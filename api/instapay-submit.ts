import {
  clean,
  customerSubmittedInstapayState,
  expectedDepositAmount,
  normalizedPaymentStatus,
  referencePattern,
  unwrapOrder,
} from "./_lib/payment";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const statusUrl = process.env.TAKEAPP_ORDER_STATUS_URL?.trim();
  const token = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim();
  const paymentWebhook = process.env.TAKEAPP_PAYMENT_WEBHOOK_URL?.trim();
  if (!statusUrl || !token || !paymentWebhook) {
    return Response.json({ error: "Payment verification service is not connected" }, { status: 503 });
  }

  let reference = "";
  let transactionReference = "";
  try {
    const body = await request.json();
    reference = clean(body?.reference, 64).toUpperCase();
    transactionReference = clean(body?.transactionReference, 120);
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
    const paymentStatus = normalizedPaymentStatus(order);

    if (paymentStatus === "INSTAPAY_VERIFICATION_REQUIRED") {
      return Response.json(
        { received: true, reference, paymentStatus, paid: false },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    if (paymentStatus !== "INSTAPAY_PENDING") {
      return Response.json(
        {
          error: "No active InstaPay transfer is awaiting customer evidence",
          paymentStatus,
          paid: false,
        },
        { status: 409 },
      );
    }

    const amount = expectedDepositAmount(order);
    if (amount === null) {
      return Response.json({ error: "Verified order total is unavailable", paid: false }, { status: 422 });
    }

    // Customer evidence is never proof of payment. It only moves the order to
    // a manual verification queue in the trusted commercial back office.
    const nextStatus = customerSubmittedInstapayState();
    const update = {
      type: "PAYMENT_UPDATE",
      reference,
      payment: {
        provider: "InstaPay",
        transactionRef: transactionReference || null,
        status: nextStatus,
        safeFailureReason: null,
        amount,
        currency: "EGP",
        customerEvidenceSubmittedAt: new Date().toISOString(),
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
        received: true,
        reference,
        paymentStatus: nextStatus,
        paid: false,
        message: "Transfer evidence received. Dandle must verify receipt before payment is marked paid.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("InstaPay evidence submission failed", error);
    return Response.json(
      { error: "Transfer evidence could not be submitted", paid: false },
      { status: 503 },
    );
  }
}
