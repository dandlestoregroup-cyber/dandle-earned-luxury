// Lovable production sync trigger: deploy hardened commerce contract.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { mapPaytabsStatus, verifyPaidAcceptance } from "../_shared/paymentPolicy.ts";
import { verifyPaytabsTransactionIdentity } from "../_shared/paytabsIdentity.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const PAYTABS_SERVER_KEY = Deno.env.get("PAYTABS_SERVER_KEY");
    const PAYTABS_PROFILE_ID = Deno.env.get("PAYTABS_PROFILE_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!PAYTABS_SERVER_KEY || !PAYTABS_PROFILE_ID) {
      throw new Error("PayTabs credentials not configured");
    }

    let callbackData: Record<string, unknown>;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      callbackData = Object.fromEntries(formData.entries()) as Record<string, unknown>;
    } else {
      callbackData = await req.json();
    }

    // Callback data is public/untrusted. Use only identity fields to locate the
    // provider transaction, then derive every status/amount/currency decision
    // from PayTabs' own Query Transaction response.
    const tranRef = typeof callbackData.tran_ref === "string" ? callbackData.tran_ref : "";
    const cartId = typeof callbackData.cart_id === "string" ? callbackData.cart_id : "";
    if (!cartId || !tranRef) {
      return json({ error: "Missing PayTabs transaction reference" }, 400);
    }

    const verifyRes = await fetch("https://secure-egypt.paytabs.com/payment/query", {
      method: "POST",
      headers: {
        authorization: PAYTABS_SERVER_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_id: parseInt(PAYTABS_PROFILE_ID, 10),
        tran_ref: tranRef,
      }),
    });

    if (!verifyRes.ok) {
      console.error("PayTabs verification request failed", {
        cartId,
        tranRef,
        httpStatus: verifyRes.status,
      });
      return json({ error: "Could not verify transaction with PayTabs" }, 502);
    }

    const verifyData = await verifyRes.json().catch(() => null);
    const verified = verifyData?.payment_result || {};
    const verifiedStatus = verified.response_status as string | undefined;
    const verifiedMessage = verified.response_message as string | undefined;
    const verifiedCode = verified.response_code as string | undefined;
    const verifiedCurrency = typeof verifyData?.cart_currency === "string"
      ? verifyData.cart_currency.toUpperCase()
      : "";

    const identity = verifyPaytabsTransactionIdentity({
      callbackTranRef: tranRef,
      verifiedTranRef: verifyData?.tran_ref,
      callbackCartId: cartId,
      verifiedCartId: verifyData?.cart_id,
    });
    if (!identity.ok) {
      console.error("PayTabs callback identity rejected", {
        cartId,
        tranRef,
        code: identity.code,
      });
      return json({ error: identity.detail }, 409);
    }

    if (!verifiedStatus) {
      console.error("PayTabs verification produced no status", { cartId, tranRef });
      return json({ error: "Could not verify transaction with PayTabs" }, 502);
    }

    console.log("PayTabs verification result", {
      cartId,
      tranRef,
      verifiedStatus,
      verifiedCode: verifiedCode ?? null,
      verifiedCurrency: verifiedCurrency || null,
    });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: existing, error: lookupError } = await supabase
      .from("orders")
      .select("total_amount,payment_status,paytabs_tran_ref")
      .eq("order_reference", cartId)
      .maybeSingle();

    if (lookupError || !existing) {
      console.error("PayTabs callback for unknown order reference", { cartId, tranRef });
      return json({ error: "Unknown order reference" }, 404);
    }

    // Paid is absorbing. A delayed decline/cancel callback from any attempt can
    // never append a contradictory event or move the order away from paid.
    if (existing.payment_status === "paid") {
      return json({ success: true, note: "already_paid" });
    }

    // paytabs-create-payment pins every successful hosted-page creation to its
    // current tran_ref. Once pinned, an older delayed callback is stale even if
    // PayTabs can still verify that old transaction independently.
    if (!existing.paytabs_tran_ref) {
      return json({ error: "Payment session is not yet attached to this order" }, 503);
    }
    if (existing.paytabs_tran_ref !== tranRef) {
      console.warn("Ignoring stale PayTabs callback", { cartId, tranRef });
      return json({ error: "This payment attempt is no longer current" }, 409);
    }

    const { payment_status, safe_failure_reason } = mapPaytabsStatus(
      verifiedStatus,
      verifiedMessage,
      verifiedCode,
    );

    if (payment_status === "paid") {
      if (verifiedCurrency !== "EGP") {
        console.error("Paid callback rejected: currency mismatch", {
          cartId,
          tranRef,
          verifiedCurrency: verifiedCurrency || null,
        });
        return json({ error: "Payment currency does not match the order" }, 409);
      }

      const acceptance = verifyPaidAcceptance({
        cartId,
        verifiedCartId: verifyData?.cart_id,
        paidAmount: verifyData?.cart_amount,
        orderAmount: existing.total_amount,
      });
      if (!acceptance.ok) {
        console.error("Paid callback rejected", { cartId, tranRef, code: acceptance.code });
        return json({ error: acceptance.detail }, 409);
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status,
        safe_failure_reason,
        paytabs_tran_ref: tranRef,
        updated_at: new Date().toISOString(),
      })
      .eq("order_reference", cartId)
      .eq("paytabs_tran_ref", tranRef)
      .eq("payment_status", existing.payment_status)
      .select("order_reference")
      .maybeSingle();

    if (updateError) {
      console.error("DB payment-state update failed", {
        cartId,
        error: updateError.message,
      });
      return json({ error: "Could not update order payment state" }, 500);
    }
    if (!updated) {
      // Another verified callback may have settled it between our read/update.
      const { data: afterRace } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("order_reference", cartId)
        .maybeSingle();
      if (afterRace?.payment_status === "paid") {
        return json({ success: true, note: "already_paid" });
      }
      return json({ error: "Order payment state changed during verification" }, 409);
    }

    const { error: eventError } = await supabase.from("order_payment_events").insert({
      order_reference: cartId,
      from_status: existing.payment_status,
      to_status: payment_status,
      payment_method: "paytabs",
      source: "paytabs_callback_verified",
      note: safe_failure_reason,
    });
    if (eventError) {
      // Settlement truth lives on orders. Audit insertion failure is important
      // operationally but must not cause PayTabs to retry a payment we applied.
      console.error("Payment event audit insert failed", {
        cartId,
        error: eventError.message,
      });
    }

    console.log("Verified PayTabs payment state applied", {
      cartId,
      tranRef,
      paymentStatus: payment_status,
      failureReason: safe_failure_reason ?? null,
    });

    return json({ success: true });
  } catch (error) {
    console.error("paytabs-callback error:", error instanceof Error ? error.message : "Unknown error");
    return json({ error: "Payment callback could not be processed" }, 500);
  }
});
