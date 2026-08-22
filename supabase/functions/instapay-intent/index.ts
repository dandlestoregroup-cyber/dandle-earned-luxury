import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Verified public receiving identity supplied by the account owner.
// These are payment-routing details, not authentication credentials.
const INSTAPAY_RECEIVER = {
  handle: "mourad.farah@instapay",
  name: "Mourad Farah",
  paymentLink: "https://ipn.eg/S/mourad.farah/instapay/6wWmu1",
} as const;

const ORDER_REF_RE = /^DN-[A-Za-z0-9-]{4,40}$/;
const TERMINAL_PAYTABS_FAILURES = new Set(["failed", "cancelled", "expired"]);
const REOPENABLE_INSTAPAY_STATES = new Set([
  "instapay_pending",
  "instapay_verification_required",
]);

const buckets = new Map<string, { count: number; resetAt: number }>();
function rateLimited(req: Request): boolean {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const now = Date.now();
  const key = `instapay-intent:${ip}`;
  const current = buckets.get(key);
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 10;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (rateLimited(req)) {
    return json({ error: "rate_limited", retry_after_seconds: 60 }, 429);
  }

  try {
    const body = await req.json().catch(() => null);

    // Non-order probe used by the storefront to decide whether the fallback is configured.
    // Return availability only; receiver values are returned only for a real eligible order.
    if (body?.probe === true) {
      return json({ available: true });
    }

    const reference = body?.order_reference;
    if (typeof reference !== "string" || !ORDER_REF_RE.test(reference)) {
      return json({ available: false, error: "invalid_reference" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRole) {
      return json({ available: false, error: "backend_unavailable" }, 503);
    }

    const supabase = createClient(supabaseUrl, serviceRole);
    const { data: order, error } = await supabase
      .from("orders")
      .select("order_reference,payment_status,total_amount,currency,payment_method")
      .eq("order_reference", reference)
      .maybeSingle();

    if (error || !order) return json({ available: false, error: "unknown_reference" }, 404);
    if (order.payment_status === "paid") {
      return json({ available: false, error: "already_paid" }, 409);
    }

    const alreadyInstapay = REOPENABLE_INSTAPAY_STATES.has(order.payment_status);
    if (!alreadyInstapay && !TERMINAL_PAYTABS_FAILURES.has(order.payment_status)) {
      return json(
        {
          available: false,
          error: "not_offerable",
          payment_status: order.payment_status,
        },
        409,
      );
    }

    if (TERMINAL_PAYTABS_FAILURES.has(order.payment_status)) {
      const previousStatus = order.payment_status;
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "instapay_pending",
          payment_method: "instapay",
          safe_failure_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("order_reference", reference)
        .neq("payment_status", "paid");

      if (updateError) {
        console.error("InstaPay switch failed:", updateError.message);
        return json({ available: false, error: "switch_failed" }, 500);
      }

      await supabase.from("order_payment_events").insert({
        order_reference: reference,
        from_status: previousStatus,
        to_status: "instapay_pending",
        payment_method: "instapay",
        source: "instapay_intent",
      });
    }

    return json({
      available: true,
      order_reference: reference,
      amount: Number(order.total_amount),
      currency: order.currency ?? "EGP",
      receiver_handle: INSTAPAY_RECEIVER.handle,
      receiver_name: INSTAPAY_RECEIVER.name,
      payment_link: INSTAPAY_RECEIVER.paymentLink,
      payment_status: alreadyInstapay ? order.payment_status : "instapay_pending",
    });
  } catch (err) {
    console.error("instapay-intent error:", err instanceof Error ? err.message : err);
    return json({ available: false, error: "unexpected_error" }, 500);
  }
});
