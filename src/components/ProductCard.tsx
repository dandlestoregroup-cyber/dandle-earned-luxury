import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Product } from "@/types/product";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  // Try to load hero image from Lovable catalog (master)
  const lovableProduct = getLovableProduct(product.id);
  const heroImage = lovableProduct?.heroImage.src || product.imageUrl;
  
  // Get total image count (hero + gallery)
  const totalImages = lovableProduct 
    ? 1 + (lovableProduct.gallery?.length || 0) 
    : 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPriceDisplay = () => {
    if (product.comingSoon) return "Notify Me";
    if (product.priceManual && product.pricePower) {
      return `${formatPrice(product.priceManual)} - ${formatPrice(product.pricePower)}`;
    }
    return product.price ? formatPrice(product.price) : "Contact for Price";
  };

  // Heritage Set uses 3:2 aspect ratio, others use square
  const isHeritageSet = product.id === "complete-set";

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-2xl cursor-pointer transition-shadow duration-300"
      onClick={onClick}
    >
      {/* Image container with orange frame */}
      <div className={cn(
        "relative overflow-hidden bg-white border-4 border-dandle-orange rounded-t-lg",
        isHeritageSet ? "aspect-[3/2]" : "aspect-square"
      )}>
        <img
          src={heroImage}
          alt={`${product.name} Recliner — ${product.tagline}`}
          className="w-full h-full object-contain object-center p-2 transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Quick View overlay button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-6 py-3 bg-charcoal/90 text-warm-white font-body text-sm rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-dandle-orange flex items-center gap-2 backdrop-blur-sm">
            <Eye className="w-4 h-4" />
            Quick View
          </span>
        </div>
        {/* Gallery image count badge */}
        {totalImages > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-charcoal/70 backdrop-blur-sm">
            <svg className="w-3 h-3 text-warm-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-body text-warm-white">{totalImages}</span>
          </div>
        )}
      </div>
      {/* Text section with separator */}
      <div className="p-6 space-y-4 bg-white border-t-2 border-warm-beige">
        <h3 className="font-headline text-2xl md:text-3xl text-charcoal">
          {product.name}
        </h3>
        <p className="font-body text-lg text-dandle-orange">
          {product.tagline}
        </p>
        <p className="font-headline text-2xl text-dandle-orange">
          {getPriceDisplay()}
        </p>
        {product.colors && (
          <div className="flex gap-3">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                className="w-12 h-12 rounded-full border-2 border-warm-beige bg-warm-white flex items-center justify-center font-body text-charcoal/60 hover:border-dandle-orange transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {color.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <button className="w-full py-3 rounded-md bg-gradient-to-r from-warm-beige to-bronze/30 text-charcoal font-body text-lg hover:from-bronze/40 hover:to-warm-beige transition-all">
          Customize Now
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
