import { verifyOrderAccess } from "../../_lib/order-access.js";
import { getOrderById } from "../../_lib/supabase-orders.js";

export default async function handler(request: Request) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const orderId = new URL(request.url).searchParams.get("order")?.trim() || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    const order = await getOrderById(orderId);
    if (!order || !verifyOrderAccess(request.headers.get("cookie"), orderId, order.access_token_hash)) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const lines = Array.isArray(order.order_lines)
      ? order.order_lines.map((line) => ({
          sku: line.sku,
          model: line.model,
          color: line.color,
          imageUrl: line.imageUrl,
          mechanism: line.mechanism,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          lineTotal: line.lineTotal,
        }))
      : [];

    return Response.json(
      {
        order: order.id,
        status: order.status,
        paymentStatus: order.payment_status,
        currency: order.currency,
        subtotal: Number(order.subtotal_egp),
        shipping: Number(order.shipping_egp),
        discount: Number(order.discount_egp),
        total: Number(order.total_egp),
        lines,
        paidAt: order.paid_at,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Dandle payment status unavailable", {
      orderId,
      reason: error instanceof Error ? error.message : "status_error",
    });
    return Response.json({ error: "Payment status is temporarily unavailable" }, { status: 503 });
  }
}
