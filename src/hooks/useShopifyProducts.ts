import { useQuery } from "@tanstack/react-query";
import { fetchShopifyProducts, ShopifyProduct } from "@/lib/shopify";
import { Product } from "@/types/product";

export const useShopifyProducts = () => {
  return useQuery({
    queryKey: ['shopify-products'],
    queryFn: async () => {
      const shopifyProducts = await fetchShopifyProducts();
      
      // Transform Shopify products to match our Product interface
      const products: Product[] = shopifyProducts.map((product: ShopifyProduct) => {
        const { node } = product;
        const price = parseFloat(node.priceRange.minVariantPrice.amount);
        const imageUrl = node.images.edges[0]?.node.url || '/placeholder.svg';
        
        // Extract colors from variants if they exist
        const colors = node.variants.edges
          .map(v => v.node.selectedOptions.find(opt => opt.name.toLowerCase() === 'color')?.value)
          .filter((color, index, self) => color && self.indexOf(color) === index) as string[];

        return {
          id: node.handle,
          shopifyId: node.id,
          name: node.title,
          tagline: node.description.substring(0, 100) || "Luxury Recliner",
          price,
          imageUrl,
          colors: colors.length > 0 ? colors : undefined,
          features: ["Premium Comfort", "Elegant Design"],
          targetAudience: "Luxury Seekers",
          variants: node.variants.edges,
          options: node.options,
        };
      });
      
      return products;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
