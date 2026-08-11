type PayTabsPayload = {
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

const referencePattern = /^DN-[A-Z0-9-]{4,48}$/;
const roundMoney = (value: number) => Math.round(value * 100) / 100;

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

  let callback: PayTabsPayload;
  try {
    callback = (await request.json()) as PayTabsPayload;
  } catch {
    return Response.json({ error: "Invalid callback payload" }, { status: 400 });
  }

  const tranRef = typeof callback.tran_ref === "string" ? callback.tran_ref.trim() : "";
  const callbackReference = typeof callback.cart_id === "string" ? callback.cart_id.trim() : "";
  if (!tranRef || !referencePattern.test(callbackReference)) {
    return Response.json({ error: "Invalid payment reference" }, { status: 400 });
  }

  try {
    const queryResponse = await fetch("https://secure-egypt.paytabs.com/payment/query", {
      method: "POST",
      headers: { authorization: serverKey, "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: Number(profileId), tran_ref: tranRef }),
    });
    const verified = (await queryResponse.json()) as PayTabsPayload;
    if (!queryResponse.ok) throw new Error(`PayTabs query returned ${queryResponse.status}`);

    const reference = typeof verified.cart_id === "string" ? verified.cart_id.trim() : "";
    const currency = typeof verified.cart_currency === "string" ? verified.cart_currency.trim() : "";
    const amount = Number(verified.cart_amount);
    const status = verified.payment_result?.response_status || "";
    if (reference !== callbackReference || currency !== "EGP" || !Number.isFinite(amount) || amount <= 0) {
      return Response.json({ error: "Verified payment details do not match the order" }, { status: 400 });
    }

    const orderResponse = await fetch(
      `${statusUrl}${statusUrl.includes("?") ? "&" : "?"}reference=${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${webhookToken}` }, cache: "no-store" },
    );
    if (!orderResponse.ok) throw new Error(`TakeApp status bridge returned ${orderResponse.status}`);
    const orderPayload = await orderResponse.json();
    const order = orderPayload?.order && typeof orderPayload.order === "object" ? orderPayload.order : orderPayload;
    const totalPrice = Number(order?.totalPrice ?? order?.total_price ?? order?.total);
    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      return Response.json({ error: "Verified order total is unavailable" }, { status: 422 });
    }
    const expectedDeposit = roundMoney(totalPrice * 0.4);
    if (Math.abs(roundMoney(amount) - expectedDeposit) > 0.01) {
      return Response.json({ error: "Verified payment amount does not match the order deposit" }, { status: 400 });
    }

    const paymentUpdate = {
      type: "PAYMENT_UPDATE",
      reference,
      payment: {
        provider: "PayTabs",
        transactionRef: tranRef,
        status: status === "A" ? "DEPOSIT_PAID" : status === "P" ? "PAYMENT_PENDING" : "NOT_PAID",
        responseStatus: status,
        responseCode: verified.payment_result?.response_code || "",
        responseMessage: verified.payment_result?.response_message || "",
        amount: expectedDeposit,
        currency,
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
      { received: true, reference, paymentStatus: paymentUpdate.payment.status },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("PayTabs callback verification failed", error);
    return Response.json({ error: "Payment verification unavailable" }, { status: 503 });
  }
}
