import assert from "node:assert/strict";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import test from "node:test";
import {
  buildAuthoritativeSku,
  OPTION_PRICES_EGP,
  priceAuthoritativeCart,
  resolveAuthoritativeLine,
} from "../api/_lib/catalog.ts";
import { createOrderAccess, verifyOrderAccess } from "../api/_lib/order-access.ts";
import { CART_OPTION_PRICES_EGP, getCartOptionSurcharge } from "../src/lib/cartOptions.ts";

async function loadPayTabsModule() {
  const sourceUrl = new URL("../api/_lib/paytabs.ts", import.meta.url);
  const tempUrl = new URL("../api/_lib/.paytabs.test-loader.ts", import.meta.url);
  const source = readFileSync(sourceUrl, "utf8").replace(
    'from "./catalog.js";',
    'from "./catalog.ts";',
  );
  writeFileSync(tempUrl, source, "utf8");
  try {
    return await import(`${tempUrl.href}?test=${Date.now()}`);
  } finally {
    unlinkSync(tempUrl);
  }
}

const paytabs = await loadPayTabsModule();
const validRelaxMax = {
  productId: "relaxmax",
  model: "Dandle RelaxMax",
  color: "Desert Grey (Leather)",
  mechanism: "power",
  quantity: 2,
};

const fullOptions = {
  baseType: "swivel360",
  giftWrap: true,
  engraving: true,
  cupHolder: true,
  usbPort: true,
  sidePocket: true,
  massageFeature: true,
  specialNotes: "Place plaque on the right side.",
};

test("server pricing ignores browser price and total tampering", () => {
  const priced = priceAuthoritativeCart([{ ...validRelaxMax, price: 1, unitPrice: 1, total: 1 }]);
  assert.equal(priced.lines[0].unitPrice, 28_900);
  assert.equal(priced.total, 57_800);
  assert.equal(priced.currency, "EGP");
});

test("every configurator surcharge is server-owned and matches the displayed cart schedule", () => {
  assert.deepEqual(OPTION_PRICES_EGP, CART_OPTION_PRICES_EGP);
  const line = resolveAuthoritativeLine({ ...validRelaxMax, quantity: 1, options: fullOptions });
  assert.equal(getCartOptionSurcharge(fullOptions), 17_550);
  assert.equal(line.baseUnitPrice, 28_900);
  assert.equal(line.optionSurcharge, 17_550);
  assert.equal(line.unitPrice, 46_450);
  assert.equal(line.lineTotal, 46_450);
  assert.deepEqual(line.options, fullOptions);
  assert.match(line.sku, /-SWV360-GW-ENG-CUP-USB-PKT-MSG$/);
});

test("paid option choices are priced by server even when browser submits fake amounts", () => {
  const priced = priceAuthoritativeCart([{
    ...validRelaxMax,
    quantity: 2,
    options: fullOptions,
    price: 1,
    unitPrice: 1,
    optionSurcharge: 0,
    lineTotal: 2,
    total: 2,
  }]);
  assert.equal(priced.lines[0].unitPrice, 46_450);
  assert.equal(priced.total, 92_900);
});

test("configuration tampering is rejected instead of silently coerced", () => {
  assert.throws(
    () => resolveAuthoritativeLine({ ...validRelaxMax, options: { ...fullOptions, baseType: "teleport" } }),
    /Invalid baseType/,
  );
  assert.throws(
    () => resolveAuthoritativeLine({ ...validRelaxMax, options: { ...fullOptions, giftWrap: "true" } }),
    /Invalid giftWrap/,
  );
  assert.throws(
    () => resolveAuthoritativeLine({ ...validRelaxMax, options: "massage" }),
    /Invalid Dandle configuration options/,
  );
  assert.throws(
    () => resolveAuthoritativeLine({ ...validRelaxMax, options: { ...fullOptions, specialNotes: 42 } }),
    /Invalid specialNotes/,
  );
});

test("massage can only be charged on the three existing eligible models", () => {
  assert.throws(
    () => resolveAuthoritativeLine({
      productId: "comfortplus",
      model: "Dandle ComfortPlus Power",
      color: "Amber Sand (Nubuck Leather)",
      mechanism: "power",
      quantity: 1,
      options: { massageFeature: true },
    }),
    /Massage add-on is not available/,
  );
});

test("model, color, quantity and SKU must match the authoritative configuration", () => {
  const good = resolveAuthoritativeLine(validRelaxMax);
  assert.equal(good.sku, buildAuthoritativeSku("relaxmax", "Desert Grey (Leather)", "power", false));
  assert.equal(good.imageUrl, "/images/relaxmax-hero-offwhite.jpg");
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, productId: "fake-chair" }), /Unknown Dandle product/);
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, model: "Dandle Diva" }), /Model does not match/);
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, color: "Oasis Green" }), /Unsupported color/);
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, quantity: 0 }), /Invalid quantity/);
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, options: fullOptions, sku: good.sku }), /SKU does not match/);
});

