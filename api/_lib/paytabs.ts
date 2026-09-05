import { createHmac, timingSafeEqual } from "node:crypto";
import { roundMoney } from "./catalog.js";

export type PayTabsPaymentResult = {
  response_status?: unknown;
  response_code?: unknown;
  response_message?: unknown;
};

export type PayTabsTransaction = {
  tran_ref?: unknown;
  profile_id?: unknown;
  profileId?: unknown;
  cart_id?: unknown;
  cart_currency?: unknown;
  cart_amount?: unknown;
  redirect_url?: unknown;
  payment_result?: PayTabsPaymentResult;
};

export type PayTabsConfig = {
  apiBase: string;
  profileId: string;
  serverKey: string;
  publicAppUrl: string;
};

export type ExpectedPayTabsOrder = {
  orderId: string;
  amount: number;
  currency: "EGP";
  profileId: string;
  tranRef?: string | null;
};

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function profileString(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return clean(value, 80);
}

function moneyEquals(left: unknown, right: number) {
  const parsed = Number(left);
  return Number.isFinite(parsed) && roundMoney(parsed) === roundMoney(right);
}

export function readPayTabsConfig(env: NodeJS.ProcessEnv = process.env): PayTabsConfig | null {
  const apiBase = env.PAYTABS_API_BASE?.trim().replace(/\/$/, "") || "";
  const profileId = env.PAYTABS_PROFILE_ID?.trim() || "";
  const serverKey = env.PAYTABS_SERVER_KEY?.trim() || "";
  const publicAppUrl = env.PUBLIC_APP_URL?.trim().replace(/\/$/, "") || "";
  if (!apiBase || !profileId || !serverKey || !publicAppUrl) return null;
  if (apiBase !== "https://secure-egypt.paytabs.com") return null;
  if (publicAppUrl !== "https://dandle-vie.com") return null;
  const numericProfile = Number(profileId);
  if (!Number.isInteger(numericProfile) || numericProfile <= 0) return null;
  return { apiBase, profileId, serverKey, publicAppUrl };
}

export function buildPayTabsPaymentRequest(
  config: Pick<PayTabsConfig, "profileId" | "publicAppUrl">,
  order: { id: string; total: number },
) {
  return {
    profile_id: Number(config.profileId),
    tran_type: "sale",
    tran_class: "ecom",
    cart_id: order.id,
    cart_currency: "EGP",
    cart_amount: roundMoney(order.total),
    cart_description: `DANDLE order ${order.id.slice(0, 8)}`,
    callback: `${config.publicAppUrl}/api/public/paytabs/webhook`,
    return: `${config.publicAppUrl}/checkout/payment-result?order=${encodeURIComponent(order.id)}`,
  } as const;
}

export function isTrustedPayTabsRedirect(rawUrl: unknown, apiBase: string) {
  const value = clean(rawUrl, 2_000);
  if (!value) return false;
  try {
    const redirect = new URL(value);
    const expectedHost = new URL(apiBase).hostname.toLowerCase();
    return redirect.protocol === "https:" && redirect.hostname.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}

export function validatePayTabsCreateResponse(
  data: PayTabsTransaction,
  expected: ExpectedPayTabsOrder,
  apiBase: string,
) {
  const tranRef = clean(data.tran_ref, 160);
  const redirectUrl = clean(data.redirect_url, 2_000);
  if (!tranRef) return { ok: false, reason: "missing_tran_ref" } as const;
  if (!isTrustedPayTabsRedirect(redirectUrl, apiBase)) {
    return { ok: false, reason: "untrusted_redirect" } as const;
  }

  const returnedCartId = clean(data.cart_id, 80);
  if (returnedCartId && returnedCartId !== expected.orderId) {
    return { ok: false, reason: "cart_id_mismatch" } as const;
  }
  const returnedCurrency = clean(data.cart_currency, 10).toUpperCase();
  if (returnedCurrency && returnedCurrency !== expected.currency) {
    return { ok: false, reason: "currency_mismatch" } as const;
  }
  if (data.cart_amount !== undefined && data.cart_amount !== null && !moneyEquals(data.cart_amount, expected.amount)) {
    return { ok: false, reason: "amount_mismatch" } as const;
  }
  const returnedProfile = profileString(data.profile_id ?? data.profileId);
  if (returnedProfile && returnedProfile !== expected.profileId) {
    return { ok: false, reason: "profile_mismatch" } as const;
  }

  return { ok: true, tranRef, redirectUrl } as const;
}

export function computePayTabsSignature(rawBody: string, serverKey: string) {
  return createHmac("sha256", serverKey).update(rawBody, "utf8").digest("hex");
}

export function verifyPayTabsSignature(rawBody: string, signatureHeader: string | null, serverKey: string) {
  const supplied = (signatureHeader || "").trim().replace(/^sha256=/i, "").toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(supplied)) return false;
  const expected = computePayTabsSignature(rawBody, serverKey);
  const left = Buffer.from(expected, "hex");
  const right = Buffer.from(supplied, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function validateVerifiedPayTabsTransaction(
  data: PayTabsTransaction,
  expected: ExpectedPayTabsOrder,
) {
  const tranRef = clean(data.tran_ref, 160);
  if (!tranRef) return { ok: false, reason: "missing_tran_ref" } as const;
  if (expected.tranRef && tranRef !== expected.tranRef) {
    return { ok: false, reason: "tran_ref_mismatch" } as const;
  }
  if (clean(data.cart_id, 80) !== expected.orderId) {
    return { ok: false, reason: "cart_id_mismatch" } as const;
  }
  if (clean(data.cart_currency, 10).toUpperCase() !== expected.currency) {
    return { ok: false, reason: "currency_mismatch" } as const;
  }
  if (!moneyEquals(data.cart_amount, expected.amount)) {
    return { ok: false, reason: "amount_mismatch" } as const;
  }
  if (profileString(data.profile_id ?? data.profileId) !== expected.profileId) {
    return { ok: false, reason: "profile_mismatch" } as const;
  }
  const responseStatus = clean(data.payment_result?.response_status, 8).toUpperCase();
  if (!responseStatus) return { ok: false, reason: "missing_payment_status" } as const;
  return { ok: true, tranRef, responseStatus } as const;
}

export function mapPayTabsSettlementStatus(status: unknown) {
  const code = clean(status, 8).toUpperCase();
  if (code === "A") return "paid" as const;
  if (code === "H" || code === "P") return "pending_payment" as const;
  return "payment_failed" as const;
}

export function safePayTabsMetadata(data: PayTabsTransaction) {
  return {
    response_status: clean(data.payment_result?.response_status, 8),
    response_code: clean(data.payment_result?.response_code, 40),
    response_message: clean(data.payment_result?.response_message, 240),
    verified_at: new Date().toISOString(),
  };
}

export async function queryPayTabsTransaction(config: PayTabsConfig, tranRef: string) {
  const response = await fetch(`${config.apiBase}/payment/query`, {
    method: "POST",
    headers: {
      Authorization: config.serverKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profile_id: Number(config.profileId), tran_ref: tranRef }),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as PayTabsTransaction;
  if (!response.ok) throw new Error(`PayTabs verification returned HTTP ${response.status}`);
  return data;
}
