/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_STORE_DOMAIN = 'dandle-earned-luxury-qbrhm.myshopify.com';
const SHOPIFY_API_VERSION = '2024-01';

interface OrderStatusRequest {
  reference: string;
}

// Query draft order by name/reference
const DRAFT_ORDER_QUERY = `
  query getDraftOrderByName($query: String!) {
    draftOrders(first: 1, query: $query) {
      nodes {
        id
        name
        createdAt
        status
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
          email
          phone
        }
        lineItems(first: 20) {
          nodes {
            title
            variantTitle
            quantity
            originalUnitPriceSet {
              shopMoney {
                amount
              }
            }
          }
        }
        shippingAddress {
          address1
          city
          province
        }
        order {
          id
          name
          displayFulfillmentStatus
        }
      }
    }
  }
`;

async function shopifyAdminRequest(query: string, variables: Record<string, unknown>) {
  const accessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  
  if (!accessToken) {
    throw new Error('SHOPIFY_ACCESS_TOKEN not configured');
  }

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

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  return response.json();
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json() as OrderStatusRequest;

    if (!reference) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order reference required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Looking up order: ${reference}`);

    // Search for draft order with this reference in tags or name
    const result = await shopifyAdminRequest(DRAFT_ORDER_QUERY, {
      query: `tag:${reference} OR name:${reference}`
    });

    const draftOrder = result.data?.draftOrders?.nodes?.[0];

    if (!draftOrder) {
      // Return pending status for orders not yet in Shopify
      return new Response(
        JSON.stringify({
          success: true,
          order: {
            reference,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            totalPrice: '0',
            currencyCode: 'EGP',
            lineItems: []
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map draft order status to display status
    let displayStatus = 'PENDING';
    if (draftOrder.order) {
      // Has been converted to a real order
      const fulfillmentStatus = draftOrder.order.displayFulfillmentStatus;
      if (fulfillmentStatus === 'FULFILLED') {
        displayStatus = 'DELIVERED';
      } else if (fulfillmentStatus === 'IN_PROGRESS' || fulfillmentStatus === 'PARTIALLY_FULFILLED') {
        displayStatus = 'SHIPPED';
      } else {
        displayStatus = 'CONFIRMED';
      }
    } else if (draftOrder.status === 'COMPLETED') {
      displayStatus = 'CONFIRMED';
    } else if (draftOrder.status === 'OPEN') {
      displayStatus = 'PENDING';
    }

    const order = {
      reference: draftOrder.name || reference,
      status: displayStatus,
      createdAt: draftOrder.createdAt,
      totalPrice: draftOrder.totalPriceSet?.shopMoney?.amount || '0',
      currencyCode: draftOrder.totalPriceSet?.shopMoney?.currencyCode || 'EGP',
      customer: draftOrder.customer ? {
        name: draftOrder.customer.displayName,
        email: draftOrder.customer.email,
        phone: draftOrder.customer.phone
      } : undefined,
      lineItems: draftOrder.lineItems?.nodes?.map((item: {
        title: string;
        variantTitle: string;
        quantity: number;
        originalUnitPriceSet: { shopMoney: { amount: string } };
      }) => ({
        title: item.title,
        variantTitle: item.variantTitle,
        quantity: item.quantity,
        price: item.originalUnitPriceSet?.shopMoney?.amount || '0'
      })) || [],
      shippingAddress: draftOrder.shippingAddress ? {
        address1: draftOrder.shippingAddress.address1,
        city: draftOrder.shippingAddress.city,
        province: draftOrder.shippingAddress.province
      } : undefined
    };

    return new Response(
      JSON.stringify({ success: true, order }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching order status:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch order status'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
