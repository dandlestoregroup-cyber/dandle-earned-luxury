import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildOperationsEvent,
  emitOperationsEvent,
  stableOperationsEventId,
} from '../api/_lib/operations.mjs';

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

test('operations event ID is stable for one business transition', () => {
  const first = stableOperationsEventId('PAYMENT_PENDING', 'DN-TEST-0001', 'TST-1');
  const second = stableOperationsEventId('PAYMENT_PENDING', 'DN-TEST-0001', 'TST-1');
  const changed = stableOperationsEventId('PAYMENT_VERIFIED', 'DN-TEST-0001', 'TST-1');

  assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(first, second);
  assert.notEqual(first, changed);
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

    assert.deepEqual(result, { configured: false, delivered: false, status: null, attempts: 0 });
  } finally {
    if (previousUrl === undefined) delete process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
    else process.env.DANDLE_OPERATIONS_WEBHOOK_URL = previousUrl;
    if (previousToken === undefined) delete process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
    else process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN = previousToken;
  }
});

test('operations delivery safely retries the same event ID', async () => {
  const previousUrl = process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
  const previousToken = process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
  process.env.DANDLE_OPERATIONS_WEBHOOK_URL = 'https://operations.test/events';
  process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN = 'test-token';

  const bodies = [];
  let calls = 0;
  const fetchImpl = async (_url, init) => {
    calls += 1;
    bodies.push(JSON.parse(init.body));
    return new Response('', { status: calls === 1 ? 503 : 202 });
  };

  try {
    const event = buildOperationsEvent({
      eventId: stableOperationsEventId('PAYMENT_PENDING', 'DN-TEST-0004', 'TST-4'),
      type: 'PAYMENT_PENDING',
      entityType: 'order',
      entityId: 'DN-TEST-0004',
      state: 'PAYMENT_PENDING',
      nextAction: 'WATCH_PAYMENT_AND_ESCALATE_EXCEPTION',
      data: { provider: 'PayTabs', currency: 'EGP' },
    });
    const result = await emitOperationsEvent(event, { fetchImpl, retryDelayMs: 0, timeoutMs: 200 });

    assert.deepEqual(result, { configured: true, delivered: true, status: 202, attempts: 2 });
    assert.equal(bodies.length, 2);
    assert.equal(bodies[0].eventId, bodies[1].eventId);
  } finally {
    if (previousUrl === undefined) delete process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
    else process.env.DANDLE_OPERATIONS_WEBHOOK_URL = previousUrl;
    if (previousToken === undefined) delete process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
    else process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN = previousToken;
  }
});

test('operations delivery does not retry a permanent client rejection', async () => {
  const previousUrl = process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
  const previousToken = process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
  process.env.DANDLE_OPERATIONS_WEBHOOK_URL = 'https://operations.test/events';
  process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN = 'test-token';

  let calls = 0;
  try {
    const result = await emitOperationsEvent(buildOperationsEvent({
      eventId: stableOperationsEventId('ORDER_SUBMITTED', 'DN-TEST-0005'),
      type: 'ORDER_SUBMITTED',
      entityType: 'order',
      entityId: 'DN-TEST-0005',
      state: 'SUBMITTED',
      nextAction: 'SYNC_CRM_AND_QUALIFY',
    }), {
      fetchImpl: async () => {
        calls += 1;
        return new Response('', { status: 422 });
      },
      retryDelayMs: 0,
    });

    assert.deepEqual(result, { configured: true, delivered: false, status: 422, attempts: 1 });
    assert.equal(calls, 1);
  } finally {
    if (previousUrl === undefined) delete process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
    else process.env.DANDLE_OPERATIONS_WEBHOOK_URL = previousUrl;
    if (previousToken === undefined) delete process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
    else process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN = previousToken;
  }
});
