import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { products, Product } from "@/types/product";
import { motion } from "framer-motion";

const ProductGallery = () => {
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


  // All products in order per spec
  const featuredOrder = [
    "relaxmax",
    "easyup",
    "easyup-compact",
    "comfortplus",
    "diva",
    "spacesaver",
    "worknest",
    "cozycompanion",
    "complete-set",
  ] as const;

  const featuredProducts = featuredOrder
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return (
    <section className="bg-cream py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              <ProductCard
                product={product}
                onClick={() => handleProductClick(product)}
              />
            </motion.div>
          ))}
        </div>
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

export default ProductGallery;
