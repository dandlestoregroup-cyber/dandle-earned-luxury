import { useState, useRef } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { products, Product } from "@/types/product";
import { productImageData } from "@/data/productImageData";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Prompt 2B: Scrollable product image gallery with lightbox
const ProductImageGalleryInline = ({ 
  productKey, 
  mainImage, 
  galleryImages = [], 
  altBase 
}: { 
  productKey: string; 
  mainImage: string; 
  galleryImages?: string[]; 
  altBase: string;
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Ensure main image is first, de-dupe
  const images = [mainImage, ...galleryImages].filter((src, idx, arr) => 
    src && arr.indexOf(src) === idx
  );

  const scrollByViewport = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const open = (src: string) => setLightboxSrc(src);
  const close = () => setLightboxSrc(null);

  return (
    <div className="relative w-full overflow-hidden" data-product-gallery={productKey}>
      <div 
        ref={trackRef}
        className="flex gap-2.5 overflow-x-auto scroll-snap-x-mandatory hide-scrollbar py-1 px-0.5"
      >
        {images.map((src, i) => (
          <button
            type="button"
            key={`${productKey}-${i}`}
            className="flex-none w-[120px] md:w-[140px] p-0 border-0 bg-transparent cursor-pointer scroll-snap-start"
            onClick={() => open(src)}
            aria-label={`Open image ${i + 1}`}
          >
            <img
              src={src}
              alt={`${altBase} ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full h-[100px] md:h-[110px] object-cover rounded-lg border border-border hover:scale-103 transition-transform"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </button>
        ))}
      </div>

      {/* Arrows only when scrolling meaningful */}
      {images.length > 4 && (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal/60 text-warm-white flex items-center justify-center hover:bg-charcoal/80 transition-colors z-10"
            onClick={() => scrollByViewport('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal/60 text-warm-white flex items-center justify-center hover:bg-charcoal/80 transition-colors z-10"
            onClick={() => scrollByViewport('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="fixed inset-0 bg-charcoal/85 z-[9999] flex flex-col gap-4 p-5" role="dialog" aria-modal="true">
          <button
            type="button"
            className="self-end w-10 h-10 rounded-full bg-warm-white/15 text-warm-white flex items-center justify-center hover:bg-warm-white/25"
            aria-label="Close"
            onClick={close}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center justify-center" onClick={close}>
            <img
              src={lightboxSrc}
              alt="Preview"
              className="max-w-[min(1100px,92vw)] max-h-[78vh] rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <a
            className="text-warm-white/90 underline text-center"
            href={lightboxSrc}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in new tab
          </a>
        </div>
      )}
    </div>
  );
};

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

  return (
    <section id="collection" className="bg-warm-beige py-16 md:py-24 px-4 md:px-6 text-center">
      <h2 className="font-headline text-2xl md:text-5xl mb-8 md:mb-12 text-charcoal">
        Our Collection
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-screen-xl mx-auto">
        {products.map((product) => {
          const imageData = productImageData[product.id];
          return (
            <div key={product.id} className="space-y-2 md:space-y-3">
              <ProductCard
                product={product}
                onClick={() => handleProductClick(product)}
              />
              {/* Gallery below each card - hidden on mobile for compact view */}
              {imageData && imageData.galleryImages.length > 0 && (
                <div className="hidden md:block">
                  <ProductImageGalleryInline
                    productKey={product.id}
                    mainImage={imageData.mainImage}
                    galleryImages={imageData.galleryImages}
                    altBase={product.name}
                  />
                </div>
              )}
            </div>
          );
        })}
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
