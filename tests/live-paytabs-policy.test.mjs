import assert from 'node:assert/strict';
import test from 'node:test';
import { isReusableForRetry, mapPaytabsStatus, classifyCreationOutcome } from '../supabase/functions/_shared/paymentPolicy.ts';
import { resolvePaymentTest } from '../supabase/functions/_shared/paymentTest.ts';

test('only conclusive unpaid outcomes permit a new PayTabs attempt', () => {
  for (const status of ['pending', 'paid', 'request', 'instapay_pending', 'instapay_verification_required', 'unknown']) {
    assert.equal(isReusableForRetry(status), false, status);
  }
  for (const status of ['failed', 'cancelled', 'expired']) assert.equal(isReusableForRetry(status), true);
});

test('holds and pending outcomes stay uncertain even with misleading provider messages', () => {
  for (const status of ['P', 'H']) {
    assert.equal(mapPaytabsStatus(status, 'expired or declined', '05').payment_status, 'pending');
  }
  assert.equal(classifyCreationOutcome({ httpStatus: 502 }).kind, 'uncertain');
  assert.equal(classifyCreationOutcome({ transportError: true }).kind, 'uncertain');
});

test('50 EGP cannot be selected by an anonymous caller or overridden by an operator', () => {
  const body = { payment_test: true, test_reference: `DN-PT50-${'A'.repeat(32)}`, amount: 1, totalAmount: 1 };
  assert.equal(resolvePaymentTest(body, null, 'operator-secret').status, 403);
  assert.equal(resolvePaymentTest(body, 'Bearer anon', 'operator-secret').status, 403);
  assert.equal(resolvePaymentTest(body, 'Bearer ', '').status, 403);
  assert.equal(resolvePaymentTest(body, 'Bearer operator-secret', 'operator-secret').amount, 50);
  assert.equal(resolvePaymentTest({ ...body, test_reference: 'DN-CUSTOMER-1234' }, 'Bearer operator-secret', 'operator-secret').status, 400);
});
