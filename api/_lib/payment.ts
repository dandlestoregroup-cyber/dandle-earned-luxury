import { createHmac, timingSafeEqual } from "node:crypto";

export type PaymentOrder = {
  status?: unknown;
  paymentStatus?: unknown;
  payment_status?: unknown;
  totalPrice?: unknown;
  total_price?: unknown;
  total?: unknown;
};

export type VerifiedPayTabsPayload = {
  tran_ref?: string;
  cart_id?: string;
  cart_currency?: string;
  cart_amount?: string | number;
  profileId?: string | number;
  profile_id?: string | number;
  payment_result?: {
    response_status?: string;
    response_code?: string;
    response_message?: string;
  };
};

export type PayTabsCheckoutPayload = VerifiedPayTabsPayload & {
  redirect_url?: string;
  message?: string;
  trace?: string;
};

export const DEFAULT_PAYTABS_API_BASE = "https://secure-egypt.paytabs.com";

export const PAYABLE_ORDER_STATUSES = new Set([
  "ACCEPTED",
  "AMENDED",
  "INVOICE_READY",
  "AWAITING_PAYMENT",
]);

export const SETTLED_PAYMENT_STATUSES = new Set([
  "PAID",
  "DEPOSIT_PAID",
  "CAPTURED",
]);

export const UNCERTAIN_PAYMENT_STATUSES = new Set([
  "PAYMENT_PENDING",
  "PENDING",
  "PROCESSING",
  "HOLD",
  "AUTH_PENDING",
  "INSTAPAY_PENDING",
  "INSTAPAY_VERIFICATION_REQUIRED",
]);

export const CONCLUSIVELY_UNPAID_STATUSES = new Set([
  "",
  "NOT_PAID",
  "FAILED",
  "PAYMENT_FAILED",
  "DECLINED",
  "CARD_DECLINED",
  "BANK_REJECTED",
  "GATEWAY_ERROR",
  "CANCELLED",
  "EXPIRED",
]);

export const referencePattern = /^DN-[A-Z0-9-]{4,48}$/;

export const clean = (value: unknown, max = 300) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const roundMoney = (value: number) => Math.round(value * 100) / 100;

export function isTrustedPayTabsHost(hostname: string) {
  const normalized = hostname.trim().toLowerCase();
  return normalized === "paytabs.com" || normalized.endsWith(".paytabs.com");
}

export function getPayTabsConfig(env: NodeJS.ProcessEnv = process.env) {
  const serverKey = env.PAYTABS_SERVER_KEY?.trim() || "";
  const rawProfileId = env.PAYTABS_PROFILE_ID?.trim() || "";
  const profileId = Number(rawProfileId);
  if (!serverKey || !rawProfileId || !Number.isInteger(profileId) || profileId <= 0) return null;

  const apiBase = (env.PAYTABS_API_BASE?.trim() || DEFAULT_PAYTABS_API_BASE).replace(/\/+$/, "");
  try {
    const parsed = new URL(apiBase);
    if (parsed.protocol !== "https:" || !isTrustedPayTabsHost(parsed.hostname)) return null;
  } catch {
    return null;
  }

  return { serverKey, profileId, apiBase } as const;
}

export function getPublicAppOrigin(requestUrl: string, env: NodeJS.ProcessEnv = process.env) {
  const configured = env.PUBLIC_APP_URL?.trim() || env.PUBLIC_SITE_URL?.trim();
  const raw = configured || new URL(requestUrl).origin;
  const parsed = new URL(raw);
  if (env.NODE_ENV === "production" && parsed.protocol !== "https:") {
    throw new Error("PUBLIC_APP_URL must use https in production");
  }
  return parsed.origin.replace(/\/+$/, "");
}

export function verifyPayTabsSignature(rawBody: string, signature: string, serverKey: string) {
  try {
    const normalized = signature.trim();
    if (!/^[0-9a-f]{64}$/i.test(normalized)) return false;
    const computed = Buffer.from(createHmac("sha256", serverKey).update(rawBody).digest("hex"), "hex");
    const provided = Buffer.from(normalized, "hex");
    if (computed.length !== provided.length) return false;
    return timingSafeEqual(computed, provided);
  } catch {
    return false;
  }
}

