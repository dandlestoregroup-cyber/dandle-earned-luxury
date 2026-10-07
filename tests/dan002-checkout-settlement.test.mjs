import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import test from "node:test";
import { captureCampaignAttribution, readAttribution } from "../src/lib/campaign.ts";

// Exercise the production handler bodies with only the .js -> .ts Node test
// loader substitutions. No real orders, PayTabs, or Ads endpoint are called.
async function loadHandler(name, replacements) {
  const source = readFileSync(new URL(`../api/${name}.ts`, import.meta.url), "utf8");
  let adjusted = source;
  for (const [from, to] of replacements) {
    assert.ok(adjusted.includes(from), `${name}: missing import ${from}`);
    adjusted = adjusted.replace(from, to);
  }
  const temp = new URL(`../api/.dan002-${name}-loader.ts`, import.meta.url);
  writeFileSync(temp, adjusted);
  try { return (await import(temp.href)).POST; }
  finally { unlinkSync(temp); }
}
const orderIntent = await loadHandler("order-intent", [
  ['from "./_lib/catalog.js"', 'from "./_lib/catalog.ts"'],
]);
const paytabsCallback = await loadHandler("paytabs-callback", [
  ['from "./_lib/payment.js"', 'from "./_lib/payment.ts"'],
  ['from "./_lib/openAiConversions.js"', 'from "./_lib/openAiConversions.ts"'],
]);

function setup() {
  const keys = [
    "TAKEAPP_ORDER_WEBHOOK_URL", "TAKEAPP_ORDER_STATUS_URL",
    "TAKEAPP_PAYMENT_WEBHOOK_URL", "TAKEAPP_ORDER_WEBHOOK_TOKEN",
    "PAYTABS_PROFILE_ID", "PAYTABS_SERVER_KEY", "PAYTABS_API_BASE",
    "OPENAI_ADS_PIXEL_ID", "OPENAI_CONVERSIONS_API_KEY",
    "DANDLE_OPERATIONS_WEBHOOK_URL", "DANDLE_OPERATIONS_WEBHOOK_TOKEN",
  ];
  const originalEnv = Object.fromEntries(keys.map(k => [k, process.env[k]]));
  const original = { fetch: globalThis.fetch, window: globalThis.window, sessionStorage: globalThis.sessionStorage };
  Object.assign(process.env, {
    TAKEAPP_ORDER_WEBHOOK_URL: "https://takeapp.test/create",
    TAKEAPP_ORDER_STATUS_URL: "https://takeapp.test/status",
    TAKEAPP_PAYMENT_WEBHOOK_URL: "https://takeapp.test/update",
    TAKEAPP_ORDER_WEBHOOK_TOKEN: "test-bridge-key",
    PAYTABS_PROFILE_ID: "12345",
    PAYTABS_SERVER_KEY: "test-paytabs-key",
    PAYTABS_API_BASE: "https://secure-egypt.paytabs.com",
    OPENAI_ADS_PIXEL_ID: "test-pixel",
    OPENAI_CONVERSIONS_API_KEY: "test-conversions-key",
  });
  delete process.env.DANDLE_OPERATIONS_WEBHOOK_URL;
  delete process.env.DANDLE_OPERATIONS_WEBHOOK_TOKEN;
  const storage = new Map();
  globalThis.sessionStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };
  globalThis.window = { location: { pathname: "/products/relaxmax", search: "" } };
  let order;
  let gateway = { status: "A", currency: "EGP", tranRef: "PT-ONE", amount: 8760 };
  let recorded = { applied: true };
  const deliveries = [], transitions = [];
  globalThis.fetch = async (url, init = {}) => {
    const address = String(url);
    if (address === "https://takeapp.test/create") {
      order = structuredClone(JSON.parse(init.body));
      return Response.json({ saved: true });
    }
    if (address.startsWith("https://takeapp.test/status?")) {
      assert.equal(new URL(address).searchParams.get("reference"), order.reference);
      return Response.json({ order: structuredClone(order) });
    }
    if (address === "https://secure-egypt.paytabs.com/payment/query") {
      return Response.json({
        tran_ref: gateway.tranRef, cart_id: order.reference,
        cart_currency: gateway.currency, cart_amount: gateway.amount,
        profile_id: 12345, payment_result: { response_status: gateway.status },
      });
    }
    if (address === "https://takeapp.test/update") {
      const payload = JSON.parse(init.body);
      assert.equal(payload.reference, order.reference);
      assert.equal(payload.payment.transactionRef, gateway.tranRef);
      assert.ok(payload.expectedPriorPaymentStatuses.includes(order.paymentStatus));
      transitions.push(payload);
      if (recorded.applied) {
        order.paymentStatus = payload.payment.status;
        order.payment = payload.payment;
      }
      return Response.json(recorded);
    }
    if (address.startsWith("https://bzr.openai.com/v1/events?pid=")) {
      assert.equal(init.headers.Authorization, "Bearer test-conversions-key");
      deliveries.push(JSON.parse(init.body));
      return Response.json({ accepted: true });
    }
    throw new Error(`Unexpected call: ${address}`);
  };
  return {
    storage, deliveries, transitions,
    get order() { return order; },
    navigate: (search, path = "/cart") => {
      globalThis.window.location.search = search;
      globalThis.window.location.pathname = path;
    },
    accept: () => {
      order.status = "ACCEPTED";
      order.paymentStatus = "PAYMENT_PENDING";
      order.payment = { transactionRef: "PT-ONE" };
    },
    setGateway: overrides => { gateway = { ...gateway, ...overrides }; },
    setRecorded: value => { recorded = value; },
    restore: () => {
      globalThis.fetch = original.fetch;
      globalThis.window = original.window;
      globalThis.sessionStorage = original.sessionStorage;
      for (const key of keys) {
        if (originalEnv[key] === undefined) delete process.env[key];
        else process.env[key] = originalEnv[key];
      }
    },
  };
}

