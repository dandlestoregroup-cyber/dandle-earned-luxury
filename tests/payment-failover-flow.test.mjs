import assert from "node:assert/strict";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import test from "node:test";
import { stableOperationsEventId } from "../api/_lib/operations.mjs";

async function loadVercelHandler(sourceName, tempName) {
  const sourceUrl = new URL(`../api/${sourceName}.ts`, import.meta.url);
  const tempUrl = new URL(`../api/${tempName}.ts`, import.meta.url);
  const source = readFileSync(sourceUrl, "utf8").replace(
    /from "\.\/_lib\/payment(?:\.js)?";/,
    'from "./_lib/payment.ts";',
  );
  writeFileSync(tempUrl, source, "utf8");
  try {
    const module = await import(`${tempUrl.href}?payment-flow-test=${Date.now()}`);
    return module.POST ?? module.default;
  } finally {
    unlinkSync(tempUrl);
  }
}

// Production uses Vercel Web handlers and explicit .js relative imports.
// Node's native TypeScript test loader needs .ts instead; create disposable
// copies that change only that import while preserving the handler bodies.
const paymentIntentHandler = await loadVercelHandler("payment-intent", ".payment-intent.test-loader");
const instapayIntentHandler = await loadVercelHandler("instapay-intent", ".instapay-intent.test-loader");
const instapaySubmitHandler = await loadVercelHandler("instapay-submit", ".instapay-submit.test-loader");

const KEYS = [
  "TAKEAPP_ORDER_STATUS_URL",
  "TAKEAPP_ORDER_WEBHOOK_TOKEN",
  "TAKEAPP_PAYMENT_WEBHOOK_URL",
  "PAYTABS_PROFILE_ID",
  "PAYTABS_SERVER_KEY",
  "PUBLIC_SITE_URL",
  "INSTAPAY_RECIPIENT_NAME",
  "INSTAPAY_RECIPIENT_ID",
  "DANDLE_OPERATIONS_WEBHOOK_URL",
  "DANDLE_OPERATIONS_WEBHOOK_TOKEN",
];

function installTestEnv() {
  const before = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));
  delete process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
  delete process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
  Object.assign(process.env, {
    TAKEAPP_ORDER_STATUS_URL: "https://takeapp.test/order-status",
    TAKEAPP_ORDER_WEBHOOK_TOKEN: "test-token",
    TAKEAPP_PAYMENT_WEBHOOK_URL: "https://takeapp.test/payment-update",
    PAYTABS_PROFILE_ID: "12345",
    PAYTABS_SERVER_KEY: "test-paytabs-key",
    PUBLIC_SITE_URL: "https://dandle-vie.com",
    INSTAPAY_RECIPIENT_NAME: "Dandle Verified Test Recipient",
    INSTAPAY_RECIPIENT_ID: "dandle-test@instapay",
  });
  return () => {
    for (const key of KEYS) {
      if (before[key] === undefined) delete process.env[key];
      else process.env[key] = before[key];
    }
  };
}

const payableOrder = {
  reference: "DN-TEST-1234",
  status: "ACCEPTED",
  paymentStatus: "NOT_PAID",
  totalPrice: 100_000,
  paymentVersion: 0,
};

