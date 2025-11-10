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

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-lg bg-warm-white shadow-subtle cursor-pointer"
      onClick={onClick}
    >
      <img
        src={product.imageUrl}
        alt={`Dandle ${product.name} Recliner — ${product.tagline}`}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-4 left-4 right-4 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <p className="font-headline text-xl">{product.name}</p>
        <p className="font-body text-sm opacity-90">{product.tagline}</p>
        <p className="font-body text-sm mt-1">{getPriceDisplay()}</p>
        <p className="mt-2 font-headline text-base">
          {product.comingSoon ? "Coming Soon" : "Customize · View in AR"}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