const customer = {
  name: "Test Customer", phone: "01000000000", address: "Test Street",
  city: "Cairo", governorate: "Cairo",
};
const items = [{ productId: "relaxmax", mechanism: "manual", quantity: 1 }];
async function submitOrder(attribution) {
  const response = await orderIntent(new Request("https://dandle-vie.com/api/order-intent", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer, items, attribution }),
  }));
  assert.equal(response.status, 201);
  return response.json();
}
function callback(reference, tranRef = "PT-ONE", signatureOverride) {
  const raw = JSON.stringify({
    tran_ref: tranRef, cart_id: reference, cart_amount: 8760,
    cart_currency: "EGP", profile_id: 12345,
    payment_result: { response_status: "A" },
  });
  const signature = signatureOverride ?? createHmac("sha256", "test-paytabs-key").update(raw).digest("hex");
  return new Request("https://dandle-vie.com/api/public/paytabs/webhook", {
    method: "POST", headers: { signature }, body: raw,
  });
}

test("attribution uses existing campaign session store on all routes", () => {
  const s = setup();
  try {
    s.navigate("?oppref=OPENAI-CLICK-123&utm_source=openai", "/products/relaxmax");
    assert.equal(captureCampaignAttribution().oppref, "OPENAI-CLICK-123");
    s.navigate("?gclid=GOOGLE-CLICK", "/cart");
    const result = captureCampaignAttribution();
    assert.equal(result.oppref, "OPENAI-CLICK-123");
    assert.equal(result.gclid, "GOOGLE-CLICK");
    assert.equal(result.landing_path, "/products/relaxmax");
    assert.equal(readAttribution().utm_source, "openai");
    s.navigate("?oppref=" + "a".repeat(501));
    assert.equal(captureCampaignAttribution().oppref.length, 500);
    s.navigate("?utm_term=" + "b".repeat(201));
    assert.equal(captureCampaignAttribution().utm_term.length, 200);
    assert.equal(s.storage.has("dandle:openai:oppref"), false);
    assert.match(readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8"), /<CampaignAttributionHandler \/>/);
    assert.match(readFileSync(new URL("../src/pages/Cart.tsx", import.meta.url), "utf8"), /attribution:\s*readAttribution\(\)/);
  } finally { s.restore(); }
});

test("stored oppref reaches one purchase event only after verified settlement", async () => {
  const s = setup();
  try {
    s.navigate("?oppref=OPENAI-ORDER-777&utm_medium=chatgpt");
    captureCampaignAttribution();
    const created = await submitOrder({ ...readAttribution(), oppref: " OPENAI-ORDER-777 ", evil: "discard" });
    assert.equal(created.charged, false);
    assert.equal(s.order.reference, created.reference);
    assert.equal(s.order.attribution.oppref, "OPENAI-ORDER-777");
    assert.equal(s.order.attribution.utm_medium, "chatgpt");
    assert.equal(s.order.attribution.evil, undefined);
    assert.equal(s.order.totalPrice, 21900);
    assert.equal(s.deliveries.length, 0);

    s.accept();
    assert.equal((await paytabsCallback(callback(created.reference, "PT-ONE", "bad"))).status, 401);
    assert.equal(s.deliveries.length, 0);
    s.setGateway({ currency: "USD" });
    assert.equal((await paytabsCallback(callback(created.reference))).status, 409);
    assert.equal(s.deliveries.length, 0);
    s.setGateway({ currency: "EGP", tranRef: "PT-OLD" });
    assert.equal((await paytabsCallback(callback(created.reference, "PT-OLD"))).status, 409);
    assert.equal(s.deliveries.length, 0);
    s.setGateway({ tranRef: "PT-ONE", status: "P" });
    assert.equal((await paytabsCallback(callback(created.reference))).status, 200);
    assert.equal(s.deliveries.length, 0);

    s.setGateway({ status: "A" });
    assert.equal((await paytabsCallback(callback(created.reference))).status, 200);
    assert.equal(s.order.paymentStatus, "DEPOSIT_PAID");
    assert.equal(s.deliveries.length, 1);
    const event = s.deliveries[0].events[0];
    assert.equal(event.id, `dandle-order:${created.reference}:PT-ONE`);
    assert.equal(event.oppref, "OPENAI-ORDER-777");
    assert.deepEqual(event.data, { type: "contents", currency: "EGP", amount: 876000 });
    const replay = await paytabsCallback(callback(created.reference));
    assert.equal(replay.status, 200);
    assert.equal((await replay.json()).alreadyProcessed, true);
    assert.equal(s.deliveries.length, 1);
    assert.equal(s.transitions.length, 2);
  } finally { s.restore(); }
});

test("duplicate bridge acknowledgment cannot emit a purchase", async () => {
  const s = setup();
  try {
    await submitOrder({ oppref: "NO-REPLAY" });
    s.accept();
    s.setRecorded({ applied: false, duplicate: true });
    const response = await paytabsCallback(callback(s.order.reference));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).alreadyProcessed, true);
    assert.equal(s.order.paymentStatus, "PAYMENT_PENDING");
    assert.equal(s.deliveries.length, 0);
  } finally { s.restore(); }
});

test("isolated payment test is settled without conversion", async () => {
  const s = setup();
  try {
    await submitOrder({ oppref: "TEST-ONLY" });
    s.accept();
    s.order.metadata = { payment_test: true };
    assert.equal((await paytabsCallback(callback(s.order.reference))).status, 200);
    assert.equal(s.order.paymentStatus, "DEPOSIT_PAID");
    assert.equal(s.deliveries.length, 0);
  } finally { s.restore(); }
});
