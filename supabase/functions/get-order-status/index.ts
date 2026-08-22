/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_STORE_DOMAIN = 'dandle-earned-luxury-qbrhm.myshopify.com';
const SHOPIFY_API_VERSION = '2024-01';

const DRAFT_ORDER_QUERY = `
  query getDraftOrderByName($query: String!) {
    draftOrders(first: 1, query: $query) {
      nodes {
        id
        name
        createdAt
        status
        totalPriceSet { shopMoney { amount currencyCode } }
        customer { displayName email phone }
        lineItems(first: 20) {
          nodes {
            title
            variantTitle
            quantity
            originalUnitPriceSet { shopMoney { amount } }
          }
        }
        shippingAddress { address1 city province }
        order { id name displayFulfillmentStatus }
      }
    }
  }
`;

async function shopifyAdminRequest(query: string, variables: Record<string, unknown>) {
  const accessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  if (!accessToken) throw new Error('SHOPIFY_ACCESS_TOKEN not configured');

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  if (!response.ok) throw new Error(`Shopify API error: ${response.status}`);
  return response.json();
}

// paytabs-create-payment generates references like DN-MT4IDQ65-W805.
// Internal hyphens are therefore valid and must be accepted consistently.
function validateOrderReference(ref: string): boolean {
  const validPattern = /^DN-[A-Za-z0-9-]{4,40}$/;
  return typeof ref === 'string' && validPattern.test(ref);
}

function sanitizeForQuery(input: string): string {
  return input
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/\\/g, '')
    .replace(/\*/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\bOR\b/gi, '')
    .replace(/\bAND\b/gi, '')
    .replace(/\bNOT\b/gi, '');
}

const rateLimitMap = new Map<string, number[]>();
function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < windowMs);
  if (recent.length >= maxRequests) return false;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => null);
    const reference = body?.reference;
    if (!reference || !validateOrderReference(reference)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid order reference format. Expected DN-XXXXXXXX.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedRef = sanitizeForQuery(reference);
    console.log('Order lookup:', { reference: sanitizedRef, ip: clientIp, timestamp: new Date().toISOString() });

    // Current PayTabs orders live in the Dandle orders table. Return only the
    // public SECURITY DEFINER projection and never expose customer PII.
    try {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data: rows, error: rpcErr } = await supabase.rpc('get_public_order_status', {
          _reference: sanitizedRef,
        });
        if (!rpcErr && Array.isArray(rows) && rows.length > 0) {
          const row = rows[0] as {
            payment_status: string;
            safe_display_reason: string | null;
            order_date: string;
            line_items: unknown;
            phone_last4: string | null;
            payment_method: string | null;
            total_amount: number | null;
          };
          const items = Array.isArray(row.line_items)
            ? (row.line_items as Array<Record<string, unknown>>).map((it) => ({
                productName: it.productName,
                variantTitle: it.variantTitle,
                quantity: it.quantity,
              }))
            : [];

          return new Response(
            JSON.stringify({
              success: true,
              source: 'db',
              order: {
                reference: sanitizedRef,
                paymentStatus: row.payment_status,
                safeDisplayReason: row.safe_display_reason,
                orderDate: row.order_date,
                lineItems: items,
                phoneLast4: row.phone_last4,
                paymentMethod: row.payment_method ?? 'paytabs',
                totalAmount: row.total_amount,
              },
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    } catch (dbErr) {
      console.error('DB status lookup failed (will fall through):', dbErr);
    }

    // Legacy Shopify lookup for references that predate the current DB flow.
    if (!Deno.env.get('SHOPIFY_ACCESS_TOKEN')) {
      return new Response(
        JSON.stringify({ success: false, source: 'none', error: 'not_found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await shopifyAdminRequest(DRAFT_ORDER_QUERY, {
      query: `tag:"${sanitizedRef}" OR name:"${sanitizedRef}"`
    });
    const draftOrder = result.data?.draftOrders?.nodes?.[0];

    if (!draftOrder) {
      return new Response(
        JSON.stringify({ success: false, source: 'none', error: 'not_found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let displayStatus = 'PENDING';
    if (draftOrder.order) {
      const fulfillmentStatus = draftOrder.order.displayFulfillmentStatus;
      if (fulfillmentStatus === 'FULFILLED') displayStatus = 'DELIVERED';
      else if (fulfillmentStatus === 'IN_PROGRESS' || fulfillmentStatus === 'PARTIALLY_FULFILLED') displayStatus = 'SHIPPED';
      else displayStatus = 'CONFIRMED';
    } else if (draftOrder.status === 'COMPLETED') displayStatus = 'CONFIRMED';

    const order = {
      reference: draftOrder.name || sanitizedRef,
      status: displayStatus,
      paymentStatus: displayStatus === 'PENDING' ? 'pending' : 'paid',
      safeDisplayReason: null,
      createdAt: draftOrder.createdAt,
      deliveryLocation: draftOrder.shippingAddress
        ? `${draftOrder.shippingAddress.city || ''}, ${draftOrder.shippingAddress.province || ''}`.replace(/^, |, $/g, '')
        : undefined,
      lineItems: draftOrder.lineItems?.nodes?.map((item: {
        title: string;
        variantTitle: string;
        quantity: number;
      }) => ({
        title: item.title,
        variantTitle: item.variantTitle,
        quantity: item.quantity,
      })) || [],
    };

    return new Response(
      JSON.stringify({ success: true, order }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching order status:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch order status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
