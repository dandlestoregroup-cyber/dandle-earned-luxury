import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_STORE_DOMAIN = Deno.env.get('SHOPIFY_STORE_DOMAIN') || 'dandle-eg.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
const SHOPIFY_API_VERSION = '2025-01';

async function shopifyAdminRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

// Fetch all products with pagination
async function fetchAllProducts() {
  const products: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              handle
              title
              descriptionHtml
              description
              vendor
              productType
              tags
              status
              createdAt
              updatedAt
              seo {
                title
                description
              }
              images(first: 50) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                    compareAtPrice
                    inventoryQuantity
                    weight
                    weightUnit
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              metafields(first: 50) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                    type
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await shopifyAdminRequest(query, { first: 50, after: cursor });
    const productEdges = data.products.edges;
    
    products.push(...productEdges.map((edge: any) => ({
      ...edge.node,
      images: edge.node.images.edges.map((e: any) => e.node),
      variants: edge.node.variants.edges.map((e: any) => e.node),
      metafields: edge.node.metafields.edges.map((e: any) => e.node),
    })));

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return products;
}

// Fetch all collections
async function fetchAllCollections() {
  const collections: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const query = `
      query GetCollections($first: Int!, $after: String) {
        collections(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              handle
              title
              description
              descriptionHtml
              image {
                url
                altText
              }
              seo {
                title
                description
              }
              ruleSet {
                appliedDisjunctively
                rules {
                  column
                  relation
                  condition
                }
              }
              products(first: 100) {
                edges {
                  node {
                    id
                    handle
                    title
                  }
                }
              }
              metafields(first: 20) {
                edges {
                  node {
                    namespace
                    key
                    value
                    type
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await shopifyAdminRequest(query, { first: 50, after: cursor });
    const edges = data.collections.edges;
    
    collections.push(...edges.map((edge: any) => ({
      ...edge.node,
      products: edge.node.products.edges.map((e: any) => e.node),
      metafields: edge.node.metafields.edges.map((e: any) => e.node),
    })));

    hasNextPage = data.collections.pageInfo.hasNextPage;
    cursor = data.collections.pageInfo.endCursor;
  }

  return collections;
}

// Fetch draft orders
async function fetchDraftOrders() {
  const query = `
    query GetDraftOrders {
      draftOrders(first: 100) {
        edges {
          node {
            id
            name
            createdAt
            updatedAt
            status
            totalPrice
            currencyCode
            customer {
              id
              email
              firstName
              lastName
              phone
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  originalUnitPrice
                  variant {
                    id
                    title
                    sku
                  }
                }
              }
            }
            shippingAddress {
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            note2
          }
        }
      }
    }
  `;

  const data = await shopifyAdminRequest(query);
  return data.draftOrders.edges.map((edge: any) => ({
    ...edge.node,
    lineItems: edge.node.lineItems.edges.map((e: any) => e.node),
  }));
}

// Fetch shop data
async function fetchShopData() {
  const query = `
    query GetShop {
      shop {
        id
        name
        email
        primaryDomain {
          url
          host
        }
        myshopifyDomain
        currencyCode
        currencyFormats {
          moneyFormat
          moneyWithCurrencyFormat
        }
        timezoneAbbreviation
        ianaTimezone
        weightUnit
        billingAddress {
          address1
          city
          country
          countryCodeV2
        }
        enabledPresentmentCurrencies
      }
    }
  `;

  const data = await shopifyAdminRequest(query);
  return data.shop;
}

// Fetch metafield definitions
async function fetchMetafieldDefinitions() {
  const query = `
    query GetMetafieldDefinitions {
      metafieldDefinitions(first: 100, ownerType: PRODUCT) {
        edges {
          node {
            id
            name
            namespace
            key
            type {
              name
            }
            description
            validations {
              name
              value
            }
          }
        }
      }
    }
  `;

  const data = await shopifyAdminRequest(query);
  return data.metafieldDefinitions.edges.map((edge: any) => edge.node);
}

// Convert products to CSV
function productsToCSV(products: any[]): string {
  const rows: string[] = [];
  
  // Header
  rows.push([
    'Product ID',
    'Handle',
    'Title',
    'Description',
    'Vendor',
    'Product Type',
    'Tags',
    'Status',
    'SEO Title',
    'SEO Description',
    'Variant ID',
    'Variant Title',
    'SKU',
    'Price',
    'Compare At Price',
    'Inventory Quantity',
    'Weight',
    'Weight Unit',
    'Image URL',
    'Image Alt Text',
    'Created At',
    'Updated At'
  ].join(','));

  for (const product of products) {
    const baseRow = [
      `"${product.id}"`,
      `"${product.handle}"`,
      `"${(product.title || '').replace(/"/g, '""')}"`,
      `"${(product.description || '').replace(/"/g, '""').substring(0, 500)}"`,
      `"${product.vendor || ''}"`,
      `"${product.productType || ''}"`,
      `"${(product.tags || []).join(', ')}"`,
      `"${product.status}"`,
      `"${product.seo?.title || ''}"`,
      `"${(product.seo?.description || '').replace(/"/g, '""')}"`,
    ];

    // Create a row for each variant
    for (const variant of product.variants) {
      const mainImage = product.images[0];
      const variantRow = [
        ...baseRow,
        `"${variant.id}"`,
        `"${variant.title}"`,
        `"${variant.sku || ''}"`,
        `"${variant.price}"`,
        `"${variant.compareAtPrice || ''}"`,
        `"${variant.inventoryQuantity || 0}"`,
        `"${variant.weight || ''}"`,
        `"${variant.weightUnit || ''}"`,
        `"${mainImage?.url || ''}"`,
        `"${(mainImage?.altText || '').replace(/"/g, '""')}"`,
        `"${product.createdAt}"`,
        `"${product.updatedAt}"`,
      ];
      rows.push(variantRow.join(','));
    }
  }

  return rows.join('\n');
}

