import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildOpenAiOrderCreatedEvent,
  reportOpenAiOrderCreated,
  stableOpenAiOrderEventId,
} from '../supabase/functions/_shared/openAiConversions.ts';

const input = {
  orderReference: 'DN-REAL-1234',
  transactionRef: 'T-ABC-123',
  amountEgp: 50,
  timestampMs: 1_777_000_000_000,
  sourceUrl: 'https://dandle-vie.com/order-confirmation?ref=DN-REAL-1234',
  oppref: 'oppref-preserve-exactly',
};

test('verified purchase payload uses stable dedupe id and EGP minor units', () => {
  const event = buildOpenAiOrderCreatedEvent(input);
  assert.equal(event.id, 'dandle-order:DN-REAL-1234:T-ABC-123');
  assert.equal(event.type, 'order_created');
  assert.equal(event.timestamp_ms, input.timestampMs);
  assert.equal(event.action_source, 'web');
  assert.equal(event.source_url, input.sourceUrl);
  assert.equal(event.oppref, input.oppref);
  assert.deepEqual(event.data, { type: 'contents', amount: 5000, currency: 'EGP' });
  assert.equal(stableOpenAiOrderEventId(input.orderReference, input.transactionRef), event.id);
});

test('missing Ads conversion credentials is a safe no-op with no network call', async () => {
  const before = { Deno: globalThis.Deno, fetch: globalThis.fetch };
  let fetchCalls = 0;
  globalThis.Deno = { env: { get: () => undefined } };
  globalThis.fetch = async () => { fetchCalls += 1; throw new Error('must not call'); };
  try {
    const result = await reportOpenAiOrderCreated(input);
    assert.deepEqual(result, {
      configured: false,
      sent: false,
      eventId: 'dandle-order:DN-REAL-1234:T-ABC-123',
    });
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.Deno = before.Deno;
    globalThis.fetch = before.fetch;
  }
});

test('configured delivery posts one server event and retains stable retry id', async () => {
  const before = { Deno: globalThis.Deno, fetch: globalThis.fetch };
  const calls = [];
  globalThis.Deno = {
    env: {
      get(name) {
        if (name === 'OPENAI_ADS_PIXEL_ID') return 'pixel-test';
        if (name === 'OPENAI_CONVERSIONS_API_KEY') return 'secret-test';
        return undefined;
      },
    },
  };
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response('{}', { status: 200 });
  };
  try {
    const first = await reportOpenAiOrderCreated(input);
    const second = await reportOpenAiOrderCreated(input);
    assert.equal(first.sent, true);
    assert.equal(second.sent, true);
    assert.equal(first.eventId, second.eventId);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, 'https://bzr.openai.com/v1/events?pid=pixel-test');
    assert.equal(calls[0].init.headers.Authorization, 'Bearer secret-test');
    const firstBody = JSON.parse(calls[0].init.body);
    const secondBody = JSON.parse(calls[1].init.body);
    assert.equal(firstBody.integration_source, 'dandle-paytabs');
    assert.equal(firstBody.events[0].id, secondBody.events[0].id);
    assert.equal(firstBody.events[0].data.amount, 5000);
    assert.equal(firstBody.events[0].data.currency, 'EGP');
  } finally {
    globalThis.Deno = before.Deno;
    globalThis.fetch = before.fetch;
  }
});
