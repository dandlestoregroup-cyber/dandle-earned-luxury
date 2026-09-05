import assert from "node:assert/strict";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import test from "node:test";
import {
  buildAuthoritativeSku,
  priceAuthoritativeCart,
  resolveAuthoritativeLine,
} from "../api/_lib/catalog.ts";
import { createOrderAccess, verifyOrderAccess } from "../api/_lib/order-access.ts";

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
  massageFeature: false,
};

test("authoritative server pricing ignores browser price and total tampering", () => {
  const priced = priceAuthoritativeCart([{ ...validRelaxMax, price: 1, unitPrice: 1, total: 1 }]);
  assert.equal(priced.lines[0].unitPrice, 28_900);
  assert.equal(priced.lines[0].lineTotal, 57_800);
  assert.equal(priced.total, 57_800);
  assert.equal(priced.currency, "EGP");
});

test("model, color, quantity and SKU must match the authoritative Dandle variant", () => {
  const good = resolveAuthoritativeLine(validRelaxMax);
  assert.equal(good.sku, buildAuthoritativeSku("relaxmax", "Desert Grey (Leather)", "power", false));
  assert.equal(good.model, "Dandle RelaxMax");
  assert.equal(good.color, "Desert Grey (Leather)");
  assert.equal(good.imageUrl, "/images/relaxmax-hero-offwhite.jpg");
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, productId: "fake-chair" }), /Unknown Dandle product/);
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, model: "Dandle Diva" }), /Model does not match/);
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, color: "Oasis Green" }), /Unsupported color/);
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, quantity: 0 }), /Invalid quantity/);
  assert.throws(() => resolveAuthoritativeLine({ ...validRelaxMax, sku: "DND-FAKE" }), /SKU does not match/);
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

test("PayTabs payment payload is full-order EGP with exact callback and return URLs", () => {
  const payload = paytabs.buildPayTabsPaymentRequest(
    { profileId: "12345", publicAppUrl: "https://dandle-vie.com" },
    { id: "11111111-1111-4111-8111-111111111111", total: 57_800 },
  );
  assert.equal(payload.profile_id, 12345);
  assert.equal(payload.tran_type, "sale");
  assert.equal(payload.tran_class, "ecom");
  assert.equal(payload.cart_currency, "EGP");
  assert.equal(payload.cart_amount, 57_800);
  assert.equal(payload.callback, "https://dandle-vie.com/api/public/paytabs/webhook");
  assert.equal(payload.return, "https://dandle-vie.com/checkout/payment-result?order=11111111-1111-4111-8111-111111111111");
});

test("PayTabs checkout response requires a trusted HTTPS PayTabs redirect and exact values", () => {
  const expected = {
    orderId: "11111111-1111-4111-8111-111111111111",
    amount: 57_800,
    currency: "EGP",
    profileId: "12345",
  };
  const good = {
    tran_ref: "TST-1",
    profile_id: 12345,
    cart_id: expected.orderId,
    cart_currency: "EGP",
    cart_amount: 57_800,
    redirect_url: "https://secure-egypt.paytabs.com/payment/page/test",
  };
  assert.equal(paytabs.validatePayTabsCreateResponse(good, expected, "https://secure-egypt.paytabs.com").ok, true);
  assert.equal(paytabs.validatePayTabsCreateResponse({ ...good, redirect_url: "https://evil.example/pay" }, expected, "https://secure-egypt.paytabs.com").ok, false);
  assert.equal(paytabs.validatePayTabsCreateResponse({ ...good, cart_amount: 1 }, expected, "https://secure-egypt.paytabs.com").reason, "amount_mismatch");
  assert.equal(paytabs.validatePayTabsCreateResponse({ ...good, profile_id: 999 }, expected, "https://secure-egypt.paytabs.com").reason, "profile_mismatch");
});

test("PayTabs raw callback HMAC-SHA256 signature is verified", () => {
  const raw = '{"tran_ref":"TST-1","cart_id":"11111111-1111-4111-8111-111111111111"}';
  const key = "test-server-key";
  const signature = paytabs.computePayTabsSignature(raw, key);
  assert.equal(paytabs.verifyPayTabsSignature(raw, signature, key), true);
  assert.equal(paytabs.verifyPayTabsSignature(`${raw} `, signature, key), false);
  assert.equal(paytabs.verifyPayTabsSignature(raw, "00".repeat(32), key), false);
});

test("verified settlement rejects all material mismatches", () => {
  const expected = {
    orderId: "11111111-1111-4111-8111-111111111111",
    amount: 57_800,
    currency: "EGP",
    profileId: "12345",
    tranRef: "TST-1",
  };
  const good = {
    tran_ref: "TST-1",
    profile_id: 12345,
    cart_id: expected.orderId,
    cart_currency: "EGP",
    cart_amount: 57_800,
    payment_result: { response_status: "A", response_code: "000", response_message: "Authorised" },
  };
  assert.equal(paytabs.validateVerifiedPayTabsTransaction(good, expected).ok, true);
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, cart_amount: 57_799 }, expected).reason, "amount_mismatch");
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, cart_currency: "USD" }, expected).reason, "currency_mismatch");
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, profile_id: 8 }, expected).reason, "profile_mismatch");
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, cart_id: "other" }, expected).reason, "cart_id_mismatch");
  assert.equal(paytabs.validateVerifiedPayTabsTransaction({ ...good, tran_ref: "TST-2" }, expected).reason, "tran_ref_mismatch");
});