export function validatePayTabsCheckoutResponse(args: {
  httpOk: boolean;
  payload: PayTabsCheckoutPayload;
  expectedReference: string;
  expectedAmount: number;
  expectedProfileId: number;
}) {
  const redirectUrl = clean(args.payload.redirect_url, 1200);
  const tranRef = clean(args.payload.tran_ref, 120);
  if (!args.httpOk || !redirectUrl || !tranRef) {
    return { ok: false, reason: "missing_checkout_fields" } as const;
  }

  if (args.payload.cart_id !== undefined && clean(args.payload.cart_id, 64).toUpperCase() !== args.expectedReference.toUpperCase()) {
    return { ok: false, reason: "cart_id_mismatch" } as const;
  }

  if (args.payload.cart_currency !== undefined && clean(args.payload.cart_currency, 10).toUpperCase() !== "EGP") {
    return { ok: false, reason: "currency_mismatch" } as const;
  }

  if (args.payload.cart_amount !== undefined) {
    const returnedAmount = Number(args.payload.cart_amount);
    if (!Number.isFinite(returnedAmount) || Math.abs(roundMoney(returnedAmount) - roundMoney(args.expectedAmount)) >= 0.005) {
      return { ok: false, reason: "amount_mismatch" } as const;
    }
  }

  const returnedProfile = args.payload.profileId ?? args.payload.profile_id;
  if (returnedProfile !== undefined && Number(returnedProfile) !== args.expectedProfileId) {
    return { ok: false, reason: "profile_mismatch" } as const;
  }

  try {
    const parsedRedirect = new URL(redirectUrl);
    if (parsedRedirect.protocol !== "https:" || !isTrustedPayTabsHost(parsedRedirect.hostname)) {
      return { ok: false, reason: "untrusted_redirect" } as const;
    }
  } catch {
    return { ok: false, reason: "invalid_redirect" } as const;
  }

  return { ok: true, redirectUrl, tranRef } as const;
}

export function unwrapOrder(payload: unknown): PaymentOrder {
  if (!payload || typeof payload !== "object") return {};
  const record = payload as Record<string, unknown>;
  const nested = record.order;
  if (nested && typeof nested === "object") return nested as PaymentOrder;
  return record as PaymentOrder;
}

export function normalizedOrderStatus(order: PaymentOrder) {
  return clean(order.status, 40).toUpperCase();
}

export function normalizedPaymentStatus(order: PaymentOrder) {
  return clean(order.paymentStatus ?? order.payment_status, 60).toUpperCase();
}

export function verifiedOrderTotal(order: PaymentOrder) {
  const total = Number(order.totalPrice ?? order.total_price ?? order.total);
  return Number.isFinite(total) && total > 0 ? roundMoney(total) : null;
}

export function expectedDepositAmount(order: PaymentOrder) {
  const total = verifiedOrderTotal(order);
  return total === null ? null : roundMoney(total * 0.4);
}

export function isSettledPayment(status: string) {
  return SETTLED_PAYMENT_STATUSES.has(status.toUpperCase());
}

export function isUncertainPayment(status: string) {
  return UNCERTAIN_PAYMENT_STATUSES.has(status.toUpperCase());
}

export function canStartInstapayFallback(order: PaymentOrder) {
  const orderStatus = normalizedOrderStatus(order);
  const paymentStatus = normalizedPaymentStatus(order);
  if (!PAYABLE_ORDER_STATUSES.has(orderStatus)) return false;
  if (isSettledPayment(paymentStatus) || isUncertainPayment(paymentStatus)) return false;
  return CONCLUSIVELY_UNPAID_STATUSES.has(paymentStatus);
}

