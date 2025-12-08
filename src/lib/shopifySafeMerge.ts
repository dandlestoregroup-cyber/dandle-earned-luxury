// Shopify Safe Merge Layer
// Fetches ONLY commerce data (price, availability, variant IDs)
// NEVER touches media/images - Lovable catalog controls all visuals

import { LovableProduct } from "@/catalog/lovableCatalog";

export interface ShopifyCommerceData {
  price: string;
  compareAtPrice?: string;
  currencyCode: string;
  availableForSale: boolean;
  variants: Array<{
    id: string;
    optionValue: string;
    price: string;
    compareAtPrice?: string;
    available: boolean;
  }>;
  metafields?: {
    leadTime?: string;
    warranty?: string;
    capacity?: string;
    madeIn?: string;
    mechanismOrigin?: string;
    frameWood?: string;
    foamType?: string;
    features?: string[];
  };
}

export interface MergedProduct extends LovableProduct {
  commerce: ShopifyCommerceData | null;
}

// Shopify configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'dandle-earned-luxury-qbrhm.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '40c01ef6931b927cffd64a795e61563b';

// Fetch commerce data from Shopify Storefront API
export async function fetchShopifyCommerceData(
  productHandle: string
): Promise<ShopifyCommerceData | null> {
  try {
    const query = `
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          variants(first: 20) {
            nodes {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
            }
          }
          leadTime: metafield(namespace: "production", key: "lead_time_days") {
            value
          }
          warranty: metafield(namespace: "production", key: "warranty_years") {
            value
          }
          capacity: metafield(namespace: "production", key: "batch_capacity") {
            value
          }
          madeIn: metafield(namespace: "production", key: "made_in_country") {
            value
          }
          mechanismOrigin: metafield(namespace: "production", key: "mechanism_origin") {
            value
          }
          frameWood: metafield(namespace: "production", key: "frame_wood") {
            value
          }
          foamType: metafield(namespace: "production", key: "foam_type") {
            value
          }
          features: metafield(namespace: "attributes", key: "features_short") {
            value
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({
        query,
        variables: { handle: productHandle }
      })
    });

    if (!response.ok) {
      throw new Error(`Shopify API returned ${response.status}`);
    }

    const data = await response.json();
    const shopifyProduct = data?.data?.product;

    if (!shopifyProduct?.variants?.nodes?.length) {
      console.warn(`[Shopify] No variants found for ${productHandle}`);
      return null;
    }

    const nodes = shopifyProduct.variants.nodes;
    const firstVariant = nodes[0];

    // Parse metafields
    const metafields: ShopifyCommerceData['metafields'] = {};
    if (shopifyProduct.leadTime?.value) metafields.leadTime = shopifyProduct.leadTime.value;
    if (shopifyProduct.warranty?.value) metafields.warranty = shopifyProduct.warranty.value;
    if (shopifyProduct.capacity?.value) metafields.capacity = shopifyProduct.capacity.value;
    if (shopifyProduct.madeIn?.value) metafields.madeIn = shopifyProduct.madeIn.value;
    if (shopifyProduct.mechanismOrigin?.value) metafields.mechanismOrigin = shopifyProduct.mechanismOrigin.value;
    if (shopifyProduct.frameWood?.value) metafields.frameWood = shopifyProduct.frameWood.value;
    if (shopifyProduct.foamType?.value) metafields.foamType = shopifyProduct.foamType.value;
    
    // Parse features (might be JSON array or comma-separated)
    if (shopifyProduct.features?.value) {
      try {
        metafields.features = JSON.parse(shopifyProduct.features.value);
      } catch {
        metafields.features = shopifyProduct.features.value.split(',').map((f: string) => f.trim());
      }
    }

    return {
      price: firstVariant.price.amount,
      compareAtPrice: firstVariant.compareAtPrice?.amount,
      currencyCode: firstVariant.price.currencyCode,
      availableForSale: firstVariant.availableForSale,
      variants: nodes.map((v: { id: string; title: string; price: { amount: string }; compareAtPrice?: { amount: string }; availableForSale: boolean }) => ({
        id: v.id,
        optionValue: v.title,
        price: v.price.amount,
        compareAtPrice: v.compareAtPrice?.amount,
        available: v.availableForSale
      })),
      metafields: Object.keys(metafields).length > 0 ? metafields : undefined
    };
  } catch (error) {
    console.error(`[Shopify] Failed to fetch ${productHandle}:`, error);
    // Fail-open: return null instead of throwing
    return null;
  }
}

// Merge Lovable visuals (master) with Shopify commerce (plugin)
export function mergeWithShopify(
  lovableProduct: LovableProduct,
  shopifyData: ShopifyCommerceData | null
): MergedProduct {
  return {
    ...lovableProduct,
    commerce: shopifyData
  };
}

// Format price for display
export function formatPrice(
  amount: string | number,
  currencyCode: string = "EGP"
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
}
