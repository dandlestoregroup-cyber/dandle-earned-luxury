import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { Product } from "@/types/product";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Loader2 } from "lucide-react";

const ProductGallery = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: products, isLoading, error } = useShopifyProducts();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <section id="collection" className="bg-warm-beige py-24 px-6 text-center">
      <h2 className="font-headline text-3xl md:text-5xl mb-12 text-charcoal">
        Our Collection
      </h2>
      
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-dandle-orange" />
        </div>
      )}
      
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load products. Please try again.</p>
        </div>
      )}
      
      {products && products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
      
      {products && products.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
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
