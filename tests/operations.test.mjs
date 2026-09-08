import test from 'node:test';
import assert from 'node:assert/strict';

import { buildOperationsEvent, emitOperationsEvent } from '../api/_lib/operations.mjs';

test('operations event carries one explicit next action', () => {
  const event = buildOperationsEvent({
    type: 'ORDER_SUBMITTED',
    entityType: 'order',
    entityId: 'DN-TEST-0001',
    state: 'SUBMITTED',
    nextAction: 'SYNC_CRM_AND_QUALIFY',
    data: { currency: 'EGP' },
    eventId: 'evt-1',
    occurredAt: '2026-09-09T00:00:00.000Z',
  });

  assert.equal(event.version, 'dandle.ops.v1');
  assert.equal(event.eventId, 'evt-1');
  assert.deepEqual(event.entity, { type: 'order', id: 'DN-TEST-0001' });
  assert.equal(event.state, 'SUBMITTED');
  assert.equal(event.nextAction, 'SYNC_CRM_AND_QUALIFY');
  assert.equal(event.data.currency, 'EGP');
});

test('operations event rejects incomplete governance state', () => {
  assert.throws(() => buildOperationsEvent({
    type: 'ORDER_SUBMITTED',
    entityType: 'order',
    entityId: 'DN-TEST-0002',
    state: 'SUBMITTED',
    nextAction: '',
  }));
});

test('operations delivery is safely disabled until webhook OAuth bridge is configured', async () => {
  const previousUrl = process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
  const previousToken = process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
  delete process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
  delete process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;

  try {
    const result = await emitOperationsEvent(buildOperationsEvent({
      type: 'PAYMENT_PENDING',
      entityType: 'order',
      entityId: 'DN-TEST-0003',
      state: 'PAYMENT_PENDING',
      nextAction: 'WATCH_PAYMENT_AND_ESCALATE_EXCEPTION',
    }));

    assert.deepEqual(result, { configured: false, delivered: false, status: null });
  } finally {
    if (previousUrl === undefined) delete process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
    else process.env.DANDLE_OPERATIONS_WEBHOOK_URL = previousUrl;
    if (previousToken === undefined) delete process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
    else process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN = previousToken;
  }
});
