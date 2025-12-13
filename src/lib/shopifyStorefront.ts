// Shopify Storefront API client
// Single source of truth for all Shopify API calls

import { toast } from "sonner";

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'dandle-earned-luxury-qbrhm.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '40c01ef6931b927cffd64a795e61563b';

export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

export interface ShopifyProduct {
  node: ShopifyProductNode;
}

// Storefront API helper function
async function storefrontApiRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({ query, variables }),
    });

    if (response.status === 402) {
      toast.error("Shopify: Payment required", {
        description: "Shopify API access requires an active billing plan."
      });
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Shopify API error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    return data;
  } catch (error) {
    console.error('[Shopify] API request failed:', error);
    return null;
  }
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
      leadTime: metafield(namespace: "production", key: "lead_time_days") {
        value
      }
      warranty: metafield(namespace: "production", key: "warranty_years") {
        value
      }
    }
  }
`;

interface ProductsResponse {
  data: {
    products: {
      edges: ShopifyProduct[];
    };
  };
}

interface ProductByHandleResponse {
  data: {
    product: ShopifyProductNode & {
      leadTime?: { value: string };
      warranty?: { value: string };
    };
  };
}

export async function fetchProducts(first: number = 20): Promise<ShopifyProduct[]> {
  const result = await storefrontApiRequest<ProductsResponse>(PRODUCTS_QUERY, { first });
  return result?.data?.products?.edges ?? [];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProductNode | null> {
  const result = await storefrontApiRequest<ProductByHandleResponse>(PRODUCT_BY_HANDLE_QUERY, { handle });
  return result?.data?.product ?? null;
}

export function formatPrice(amount: string | number, currencyCode: string = "EGP"): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
}

export function getPriceRange(product: ShopifyProductNode): string {
  const min = parseFloat(product.priceRange.minVariantPrice.amount);
  const max = parseFloat(product.priceRange.maxVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;
  
  if (min === max) {
    return formatPrice(min, currency);
  }
  return `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`;
}
