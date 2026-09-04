import { getVerifiedUnitPrice } from "./_lib/catalog.js";

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
    massageFeature?: boolean;
    handle?: string;
  }>;
};

const clean = (value: unknown, max = 300) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function makeReference() {
  return `DN-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

const roundMoney = (value: number) => Math.round(value * 100) / 100;

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

    if (!customer.name || !customer.phone || !customer.address || !customer.city || !customer.governorate) {
      return Response.json({ error: "Missing required order details", charged: false }, { status: 400 });
    }

    const rawItems = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
    if (rawItems.length === 0) {
      return Response.json({ error: "Cart is empty", charged: false }, { status: 400 });
    }

    let items;
    try {
      items = rawItems.map((item) => {
        const productId = clean(item.productId, 80).toLowerCase();
        const mechanism = clean(item.mechanism, 20).toLowerCase();
        const quantity = Math.max(1, Math.min(20, Math.trunc(Number(item.quantity) || 1)));
        const massageFeature = Boolean(item.massageFeature);
        return {
          productId,
          productName: clean(item.productName, 160),
          variantTitle: clean(item.variantTitle, 160),
          color: clean(item.color, 80),
          mechanism,
          quantity,
          price: getVerifiedUnitPrice(productId, mechanism, massageFeature),
          massageFeature,
          handle: clean(item.handle, 100),
        };
      });
    } catch (error) {
      console.error("Rejected invalid cart", error);
      return Response.json(
        { error: "Cart contains an unsupported product configuration", charged: false },
        { status: 400 },
      );
    }

    const totalPrice = roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const reference = makeReference();
    const intent = {
      reference,
      customer,
      items,
      totalPrice,
      depositAmount: roundMoney(totalPrice * 0.4),
      balanceOnDelivery: roundMoney(totalPrice * 0.6),
      currency: "EGP",
      source: "dandle-vercel",
      status: "SUBMITTED",
      paymentProvider: "PayTabs",
      createdAt: new Date().toISOString(),
    };

    const webhookUrl = process.env.TAKEAPP_ORDER_WEBHOOK_URL?.trim();
    const webhookToken = process.env.TAKEAPP_ORDER_WEBHOOK_TOKEN?.trim();
    if (!webhookUrl || !webhookToken) {
      return Response.json(
        { error: "Order service is not connected", synced: false, charged: false },
        { status: 503, headers: { "Cache-Control": "no-store" } },
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
    if (!response.ok) throw new Error(`TakeApp bridge returned ${response.status}`);

    return Response.json(
      {
        reference,
        synced: true,
        status: "SUBMITTED",
        charged: false,
        totalPrice,
        depositAmount: roundMoney(totalPrice * 0.4),
        balanceOnDelivery: roundMoney(totalPrice * 0.6),
        currency: "EGP",
        next: "ADMIN_REVIEW",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Order intent failed", error);
    return Response.json(
      { error: "Order service is temporarily unavailable", synced: false, charged: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
