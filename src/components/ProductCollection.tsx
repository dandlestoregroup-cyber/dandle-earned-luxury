import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { products, Product } from "@/types/product";

const ProductCollection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <section id="collection" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each Dandle recliner is crafted to embody earned luxury—designed
            for those who value quality, comfort, and sophistication.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <ProductCard
                product={product}
                onClick={() => handleProductClick(product)}
              />
            </div>
          ))}
        </div>

        {/* More Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(2, 5).map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <ProductCard
                product={product}
                onClick={() => handleProductClick(product)}
              />
            </div>
          ))}
        </div>

        {/* View More */}
        {products.length > 5 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              + {products.length - 5} more products in our collection
            </p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default ProductCollection;
