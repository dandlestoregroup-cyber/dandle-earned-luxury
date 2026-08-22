import assert from "node:assert/strict";
import test from "node:test";

const ORIGIN = "https://dandle-vie.com";
const PROJECT_REF = "rbvbrxjnhmgrtxvwusxr";
const FUNCTIONS = `https://${PROJECT_REF}.supabase.co/functions/v1`;

function decodeJwtPayload(token) {
  try {
    const segment = token.split(".")[1];
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

async function getPublishedAnonKey() {
  const html = await (await fetch(ORIGIN)).text();
  const scriptMatch = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/i);
  assert.ok(scriptMatch, "Could not locate the published app bundle");
  const bundleUrl = new URL(scriptMatch[1], ORIGIN).toString();
  const bundle = await (await fetch(bundleUrl)).text();
  const tokens = bundle.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) || [];
  const anon = tokens.find((token) => {
    const payload = decodeJwtPayload(token);
    return payload?.ref === PROJECT_REF && payload?.role === "anon";
  });
  assert.ok(anon, "Could not locate the published Supabase anon key");
  return anon;
}

async function invokeFunction(name, body, anonKey) {
  const response = await fetch(`${FUNCTIONS}/${name}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${anonKey}`,
      "content-type": "application/json",
      origin: ORIGIN,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text.slice(0, 500) }; }
  return { response, data };
}

test("actual live PayTabs session can be created from the Lovable production stack", async () => {
  const anonKey = await getPublishedAnonKey();
  const stamp = Date.now();

  const payload = {
    lines: [{
      productId: "relaxmax-recliner",
      productName: "RelaxMax",
      variantId: "relaxmax-recliner__warm-beige",
      colorSlug: "warm-beige",
      colorNameEn: "Warm Beige",
      colorNameAr: "Warm Beige TEST",
      material: null,
      imageUrl: "/images/products/relaxmax/warm-beige__front.webp",
      mechanismId: "manual",
      mechanismOfferId: "relaxmax-recliner__warm-beige::manual",
      mechanismLabelEn: "Manual",
      mechanismLabelAr: "Manual TEST",
      unitPriceEgp: 1,
      quantity: 1,
      checkoutAvailable: true,
      extras: [],
      notes: "AUTOMATED PAYTABS TEST ONLY - DO NOT FULFILL",
    }],
    access: {
      installationNotes: "AUTOMATED PAYTABS TEST ONLY - DO NOT FULFILL, SHIP OR CALL",
    },
    address: {
      governorateName: "Cairo",
      cityName: "Cairo",
      street: "TEST ORDER ONLY - DO NOT FULFILL",
      buildingNumber: "TEST",
      landmark: "AUTOMATED PAYMENT SMOKE TEST",
    },
    contact: {
      fullName: `DANDLE PAYTABS TEST ${stamp}`,
      mobile: "+201000000000",
      email: `dandle-paytabs-test-${stamp}@example.com`,
    },
    confirmedAt: new Date().toISOString(),
    // Deliberately tampered. The edge function must ignore this and charge the
    // server-authoritative RelaxMax manual price of EGP 21,900.
    totalAmount: 1,
    mode: "checkout",
  };

  const result = await invokeFunction("paytabs-create-payment", payload, anonKey);
  console.log("LIVE_PAYTABS_CREATE", JSON.stringify({
    status: result.response.status,
    success: result.data?.success,
    failureKind: result.data?.failure_kind,
    orderReference: result.data?.order_reference,
    error: result.data?.error,
    redirectHost: result.data?.redirect_url ? new URL(result.data.redirect_url).host : null,
  }));

  assert.equal(result.response.status, 200, `PayTabs create returned ${result.response.status}: ${JSON.stringify(result.data)}`);
  assert.equal(result.data.success, true);
  assert.match(String(result.data.order_reference || ""), /^DN-[A-Z0-9-]{4,40}$/i);
  assert.ok(result.data.redirect_url, "PayTabs did not return a hosted payment URL");

  const paymentUrl = new URL(result.data.redirect_url);
  assert.equal(paymentUrl.protocol, "https:");
  assert.ok(paymentUrl.hostname.endsWith("paytabs.com"), `Unexpected payment host: ${paymentUrl.hostname}`);

  // Load the hosted page without submitting any payment instrument. This proves
  // the returned session is reachable; it cannot charge anything by itself.
  const hosted = await fetch(paymentUrl, { redirect: "manual" });
  console.log("LIVE_PAYTABS_HOSTED_PAGE", JSON.stringify({
    orderReference: result.data.order_reference,
    paymentHost: paymentUrl.hostname,
    httpStatus: hosted.status,
  }));
  assert.ok(hosted.status >= 200 && hosted.status < 400, `Hosted PayTabs page returned ${hosted.status}`);

  // Probe the live status endpoint as well. If it rejects the generated
  // reference format, keep that evidence visible because the return journey
  // would need correction even though PayTabs itself is working.
  const statusProbe = await invokeFunction("get-order-status", { reference: result.data.order_reference }, anonKey);
  console.log("LIVE_ORDER_STATUS_PROBE", JSON.stringify({
    httpStatus: statusProbe.response.status,
    success: statusProbe.data?.success,
    error: statusProbe.data?.error,
    source: statusProbe.data?.source,
    paymentStatus: statusProbe.data?.order?.paymentStatus,
    totalAmount: statusProbe.data?.order?.totalAmount,
  }));
});
