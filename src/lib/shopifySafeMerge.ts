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
}

export interface MergedProduct extends LovableProduct {
  commerce: ShopifyCommerceData | null;
}

// Fetch commerce data from Shopify Storefront API
export async function fetchShopifyCommerceData(
  productHandle: string
): Promise<ShopifyCommerceData | null> {
  try {
    const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
    const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;

    if (!storefrontToken || !storeDomain) {
      console.warn("[Shopify] Missing credentials - displaying catalog only");
      return null;
    }

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
        }
      }
    `;

    const response = await fetch(
      `https://${storeDomain}/api/2025-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontToken
        },
        body: JSON.stringify({
          query,
          variables: { handle: productHandle }
        })
      }
    );

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

    return {
      price: firstVariant.price.amount,
      compareAtPrice: firstVariant.compareAtPrice?.amount,
      currencyCode: firstVariant.price.currencyCode,
      availableForSale: firstVariant.availableForSale,
      variants: nodes.map((v: any) => ({
        id: v.id,
        optionValue: v.title,
        price: v.price.amount,
        compareAtPrice: v.compareAtPrice?.amount,
        available: v.availableForSale
      }))
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
