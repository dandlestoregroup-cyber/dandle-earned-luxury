/**
 * paymentPolicy — pure, runtime-agnostic payment decision logic.
 *
 * Deliberately free of Deno/Node globals so the same code that runs inside the
 * edge functions is executed by the Vitest suite. Every rule that decides
 * "is this order paid / repriced / offerable to InstaPay" lives here.
 *
 * Retains the August 2026 PayTabs hardening verbatim:
 *   - server-authoritative catalog repricing
 *   - fail-closed on unknown / non-purchasable offers
 *   - PayTabs' own verification is the only source of a paid status
 *   - verified cart_id and amount must both be present and match exactly
 *   - nothing the browser sends is trusted
 */

import { priceForOffer } from "./catalogPrices.ts";

// ─── Vocabulary ──────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "expired",
  "instapay_pending",
  "instapay_verification_required",
  "request",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["paytabs", "instapay"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function isOrderStatus(x: unknown): x is OrderStatus {
  return typeof x === "string" && (ORDER_STATUSES as readonly string[]).includes(x);
}

/**
 * Conclusive PayTabs negatives. Only these may unlock the InstaPay fallback.
 * `pending` (uncertain / still verifying) is intentionally excluded.
 */
export const TERMINAL_PAYTABS_FAILURES: readonly OrderStatus[] = [
  "failed",
  "cancelled",
  "expired",
];

export function isTerminalPaytabsFailure(status: unknown): boolean {
  return isOrderStatus(status) && TERMINAL_PAYTABS_FAILURES.includes(status);
}

/** A reference whose payment attempt may still be reused for a fresh PayTabs cart. */
export function isReusableForRetry(status: unknown): boolean {
  return isTerminalPaytabsFailure(status);
}

// ─── Status transitions ──────────────────────────────────────────────────────

/**
 * `paid` is absorbing: nothing may move an order out of it, and only the
 * verified PayTabs callback or an authorised admin decision may move one in
 * (enforced by the callers plus the DB trigger).
 */
export function isTransitionAllowed(from: unknown, to: unknown): boolean {
  if (!isOrderStatus(from) || !isOrderStatus(to)) return false;
  if (from === "paid") return to === "paid";
  return true;
}

// ─── PayTabs response mapping ────────────────────────────────────────────────

/**
 * Map a *verified* PayTabs response to (payment_status, safe_failure_reason).
 * PayTabs response_status: A authorised, H hold, P pending, V void, E error,
 * D declined, X expired, C cancelled.
 */
export function mapPaytabsStatus(
  respStatus: string | undefined,
  respMessage: string | undefined,
  respCode: string | undefined,
): { payment_status: OrderStatus; safe_failure_reason: string | null } {
  const msg = (respMessage || "").toLowerCase();
  const code = (respCode || "").toString();

  if (respStatus === "A") return { payment_status: "paid", safe_failure_reason: null };

  // A provider hold is not a decline: funds may still settle.
  if (respStatus === "P" || respStatus === "H") {
    return { payment_status: "pending", safe_failure_reason: null };
  }

  if (respStatus === "C" || /cancel|abandon/.test(msg)) {
    return { payment_status: "cancelled", safe_failure_reason: "payment_cancelled" };
  }
  if (respStatus === "X" || /expire|timeout/.test(msg)) {
    return { payment_status: "expired", safe_failure_reason: "payment_expired" };
  }
  if (respStatus === "D" || respStatus === "E" || respStatus === "V") {
    if (/insufficient|not enough|low balance|funds/.test(msg)) {
      return { payment_status: "failed", safe_failure_reason: "insufficient_funds" };
    }
    if (/declin|do not honou?r|refused/.test(msg) || code === "05") {
      return { payment_status: "failed", safe_failure_reason: "card_declined" };
    }
    if (/bank|issuer|reject/.test(msg)) {
      return { payment_status: "failed", safe_failure_reason: "bank_rejected" };
    }
    if (/gateway|network|connection|timeout/.test(msg)) {
      return { payment_status: "failed", safe_failure_reason: "gateway_error" };
    }
    return { payment_status: "failed", safe_failure_reason: "unknown_failure" };
  }

  // Ambiguous / still processing — never a terminal state.
  return { payment_status: "pending", safe_failure_reason: null };
}

// ─── Acceptance guards for a "paid" callback ────────────────────────────────

export type AcceptanceResult =
  | { ok: true }
  | {
      ok: false;
      code: "cart_mismatch" | "amount_mismatch" | "invalid_verification";
      detail: string;
    };

export function verifyPaidAcceptance(input: {
  cartId: string;
  verifiedCartId?: string | null;
  paidAmount: unknown;
  orderAmount: unknown;
}): AcceptanceResult {
  const { cartId, verifiedCartId } = input;

  // Query Transaction is our trusted source. Missing identity is not neutral:
  // PayTabs documents cart_id as part of the transaction query response, so a
  // response without it cannot prove that this transaction belongs to this order.
  if (!verifiedCartId || verifiedCartId !== cartId) {
    return { ok: false, code: "cart_mismatch", detail: "Transaction does not belong to this order" };
  }

  const paid = Number(input.paidAmount);
  const owed = Number(input.orderAmount);
  if (!Number.isFinite(paid) || !Number.isFinite(owed) || paid <= 0 || owed <= 0) {
    return {
      ok: false,
      code: "invalid_verification",
      detail: "Payment amount could not be verified",
    };
  }

  // Query Transaction returns cart_amount for the verified transaction. Since
  // Dandle creates that PayTabs cart from the server-authoritative order total,
  // require exact cent-level equality rather than accepting missing or excess data.
  if (Math.round(paid * 100) !== Math.round(owed * 100)) {
    return { ok: false, code: "amount_mismatch", detail: "Paid amount does not match the order total" };
  }

  return { ok: true };
}

// ─── Server-authoritative repricing ─────────────────────────────────────────

export interface PricedLineInput {
  productName?: string;
  mechanismOfferId: string;
  quantity: unknown;
  extras?: Array<{ priceEgp?: unknown }> | null;
}

export type PricingResult =
  | { ok: true; totalEgp: number }
  | { ok: false; reason: string };

/**
 * Re-derive the order total from the generated catalog. The browser's
 * `unitPriceEgp` / `totalAmount` are never used.
 */
export function priceGuidedLines(lines: PricedLineInput[] | undefined | null): PricingResult {
  if (!lines || lines.length === 0) return { ok: false, reason: "Order contains no lines" };

  let totalEgp = 0;
  for (const line of lines) {
    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return { ok: false, reason: `Invalid quantity for ${line.productName || "item"}` };
    }

    const unitPriceEgp = priceForOffer(line.mechanismOfferId);
    if (unitPriceEgp === null) {
      return { ok: false, reason: "Item is not available for online checkout" };
    }

    let extrasEgp = 0;
    for (const extra of line.extras ?? []) {
      const extraPrice = Number(extra?.priceEgp ?? 0);
      if (!Number.isFinite(extraPrice) || extraPrice !== 0) {
        return { ok: false, reason: "Order contains an extra that cannot be priced" };
      }
      extrasEgp += extraPrice;
    }

    totalEgp += (unitPriceEgp + extrasEgp) * quantity;
  }

  if (!Number.isFinite(totalEgp) || totalEgp <= 0) {
    return { ok: false, reason: "Order total could not be determined" };
  }
  return { ok: true, totalEgp };
}

