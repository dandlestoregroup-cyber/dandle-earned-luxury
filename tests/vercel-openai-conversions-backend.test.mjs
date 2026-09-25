import assert from 'node:assert/strict';
import test from 'node:test';
import { buildOpenAiOrderCreatedEvent, stableOpenAiOrderEventId } from '../api/_lib/openAiConversions.ts';

test('verified purchase event has stable identity and EGP minor units', () => {
  const event = buildOpenAiOrderCreatedEvent({
    orderReference: 'DN-TEST-1234',
    transactionRef: 'T-123',
    amountEgp: 50,
    timestampMs: 1777000000000,
    sourceUrl: 'https://dandle-vie.com/order/DN-TEST-1234',
  });
  assert.equal(event.id, 'dandle-order:DN-TEST-1234:T-123');
  assert.equal(stableOpenAiOrderEventId('DN-TEST-1234', 'T-123'), event.id);
  assert.deepEqual(event.data, { type: 'contents', amount: 5000, currency: 'EGP' });
});
