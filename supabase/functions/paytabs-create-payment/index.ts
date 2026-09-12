import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { rateLimitResponse } from "../_shared/rateLimit.ts";
import { priceForOffer } from "../_shared/catalogPrices.ts";
import {
  classifyCreationOutcome,
  isReusableForRetry,
  priceGuidedLines,
} from "../_shared/paymentPolicy.ts";
import { isValidDandleOrderReference } from "../_shared/orderReference.ts";
import { resolvePaymentTest } from "../_shared/paymentTest.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PAYTABS_BASE = "https://secure-egypt.paytabs.com";
const PRODUCTION_RETURN_BASE = "https://dandle-vie.com";

/**
 * Production always returns to the canonical storefront. Preview/local builds
 * may return to their own trusted origin so test journeys do not bounce into
 * production after the hosted PayTabs page.
 */
function resolveReturnBase(req: Request): string {
  const candidate = req.headers.get("origin") || req.headers.get("referer") || "";
  if (!candidate) return PRODUCTION_RETURN_BASE;

  try {
    const url = new URL(candidate);
    if (url.hostname === "dandle-vie.com" || url.hostname === "www.dandle-vie.com") {
      return PRODUCTION_RETURN_BASE;
    }
    if (url.hostname === "localhost") return url.origin;
    if (url.protocol === "https:" && url.hostname.endsWith(".lovable.app")) return url.origin;
  } catch {
    // Fall through to the production origin.
  }
  return PRODUCTION_RETURN_BASE;
}

interface GuidedLine {
  productId: string;
  productName: string;
  variantId: string;
  colorSlug: string;
  colorNameEn: string;
  colorNameAr: string;
  material: string | null;
  imageUrl: string;
  mechanismId: "manual" | "power";
  mechanismOfferId: string;
  mechanismLabelEn: string;
  mechanismLabelAr: string;
  unitPriceEgp: number;
  quantity: number;
  checkoutAvailable: boolean;
  extras: Array<{ extraId: string; labelEn: string; labelAr: string; priceEgp: number }>;
  notes: string;
}

interface GuidedPayload {
  lines: GuidedLine[];
  access: Record<string, unknown>;
  address: Record<string, unknown> & {
    governorateName?: string;
    cityName?: string;
    street?: string;
    buildingNumber?: string;
  };
  contact: { fullName: string; mobile: string; email?: string };
  confirmedAt: string | null;
  totalAmount: number;
  mode?: "checkout" | "request";
  order_reference?: string;
}

function isGuidedPayload(value: unknown): value is GuidedPayload {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  return (
    Array.isArray(body.lines) &&
    !!body.access && typeof body.access === "object" &&
    !!body.address && typeof body.address === "object" &&
    !!body.contact && typeof body.contact === "object"
  );
}

type Customer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  governorate?: string;
  notes?: string;
};

type CheckoutItem = {
  productName: string;
  quantity: number;
  price: number;
  variantTitle?: string;
};

