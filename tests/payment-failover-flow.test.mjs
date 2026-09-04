import assert from "node:assert/strict";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import test from "node:test";

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
    return module.default;
  } finally {
    unlinkSync(tempUrl);
  }
}

// Vercel emits Node ESM server functions, so production source uses explicit
// .js relative imports. Node's native TypeScript test loader needs .ts instead;
// create disposable copies that change only that import while preserving the
// actual handler bodies under test.
const paymentIntentHandler = await loadVercelHandler("payment-intent", ".payment-intent.test-loader");
const instapayIntentHandler = await loadVercelHandler("instapay-intent", ".instapay-intent.test-loader");

const KEYS = [
  "TAKEAPP_ORDER_STATUS_URL",
  "TAKEAPP_ORDER_WEBHOOK_TOKEN",
  "TAKEAPP_PAYMENT_WEBHOOK_URL",
  "PAYTABS_PROFILE_ID",
  "PAYTABS_SERVER_KEY",
  "PUBLIC_SITE_URL",
  "INSTAPAY_RECIPIENT_NAME",
  "INSTAPAY_RECIPIENT_ID",
];

function installTestEnv() {
  const before = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));
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
};

test("controlled PayTabs creation failure falls over to InstaPay with the same reference and amount", async () => {
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
        return Response.json({ message: "controlled gateway failure" }, { status: 502 });
      }
      if (url === "https://takeapp.test/payment-update") {
        recordedUpdates.push(JSON.parse(String(init.body || "{}")));
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