test("ComfortPlus never falls back to a RelaxMax image", () => {
  const line = resolveAuthoritativeLine({
    productId: "comfortplus",
    model: "Dandle ComfortPlus Power",
    color: "Amber Sand (Nubuck Leather)",
    mechanism: "power",
    quantity: 1,
  });
  assert.equal(line.imageUrl, "/images/comfortplus-tan-front.webp");
  assert.doesNotMatch(line.imageUrl, /relaxmax/i);
});

test("configurator persists every paid option and no unsupported service-charge fee", () => {
  const modal = readFileSync(new URL("../src/components/ProductModal.tsx", import.meta.url), "utf8");
  const cart = readFileSync(new URL("../src/pages/Cart.tsx", import.meta.url), "utf8");
  assert.match(modal, /addItem\(product, colorName, mechanism, options\)/);
  for (const field of ["baseType", "giftWrap", "engraving", "cupHolder", "usbPort", "sidePocket", "massageFeature", "specialNotes"]) {
    assert.match(modal, new RegExp(`\\b${field}\\b`));
  }
  assert.doesNotMatch(modal, /Service Charge|calculateCommission|0\.035/);
  assert.match(cart, /options:\s*item\.options/);
  assert.match(cart, /getUnitPrice\(item\)/);
});

test("PayTabs payload is full-order EGP with exact callback and return URLs", () => {
  const orderId = "11111111-1111-4111-8111-111111111111";
  const payload = paytabs.buildPayTabsPaymentRequest(
    { profileId: "12345", publicAppUrl: "https://dandle-vie.com" },
    { id: orderId, total: 92_900 },
  );
  assert.equal(payload.profile_id, 12345);
  assert.equal(payload.cart_id, orderId);
  assert.equal(payload.cart_currency, "EGP");
  assert.equal(payload.cart_amount, 92_900);
  assert.equal(payload.callback, "https://dandle-vie.com/api/public/paytabs/webhook");
  assert.equal(payload.return, `https://dandle-vie.com/checkout/payment-result?order=${orderId}`);
});

test("PayTabs checkout requires trusted HTTPS redirect and exact amount/profile/order", () => {
  const expected = { orderId: "11111111-1111-4111-8111-111111111111", amount: 92_900, currency: "EGP", profileId: "12345" };
  const good = {
    tran_ref: "TST-1", profile_id: 12345, cart_id: expected.orderId,
    cart_currency: "EGP", cart_amount: 92_900,
    redirect_url: "https://secure-egypt.paytabs.com/payment/page/test",
  };
  assert.equal(paytabs.validatePayTabsCreateResponse(good, expected, "https://secure-egypt.paytabs.com").ok, true);
  assert.equal(paytabs.validatePayTabsCreateResponse({ ...good, redirect_url: "https://evil.example/pay" }, expected, "https://secure-egypt.paytabs.com").ok, false);
  assert.equal(paytabs.validatePayTabsCreateResponse({ ...good, cart_amount: 1 }, expected, "https://secure-egypt.paytabs.com").reason, "amount_mismatch");
  assert.equal(paytabs.validatePayTabsCreateResponse({ ...good, profile_id: 999 }, expected, "https://secure-egypt.paytabs.com").reason, "profile_mismatch");
});

test("raw callback HMAC-SHA256 signature is verified", () => {
  const raw = '{"tran_ref":"TST-1","cart_id":"11111111-1111-4111-8111-111111111111"}';
  const key = "test-server-key";
  const signature = paytabs.computePayTabsSignature(raw, key);
  assert.equal(paytabs.verifyPayTabsSignature(raw, signature, key), true);
  assert.equal(paytabs.verifyPayTabsSignature(`${raw} `, signature, key), false);
  assert.equal(paytabs.verifyPayTabsSignature(raw, "00".repeat(32), key), false);
});

test("verified settlement rejects all identity/value mismatches", () => {
  const expected = { orderId: "11111111-1111-4111-8111-111111111111", amount: 92_900, currency: "EGP", profileId: "12345", tranRef: "TST-1" };
  const good = { tran_ref: "TST-1", profile_id: 12345, cart_id: expected.orderId, cart_currency: "EGP", cart_amount: 92_900, payment_result: { response_status: "A" } };
  assert.equal(paytabs.validateVerifiedPayTabsTransaction(good, expected).ok, true);
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, cart_amount: 92_899 }, expected).reason, "amount_mismatch");
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, cart_currency: "USD" }, expected).reason, "currency_mismatch");
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, profile_id: 8 }, expected).reason, "profile_mismatch");
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, cart_id: "other" }, expected).reason, "cart_id_mismatch");
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, tran_ref: "TST-2" }, expected).reason, "tran_ref_mismatch");
});

