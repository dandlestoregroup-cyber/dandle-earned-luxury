import {
  mapPayTabsSettlementStatus,
  queryPayTabsTransaction,
  readPayTabsConfig,
  safePayTabsMetadata,
  validateVerifiedPayTabsTransaction,
  verifyPayTabsSignature,
  type PayTabsTransaction,
} from "../../_lib/paytabs";
import { getOrderById, settleOrderPaid, updateOrder } from "../../_lib/supabase-orders";

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const payTabs = readPayTabsConfig();
  if (!payTabs) return Response.json({ error: "Payment callback is not configured" }, { status: 503 });

  const rawBody = await request.text();
  if (!verifyPayTabsSignature(rawBody, request.headers.get("signature"), payTabs.serverKey)) {
    console.warn("Rejected invalid PayTabs signature");
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let callback: PayTabsTransaction;
  try {
    callback = JSON.parse(rawBody) as PayTabsTransaction;
  } catch {
    return Response.json({ error: "Invalid callback payload" }, { status: 400 });
  }

  const orderId = clean(callback.cart_id, 80);
  const tranRef = clean(callback.tran_ref, 160);
  if (!orderId || !tranRef) {
    return Response.json({ error: "Invalid payment reference" }, { status: 400 });
  }

  try {
    const order = await getOrderById(orderId);
    if (!order || order.paytabs_cart_id !== orderId) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const verified = await queryPayTabsTransaction(payTabs, tranRef);
    const validation = validateVerifiedPayTabsTransaction(verified, {
      orderId,
      amount: Number(order.total_egp),
      currency: "EGP",
      profileId: payTabs.profileId,
      tranRef: order.paytabs_tran_ref,
    });
    if (!validation.ok) {
      console.error("Rejected mismatched PayTabs settlement", { orderId, reason: validation.reason });
      return Response.json({ error: "Verified payment does not match order" }, { status: 409 });
    }

    const settlementStatus = mapPayTabsSettlementStatus(validation.responseStatus);
    const metadata = { provider: "PayTabs", ...safePayTabsMetadata(verified) };

    if (settlementStatus === "paid") {
      const result = await settleOrderPaid(orderId, validation.tranRef, metadata);
      return Response.json(
        {
          received: true,
          order: orderId,
          status: "paid",
          duplicate: Boolean(result.duplicate),
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    if (settlementStatus === "payment_failed") {
      await updateOrder(
        orderId,
        {
          status: "payment_failed",
          payment_status: "payment_failed",
          payment_metadata: metadata,
          last_reconciled_at: new Date().toISOString(),
        },
        "pending_payment",
      );
    } else {
      await updateOrder(
        orderId,
        {
          payment_status: "payment_pending",
          payment_metadata: metadata,
          last_reconciled_at: new Date().toISOString(),
        },
        "pending_payment",
      );
    }

    return Response.json(
      { received: true, order: orderId, status: settlementStatus },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("PayTabs callback verification failed", {
      orderId,
      reason: error instanceof Error ? error.message : "verification_error",
    });
    return Response.json({ error: "Payment verification unavailable" }, { status: 503 });
  }
}
