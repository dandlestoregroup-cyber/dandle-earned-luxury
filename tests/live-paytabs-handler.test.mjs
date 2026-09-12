import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import test from 'node:test';

// Execute the production handler bodies; replace only the Deno HTTP entry and
// Supabase transport. No live network, account, order, or payment is touched.
async function handler(name) {
  const file = new URL(`../supabase/functions/${name}/index.ts`, import.meta.url);
  const temporary = new URL(`../supabase/functions/${name}/.node-test.ts`, import.meta.url);
  const source = readFileSync(file, 'utf8')
    .replace(/import \{ serve \} from "https:[^\n]+\n/, '')
    .replace(/import \{ createClient \} from "https:[^\n]+\n/, 'const createClient = () => globalThis.__dandlePaymentDb;\n')
    .replace('serve(async (req) => {', 'export default (async (req: Request) => {');
  writeFileSync(temporary, source);
  try { return (await import(temporary.href)).default; }
  finally { unlinkSync(temporary); }
}
const createPayment = await handler('paytabs-create-payment');
const callback = await handler('paytabs-callback');

function setup() {
  const rows = new Map();
  const events = [];
  const providerCalls = [];
  const before = { fetch: globalThis.fetch, Deno: globalThis.Deno, db: globalThis.__dandlePaymentDb };
  const env = { PAYTABS_SERVER_KEY: 'test-key', PAYTABS_PROFILE_ID: '1234', SUPABASE_URL: 'https://database.test', SUPABASE_SERVICE_ROLE_KEY: 'operator-secret' };
  globalThis.Deno = { env: { get: name => env[name] } };
  let beforeUpdate;
  globalThis.__dandlePaymentDb = {
    from(table) {
      let action = 'select', values, filters = [];
      const query = {
        select() { return query; },
        eq(key, value) { filters.push(row => row[key] === value); return query; },
        neq(key, value) { filters.push(row => row[key] !== value); return query; },
        is(key, value) { filters.push(row => (row[key] ?? null) === value); return query; },
        update(value) { action = 'update'; values = value; return query; },
        insert(value) { action = 'insert'; values = value; return query; },
        maybeSingle() { return Promise.resolve(run()); },
        then(resolve, reject) { return Promise.resolve().then(run).then(resolve, reject); },
      };
      function run() {
        if (table === 'order_payment_events') { events.push(values); return { error: null }; }
        if (action === 'insert') {
          if (rows.has(values.order_reference)) return { error: { code: '23505', message: 'duplicate' } };
          rows.set(values.order_reference, { paytabs_tran_ref: null, ...values });
          return { error: null };
        }
        if (action === 'update' && beforeUpdate) beforeUpdate(rows);
        const row = [...rows.values()].find(row => filters.every(match => match(row)));
        if (!row) return { data: null, error: null };
        if (action === 'update') Object.assign(row, values);
        return { data: structuredClone(row), error: null };
      }
      return query;
    },
  };
  globalThis.fetch = async (url, init) => {
    const body = JSON.parse(init.body);
    providerCalls.push({ url, body });
    return Response.json({ tran_ref: `T-${providerCalls.length}`, cart_id: body.cart_id, redirect_url: 'https://secure-egypt.paytabs.com/payment/page' });
  };
  return {
    rows, events, providerCalls,
    onUpdate(fn) { beforeUpdate = fn; },
    restore() { globalThis.fetch = before.fetch; globalThis.Deno = before.Deno; globalThis.__dandlePaymentDb = before.db; },
  };
}
let requestNumber = 0;
function request(body, authorized = false) {
  return new Request('https://database.test/functions/v1/paytabs-create-payment', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': `test-${++requestNumber}`, ...(authorized ? { authorization: 'Bearer operator-secret' } : {}) },
    body: JSON.stringify(body),
  });
}
const reference = `DN-PT50-${'A'.repeat(32)}`;

test('operator checkout charges exactly 50 and duplicate reference cannot create a second session', async () => {
  const state = setup();
  try {
    const body = { payment_test: true, test_reference: reference, totalAmount: 1 };
    assert.equal((await createPayment(request(body))).status, 403);
    assert.equal(state.rows.size, 0);
    const response = await createPayment(request(body, true));
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.amount, 50);
    assert.equal(result.charged, false);
    assert.equal(state.providerCalls[0].body.cart_amount, 50);
    assert.equal(state.providerCalls[0].body.customer_details, undefined);
    assert.equal(state.rows.get(reference).items.fulfilment_required, false);
    assert.equal(state.rows.get(reference).paytabs_tran_ref, result.transaction_reference);
    assert.equal((await createPayment(request(body, true))).status, 409);
    assert.equal((await createPayment(request({ order_reference: reference }))).status, 409);
    assert.equal(state.providerCalls.length, 1);
    assert.ok(state.events.every(event => !('transaction_reference' in event)), 'audit schema remains valid');
  } finally { state.restore(); }
});

test('two simultaneous retries acquire only one pending attempt', async () => {
  const state = setup();
  try {
    state.rows.set('DN-RETRY-1234', { order_reference: 'DN-RETRY-1234', payment_status: 'failed', total_amount: 100, items: [{ productName: 'Existing order', quantity: 1, price: 100 }], customer_name: 'Test', customer_phone: 'TEST', customer_address: 'NO DELIVERY', paytabs_tran_ref: 'OLD' });
    const results = await Promise.all([createPayment(request({ order_reference: 'DN-RETRY-1234' })), createPayment(request({ order_reference: 'DN-RETRY-1234' }))]);
    assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
    assert.equal(state.providerCalls.length, 1);
  } finally { state.restore(); }
});

test('network uncertainty preserves pending state and never exposes a payment URL', async () => {
  const state = setup();
  try {
    globalThis.fetch = async () => { throw new Error('timeout'); };
    const response = await createPayment(request({ payment_test: true, test_reference: reference }, true));
    assert.equal(response.status, 502);
    assert.equal((await response.json()).failure_kind, 'uncertain');
    assert.equal(state.rows.get(reference).payment_status, 'pending');
  } finally { state.restore(); }
});

test('untrusted redirect is rejected without making another payment available', async () => {
  const state = setup();
  try {
    globalThis.fetch = async () => Response.json({ tran_ref: 'T-1', cart_id: reference, redirect_url: 'https://paytabs.com.attacker.invalid/payment' });
    const response = await createPayment(request({ payment_test: true, test_reference: reference }, true));
    assert.equal(response.status, 502);
    assert.equal(state.rows.get(reference).payment_status, 'pending');
  } finally { state.restore(); }
});

test('verified 50 EGP callback settles only the pinned attempt and never overwrites a newer attempt', async () => {
  const state = setup();
  try {
    state.rows.set(reference, { order_reference: reference, total_amount: 50, payment_status: 'pending', paytabs_tran_ref: 'T-1' });
    globalThis.fetch = async () => Response.json({ tran_ref: 'T-1', cart_id: reference, cart_currency: 'EGP', cart_amount: 50, payment_result: { response_status: 'A' } });
    const body = { tran_ref: 'T-1', cart_id: reference };
    state.onUpdate(rows => { rows.get(reference).paytabs_tran_ref = 'T-NEW'; });
    assert.equal((await callback(request(body))).status, 409);
    assert.equal(state.rows.get(reference).payment_status, 'pending');
    state.onUpdate(null);
    state.rows.get(reference).paytabs_tran_ref = 'T-1';
    assert.equal((await callback(request(body))).status, 200);
    assert.equal(state.rows.get(reference).payment_status, 'paid');
    assert.equal(state.events.length, 1);
  } finally { state.restore(); }
});
