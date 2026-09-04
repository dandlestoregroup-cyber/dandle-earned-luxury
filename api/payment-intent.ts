import {
  PAYABLE_ORDER_STATUSES,
  clean,
  expectedDepositAmount,
  getInstapayConfig,
  getPayTabsConfig,
  getPublicAppOrigin,
  isSettledPayment,
  isUncertainPayment,
  normalizedOrderStatus,
  normalizedPaymentStatus,
  referencePattern,
  unwrapOrder,
  validatePayTabsCheckoutResponse,
  type PayTabsCheckoutPayload,
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
  const statusUrl = process.env.TAKEAPP_ORDER_STATUS_URL?.trim();
  const statusToken = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim();
  const paymentWebhook = process.env.TAKEAPP_PAYMENT_WEBHOOK_URL?.trim();
  const instapayReady = Boolean(getInstapayConfig());

  if (!statusUrl || !statusToken || !paymentWebhook) {
    return Response.json(
      { error: "Payment service is not connected", paymentAvailable: false, fallbackAvailable: false },
      { status: 503 },
    );
  }

  let reference = "";
  try {
    const body = await request.json();
    reference = clean(body?.reference, 64).toUpperCase();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!referencePattern.test(reference)) {
    return Response.json({ error: "Invalid order reference" }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${statusUrl}${statusUrl.includes("?") ? "&" : "?"}reference=${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${statusToken}` },
        cache: "no-store",
      },
    );
    if (!upstream.ok) throw new Error(`TakeApp status bridge returned ${upstream.status}`);
    const order = unwrapOrder(await upstream.json());
    const status = normalizedOrderStatus(order);
    const paymentStatus = normalizedPaymentStatus(order);

    if (!PAYABLE_ORDER_STATUSES.has(status)) {
      return Response.json(
        { error: "Order is not ready for payment", status, paymentAvailable: false, fallbackAvailable: false },
        { status: 409 },
      );
    }

    if (isSettledPayment(paymentStatus)) {
      return Response.json(
        { error: "Deposit is already paid", status, paymentStatus, fallbackAvailable: false },
        { status: 409 },
      );
    }

    if (isUncertainPayment(paymentStatus)) {
      return Response.json(
        {
          error: "A payment is still awaiting verification. Do not pay again yet.",
          status,
          paymentStatus,
          paymentPending: true,
          fallbackAvailable: false,
        },
        { status: 409 },
      );
    }

    const depositAmount = expectedDepositAmount(order);
    if (depositAmount === null) {
      return Response.json({ error: "Verified order total is unavailable" }, { status: 422 });
    }

    if (!payTabs) {
      return Response.json(
        {
          error: "Card payment is temporarily unavailable",
          paymentAvailable: false,
          fallbackAvailable: instapayReady,
          reference,
          depositAmount,
          currency: "EGP",
        },
        { status: 503 },
      );
    }

    const customer = (order as Record<string, unknown>).customer;
    const customerRecord = customer && typeof customer === "object" ? (customer as Record<string, unknown>) : {};
    const origin = getPublicAppOrigin(request.url);
    const paymentRequest: Record<string, unknown> = {
      profile_id: payTabs.profileId,
      tran_type: "sale",
      tran_class: "ecom",
      cart_id: reference,
      cart_currency: "EGP",
      cart_amount: depositAmount,
      cart_description: `Dandle 40% deposit for ${reference}`,
      callback: `${origin}/api/public/paytabs/webhook`,
      return: `${origin}/order/${encodeURIComponent(reference)}?payment=return`,
    };

    const email = clean(customerRecord.email, 160);
    if (email) {
      paymentRequest.customer_details = {
        name: clean(customerRecord.name, 120),
        email,
        phone: clean(customerRecord.phone, 40),
        street1: clean(customerRecord.address, 500),
        city: clean(customerRecord.city, 100),
        state: clean(customerRecord.governorate ?? customerRecord.province, 100),
        country: "EG",
      };
    }

    const response = await fetch(`${payTabs.apiBase}/payment/request`, {
      method: "POST",
      headers: {
        Authorization: payTabs.serverKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    });
    const data = (await response.json().catch(() => ({}))) as PayTabsCheckoutPayload;
    const validation = validatePayTabsCheckoutResponse({
      httpOk: response.ok,
      payload: data,
      expectedReference: reference,
      expectedAmount: depositAmount,
      expectedProfileId: payTabs.profileId,
    });

    if (!validation.ok) {
      console.error("PayTabs payment page creation rejected", {
        status: response.status,
        reason: validation.reason,
      });
      await recordPaymentState(paymentWebhook, statusToken, {
        type: "PAYMENT_UPDATE",
        reference,
        payment: {
          provider: "PayTabs",
          status: "NOT_PAID",
          safeFailureReason: "gateway_error",
          amount: depositAmount,
          currency: "EGP",
          verifiedAt: new Date().toISOString(),
        },
      });
      return Response.json(
        {
          error: "Card payment could not be started",
          paymentAvailable: false,
          fallbackAvailable: instapayReady,
          reference,
          depositAmount,
          currency: "EGP",
        },
        { status: 503 },
      );
    }

    await recordPaymentState(paymentWebhook, statusToken, {
      type: "PAYMENT_UPDATE",
      reference,
      idempotencyKey: `paytabs:${validation.tranRef}:pending`,
      payment: {
        provider: "PayTabs",
        transactionRef: validation.tranRef,
        checkoutUrl: validation.redirectUrl,
        profileId: payTabs.profileId,
        status: "PAYMENT_PENDING",
        safeFailureReason: null,
        amount: depositAmount,
        currency: "EGP",
        verifiedAt: new Date().toISOString(),
      },
    });

    return Response.json(
      {
        paymentAvailable: true,
        paymentUrl: validation.redirectUrl,
        transactionRef: validation.tranRef,
        reference,
        depositAmount,
        currency: "EGP",
        charged: false,
        fallbackAvailable: false,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Payment intent failed", error instanceof Error ? error.message : "unknown_error");
    return Response.json(
      {
        error: "Payment service is temporarily unavailable",
        paymentAvailable: false,
        fallbackAvailable: instapayReady,
      },
      { status: 503 },
    );
  }
}