test("cross-user status isolation requires matching HttpOnly order token", () => {
  const orderA = "11111111-1111-4111-8111-111111111111";
  const orderB = "22222222-2222-4222-8222-222222222222";
  const access = createOrderAccess(orderA);
  const cookiePair = access.cookie.split(";", 1)[0];
  assert.equal(verifyOrderAccess(cookiePair, orderA, access.hash), true);
  assert.equal(verifyOrderAccess(cookiePair, orderB, access.hash), false);
  assert.equal(verifyOrderAccess(null, orderA, access.hash), false);
});

test("webhook verifies raw body before parsing and independently re-queries PayTabs", () => {
  const source = readFileSync(new URL("../api/public/paytabs/webhook.ts", import.meta.url), "utf8");
  const rawIndex = source.indexOf("await request.text()");
  const signatureIndex = source.indexOf("verifyPayTabsSignature(rawBody");
  const parseIndex = source.indexOf("JSON.parse(rawBody)");
  assert.ok(rawIndex >= 0 && signatureIndex > rawIndex && parseIndex > signatureIndex);
  assert.match(source, /queryPayTabsTransaction\(payTabs, tranRef\)/);
  assert.match(source, /validateVerifiedPayTabsTransaction/);
});

test("database settlement is atomic, immutable and duplicate-safe", () => {
  const migration = readFileSync(new URL("../supabase/migrations/20260904160000_paytabs_production_orders.sql", import.meta.url), "utf8");
  assert.match(migration, /for update;/i);
  assert.match(migration, /if v_order\.status = 'paid'/i);
  assert.match(migration, /'duplicate', true/i);
  assert.match(migration, /and status = 'pending_payment'/i);
  assert.match(migration, /checkout snapshot is immutable/i);
});

test("reconciliation is ten-minute, secretless OIDC-authenticated and uses atomic settlement", () => {
  const reconcile = readFileSync(new URL("../api/cron/paytabs-reconcile.ts", import.meta.url), "utf8");
  const store = readFileSync(new URL("../api/_lib/supabase-orders.ts", import.meta.url), "utf8");
  const scheduler = readFileSync(new URL("../.github/workflows/paytabs-reconcile.yml", import.meta.url), "utf8");
  const env = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
  assert.match(store, /status:\s*"eq\.pending_payment"/);
  assert.match(reconcile, /settleOrderPaid\(order\.id/);
  assert.match(reconcile, /validateVerifiedPayTabsTransaction/);
  assert.match(reconcile, /token\.actions\.githubusercontent\.com/);
  assert.match(reconcile, /workflow_ref === GITHUB_WORKFLOW_REF/);
  assert.match(reconcile, /claims\.ref === "refs\/heads\/main"/);
  assert.match(scheduler, /cron:\s*["']\*\/10 \* \* \* \*["']/);
  assert.match(scheduler, /id-token:\s*write/);
  assert.match(scheduler, /ACTIONS_ID_TOKEN_REQUEST_TOKEN/);
  assert.doesNotMatch(scheduler, /secrets\.CRON_SECRET/);
  assert.doesNotMatch(env, /^CRON_SECRET=/m);
});

test("PayTabs server key never enters browser source or payment request body", () => {
  const checkout = readFileSync(new URL("../api/public/paytabs/checkout.ts", import.meta.url), "utf8");
  const cart = readFileSync(new URL("../src/pages/Cart.tsx", import.meta.url), "utf8");
  const result = readFileSync(new URL("../src/pages/PaymentResult.tsx", import.meta.url), "utf8");
  const payload = paytabs.buildPayTabsPaymentRequest({ profileId: "12345", publicAppUrl: "https://dandle-vie.com" }, { id: "11111111-1111-4111-8111-111111111111", total: 100 });
  assert.equal(JSON.stringify(payload).includes("PAYTABS_SERVER_KEY"), false);
  assert.doesNotMatch(cart, /PAYTABS_SERVER_KEY|serverKey/);
  assert.doesNotMatch(result, /PAYTABS_SERVER_KEY|serverKey/);
  assert.match(checkout, /Authorization:\s*payTabs\.serverKey/);
});

test("protected status response keeps exact option and pricing snapshots", () => {
  const status = readFileSync(new URL("../api/public/paytabs/status.ts", import.meta.url), "utf8");
  assert.match(status, /options:\s*line\.options/);
  assert.match(status, /optionSurcharge:\s*line\.optionSurcharge/);
  assert.match(status, /unitPrice:\s*line\.unitPrice/);
});

test("legacy TakeApp order, deposit, callback and InstaPay serverless starters are physically removed", () => {
  for (const path of ["order-intent.ts", "payment-intent.ts", "instapay-intent.ts", "instapay-submit.ts", "paytabs-callback.ts"]) {
    assert.equal(existsSync(new URL(`../api/${path}`, import.meta.url)), false, `${path} must not deploy`);
  }
});

test("legacy order page is status-only and cannot initiate the retired payment paths", () => {
  const source = readFileSync(new URL("../src/pages/OrderStatus.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\/api\/(payment-intent|instapay-intent|instapay-submit)/);
  assert.doesNotMatch(source, /40%|Remaining 60%|InstaPay transfer selected/i);
  assert.match(source, /status-only/i);
});