test("controlled PayTabs creation failure falls over to InstaPay with the same reference and amount", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  const recordedUpdates = [];
  let order = { ...payableOrder };

  try {
    globalThis.fetch = async (input, init = {}) => {
      const url = String(input);
      if (url.startsWith("https://takeapp.test/order-status")) {
        return Response.json({ order });
      }
      if (url === "https://secure-egypt.paytabs.com/payment/request") {
        return Response.json({ message: "controlled gateway failure" }, { status: 502 });
      }
      if (url === "https://takeapp.test/payment-update") {
        const update = JSON.parse(String(init.body || "{}"));
        recordedUpdates.push(update);
        order = { ...order, payment: update.payment, paymentStatus: update.payment.status, paymentVersion: order.paymentVersion + 1 };
        return Response.json({ ok: true });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    const payTabsResponse = await paymentIntentHandler(new Request(
      "https://dandle-vie.com/api/payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: payableOrder.reference, amount: 1 }),
      },
    ));
    const payTabsBody = await payTabsResponse.json();

    assert.equal(payTabsResponse.status, 503);
    assert.equal(payTabsBody.fallbackAvailable, true);
    assert.equal(payTabsBody.reference, payableOrder.reference);
    assert.equal(payTabsBody.depositAmount, 40_000);
    assert.equal(recordedUpdates[0].payment.status, "NOT_PAID");
    assert.equal(recordedUpdates[0].payment.amount, 40_000);

    const instaPayResponse = await instapayIntentHandler(new Request(
      "https://dandle-vie.com/api/instapay-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: payableOrder.reference, amount: 1 }),
      },
    ));
    const instaPayBody = await instaPayResponse.json();

    assert.equal(instaPayResponse.status, 200);
    assert.equal(instaPayBody.fallbackAvailable, true);
    assert.equal(instaPayBody.reference, payableOrder.reference);
    assert.equal(instaPayBody.amount, 40_000);
    assert.equal(instaPayBody.currency, "EGP");
    assert.equal(instaPayBody.paymentStatus, "INSTAPAY_PENDING");
    assert.equal(instaPayBody.recipient.id, "dandle-test@instapay");
    assert.equal(recordedUpdates[1].payment.status, "INSTAPAY_PENDING");
    assert.equal(recordedUpdates[1].payment.amount, 40_000);
    assert.equal(recordedUpdates[1].idempotencyKey,
      `instapay:${payableOrder.reference}:${stableOperationsEventId("INSTAPAY_ATTEMPT", payableOrder.reference, 1)}:pending`);
    assert.ok(recordedUpdates[1].expectedPriorPaymentStatuses.includes("NOT_PAID"));
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv();
  }
});

test("an uncertain PayTabs payment blocks InstaPay to prevent double payment", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  let paymentUpdateCalls = 0;

  try {
    globalThis.fetch = async (input) => {
      const url = String(input);
      if (url.startsWith("https://takeapp.test/order-status")) {
        return Response.json({
          order: { ...payableOrder, paymentStatus: "PAYMENT_PENDING" },
        });
      }
      if (url === "https://takeapp.test/payment-update") {
        paymentUpdateCalls += 1;
        return Response.json({ ok: true });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    const response = await instapayIntentHandler(new Request(
      "https://dandle-vie.com/api/instapay-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: payableOrder.reference }),
      },
    ));
    const body = await response.json();

    assert.equal(response.status, 409);
    assert.equal(body.paymentPending, true);
    assert.equal(body.fallbackAvailable, false);
    assert.equal(paymentUpdateCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv();
  }
});

test("successful PayTabs page creation records PAYMENT_PENDING before returning the redirect", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  const recordedUpdates = [];

  try {
    globalThis.fetch = async (input, init = {}) => {
      const url = String(input);
      if (url.startsWith("https://takeapp.test/order-status")) {
        return Response.json({ order: payableOrder });
      }
      if (url === "https://secure-egypt.paytabs.com/payment/request") {
        const requestBody = JSON.parse(String(init.body || "{}"));
        assert.equal(requestBody.cart_id, payableOrder.reference);
        assert.equal(requestBody.cart_amount, 40_000);
        return Response.json({
          redirect_url: "https://secure-egypt.paytabs.com/test-pay-page",
          tran_ref: "TST-TRAN-1",
        });
      }
      if (url === "https://takeapp.test/payment-update") {
        recordedUpdates.push(JSON.parse(String(init.body || "{}")));
        return Response.json({ ok: true });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    const response = await paymentIntentHandler(new Request(
      "https://dandle-vie.com/api/payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: payableOrder.reference, totalAmount: 1 }),
      },
    ));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.paymentUrl, "https://secure-egypt.paytabs.com/test-pay-page");
    assert.equal(body.depositAmount, 40_000);
    assert.equal(recordedUpdates.length, 1);
    assert.equal(recordedUpdates[0].payment.status, "PAYMENT_PENDING");
    assert.equal(recordedUpdates[0].payment.amount, 40_000);
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv();
  }
});

function requestFallback(extra = {}) {
  return instapayIntentHandler(new Request("https://dandle-vie.com/api/instapay-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference: payableOrder.reference, ...extra }),
  }));
}