// Generate URLs list
function generateURLs(products: any[], collections: any[], storeDomain: string): string[] {
  const urls: string[] = [];
  
  // Product URLs
  for (const product of products) {
    urls.push(`https://${storeDomain}/products/${product.handle}`);
  }
  
  // Collection URLs
  for (const collection of collections) {
    urls.push(`https://${storeDomain}/collections/${collection.handle}`);
  }
  
  return urls;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error('SHOPIFY_ACCESS_TOKEN is not configured');
    }

    console.log('Starting complete store export...');
    const startTime = Date.now();

    // Fetch all data in parallel where possible
    const [products, collections, draftOrders, shop, metafieldDefinitions] = await Promise.all([
      fetchAllProducts(),
      fetchAllCollections(),
      fetchDraftOrders(),
      fetchShopData(),
      fetchMetafieldDefinitions(),
    ]);

    console.log(`Fetched: ${products.length} products, ${collections.length} collections, ${draftOrders.length} draft orders`);

    // Generate CSV
    const productsCSV = productsToCSV(products);

    // Generate URLs
    const storeDomain = shop.primaryDomain?.host || SHOPIFY_STORE_DOMAIN;
    const urls = generateURLs(products, collections, storeDomain);

    const exportData = {
      export_timestamp: new Date().toISOString(),
      export_duration_ms: Date.now() - startTime,
      summary: {
        total_products: products.length,
        total_variants: products.reduce((acc: number, p: any) => acc + p.variants.length, 0),
        total_collections: collections.length,
        total_draft_orders: draftOrders.length,
        total_metafield_definitions: metafieldDefinitions.length,
        total_urls: urls.length,
      },
      shop,
      products,
      products_csv: productsCSV,
      collections,
      draft_orders: draftOrders,
      metafield_definitions: metafieldDefinitions,
      urls,
    };

    console.log(`Export completed in ${exportData.export_duration_ms}ms`);

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Export error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