type ExistingOrder = {
  order_reference: string;
  payment_status: string;
  total_amount: number;
  items: unknown;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  city: string | null;
  governorate: string | null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  const limited = rateLimitResponse(
    req,
    { key: "paytabs-pay", max: 5, windowMs: 60_000 },
    corsHeaders,
  );
  if (limited) return limited;

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

    const parsed = await req.json().catch(() => null);
    if (!parsed || typeof parsed !== "object") {
      return json({ error: "Invalid checkout payload", failure_kind: "not_purchasable" }, 400);
    }
    const body = parsed as Record<string, unknown>;
    const test = resolvePaymentTest(body, req.headers.get("authorization"), SUPABASE_SERVICE_ROLE_KEY);
    if (test.requested && !test.ok) return json({ error: test.error }, test.status);
    const paymentTest = test.requested && test.ok ? test : null;

    let customer: Customer | undefined;
    let items: CheckoutItem[] | undefined;
    let totalAmount: number | undefined;
    let guidedSnapshot: GuidedPayload | null = null;
    let mode: "checkout" | "request" = "checkout";
    let retryReference: string | null = null;

    if (paymentTest) {
      customer = {
        name: "DANDLE PAYMENT TEST - DO NOT FULFILL",
        phone: "TEST-NO-CONTACT",
        address: "NO DELIVERY - PAYMENT VERIFICATION ONLY",
        notes: "PAYMENT TEST ONLY. No product, inventory reservation, shipment or customer outreach.",
      };
      items = [{ productName: "DANDLE payment test - no goods or delivery", quantity: 1, price: paymentTest.amount }];
      totalAmount = paymentTest.amount;
    } else if (isGuidedPayload(parsed)) {
      guidedSnapshot = parsed;
      mode = parsed.mode ?? (parsed.lines.every((line) => line.checkoutAvailable) ? "checkout" : "request");
      if (isValidDandleOrderReference(parsed.order_reference)) {
        retryReference = parsed.order_reference;
      }

      const address = parsed.address;
      const addressLine = [
        address.street,
        address.buildingNumber,
        address.apartmentUnit,
        address.cityName,
        address.governorateName,
      ].filter(Boolean).join(", ");

      customer = {
        name: parsed.contact.fullName,
        phone: parsed.contact.mobile,
        email: parsed.contact.email,
        address: addressLine,
        city: address.cityName,
        governorate: address.governorateName,
        notes: [address.landmark, address.mapsUrl, parsed.access.installationNotes]
          .filter(Boolean)
          .join(" | "),
      };

      items = parsed.lines.map((line) => ({
        productName: line.productName,
        variantTitle: `${line.colorNameEn} · ${line.mechanismLabelEn}`,
        quantity: line.quantity,
        price: line.unitPriceEgp,
      }));
      totalAmount = parsed.totalAmount;
    } else {
      // Reference-only retry is intentionally valid. Legacy customer/items are
      // retained only so older request-only surfaces can fail gracefully.
      if (isValidDandleOrderReference(body.order_reference)) {
        retryReference = body.order_reference;
      }
      customer = body.customer as Customer | undefined;
      items = Array.isArray(body.items) ? body.items as CheckoutItem[] : undefined;
      totalAmount = typeof body.totalAmount === "number" ? body.totalAmount : undefined;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    let existingOrder: ExistingOrder | null = null;

    if (retryReference) {
      const { data: row, error } = await supabase
        .from("orders")
        .select(
          "order_reference,payment_status,total_amount,items,customer_name,customer_phone,customer_email,customer_address,city,governorate",
        )
        .eq("order_reference", retryReference)
        .maybeSingle();

      if (error || !row) {
        return json({ error: "Unknown order reference", failure_kind: "unknown_reference" }, 404);
      }
      if (row.items && !Array.isArray(row.items) && row.items.payment_test === true) {
        return json({ error: "Test payments require a new operator-authorized reference", failure_kind: "not_retryable" }, 409);
      }
      if (row.payment_status === "paid") {
        return json({ error: "This order is already paid", failure_kind: "already_paid" }, 409);
      }
      if (!isReusableForRetry(row.payment_status)) {
        return json({ error: "This order cannot be retried", failure_kind: "not_retryable" }, 409);
      }

      existingOrder = row as ExistingOrder;
      totalAmount = Number(row.total_amount);
      customer = {
        name: row.customer_name,
        phone: row.customer_phone,
        email: row.customer_email ?? undefined,
        address: row.customer_address,
        city: row.city ?? undefined,
        governorate: row.governorate ?? undefined,
      };

      const stored = row.items as { legacy_items?: CheckoutItem[] } | CheckoutItem[] | null;
      items = Array.isArray(stored) ? stored : stored?.legacy_items;
      mode = "checkout";
    }

    // New online orders are always re-priced from the server catalog. Browser
    // totals and unit prices are display inputs only and never decide the charge.
    if (!existingOrder && mode === "checkout" && guidedSnapshot) {
      const priced = priceGuidedLines(guidedSnapshot.lines);
      if (!priced.ok) {
        return json({ error: priced.reason, failure_kind: "not_purchasable" }, 400);
      }
      if (Math.round(Number(totalAmount)) !== Math.round(priced.totalEgp)) {
        console.warn("Client/server total mismatch", {
          clientTotal: totalAmount,
          serverTotal: priced.totalEgp,
        });
      }
      totalAmount = priced.totalEgp;
      items = guidedSnapshot.lines.map((line) => ({
        productName: line.productName,
        variantTitle: `${line.colorNameEn} · ${line.mechanismLabelEn}`,
        quantity: line.quantity,
        price: priceForOffer(line.mechanismOfferId) ?? 0,
      }));
    } else if (!existingOrder && mode === "checkout" && !paymentTest) {
      return json(
        {
          error: "This checkout format is no longer supported. Please re-open your cart.",
          failure_kind: "not_purchasable",
        },
        400,
      );
    }

    if (!customer?.name || !customer.phone || !customer.address || !items?.length || !totalAmount) {
      return json({ error: "Missing required fields", failure_kind: "not_purchasable" }, 400);
    }

    if (mode === "checkout" && (!PAYTABS_SERVER_KEY || !PAYTABS_PROFILE_ID)) {
      console.error("PayTabs credentials not configured");
      return json(
        { error: "Online payment is temporarily unavailable.", failure_kind: "credentials_missing" },
        503,
      );
    }

    const orderRef = paymentTest?.reference ?? existingOrder?.order_reference ??
      `DN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    if (existingOrder) {
      // Mark the same order pending before contacting PayTabs. An uncertain
      // provider outcome therefore cannot encourage a second parallel payment.
      const { data: reset, error: resetError } = await supabase
        .from("orders")
        .update({
          payment_status: "pending",
          payment_method: "paytabs",
          paytabs_tran_ref: null,
          safe_failure_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("order_reference", orderRef)
        .eq("payment_status", existingOrder.payment_status)
        .select("order_reference")
        .maybeSingle();
      if (resetError || !reset) {
        console.error("Order retry reset failed", { orderRef, error: resetError?.message });
        return json({ error: "Payment state changed. Do not pay again yet.", failure_kind: "uncertain" }, 409);
      }

      const { error: retryEventError } = await supabase.from("order_payment_events").insert({
        order_reference: orderRef,
        from_status: existingOrder.payment_status,
        to_status: "pending",
        payment_method: "paytabs",
        source: "paytabs_retry",
      });
      if (retryEventError) {
        console.error("Retry event audit insert failed", { orderRef, error: retryEventError.message });
      }
    } else {
      const orderRow = {
        order_reference: orderRef,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email || null,
        customer_address: customer.address,
        city: customer.city || null,
        governorate: customer.governorate || null,
        notes: customer.notes || null,
        items: paymentTest
          ? { legacy_items: items, payment_test: true, fulfilment_required: false }
          : guidedSnapshot ? { legacy_items: items, guided: guidedSnapshot } : items,
        total_amount: totalAmount,
        payment_method: "paytabs",
        payment_status: mode === "request" ? "request" : "pending",
      };

      const { error: dbError } = await supabase.from("orders").insert(orderRow);
      if (dbError) {
        if (paymentTest && dbError.code === "23505") {
          return json({ error: "Test reference already exists. Verify the existing attempt before creating another.", order_reference: orderRef }, 409);
        }
        console.error("DB order insert failed", { error: dbError.message });
        return json({ error: "Failed to create order record", failure_kind: "uncertain" }, 500);
      }

      const { error: orderEventError } = await supabase.from("order_payment_events").insert({
        order_reference: orderRef,
        from_status: null,
        to_status: mode === "request" ? "request" : "pending",
        payment_method: "paytabs",
        source: "order_created",
      });
      if (orderEventError) {
        console.error("Order event audit insert failed", { orderRef, error: orderEventError.message });
      }
    }

    if (mode === "request") {
      return json({ success: true, order_reference: orderRef, mode: "request" });
    }

    const cartDesc = items
      .map((item) => `${item.quantity}x ${item.productName}`)
      .join(", ")
      .slice(0, 120);

    const callbackUrl = `${SUPABASE_URL}/functions/v1/paytabs-callback`;
    const returnUrl = `${resolveReturnBase(req)}/order-confirmation?ref=${orderRef}`;

    let ptStatus = 0;
    let ptData: {
      redirect_url?: unknown;
      tran_ref?: unknown;
      cart_id?: unknown;
      message?: unknown;
    } | null = null;
    let transportError = false;

    try {
      const ptResponse = await fetch(`${PAYTABS_BASE}/payment/request`, {
        method: "POST",
        headers: {
          authorization: PAYTABS_SERVER_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_id: parseInt(PAYTABS_PROFILE_ID!, 10),
          tran_type: "sale",
          tran_class: "ecom",
          cart_id: orderRef,
          cart_currency: "EGP",
          cart_amount: totalAmount,
          cart_description: cartDesc,
          customer_details: paymentTest ? undefined : {
            name: customer.name,
            email: customer.email || "customer@dandlerecliners.com",
            phone: customer.phone,
            street1: customer.address,
            city: customer.city || "Cairo",
            state: customer.governorate || "Cairo",
            country: "EG",
            zip: "00000",
          },
          callback: callbackUrl,
          return: returnUrl,
          hide_shipping: true,
          framed: false,
        }),
        signal: AbortSignal.timeout(20_000),
      });
      ptStatus = ptResponse.status;
      ptData = await ptResponse.json().catch(() => null);
    } catch (networkError) {
      transportError = true;
      console.error(
        "PayTabs transport error",
        networkError instanceof Error ? networkError.message : "unknown error",
      );
    }

    const outcome = classifyCreationOutcome({
      transportError,
      httpStatus: ptStatus,
      body: ptData,
    });

    if (!outcome.ok) {
      console.error("PayTabs session creation outcome", {
        orderRef,
        kind: outcome.kind,
        httpStatus: ptStatus,
      });

      // A provider/network uncertainty remains pending. Only a definitive
      // provider refusal becomes failed; no alternate settlement is unlocked.
      if (outcome.kind === "creation_failed") {
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            safe_failure_reason: "session_creation_failed",
            updated_at: new Date().toISOString(),
          })
          .eq("order_reference", orderRef)
          .neq("payment_status", "paid");
        await supabase.from("order_payment_events").insert({
          order_reference: orderRef,
          from_status: "pending",
          to_status: "failed",
          payment_method: "paytabs",
          source: "paytabs_create_failed",
        });
      }

      return json(
        {
          error: outcome.message,
          failure_kind: outcome.kind,
          order_reference: orderRef,
          conclusive: outcome.kind !== "uncertain",
        },
        502,
      );
    }

    const paytabsTranRef = typeof ptData?.tran_ref === "string" ? ptData.tran_ref : "";
    const paytabsCartId = typeof ptData?.cart_id === "string" ? ptData.cart_id : "";
    const redirectUrl = typeof ptData?.redirect_url === "string" ? ptData.redirect_url : "";
    let trustedRedirect = false;
    try {
      const url = new URL(redirectUrl);
      trustedRedirect = url.origin === PAYTABS_BASE && !url.username && !url.password;
    } catch { /* fail closed */ }

    // PayTabs documents tran_ref and cart_id in a successful hosted-page
    // creation response. Do not hand a customer an untracked payment page.
    if (!paytabsTranRef || paytabsCartId !== orderRef || !trustedRedirect) {
      console.error("PayTabs session identity incomplete", {
        orderRef,
        hasTranRef: Boolean(paytabsTranRef),
        cartMatches: paytabsCartId === orderRef,
        hasRedirect: Boolean(redirectUrl),
      });
      return json(
        {
          error: "Payment session could not be verified.",
          failure_kind: "uncertain",
          order_reference: orderRef,
          conclusive: false,
        },
        502,
      );
    }

    // Pin this Dandle order to the newest PayTabs attempt before returning the
    // hosted page. The callback rejects delayed events from older attempts.
    const { data: pinned, error: pinError } = await supabase
      .from("orders")
      .update({
        payment_status: "pending",
        payment_method: "paytabs",
        paytabs_tran_ref: paytabsTranRef,
        safe_failure_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq("order_reference", orderRef)
      .eq("payment_status", "pending")
      .is("paytabs_tran_ref", null)
      .select("order_reference")
      .maybeSingle();

    if (pinError || !pinned) {
      console.error("Could not pin PayTabs session to order", {
        orderRef,
        error: pinError?.message ?? null,
      });
      return json(
        {
          error: "Payment session could not be attached to this order.",
          failure_kind: "uncertain",
          order_reference: orderRef,
          conclusive: false,
        },
        502,
      );
    }

    const { error: sessionEventError } = await supabase.from("order_payment_events").insert({
      order_reference: orderRef,
      from_status: "pending",
      to_status: "pending",
      payment_method: "paytabs",
      source: "paytabs_session_created",
      note: paytabsTranRef,
    });
    if (sessionEventError) {
      console.error("PayTabs session audit insert failed", {
        orderRef,
        error: sessionEventError.message,
      });
    }

    return json({
      success: true,
      redirect_url: redirectUrl,
      order_reference: orderRef,
      transaction_reference: paytabsTranRef,
      amount: totalAmount,
      currency: "EGP",
      payment_test: Boolean(paymentTest),
      charged: false,
    });
  } catch (error) {
    console.error(
      "paytabs-create-payment error",
      error instanceof Error ? error.message : "Unknown error",
    );
    return json(
      {
        error: "Payment session could not be created.",
        failure_kind: "uncertain",
      },
      500,
    );
  }
});