// ─── InstaPay configuration (presence only — values never returned) ─────────

export const INSTAPAY_REQUIRED_KEYS = [
  "INSTAPAY_ENABLED",
  "INSTAPAY_RECEIVER_HANDLE",
  "INSTAPAY_RECEIVER_NAME",
] as const;

export interface InstapayConfigStatus {
  configured: boolean;
  missing: string[];
  /** Present only when fully configured; the caller decides whether to expose. */
  receiver: { handle: string; name: string } | null;
}

/**
 * Fail-closed configuration check. Reports *key names* only.
 * `INSTAPAY_ENABLED` must be the literal string "true".
 */
export function readInstapayConfig(
  env: (key: string) => string | undefined,
): InstapayConfigStatus {
  const missing: string[] = [];
  for (const key of INSTAPAY_REQUIRED_KEYS) {
    const value = (env(key) ?? "").trim();
    if (!value) missing.push(key);
  }
  const enabled = (env("INSTAPAY_ENABLED") ?? "").trim().toLowerCase();
  if (!missing.includes("INSTAPAY_ENABLED") && enabled !== "true") {
    missing.push("INSTAPAY_ENABLED");
  }
  if (missing.length > 0) return { configured: false, missing, receiver: null };
  return {
    configured: true,
    missing: [],
    receiver: {
      handle: (env("INSTAPAY_RECEIVER_HANDLE") ?? "").trim(),
      name: (env("INSTAPAY_RECEIVER_NAME") ?? "").trim(),
    },
  };
}

