import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWishlistStore, WishlistItem } from "@/stores/wishlistStore";

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    type?: string;
    fabric?: string;
    color?: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

const WishlistButton = ({ product, className, size = "md" }: WishlistButtonProps) => {
  const { isInWishlist, openModal } = useWishlistStore();
  const isSaved = isInWishlist(product.id);
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isSaved) return; // Already saved, no action needed
    
    const wishlistItem: WishlistItem = {
      productId: product.id,
      productName: product.name,
      productType: product.type,
      productFabric: product.fabric,
      productColor: product.color,
      addedAt: new Date().toISOString(),
    };
    
    openModal(wishlistItem);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-300",
        "bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl",
        "border border-champagne/30",
        sizeClasses[size],
        isSaved && "bg-dandle-orange/10 border-dandle-orange",
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isSaved ? "Saved to wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-colors duration-300",
          isSaved 
            ? "fill-dandle-orange text-dandle-orange" 
            : "text-charcoal/60 hover:text-dandle-orange"
        )}
      />
    </motion.button>
  );
};

export default WishlistButton;
