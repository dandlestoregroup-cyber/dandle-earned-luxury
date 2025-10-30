import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import NourCard from "./NourCard";
import NourModal from "./NourModal";
import { products, Product } from "@/types/product";

const ProductCollection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [nourModalOpen, setNourModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIX: Auto-open Nour on first visit + pre-load resources
  useEffect(() => {
    // 1. Auto-open Nour modal on first visit
    const hasVisited = sessionStorage.getItem('nour-visited');
    if (!hasVisited) {
      setTimeout(() => {
        setNourModalOpen(true);
        sessionStorage.setItem('nour-visited', '1');
      }, 1500); // Wait 1.5s after page load for smooth entry
    }

    // 2. Pre-load ColorThief library
    import('colorthief').then(() => {
      console.log('🎨 ColorThief ready');
    }).catch((error) => {
      console.log('ColorThief pre-load skipped:', error);
    });

    // 3. Warm the model cache silently
    if ('caches' in window) {
      caches.open('nour-v1').then((cache) => {
        cache.add('/models/nanobanana-flash-2.5.safetensors').catch(() => {
          console.log('Model cache warming skipped (file may not exist yet)');
        });
      });
    }
  }, []);

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

        {/* Product Grid with Nour Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="animate-fade-in-up">
            <NourCard onClick={() => setNourModalOpen(true)} />
          </div>
          {products.slice(0, 2).map((product, index) => (
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

      {/* Nour Modal */}
      <NourModal
        open={nourModalOpen}
        onOpenChange={setNourModalOpen}
      />
    </section>
  );
};

export default ProductCollection;
