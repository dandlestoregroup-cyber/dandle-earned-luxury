import assert from "node:assert/strict";
import test from "node:test";

const ORIGIN = "https://dandle-vie.com";

async function jsonFetch(path, init) {
  const response = await fetch(`${ORIGIN}${path}`, init);
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  return { response, body };
}

test("live production order and PayTabs smoke", async () => {
  const health = await jsonFetch("/api/integration-health", { headers: { Accept: "application/json" } });
  console.log("LIVE_HEALTH", JSON.stringify(health.body));
  assert.equal(health.response.ok, true, `integration-health returned ${health.response.status}`);
  assert.equal(health.body?.localReadiness?.payTabsPayment, true, "PayTabs production configuration is not ready");
  assert.equal(health.body?.localReadiness?.takeappOrderWebhook, true, "TakeApp order bridge is not ready");
  assert.equal(health.body?.localReadiness?.orderStatusBridge, true, "Order status bridge is not ready");
  assert.equal(health.body?.localReadiness?.paymentRecordingBridge, true, "Payment recording bridge is not ready");

  const stamp = Date.now();
  const order = await jsonFetch("/api/order-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: {
        name: `DANDLE PAYTABS LIVE TEST ${stamp}`,
        phone: "+201000000000",
        email: `dandle-paytabs-test-${stamp}@example.com`,
        address: "TEST ORDER ONLY - DO NOT FULFILL - Cairo",
        city: "Cairo",
        governorate: "Cairo",
        notes: "AUTOMATED PAYMENT SMOKE TEST. DO NOT FULFILL, SHIP, CALL, OR PROCESS AS A CUSTOMER ORDER.",
      },
      items: [{
        productId: "relaxmax",
        productName: "RelaxMax",
        variantTitle: "Manual - TEST ONLY",
        color: "TEST",
        mechanism: "manual",
        quantity: 1,
        massageFeature: false,
        handle: "relaxmax",
      }],
    }),
  });

  console.log("LIVE_ORDER", JSON.stringify(order.body));
  assert.equal(order.response.status, 201, `order-intent returned ${order.response.status}: ${JSON.stringify(order.body)}`);
  assert.match(order.body.reference, /^DN-[A-Z0-9-]{4,48}$/);
  assert.equal(order.body.totalPrice, 21900);
  assert.equal(order.body.depositAmount, 8760);
  assert.equal(order.body.charged, false);

  const reference = order.body.reference;
  let lastStatus = null;
  let paymentResult = null;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const status = await jsonFetch(`/api/order-status?reference=${encodeURIComponent(reference)}`, { headers: { Accept: "application/json" } });
    lastStatus = status.body;
    console.log(`LIVE_STATUS_${attempt + 1}`, JSON.stringify(status.body));

    const normalizedStatus = String(status.body?.order?.status ?? status.body?.status ?? "").toUpperCase();
    if (["ACCEPTED", "AMENDED", "INVOICE_READY", "AWAITING_PAYMENT"].includes(normalizedStatus)) {
      paymentResult = await jsonFetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, amount: 1, totalAmount: 1 }),
      });
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  if (!paymentResult) {
    paymentResult = await jsonFetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, amount: 1, totalAmount: 1 }),
    });
  }

  console.log("LIVE_PAYMENT", JSON.stringify({ status: paymentResult.response.status, body: paymentResult.body }));

  if (paymentResult.response.status === 200) {
    assert.equal(paymentResult.body.paymentAvailable, true);
    assert.equal(paymentResult.body.reference, reference);
    assert.equal(paymentResult.body.depositAmount, 8760);
    assert.equal(paymentResult.body.currency, "EGP");
    assert.equal(paymentResult.body.charged, false);
    assert.match(String(paymentResult.body.paymentUrl || ""), /^https:\/\//);
    assert.ok(paymentResult.body.transactionRef);
    console.log("PAYTABS_LIVE_SESSION_CREATED", JSON.stringify({
      reference,
      depositAmount: paymentResult.body.depositAmount,
      transactionRef: paymentResult.body.transactionRef,
      paymentUrlHost: new URL(paymentResult.body.paymentUrl).host,
    }));
    return;
  }

  // A newly created production order is intentionally not payable until admin acceptance.
  // This is not a PayTabs failure; keep the evidence visible in the job log for follow-up.
  assert.equal(paymentResult.response.status, 409, `unexpected payment-intent result: ${JSON.stringify(paymentResult.body)}`);
  assert.equal(paymentResult.body.paymentAvailable, false);
  console.log("PAYTABS_LIVE_BLOCKED_BY_ADMIN_GATE", JSON.stringify({ reference, lastStatus, payment: paymentResult.body }));
});
