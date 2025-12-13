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
    <section id="collection" className="bg-warm-beige py-24 px-6 text-center">
      <h2 className="font-headline text-3xl md:text-5xl mb-12 text-charcoal">
        Our Collection
      </h2>
      
      {loading && (
        <div className="grid md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-destructive bg-destructive/10 p-4 rounded-lg max-w-md mx-auto mb-8">
          <p>Unable to load live pricing. Showing catalog prices.</p>
        </div>
      )}
      
      {!loading && (
        <div className="grid md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
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

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default ProductGallery;