// Model the external bridge's transactional contract, including durable
// deduplication across retries and optimistic concurrency on paymentVersion.
function paymentBridge(initial = payableOrder) {
  let order = structuredClone(initial);
  const updates = [];
  const events = [];
  const applied = new Set();
  return {
    updates, events, applied,
    get order() { return order; },
    set order(value) { order = value; },
    fetch: async (input, init = {}) => {
      const url = String(input);
      if (url.startsWith("https://takeapp.test/order-status")) return Response.json({ order });
      if (url === "https://operations.test/events") {
        events.push(JSON.parse(init.body));
        return Response.json({ ok: true });
      }
      if (url === "https://takeapp.test/payment-update") {
        const update = JSON.parse(init.body);
        updates.push(update);
        if (applied.has(update.idempotencyKey)) return Response.json({ duplicate: true });
        if (update.expectedPaymentVersion !== order.paymentVersion ||
          !update.expectedPriorPaymentStatuses.includes(order.paymentStatus)) {
          return Response.json({ conflict: true }, { status: 409 });
        }
        applied.add(update.idempotencyKey);
        order = { ...order, payment: update.payment, paymentStatus: update.payment.status, paymentVersion: order.paymentVersion + 1 };
        return Response.json({ ok: true });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    },
  };
}

test("InstaPay restarts after repeated failures get new durable attempt and operations IDs", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  const bridge = paymentBridge();
  try {
    process.env.DANDLE_OPERATIONS_WEBHOOK_URL = "https://operations.test/events";
    process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN = "test-operations-token";
    globalThis.fetch = bridge.fetch;
    assert.equal((await requestFallback()).status, 200);
    for (const status of ["FAILED", "FAILED", "BANK_REJECTED", "EXPIRED", "PAYMENT_FAILED",
      "DECLINED", "CARD_DECLINED", "GATEWAY_ERROR", "CANCELLED"]) {
      bridge.order = { ...bridge.order, paymentStatus: status, paymentVersion: bridge.order.paymentVersion + 1 };
      const response = await requestFallback({ attemptId: "forged", paymentVersion: 0, amount: 1 });
      assert.equal(response.status, 200, status);
      assert.equal((await response.json()).amount, 40_000);
      assert.equal(bridge.order.paymentStatus, "INSTAPAY_PENDING");
      assert.equal(bridge.order.payment.amount, 40_000);
    }
    assert.equal(bridge.applied.size, 10);
    assert.equal(new Set(bridge.updates.map((update) => update.payment.attemptId)).size, 10);
    assert.equal(new Set(bridge.events.map((event) => event.eventId)).size, 10);
    assert.ok(bridge.updates.every((update) => update.payment.status === "INSTAPAY_PENDING"));
    assert.ok(bridge.events.every((event) => event.nextAction === "AWAIT_TRANSFER_EVIDENCE"));
  } finally { globalThis.fetch = originalFetch; restoreEnv(); }
});

test("retry after a lost write acknowledgement reuses the same attempt across handler requests", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  const bridge = paymentBridge();
  let firstWrite = true;
  let staleRead = false;
  try {
    globalThis.fetch = async (input, init) => {
      if (String(input).startsWith("https://takeapp.test/order-status") && staleRead) {
        staleRead = false;
        return Response.json({ order: payableOrder });
      }
      const result = await bridge.fetch(input, init);
      if (String(input) === "https://takeapp.test/payment-update" && firstWrite) {
        firstWrite = false;
        throw new Error("simulated lost acknowledgement");
      }
      return result;
    };
    assert.equal((await requestFallback()).status, 503);
    staleRead = true;
    assert.equal((await requestFallback()).status, 200);
    assert.equal(bridge.applied.size, 1);
    assert.equal(bridge.updates[0].idempotencyKey, bridge.updates[1].idempotencyKey);
    assert.equal(bridge.order.paymentVersion, 1);
    assert.equal((await requestFallback()).status, 409); // fresh pending state blocks another transfer
    assert.equal(bridge.updates.length, 2);
  } finally { globalThis.fetch = originalFetch; restoreEnv(); }
});

test("concurrent starts of the same payment revision apply one transition", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  const bridge = paymentBridge();
  try {
    globalThis.fetch = bridge.fetch;
    const responses = await Promise.all([requestFallback(), requestFallback()]);
    assert.ok(responses.every((response) => response.status === 200 || response.status === 409));
    assert.equal(bridge.applied.size, 1);
    assert.equal(new Set(bridge.updates.map((update) => update.idempotencyKey)).size, 1);
    assert.equal(bridge.order.paymentVersion, 1);
  } finally { globalThis.fetch = originalFetch; restoreEnv(); }
});

