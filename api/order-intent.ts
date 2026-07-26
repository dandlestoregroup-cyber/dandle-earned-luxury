type OrderIntentBody = {
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    governorate?: string;
    notes?: string;
  };
  items?: Array<{
    productId?: string;
    productName?: string;
    variantTitle?: string;
    color?: string;
    mechanism?: string;
    quantity?: number;
    price?: number;
    massageFeature?: boolean;
    handle?: string;
  }>;
  totalPrice?: number;
};

const clean = (value: unknown, max = 300) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function makeReference() {
  return `DN-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID()
    .slice(0, 4)
    .toUpperCase()}`;
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = (await request.json()) as OrderIntentBody;
    const customer = {
      name: clean(body.customer?.name, 120),
      phone: clean(body.customer?.phone, 40),
      email: clean(body.customer?.email, 160),
      address: clean(body.customer?.address, 500),
      city: clean(body.customer?.city, 100),
      governorate: clean(body.customer?.governorate, 100),
      notes: clean(body.customer?.notes, 800),
    };
    const items = (Array.isArray(body.items) ? body.items : []).slice(0, 20).map((item) => ({
      productId: clean(item.productId, 80),
      productName: clean(item.productName, 160),
      variantTitle: clean(item.variantTitle, 160),
      color: clean(item.color, 80),
      mechanism: clean(item.mechanism, 80),
      quantity: Math.max(1, Math.min(20, Number(item.quantity) || 1)),
      price: Math.max(0, Number(item.price) || 0),
      massageFeature: Boolean(item.massageFeature),
      handle: clean(item.handle, 100),
    }));

    if (!customer.name || !customer.phone || !customer.address || items.length === 0) {
      return Response.json({ error: "Missing required order details" }, { status: 400 });
    }

    const reference = makeReference();
    const intent = {
      reference,
      customer,
      items,
      totalPrice: Math.max(0, Number(body.totalPrice) || 0),
      currency: "EGP",
      source: "dandle-vercel",
      createdAt: new Date().toISOString(),
    };

    const webhookUrl = process.env.TAKEAPP_ORDER_WEBHOOK_URL;
    const webhookToken = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN;

    if (!webhookUrl || !webhookToken) {
      return Response.json(
        {
          reference,
          synced: false,
          status: "MANUAL_CONFIRMATION_REQUIRED",
          charged: false,
        },
        { status: 202, headers: { "Cache-Control": "no-store" } },
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${webhookToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(intent),
    });

    if (!response.ok) {
      throw new Error(`TakeApp bridge returned ${response.status}`);
    }

    return Response.json(
      { reference, synced: true, status: "PENDING", charged: false },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Order intent failed", error);
    return Response.json(
      { error: "Order sync unavailable", charged: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
