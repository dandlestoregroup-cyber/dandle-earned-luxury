import {
  clean,
  expectedDepositAmount,
  getPayTabsConfig,
  isSettledPayment,
  mapVerifiedPayTabsStatus,
  normalizedPaymentStatus,
  referencePattern,
  unwrapOrder,
  validateVerifiedPayTabsTransaction,
  verifyPayTabsSignature,
  type VerifiedPayTabsPayload,
} from "./_lib/payment";

async function recordPaymentState(
  paymentWebhook: string,
  token: string,
  payload: Record<string, unknown>,
) {
  const response = await fetch(paymentWebhook, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Payment recording webhook returned ${response.status}`);
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const payTabs = getPayTabsConfig();
  const paymentWebhook = process.env.TAKEAPP_PAYMENT_WEBHOOK_URL?.trim();
  const statusUrl = process.env.TAKEAPP_ORDER_STATUS_URL?.trim();
  const webhookToken = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim();
  if (!payTabs || !paymentWebhook || !statusUrl || !webhookToken) {
    return Response.json({ error: "Payment callback is not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("signature") ?? "";
  if (!signature || !verifyPayTabsSignature(rawBody, signature, payTabs.serverKey)) {
    console.warn("Rejected PayTabs callback with invalid signature");
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let callback: VerifiedPayTabsPayload;
  try {
    const parsed = JSON.parse(rawBody);
    callback = parsed && typeof parsed === "object" ? (parsed as VerifiedPayTabsPayload) : {};
  } catch {
    return Response.json({ error: "Invalid callback payload" }, { status: 400 });
  }

  const tranRef = clean(callback.tran_ref, 120);
  const callbackReference = clean(callback.cart_id, 64).toUpperCase();
  const callbackProfileId = Number(callback.profileId ?? callback.profile_id);
  if (!tranRef || !referencePattern.test(callbackReference)) {
    return Response.json({ error: "Invalid payment reference" }, { status: 400 });
  }
  if (!Number.isFinite(callbackProfileId) || callbackProfileId !== payTabs.profileId) {
    return Response.json({ error: "Invalid payment profile" }, { status: 409 });
  }

  try {
    const orderResponse = await fetch(
      `${statusUrl}${statusUrl.includes("?") ? "&" : "?"}reference=${encodeURIComponent(callbackReference)}`,
      { headers: { Authorization: `Bearer ${webhookToken}` }, cache: "no-store" },
    );
    if (!orderResponse.ok) throw new Error(`TakeApp status bridge returned ${orderResponse.status}`);
    const order = unwrapOrder(await orderResponse.json());
    const expectedDeposit = expectedDepositAmount(order);
    if (expectedDeposit === null) {
      return Response.json({ error: "Verified order total is unavailable" }, { status: 422 });
    }

    const signedCallbackCheck = validateVerifiedPayTabsTransaction(
      callback,
      callbackReference,
      expectedDeposit,
      payTabs.profileId,
      tranRef,
    );
    if (!signedCallbackCheck.ok) {
      console.error("Rejected mismatched signed PayTabs callback", {
        reference: callbackReference,
        reason: signedCallbackCheck.reason,
      });
      return Response.json({ error: "Payment details do not match the order" }, { status: 409 });
    }

    const queryResponse = await fetch(`${payTabs.apiBase}/payment/query`, {
      method: "POST",
      headers: { Authorization: payTabs.serverKey, "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: payTabs.profileId, tran_ref: tranRef }),
    });
    const verified = (await queryResponse.json().catch(() => ({}))) as VerifiedPayTabsPayload;
    if (!queryResponse.ok) throw new Error(`PayTabs query returned ${queryResponse.status}`);

    const verifiedCheck = validateVerifiedPayTabsTransaction(
      verified,
      callbackReference,
      expectedDeposit,
      payTabs.profileId,
      tranRef,
    );
    if (!verifiedCheck.ok) {
      console.error("Rejected mismatched PayTabs verification", {
        reference: callbackReference,
        reason: verifiedCheck.reason,
      });
      return Response.json({ error: "Verified payment details do not match the order" }, { status: 409 });
    }

    const verifiedStatus = clean(verified.payment_result?.response_status, 8).toUpperCase();
    const mapped = mapVerifiedPayTabsStatus(
      verified.payment_result?.response_status,
      verified.payment_result?.response_message,
      verified.payment_result?.response_code,
    );

    const currentPaymentStatus = normalizedPaymentStatus(order);
    if (isSettledPayment(currentPaymentStatus)) {
      return Response.json(
        {
          received: true,
          reference: callbackReference,
          paymentStatus: currentPaymentStatus,
          alreadyProcessed: true,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    await recordPaymentState(paymentWebhook, webhookToken, {
      type: "PAYMENT_UPDATE",
      reference: callbackReference,
      idempotencyKey: `paytabs:${tranRef}:${mapped.paymentStatus}`,
      expectedPriorPaymentStatuses: [
        "",
        "NOT_PAID",
        "PAYMENT_PENDING",
        "PENDING",
        "PROCESSING",
        "HOLD",
        "FAILED",
        "DECLINED",
        "CANCELLED",
        "EXPIRED",
      ],
      payment: {
        provider: "PayTabs",
        transactionRef: tranRef,
        profileId: payTabs.profileId,
        status: mapped.paymentStatus,
        safeFailureReason: mapped.safeFailureReason,
        responseStatus: verifiedStatus,
        responseCode: clean(verified.payment_result?.response_code, 40),
        amount: expectedDeposit,
        currency: "EGP",
        verifiedAt: new Date().toISOString(),
      },
    });

    return Response.json(
      {
        received: true,
        reference: callbackReference,
        paymentStatus: mapped.paymentStatus,
        conclusive: mapped.conclusive,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("PayTabs callback verification failed", error instanceof Error ? error.message : "unknown_error");
    return Response.json({ error: "Payment verification unavailable" }, { status: 503 });
  }
}
