const payableStatuses = new Set(["ACCEPTED", "AMENDED", "INVOICE_READY", "AWAITING_PAYMENT"]);
const referencePattern = /^DN-[A-Z0-9-]{4,48}$/;
const roundMoney = (value: number) => Math.round(value * 100) / 100;

const clean = (value: unknown, max = 300) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function getOrigin(request: Request) {
  const configured = process.env.PUBLIC_SITE_URL?.trim();
  return (configured || new URL(request.url).origin).replace(/\/$/, "");
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
  if (!profileId || !serverKey || !statusUrl || !statusToken || !paymentWebhook) {
    return Response.json({ error: "Online payment is not ready", paymentAvailable: false }, { status: 503 });
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
    const payload = await upstream.json();
    const order = payload?.order && typeof payload.order === "object" ? payload.order : payload;
    const status = clean(order?.status, 40).toUpperCase();
    if (!payableStatuses.has(status)) {
      return Response.json(
        { error: "Order is not ready for payment", status, paymentAvailable: false },
        { status: 409 },
      );
    }

    const paymentStatus = clean(order?.paymentStatus ?? order?.payment_status, 40).toUpperCase();
    if (["PAID", "DEPOSIT_PAID", "CAPTURED"].includes(paymentStatus)) {
      return Response.json({ error: "Deposit is already paid", status, paymentStatus }, { status: 409 });
    }

    const totalPrice = Number(order?.totalPrice ?? order?.total_price ?? order?.total);
    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      return Response.json({ error: "Verified order total is unavailable" }, { status: 422 });
    }
    const depositAmount = roundMoney(totalPrice * 0.4);
    const customer = order?.customer && typeof order.customer === "object" ? order.customer : {};
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

    const email = clean(customer?.email, 160);
    if (email) {
      paymentRequest.customer_details = {
        name: clean(customer?.name, 120),
        email,
        phone: clean(customer?.phone, 40),
        street1: clean(customer?.address, 500),
        city: clean(customer?.city, 100),
        state: clean(customer?.governorate ?? customer?.province, 100),
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
      return Response.json({ error: "Payment page could not be created", paymentAvailable: false }, { status: 503 });
    }

    return Response.json(
      {
        paymentAvailable: true,
        paymentUrl,
        transactionRef,
        reference,
        depositAmount,
        currency: "EGP",
        charged: false,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Payment intent failed", error);
    return Response.json({ error: "Payment service is temporarily unavailable", paymentAvailable: false }, { status: 503 });
  }
}
