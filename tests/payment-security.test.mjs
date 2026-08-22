import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  canStartInstapayFallback,
  customerSubmittedInstapayState,
  expectedDepositAmount,
  getInstapayConfig,
  mapVerifiedPayTabsStatus,
  validateVerifiedPayTabsTransaction,
} from "../api/_lib/payment.ts";

test("payable deposit is derived from the verified order total", () => {
  assert.equal(expectedDepositAmount({ totalPrice: 28_900 }), 11_560);
  assert.equal(expectedDepositAmount({ total_price: "62,690" }), null);
  assert.equal(expectedDepositAmount({ total: 62_690 }), 25_076);
});

test("InstaPay fallback is allowed only when the first payment is conclusively unpaid", () => {
  const base = { status: "ACCEPTED", totalPrice: 50_000 };
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "" }), true);
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "NOT_PAID" }), true);
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "DECLINED" }), true);
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "CANCELLED" }), true);
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "EXPIRED" }), true);

  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "PAYMENT_PENDING" }), false);
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "INSTAPAY_PENDING" }), false);
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "INSTAPAY_VERIFICATION_REQUIRED" }), false);
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "DEPOSIT_PAID" }), false);
  assert.equal(canStartInstapayFallback({ ...base, paymentStatus: "PAID" }), false);
  assert.equal(canStartInstapayFallback({ ...base, status: "SUBMITTED", paymentStatus: "NOT_PAID" }), false);
});

test("verified PayTabs statuses map without trusting caller claims", () => {
  assert.deepEqual(mapVerifiedPayTabsStatus("A", "Authorised", "000"), {
    paymentStatus: "DEPOSIT_PAID",
    safeFailureReason: null,
    conclusive: true,
  });
  assert.equal(mapVerifiedPayTabsStatus("P", "Pending", "").paymentStatus, "PAYMENT_PENDING");
  assert.equal(mapVerifiedPayTabsStatus("H", "Hold", "").paymentStatus, "PAYMENT_PENDING");
  assert.equal(mapVerifiedPayTabsStatus("D", "Declined", "05").paymentStatus, "DECLINED");
  assert.equal(mapVerifiedPayTabsStatus("C", "Cancelled", "").paymentStatus, "CANCELLED");
  assert.equal(mapVerifiedPayTabsStatus("X", "Expired", "").paymentStatus, "EXPIRED");
  assert.equal(mapVerifiedPayTabsStatus("?", "Unknown", "").paymentStatus, "PAYMENT_PENDING");
});

test("PayTabs verification rejects missing status, wrong order, wrong currency and wrong amount", () => {
  const good = {
    cart_id: "DN-ABC1-XYZ9",
    cart_currency: "EGP",
    cart_amount: 10_000,
    payment_result: { response_status: "A" },
  };
  assert.equal(validateVerifiedPayTabsTransaction(good, "DN-ABC1-XYZ9", 10_000).ok, true);

  assert.deepEqual(
    validateVerifiedPayTabsTransaction({ ...good, payment_result: {} }, "DN-ABC1-XYZ9", 10_000),
    { ok: false, reason: "missing_verified_status" },
  );
  assert.deepEqual(
    validateVerifiedPayTabsTransaction({ ...good, cart_id: "DN-OTHER-1" }, "DN-ABC1-XYZ9", 10_000),
    { ok: false, reason: "cart_id_mismatch" },
  );
  assert.deepEqual(
    validateVerifiedPayTabsTransaction({ ...good, cart_currency: "USD" }, "DN-ABC1-XYZ9", 10_000),
    { ok: false, reason: "currency_mismatch" },
  );
  assert.deepEqual(
    validateVerifiedPayTabsTransaction({ ...good, cart_amount: 1 }, "DN-ABC1-XYZ9", 10_000),
    { ok: false, reason: "amount_mismatch" },
  );
});

test("InstaPay receiving details fail closed when server configuration is incomplete", () => {
  assert.equal(getInstapayConfig({}), null);
  assert.equal(getInstapayConfig({ INSTAPAY_RECIPIENT_NAME: "Dandle" }), null);
  assert.deepEqual(
    getInstapayConfig({ INSTAPAY_RECIPIENT_NAME: "Dandle", INSTAPAY_RECIPIENT_ID: "verified-id" }),
    { recipientName: "Dandle", recipientId: "verified-id" },
  );
});

test("customer-submitted InstaPay evidence never becomes paid", () => {
  assert.equal(customerSubmittedInstapayState(), "INSTAPAY_VERIFICATION_REQUIRED");
  assert.notEqual(customerSubmittedInstapayState(), "PAID");
  assert.notEqual(customerSubmittedInstapayState(), "DEPOSIT_PAID");
});

test("payment API does not accept a browser-supplied payable amount", () => {
  const source = readFileSync(new URL("../api/payment-intent.ts", import.meta.url), "utf8");
  assert.match(source, /expectedDepositAmount\(order\)/);
  assert.doesNotMatch(source, /body\?\.(total|totalAmount|depositAmount|amount)/);
});

test("public PayTabs callback requires PayTabs server verification", () => {
  const source = readFileSync(new URL("../api/paytabs-callback.ts", import.meta.url), "utf8");
  assert.match(source, /payment\/query/);
  assert.match(source, /if \(!verifiedStatus\)/);
  assert.doesNotMatch(source, /mapVerifiedPayTabsStatus\(\s*callback/);
});

test("InstaPay submission endpoint cannot mark customer evidence paid", () => {
  const source = readFileSync(new URL("../api/instapay-submit.ts", import.meta.url), "utf8");
  assert.match(source, /customerSubmittedInstapayState\(\)/);
  assert.match(source, /paid: false/);
  assert.doesNotMatch(source, /status:\s*["']PAID["']/);
  assert.doesNotMatch(source, /status:\s*["']DEPOSIT_PAID["']/);
});
