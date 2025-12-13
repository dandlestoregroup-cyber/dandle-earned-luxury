import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Shopify API config
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'dandle-earned-luxury-qbrhm.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '40c01ef6931b927cffd64a795e61563b';

export interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
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
      };
    }>;
  };
  tags: string[];
  availableForSale: boolean;
}

export interface ShopifyProduct {
  node: ShopifyProductNode;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
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
              }
            }
          }
          tags
          availableForSale
        }
      }
    }
  }
`;

async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs an active Shopify billing plan.",
    });
    throw new Error('Shopify billing required');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Shopify API error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

interface UseShopifyProductsResult {
  shopifyProducts: ShopifyProduct[];
  loading: boolean;
  error: string | null;
  getShopifyProduct: (handle: string) => ShopifyProduct | undefined;
}

export function useShopifyProducts(limit = 20): UseShopifyProductsResult {
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: limit });
        const products: ShopifyProduct[] = data.data.products.edges;
        
        setShopifyProducts(products);
      } catch (err) {
        console.error('Error fetching Shopify products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [limit]);

  const getShopifyProduct = (handle: string): ShopifyProduct | undefined => {
    return shopifyProducts.find(p => p.node.handle === handle);
  };

  return { shopifyProducts, loading, error, getShopifyProduct };
}

// Helper to format price
export function formatShopifyPrice(amount: string | number, currencyCode: string = 'EGP'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(numericAmount);
}
