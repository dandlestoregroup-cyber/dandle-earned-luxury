import {
  canStartInstapayFallback,
  expectedDepositAmount,
  getInstapayConfig,
  isSettledPayment,
  isUncertainPayment,
  normalizedOrderStatus,
  normalizedPaymentStatus,
  referencePattern,
  clean,
  unwrapOrder,
} from "./_lib/payment";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const statusUrl = process.env.TAKEAPP_ORDER_STATUS_URL?.trim();
  const token = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim();
  const paymentWebhook = process.env.TAKEAPP_PAYMENT_WEBHOOK_URL?.trim();
  const instapay = getInstapayConfig();

  if (!statusUrl || !token || !paymentWebhook || !instapay) {
    return Response.json(
      {
        error: "InstaPay fallback is not configured",
        fallbackAvailable: false,
        configurationRequired: !instapay,
      },
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
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!upstream.ok) throw new Error(`TakeApp status bridge returned ${upstream.status}`);
    const order = unwrapOrder(await upstream.json());
    const orderStatus = normalizedOrderStatus(order);
    const paymentStatus = normalizedPaymentStatus(order);

    if (isSettledPayment(paymentStatus)) {
      return Response.json(
        { error: "This order already has a verified payment", fallbackAvailable: false, paymentStatus },
        { status: 409 },
      );
    }

    if (isUncertainPayment(paymentStatus)) {
      return Response.json(
        {
          error: "Payment confirmation is still pending. Do not pay again yet.",
          fallbackAvailable: false,
          paymentPending: true,
          paymentStatus,
        },
        { status: 409 },
      );
    }

    if (!canStartInstapayFallback(order)) {
      return Response.json(
        {
          error: "This order is not eligible for InstaPay fallback",
          fallbackAvailable: false,
          orderStatus,
          paymentStatus,
        },
        { status: 409 },
      );
    }

    const depositAmount = expectedDepositAmount(order);
    if (depositAmount === null) {
      return Response.json({ error: "Verified order total is unavailable" }, { status: 422 });
    }

    const update = {
      type: "PAYMENT_UPDATE",
      reference,
      payment: {
        provider: "InstaPay",
        status: "INSTAPAY_PENDING",
        safeFailureReason: null,
        amount: depositAmount,
        currency: "EGP",
        verifiedAt: new Date().toISOString(),
      },
    };

    const recordResponse = await fetch(paymentWebhook, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    if (!recordResponse.ok) throw new Error(`Payment recording webhook returned ${recordResponse.status}`);

    return Response.json(
      {
        fallbackAvailable: true,
        provider: "InstaPay",
        reference,
        amount: depositAmount,
        currency: "EGP",
        recipient: {
          name: instapay.recipientName,
          id: instapay.recipientId,
        },
        paymentStatus: "INSTAPAY_PENDING",
        instructions: {
          en: `Transfer exactly EGP ${depositAmount.toLocaleString("en-US")} to the verified Dandle InstaPay recipient and keep reference ${reference} with your transfer record. The order is not paid until Dandle verifies receipt.`,
          ar: `حوّل بالضبط ${depositAmount.toLocaleString("en-US")} جنيه إلى مستلم InstaPay المعتمد لدى داندل، واحتفظ بمرجع الطلب ${reference} مع بيانات التحويل. لا يُعتبر الطلب مدفوعًا إلا بعد تحقق داندل من استلام المبلغ.`,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("InstaPay fallback intent failed", error);
    return Response.json(
      { error: "InstaPay fallback is temporarily unavailable", fallbackAvailable: false },
      { status: 503 },
    );
  }
}
