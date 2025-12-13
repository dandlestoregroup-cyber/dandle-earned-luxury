import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { products, Product } from "@/types/product";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Skeleton } from "@/components/ui/skeleton";

const ProductGallery = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch live Shopify data
  const { shopifyProducts, loading, error, getShopifyProduct } = useShopifyProducts();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // Get Shopify data for a static product by matching handle/id
  const getShopifyData = (productId: string) => {
    const shopifyProduct = getShopifyProduct(productId);
    if (!shopifyProduct) return null;
    
    const { node } = shopifyProduct;
    return {
      minPrice: parseFloat(node.priceRange.minVariantPrice.amount),
      maxPrice: parseFloat(node.priceRange.maxVariantPrice.amount),
      currencyCode: node.priceRange.minVariantPrice.currencyCode,
      availableForSale: node.availableForSale,
      variants: node.variants.edges.map(v => ({
        id: v.node.id,
        title: v.node.title,
        price: parseFloat(v.node.price.amount),
        available: v.node.availableForSale,
      })),
    };
  };

  return (
    <section id="collection" className="bg-background py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl md:text-4xl text-foreground mb-3">
            Our Collection
          </h2>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Handcrafted in Cairo, designed for earned luxury
          </p>
        </div>
        
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/9] w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-destructive bg-destructive/10 p-4 rounded-lg max-w-md mx-auto mb-8">
            <p className="text-sm">Unable to load live pricing. Showing catalog prices.</p>
          </div>
        )}
        
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                shopifyData={getShopifyData(product.id)}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default ProductGallery;
