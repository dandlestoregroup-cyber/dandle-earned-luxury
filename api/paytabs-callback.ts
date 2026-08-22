import {
  clean,
  expectedDepositAmount,
  mapVerifiedPayTabsStatus,
  referencePattern,
  unwrapOrder,
  validateVerifiedPayTabsTransaction,
  type VerifiedPayTabsPayload,
} from "./_lib/payment";

async function readCallback(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }
  const payload = await request.json();
  return payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const profileId = process.env.PAYTABS_PROFILE_ID?.trim();
  const serverKey = process.env.PAYTABS_SERVER_KEY?.trim();
  const paymentWebhook = process.env.TAKEAPP_PAYMENT_WEBHOOK_URL?.trim();
  const statusUrl = process.env.TAKEAPP_ORDER_STATUS_URL?.trim();
  const webhookToken = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim();
  if (!profileId || !serverKey || !paymentWebhook || !statusUrl || !webhookToken) {
    return Response.json({ error: "Payment callback is not configured" }, { status: 503 });
  }

  let callback: Record<string, unknown>;
  try {
    callback = await readCallback(request);
  } catch {
    return Response.json({ error: "Invalid callback payload" }, { status: 400 });
  }

  const tranRef = clean(callback.tran_ref, 120);
  const callbackReference = clean(callback.cart_id, 64).toUpperCase();
  if (!tranRef || !referencePattern.test(callbackReference)) {
    return Response.json({ error: "Invalid payment reference" }, { status: 400 });
  }

  try {
    const queryResponse = await fetch("https://secure-egypt.paytabs.com/payment/query", {
      method: "POST",
      headers: { authorization: serverKey, "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: Number(profileId), tran_ref: tranRef }),
    });
    const verified = (await queryResponse.json().catch(() => ({}))) as VerifiedPayTabsPayload;
    if (!queryResponse.ok) throw new Error(`PayTabs query returned ${queryResponse.status}`);

    // The public callback body is attacker-controlled. It may identify the
    // transaction to query, but it never decides whether money was paid.
    const verifiedStatus = clean(verified.payment_result?.response_status, 8).toUpperCase();
    if (!verifiedStatus) {
      console.error("PayTabs verification returned no status", { callbackReference, tranRef });
      return Response.json({ error: "Could not verify transaction with PayTabs" }, { status: 502 });
    }

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

    const transactionCheck = validateVerifiedPayTabsTransaction(
      verified,
      callbackReference,
      expectedDeposit,
    );
    if (!transactionCheck.ok) {
      console.error("Rejected mismatched PayTabs transaction", {
        callbackReference,
        tranRef,
        reason: transactionCheck.reason,
      });
      return Response.json({ error: "Verified payment details do not match the order" }, { status: 409 });
    }

    const mapped = mapVerifiedPayTabsStatus(
      verified.payment_result?.response_status,
      verified.payment_result?.response_message,
      verified.payment_result?.response_code,
    );

    const paymentUpdate = {
      type: "PAYMENT_UPDATE",
      reference: callbackReference,
      payment: {
        provider: "PayTabs",
        transactionRef: tranRef,
        status: mapped.paymentStatus,
        safeFailureReason: mapped.safeFailureReason,
        responseStatus: verifiedStatus,
        responseCode: clean(verified.payment_result?.response_code, 40),
        responseMessage: clean(verified.payment_result?.response_message, 240),
        amount: expectedDeposit,
        currency: "EGP",
        verifiedAt: new Date().toISOString(),
      },
    };

    const recordResponse = await fetch(paymentWebhook, {
      method: "POST",
      headers: { Authorization: `Bearer ${webhookToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(paymentUpdate),
    });
    if (!recordResponse.ok) throw new Error(`Payment recording webhook returned ${recordResponse.status}`);

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
    console.error("PayTabs callback verification failed", error);
    return Response.json({ error: "Payment verification unavailable" }, { status: 503 });
  }
}
