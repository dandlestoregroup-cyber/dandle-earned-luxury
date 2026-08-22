import {
  PAYABLE_ORDER_STATUSES,
  clean,
  expectedDepositAmount,
  getInstapayConfig,
  isSettledPayment,
  isUncertainPayment,
  normalizedOrderStatus,
  normalizedPaymentStatus,
  referencePattern,
  unwrapOrder,
} from "./_lib/payment";

function getOrigin(request: Request) {
  const configured = process.env.PUBLIC_SITE_URL?.trim();
  return (configured || new URL(request.url).origin).replace(/\/$/, "");
}

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

  const profileId = process.env.PAYTABS_PROFILE_ID?.trim();
  const serverKey = process.env.PAYTABS_SERVER_KEY?.trim();
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

    if (!profileId || !serverKey) {
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
    const origin = getOrigin(request);
    const paymentRequest: Record<string, unknown> = {
      profile_id: Number(profileId),
      tran_type: "sale",
      tran_class: "ecom",
      cart_id: reference,
      cart_currency: "EGP",
      cart_amount: depositAmount,
      cart_description: `Dandle 40% deposit for ${reference}`,
      callback: `${origin}/api/paytabs-callback`,
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

    const response = await fetch("https://secure-egypt.paytabs.com/payment/request", {
      method: "POST",
      headers: {
        authorization: serverKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    });
    const data = await response.json().catch(() => ({}));
    const paymentUrl = typeof data?.redirect_url === "string" ? data.redirect_url : "";
    const transactionRef = typeof data?.tran_ref === "string" ? data.tran_ref : "";

    if (!response.ok || !paymentUrl || !transactionRef) {
      console.error("PayTabs payment page creation failed", { status: response.status, trace: data?.trace });
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

    // Record an active PayTabs attempt before exposing the redirect URL. This
    // blocks a parallel InstaPay fallback until PayTabs is conclusively unpaid.
    await recordPaymentState(paymentWebhook, statusToken, {
      type: "PAYMENT_UPDATE",
      reference,
      payment: {
        provider: "PayTabs",
        transactionRef,
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
        paymentUrl,
        transactionRef,
        reference,
        depositAmount,
        currency: "EGP",
        charged: false,
        fallbackAvailable: false,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Payment intent failed", error);
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
