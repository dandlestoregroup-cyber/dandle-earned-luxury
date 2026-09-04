import { randomUUID } from "node:crypto";
import { priceAuthoritativeCart, type CheckoutLineInput } from "../../_lib/catalog";
import { createOrderAccess } from "../../_lib/order-access";
import {
  buildPayTabsPaymentRequest,
  readPayTabsConfig,
  validatePayTabsCreateResponse,
  type PayTabsTransaction,
} from "../../_lib/paytabs";
import { createOrder, updateOrder } from "../../_lib/supabase-orders";

type CheckoutBody = {
  customer?: Record<string, unknown>;
  items?: CheckoutLineInput[];
};

const clean = (value: unknown, max = 300) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function readCustomer(input: Record<string, unknown> | undefined) {
  const customer = {
    name: clean(input?.name, 120),
    phone: clean(input?.phone, 40),
    email: clean(input?.email, 160),
    address: clean(input?.address, 500),
    city: clean(input?.city, 100),
    governorate: clean(input?.governorate, 100),
    notes: clean(input?.notes, 800),
  };
  if (!customer.name || !customer.phone || !customer.address || !customer.city || !customer.governorate) {
    throw new Error("Missing required checkout details");
  }
  return customer;
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const payTabs = readPayTabsConfig();
  if (!payTabs) {
    return Response.json({ error: "Secure card payment is not configured" }, { status: 503 });
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return Response.json({ error: "Invalid checkout request" }, { status: 400 });
  }

  let customer;
  let priced;
  try {
    customer = readCustomer(body.customer);
    priced = priceAuthoritativeCart(Array.isArray(body.items) ? body.items : []);
  } catch (error) {
    console.warn("Rejected Dandle checkout", { reason: error instanceof Error ? error.message : "invalid_cart" });
    return Response.json({ error: "The cart contains an invalid or unavailable configuration" }, { status: 400 });
  }

  const orderId = randomUUID();
  const access = createOrderAccess(orderId);

  try {
    await createOrder({
      id: orderId,
      user_id: null,
      status: "pending_payment",
      currency: "EGP",
      customer,
      order_lines: priced.lines,
      subtotal_egp: priced.subtotal,
      shipping_egp: priced.shipping,
      discount_egp: priced.discount,
      total_egp: priced.total,
      paytabs_cart_id: orderId,
      paytabs_tran_ref: null,
      paytabs_redirect_url: null,
      payment_status: "checkout_created",
      payment_metadata: { provider: "PayTabs" },
      access_token_hash: access.hash,
    });
  } catch (error) {
    console.error("Dandle order creation failed", { orderId, reason: error instanceof Error ? error.message : "store_error" });
    return Response.json({ error: "Order could not be created" }, { status: 503 });
  }

  const paymentRequest = buildPayTabsPaymentRequest(payTabs, { id: orderId, total: priced.total });

  try {
    const response = await fetch(`${payTabs.apiBase}/payment/request`, {
      method: "POST",
      headers: {
        Authorization: payTabs.serverKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => ({}))) as PayTabsTransaction;
    const validation = response.ok
      ? validatePayTabsCreateResponse(
          data,
          { orderId, amount: priced.total, currency: "EGP", profileId: payTabs.profileId },
          payTabs.apiBase,
        )
      : ({ ok: false, reason: `http_${response.status}` } as const);

    if (!validation.ok) {
      await updateOrder(
        orderId,
        {
          status: "payment_failed",
          payment_status: "checkout_failed",
          payment_metadata: { provider: "PayTabs", reason: validation.reason },
        },
        "pending_payment",
      ).catch(() => null);
      console.error("PayTabs checkout rejected", { orderId, reason: validation.reason });
      return Response.json({ error: "Secure card payment could not be started" }, { status: 502 });
    }

    const updated = await updateOrder(
      orderId,
      {
        paytabs_tran_ref: validation.tranRef,
        paytabs_redirect_url: validation.redirectUrl,
        payment_status: "payment_pending",
        payment_metadata: { provider: "PayTabs", checkout_verified_at: new Date().toISOString() },
      },
      "pending_payment",
    );
    if (!updated) throw new Error("Order payment attempt was not persisted");

    return Response.json(
      {
        order: orderId,
        status: "pending_payment",
        redirectUrl: validation.redirectUrl,
        currency: "EGP",
        total: priced.total,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
          "Set-Cookie": access.cookie,
        },
      },
    );
  } catch (error) {
    await updateOrder(
      orderId,
      {
        status: "payment_failed",
        payment_status: "checkout_failed",
        payment_metadata: { provider: "PayTabs", reason: "gateway_unavailable" },
      },
      "pending_payment",
    ).catch(() => null);
    console.error("PayTabs checkout unavailable", { orderId, reason: error instanceof Error ? error.message : "gateway_error" });
    return Response.json({ error: "Secure card payment is temporarily unavailable" }, { status: 503 });
  }
}