test("missing revisions, stale bridge acknowledgements and verified payments never expose transfer instructions", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  try {
    for (const version of [undefined, null, "0", -1, 0.5, Number.MAX_SAFE_INTEGER]) {
      const bridge = paymentBridge({ ...payableOrder, paymentVersion: version });
      globalThis.fetch = bridge.fetch;
      const response = await requestFallback({ paymentVersion: 0 });
      assert.equal(response.status, 503);
      assert.equal(bridge.updates.length, 0);
      assert.equal((await response.json()).recipient, undefined);
    }
    const bridge = paymentBridge({ ...payableOrder, paymentStatus: "FAILED", paymentVersion: 5 });
    globalThis.fetch = async (input, init) => String(input) === "https://takeapp.test/payment-update"
      ? Response.json({ duplicate: true }) : bridge.fetch(input, init);
    const stale = await requestFallback();
    assert.equal(stale.status, 409);
    assert.equal((await stale.json()).recipient, undefined);
    assert.equal(bridge.order.paymentStatus, "FAILED");

    for (const paymentStatus of ["DEPOSIT_PAID", "PAID", "CAPTURED", "PAYMENT_PENDING", "INSTAPAY_VERIFICATION_REQUIRED"]) {
      bridge.order = { ...payableOrder, paymentStatus };
      globalThis.fetch = bridge.fetch;
      const response = await requestFallback();
      assert.equal(response.status, 409);
      assert.equal((await response.json()).recipient, undefined);
    }
    assert.equal(bridge.updates.length, 0);
  } finally { globalThis.fetch = originalFetch; restoreEnv(); }
});

test("a PayTabs settlement between status lookup and bridge write wins over fallback", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  const bridge = paymentBridge();
  try {
    globalThis.fetch = async (input, init) => {
      if (String(input) === "https://takeapp.test/payment-update") {
        bridge.order = { ...bridge.order, paymentStatus: "DEPOSIT_PAID", paymentVersion: 1 };
      }
      return bridge.fetch(input, init);
    };
    const response = await requestFallback();
    assert.equal(response.status, 503);
    assert.equal((await response.json()).recipient, undefined);
    assert.equal(bridge.order.paymentStatus, "DEPOSIT_PAID");
    assert.equal(bridge.applied.size, 0);
  } finally { globalThis.fetch = originalFetch; restoreEnv(); }
});

test("evidence without a transaction reference can be submitted again after a failed attempt", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  const bridge = paymentBridge();
  try {
    process.env.DANDLE_OPERATIONS_WEBHOOK_URL = "https://operations.test/events";
    process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN = "test-operations-token";
    globalThis.fetch = bridge.fetch;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      assert.equal((await requestFallback()).status, 200);
      const evidence = await instapaySubmitHandler(new Request("https://dandle-vie.com/api/instapay-submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: payableOrder.reference, attemptId: "forged", paid: true }),
      }));
      assert.equal(evidence.status, 200);
      const result = await evidence.json();
      assert.equal(result.paid, false);
      assert.equal(result.paymentStatus, "INSTAPAY_VERIFICATION_REQUIRED");
      assert.equal(bridge.order.paymentStatus, "INSTAPAY_VERIFICATION_REQUIRED");
      assert.equal(bridge.order.payment.amount, 40_000);
      bridge.order = { ...bridge.order, paymentStatus: "FAILED", paymentVersion: bridge.order.paymentVersion + 1 };
    }
    assert.equal(bridge.applied.size, 4);
    assert.notEqual(bridge.updates[1].idempotencyKey, bridge.updates[3].idempotencyKey);
    const evidenceEvents = bridge.events.filter((event) => event.type === "INSTAPAY_EVIDENCE_RECEIVED");
    assert.equal(evidenceEvents.length, 2);
    assert.notEqual(evidenceEvents[0].eventId, evidenceEvents[1].eventId);
    assert.ok(bridge.events.every((event) => event.nextAction !== "RELEASE_TO_FULFILMENT"));
  } finally { globalThis.fetch = originalFetch; restoreEnv(); }
});

test("a deduplicated evidence acknowledgement cannot report receipt while order remains pending", async () => {
  const restoreEnv = installTestEnv();
  const originalFetch = globalThis.fetch;
  const bridge = paymentBridge();
  try {
    globalThis.fetch = bridge.fetch;
    assert.equal((await requestFallback()).status, 200);
    globalThis.fetch = async (input, init) => String(input) === "https://takeapp.test/payment-update"
      ? Response.json({ duplicate: true }) : bridge.fetch(input, init);
    const response = await instapaySubmitHandler(new Request("https://dandle-vie.com/api/instapay-submit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: payableOrder.reference }),
    }));
    assert.equal(response.status, 409);
    const result = await response.json();
    assert.equal(result.received, undefined);
    assert.equal(result.paid, false);
  } finally { globalThis.fetch = originalFetch; restoreEnv(); }
});