test("successful, pending and failed PayTabs results map conservatively", () => {
  assert.equal(paytabs.mapPayTabsSettlementStatus("A"), "paid");
  assert.equal(paytabs.mapPayTabsSettlementStatus("P"), "pending_payment");
  assert.equal(paytabs.mapPayTabsSettlementStatus("H"), "pending_payment");
  assert.equal(paytabs.mapPayTabsSettlementStatus("D"), "payment_failed");
  assert.equal(paytabs.mapPayTabsSettlementStatus("E"), "payment_failed");
  assert.equal(paytabs.mapPayTabsSettlementStatus("X"), "payment_failed");
});

test("cross-user status access requires the matching HttpOnly order token", () => {
  const orderA = "11111111-1111-4111-8111-111111111111";
  const orderB = "22222222-2222-4222-8222-222222222222";
  const access = createOrderAccess(orderA);
  const cookiePair = access.cookie.split(";", 1)[0];
  assert.equal(verifyOrderAccess(cookiePair, orderA, access.hash), true);
  assert.equal(verifyOrderAccess(cookiePair, orderB, access.hash), false);
  assert.equal(verifyOrderAccess(null, orderA, access.hash), false);
});

test("webhook reads raw body before parse and independently queries PayTabs", () => {
  const source = readFileSync(new URL("../api/public/paytabs/webhook.ts", import.meta.url), "utf8");
  const rawIndex = source.indexOf("await request.text()");
  const signatureIndex = source.indexOf("verifyPayTabsSignature(rawBody");
  const parseIndex = source.indexOf("JSON.parse(rawBody)");
  assert.ok(rawIndex >= 0 && signatureIndex > rawIndex && parseIndex > signatureIndex);
  assert.match(source, /queryPayTabsTransaction\(payTabs, tranRef\)/);
  assert.match(source, /validateVerifiedPayTabsTransaction/);
  assert.match(source, /export async function POST/);
  assert.doesNotMatch(source, /export default async function handler/);
});

test("database settlement is atomic, immutable and duplicate-safe", () => {
  const migration = readFileSync(new URL("../supabase/migrations/20260904160000_paytabs_production_orders.sql", import.meta.url), "utf8");
  assert.match(migration, /for update;/i);
  assert.match(migration, /if v_order\.status = 'paid'/i);
  assert.match(migration, /'duplicate', true/i);
  assert.match(migration, /set status = 'paid'/i);
  assert.match(migration, /and status = 'pending_payment'/i);
  assert.match(migration, /checkout snapshot is immutable/i);
});

test("reconciliation uses pending orders and the same atomic settlement RPC", () => {
  const reconcile = readFileSync(new URL("../api/cron/paytabs-reconcile.ts", import.meta.url), "utf8");
  const store = readFileSync(new URL("../api/_lib/supabase-orders.ts", import.meta.url), "utf8");
  assert.match(store, /status:\s*"eq\.pending_payment"/);
  assert.match(reconcile, /settleOrderPaid\(order\.id/);
  assert.match(reconcile, /validateVerifiedPayTabsTransaction/);
  assert.match(reconcile, /export async function GET/);
});

test("active Vercel PayTabs routes use named Web handlers and runtime-safe imports", () => {
  const paths = [
    "../api/public/paytabs/checkout.ts",
    "../api/public/paytabs/webhook.ts",
    "../api/public/paytabs/status.ts",
    "../api/cron/paytabs-reconcile.ts",
  ];
  for (const path of paths) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(source, /export default async function handler/);
    assert.doesNotMatch(source, /from\s+"\.\.?\/[^".]+"/);
  }
});

test("PayTabs server key never enters browser source", () => {
  const checkout = readFileSync(new URL("../api/public/paytabs/checkout.ts", import.meta.url), "utf8");
  const cart = readFileSync(new URL("../src/pages/Cart.tsx", import.meta.url), "utf8");
  const result = readFileSync(new URL("../src/pages/PaymentResult.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(cart, /PAYTABS_SERVER_KEY|serverKey/);
  assert.doesNotMatch(result, /PAYTABS_SERVER_KEY|serverKey/);
  assert.match(checkout, /Authorization:\s*payTabs\.serverKey/);
});

test("legacy deposit and manual payment starters are retired", () => {
  for (const path of ["payment-intent.ts", "instapay-intent.ts", "instapay-submit.ts"]) {
    const source = readFileSync(new URL(`../api/${path}`, import.meta.url), "utf8");
    assert.match(source, /status:\s*410/);
    assert.match(source, /export async function POST/);
  }
});
