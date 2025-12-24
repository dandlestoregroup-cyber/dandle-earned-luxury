import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { getLovableProduct } from "@/catalog/lovableCatalog";

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

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-lg bg-white shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={heroImage}
          alt={`${product.name} Recliner — ${product.tagline}`}
          className="w-full h-full object-cover object-center"
          style={{ objectPosition: 'center center' }}
          loading="lazy"
        />
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
      <div className="p-6 space-y-4">
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
