import { timingSafeEqual } from "node:crypto";
import {
  mapPayTabsSettlementStatus,
  queryPayTabsTransaction,
  readPayTabsConfig,
  safePayTabsMetadata,
  validateVerifiedPayTabsTransaction,
} from "../_lib/paytabs.js";
import { listPendingPayTabsOrders, settleOrderPaid, updateOrder } from "../_lib/supabase-orders.js";

function authorized(request: Request) {
  const expected = process.env.CRON_SECRET?.trim() || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() || "";
  if (!expected || !supplied) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(supplied);
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async function handler(request: Request) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const payTabs = readPayTabsConfig();
  if (!payTabs) return Response.json({ error: "PayTabs is not configured" }, { status: 503 });

  const orders = await listPendingPayTabsOrders(50);
  const result = { checked: 0, settled: 0, failed: 0, pending: 0, rejected: 0, errors: 0 };

  for (const order of orders) {
    result.checked += 1;
    try {
      if (!order.paytabs_tran_ref) {
        result.pending += 1;
        continue;
      }

      const verified = await queryPayTabsTransaction(payTabs, order.paytabs_tran_ref);
      const validation = validateVerifiedPayTabsTransaction(verified, {
        orderId: order.id,
        amount: Number(order.total_egp),
        currency: "EGP",
        profileId: payTabs.profileId,
        tranRef: order.paytabs_tran_ref,
      });
      if (!validation.ok) {
        result.rejected += 1;
        console.error("Reconciliation rejected mismatched PayTabs transaction", { orderId: order.id, reason: validation.reason });
        continue;
      }

      const status = mapPayTabsSettlementStatus(validation.responseStatus);
      const metadata = { provider: "PayTabs", source: "reconciliation", ...safePayTabsMetadata(verified) };
      if (status === "paid") {
        const settled = await settleOrderPaid(order.id, validation.tranRef, metadata);
        if (settled.settled) result.settled += 1;
        else result.pending += 1;
      } else if (status === "payment_failed") {
        const updated = await updateOrder(
          order.id,
          {
            status: "payment_failed",
            payment_status: "payment_failed",
            payment_metadata: metadata,
            last_reconciled_at: new Date().toISOString(),
          },
          "pending_payment",
        );
        if (updated) result.failed += 1;
        else result.pending += 1;
      } else {
        await updateOrder(
          order.id,
          {
            payment_status: "payment_pending",
            payment_metadata: metadata,
            last_reconciled_at: new Date().toISOString(),
          },
          "pending_payment",
        );
        result.pending += 1;
      }
    } catch (error) {
      result.errors += 1;
      console.error("PayTabs reconciliation item failed", {
        orderId: order.id,
        reason: error instanceof Error ? error.message : "reconciliation_error",
      });
    }
  }

  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
