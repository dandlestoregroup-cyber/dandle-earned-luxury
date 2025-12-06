import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_STORE_DOMAIN = 'dandle-earned-luxury-qbrhm.myshopify.com';
const SHOPIFY_API_VERSION = '2025-07';

interface CartItem {
  productId: string;
  productName: string;
  variantTitle: string;
  color: string;
  mechanism: 'power' | 'manual';
  quantity: number;
  price: number;
  massageFeature?: boolean;
  handle?: string;
}

interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  governorate: string;
  notes?: string;
}

interface CreateOrderRequest {
  customer: CustomerData;
  items: CartItem[];
  totalPrice: number;
}

const DRAFT_ORDER_CREATE_MUTATION = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        invoiceUrl
        totalPrice
        customer {
          id
          displayName
        }
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              originalUnitPrice
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function shopifyAdminRequest(query: string, variables: Record<string, unknown> = {}) {
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
    const errorText = await response.text();
    console.error('Shopify API error:', response.status, errorText);
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    console.error('Shopify GraphQL errors:', data.errors);
    throw new Error(`Shopify GraphQL error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DN-${timestamp}${random}`;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer, items, totalPrice }: CreateOrderRequest = await req.json();

    console.log('Creating order for customer:', customer.name);
    console.log('Items:', items.length);

    // Generate a reference number for tracking
    const orderReference = generateOrderNumber();

    // Build line items for Shopify draft order
    const lineItems = items.map(item => {
      const massageLabel = item.massageFeature ? ' + Massage' : '';
      return {
        title: `${item.productName} (${item.color}, ${item.mechanism}${massageLabel})`,
        quantity: item.quantity,
        originalUnitPrice: item.price.toString(),
        requiresShipping: true,
      };
    });

    // Build shipping address
    const shippingAddress = {
      firstName: customer.name.split(' ')[0] || customer.name,
      lastName: customer.name.split(' ').slice(1).join(' ') || '',
      address1: customer.address,
      city: customer.city,
      province: customer.governorate,
      country: 'Egypt',
      countryCode: 'EG',
      phone: customer.phone,
    };

    // Create draft order input
    const input = {
      lineItems,
      shippingAddress,
      billingAddress: shippingAddress,
      email: customer.email || undefined,
      phone: customer.phone,
      note: `Order Reference: ${orderReference}${customer.notes ? `\n\nCustomer Notes: ${customer.notes}` : ''}`,
      tags: ['whatsapp-order', 'pending-confirmation'],
      customAttributes: [
        { key: 'order_reference', value: orderReference },
        { key: 'source', value: 'dandle-website' },
      ],
    };

    console.log('Creating Shopify draft order...');
    
    const result = await shopifyAdminRequest(DRAFT_ORDER_CREATE_MUTATION, { input });

    if (result.data?.draftOrderCreate?.userErrors?.length > 0) {
      const errors = result.data.draftOrderCreate.userErrors;
      console.error('Draft order creation errors:', errors);
      throw new Error(`Order creation failed: ${errors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    const draftOrder = result.data?.draftOrderCreate?.draftOrder;
    
    if (!draftOrder) {
      throw new Error('No draft order returned from Shopify');
    }

    console.log('Draft order created:', draftOrder.name);

    // Build product links for WhatsApp
    const productLinks = items.map(item => ({
      name: item.productName,
      handle: item.handle || item.productName.toLowerCase().replace(/\s+/g, '-'),
      url: `https://dandle.eg/product/${item.handle || item.productName.toLowerCase().replace(/\s+/g, '-')}`,
    }));

    // Return order details
    const response = {
      success: true,
      order: {
        id: draftOrder.id,
        name: draftOrder.name,
        reference: orderReference,
        invoiceUrl: draftOrder.invoiceUrl,
        totalPrice: draftOrder.totalPrice,
        trackingUrl: `https://dandle.eg/order/${orderReference}`,
      },
      productLinks,
    };

    console.log('Order created successfully:', orderReference);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating order:', errorMessage);
    
    // Return a fallback response with generated reference
    const fallbackReference = generateOrderNumber();
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      fallback: {
        reference: fallbackReference,
        message: 'Order will be processed manually via WhatsApp',
      },
    }), {
      status: 200, // Return 200 so WhatsApp flow continues
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
