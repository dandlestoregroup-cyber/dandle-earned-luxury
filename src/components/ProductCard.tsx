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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-sm bg-background shadow-subtle cursor-pointer relative border border-border hover:border-primary/40"
      onClick={onClick}
    >
      <div className="w-full aspect-[4/3] overflow-hidden">
        <img
          src={`${product.imageUrl}?quality=80`}
          alt=""
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="p-6 space-y-3">
        <h3 className="font-headline text-xl md:text-2xl text-foreground font-normal">
          {product.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground font-normal">
          {getPriceDisplay()}
        </p>
        {product.colors && (
          <div className="flex gap-2">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center font-body text-xs text-muted-foreground hover:border-primary transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
                aria-label={color}
              >
                {color.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
