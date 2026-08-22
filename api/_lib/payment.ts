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
  payment_result?: {
    response_status?: string;
    response_code?: string;
    response_message?: string;
  };
};

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
) {
  const reference = clean(verified.cart_id, 64).toUpperCase();
  const currency = clean(verified.cart_currency, 10).toUpperCase();
  const amount = Number(verified.cart_amount);
  const responseStatus = clean(verified.payment_result?.response_status, 8).toUpperCase();

  if (!responseStatus) {
    return { ok: false, reason: "missing_verified_status" } as const;
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
  if (Math.abs(roundMoney(amount) - roundMoney(expectedAmount)) > 0.01) {
    return { ok: false, reason: "amount_mismatch" } as const;
  }
  return { ok: true, amount: roundMoney(amount), responseStatus } as const;
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
