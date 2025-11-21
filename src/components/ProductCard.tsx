import { motion } from "framer-motion";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
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

  const isBundle = product.name.toLowerCase().includes('complete set') || 
                   product.name.toLowerCase().includes('bundle');

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className={`overflow-hidden rounded-lg bg-white shadow-lg cursor-pointer relative ${
        isBundle ? 'ring-2 ring-dandle-orange/50' : ''
      }`}
      onClick={onClick}
    >
      {isBundle && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-dandle-orange to-bronze px-3 py-1 rounded-full shadow-lg">
            <span className="text-white font-headline text-sm font-semibold">
              Bundle Deal
            </span>
          </div>
        </div>
      )}
      <div className="w-full aspect-[4/3] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={`${product.name} Recliner — ${product.tagline}`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
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
