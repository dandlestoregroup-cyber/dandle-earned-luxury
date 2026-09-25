import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  buildOpenAiOrderCreatedEvent,
  reportOpenAiOrderCreated,
  stableOpenAiOrderEventId,
} from '../api/_lib/openAiConversions.ts';

const input = {
  orderReference: 'DN-REAL-1234',
  transactionRef: 'T-ABC-123',
  amountEgp: 50,
  timestampMs: 1_777_000_000_000,
  sourceUrl: 'https://dandle-vie.com/order/DN-REAL-1234',
  oppref: 'oppref-preserve-exactly',
};

function withConversionEnv(pixelId, apiKey, run) {
  const before = {
    pixelId: process.env.OPENAI_ADS_PIXEL_ID,
    apiKey: process.env.OPENAI_CONVERSIONS_API_KEY,
  };
  if (pixelId === undefined) delete process.env.OPENAI_ADS_PIXEL_ID;
  else process.env.OPENAI_ADS_PIXEL_ID = pixelId;
  if (apiKey === undefined) delete process.env.OPENAI_CONVERSIONS_API_KEY;
  else process.env.OPENAI_CONVERSIONS_API_KEY = apiKey;
  return Promise.resolve(run()).finally(() => {
    if (before.pixelId === undefined) delete process.env.OPENAI_ADS_PIXEL_ID;
    else process.env.OPENAI_ADS_PIXEL_ID = before.pixelId;
    if (before.apiKey === undefined) delete process.env.OPENAI_CONVERSIONS_API_KEY;
    else process.env.OPENAI_CONVERSIONS_API_KEY = before.apiKey;
  });
}

test('Vercel purchase payload uses a stable settlement id and EGP minor units', () => {
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

test('missing conversion credentials is a safe no-op', async () => {
  await withConversionEnv(undefined, undefined, async () => {
    let calls = 0;
    const result = await reportOpenAiOrderCreated(input, {
      fetchImpl: async () => {
        calls += 1;
        throw new Error('must not call');
      },
    });
    assert.equal(result.configured, false);
    assert.equal(result.sent, false);
    assert.equal(result.attempts, 0);
    assert.equal(calls, 0);
  });
});

test('retryable OpenAI delivery failure retries with the same event id', async () => {
  await withConversionEnv('pixel-test', 'secret-test', async () => {
    const bodies = [];
    let calls = 0;
    const result = await reportOpenAiOrderCreated(input, {
      maxAttempts: 3,
      retryDelayMs: 0,
      fetchImpl: async (_url, init) => {
        calls += 1;
        bodies.push(JSON.parse(init.body));
        return new Response('{}', { status: calls === 1 ? 503 : 200 });
      },
    });
    assert.equal(result.sent, true);
    assert.equal(result.attempts, 2);
    assert.equal(calls, 2);
    assert.equal(bodies[0].events[0].id, bodies[1].events[0].id);
    assert.equal(bodies[1].events[0].oppref, input.oppref);
  });
});

test('real storefront path preserves oppref into the settlement callback', () => {
  const campaign = readFileSync(new URL('../src/lib/campaign.ts', import.meta.url), 'utf8');
  const cart = readFileSync(new URL('../src/pages/Cart.tsx', import.meta.url), 'utf8');
  const orderIntent = readFileSync(new URL('../api/order-intent.ts', import.meta.url), 'utf8');
  const callback = readFileSync(new URL('../api/paytabs-callback.ts', import.meta.url), 'utf8');

  assert.match(campaign, /"oppref"/);
  assert.match(cart, /attribution:\s*readAttribution\(\)/);
  assert.match(orderIntent, /const attribution = sanitizeAttribution\(body\.attribution\)/);
  assert.match(callback, /mapped\.paymentStatus === "DEPOSIT_PAID"/);
  assert.match(callback, /await reportPaidConversion\(order, callbackReference, tranRef, expectedDeposit\)/);
});