/** InstaPay may be offered only after a stored terminal PayTabs negative AND config. */
export function canOfferInstapay(storedStatus: unknown, configured: boolean): boolean {
  return configured && isTerminalPaytabsFailure(storedStatus);
}

// ─── Customer proof submission (evidence only) ──────────────────────────────

export type ProofResult =
  | { ok: true; nextStatus: "instapay_verification_required" }
  | { ok: false; code: "wrong_state" | "invalid_reference" };

/**
 * A customer submission can only move `instapay_pending` →
 * `instapay_verification_required`. It can never produce `paid`, regardless of
 * what the request body claims.
 */
export function evaluateProofSubmission(
  storedStatus: unknown,
  transactionId: unknown,
): ProofResult {
  const ref = typeof transactionId === "string" ? transactionId.trim() : "";
  if (ref.length < 4 || ref.length > 64 || !/^[A-Za-z0-9._/-]+$/.test(ref)) {
    return { ok: false, code: "invalid_reference" };
  }
  if (storedStatus !== "instapay_pending") return { ok: false, code: "wrong_state" };
  return { ok: true, nextStatus: "instapay_verification_required" };
}

/** Admin verification outcome mapping. */
export function resolveAdminDecision(
  storedStatus: unknown,
  decision: unknown,
): { ok: true; nextStatus: OrderStatus; reason: string | null } | { ok: false; code: string } {
  if (storedStatus === "paid") return { ok: false, code: "already_paid" };
  if (storedStatus !== "instapay_verification_required") return { ok: false, code: "wrong_state" };
  if (decision === "approve") return { ok: true, nextStatus: "paid", reason: null };
  if (decision === "reject") {
    return { ok: true, nextStatus: "failed", reason: "instapay_not_verified" };
  }
  return { ok: false, code: "invalid_decision" };
}

// ─── PayTabs session-creation outcome ───────────────────────────────────────

export type CreationFailureKind =
  | "creation_failed" // conclusive: provider refused / returned an error body
  | "credentials_missing" // conclusive: we cannot even talk to the provider
  | "not_purchasable" // conclusive: repricing refused the order
  | "uncertain"; // network/timeout — order must remain pending

/**
 * Classify a PayTabs `/payment/request` attempt.
 * `uncertain` is returned for transport-level errors: the session may in fact
 * exist, so the order must stay `pending` and no fallback may be offered.
 */
export function classifyCreationOutcome(input: {
  transportError?: boolean;
  httpStatus?: number;
  body?: { redirect_url?: unknown; message?: unknown } | null;
}): { ok: true } | { ok: false; kind: CreationFailureKind; message: string } {
  if (input.transportError) {
    return { ok: false, kind: "uncertain", message: "Could not reach the payment provider" };
  }
  const status = input.httpStatus ?? 0;
  const redirect = input.body?.redirect_url;
  if (status >= 200 && status < 300 && typeof redirect === "string" && redirect.length > 0) {
    return { ok: true };
  }
  if (status >= 500) {
    // The provider answered, but with a server fault: treat as uncertain so we
    // never mark an order failed on a provider hiccup.
    return { ok: false, kind: "uncertain", message: "Payment provider is temporarily unavailable" };
  }
  const message =
    typeof input.body?.message === "string" && input.body.message.length > 0
      ? input.body.message
      : "Failed to create payment page";
  return { ok: false, kind: "creation_failed", message };
}