export function mapVerifiedPayTabsStatus(status: unknown, message: unknown, code: unknown) {
  const responseStatus = clean(status, 8).toUpperCase();
  const responseMessage = clean(message, 300).toLowerCase();
  const responseCode = clean(code, 20);

  if (responseStatus === "A") {
    return { paymentStatus: "DEPOSIT_PAID", safeFailureReason: null, conclusive: true } as const;
  }

  if (responseStatus === "P" || responseStatus === "H") {
    return { paymentStatus: "PAYMENT_PENDING", safeFailureReason: null, conclusive: false } as const;
  }

  if (responseStatus === "C" || /cancel|abandon/.test(responseMessage)) {
    return { paymentStatus: "CANCELLED", safeFailureReason: "payment_cancelled", conclusive: true } as const;
  }

  if (responseStatus === "X" || /expire/.test(responseMessage)) {
    return { paymentStatus: "EXPIRED", safeFailureReason: "payment_expired", conclusive: true } as const;
  }

  if (["D", "E", "V"].includes(responseStatus)) {
    if (/insufficient|not enough|low balance|funds/.test(responseMessage)) {
      return { paymentStatus: "FAILED", safeFailureReason: "insufficient_funds", conclusive: true } as const;
    }
    if (/declin|do not honou?r|refused/.test(responseMessage) || responseCode === "05") {
      return { paymentStatus: "DECLINED", safeFailureReason: "card_declined", conclusive: true } as const;
    }
    if (/bank|issuer|reject/.test(responseMessage)) {
      return { paymentStatus: "FAILED", safeFailureReason: "bank_rejected", conclusive: true } as const;
    }
    if (/gateway|network|connection|timeout/.test(responseMessage)) {
      return { paymentStatus: "FAILED", safeFailureReason: "gateway_error", conclusive: true } as const;
    }
    return { paymentStatus: "FAILED", safeFailureReason: "unknown_failure", conclusive: true } as const;
  }

  return { paymentStatus: "PAYMENT_PENDING", safeFailureReason: null, conclusive: false } as const;
}

export function validateVerifiedPayTabsTransaction(
  verified: VerifiedPayTabsPayload,
  expectedReference: string,
  expectedAmount: number,
  expectedProfileId?: number,
  expectedTranRef?: string,
) {
  const reference = clean(verified.cart_id, 64).toUpperCase();
  const currency = clean(verified.cart_currency, 10).toUpperCase();
  const amount = Number(verified.cart_amount);
  const responseStatus = clean(verified.payment_result?.response_status, 8).toUpperCase();
  const tranRef = clean(verified.tran_ref, 120);

  if (!responseStatus) {
    return { ok: false, reason: "missing_verified_status" } as const;
  }
  if (!tranRef) {
    return { ok: false, reason: "missing_tran_ref" } as const;
  }
  if (expectedTranRef && tranRef !== expectedTranRef) {
    return { ok: false, reason: "tran_ref_mismatch" } as const;
  }
  if (reference !== expectedReference.toUpperCase()) {
    return { ok: false, reason: "cart_id_mismatch" } as const;
  }
  if (currency !== "EGP") {
    return { ok: false, reason: "currency_mismatch" } as const;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, reason: "invalid_amount" } as const;
  }
  if (Math.abs(roundMoney(amount) - roundMoney(expectedAmount)) >= 0.005) {
    return { ok: false, reason: "amount_mismatch" } as const;
  }

  const returnedProfile = verified.profileId ?? verified.profile_id;
  if (expectedProfileId !== undefined && returnedProfile !== undefined && Number(returnedProfile) !== expectedProfileId) {
    return { ok: false, reason: "profile_mismatch" } as const;
  }

  return { ok: true, amount: roundMoney(amount), responseStatus, tranRef } as const;
}

export function getInstapayConfig(env: NodeJS.ProcessEnv = process.env) {
  const recipientName = env.INSTAPAY_RECIPIENT_NAME?.trim() || "";
  const recipientId = env.INSTAPAY_RECIPIENT_ID?.trim() || "";
  if (!recipientName || !recipientId) return null;
  return { recipientName, recipientId };
}

export function customerSubmittedInstapayState() {
  return "INSTAPAY_VERIFICATION_REQUIRED" as const;
}
