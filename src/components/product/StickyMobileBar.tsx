import { ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEGP } from "@/data/productDetails";

interface StickyMobileBarProps {
  productName: string;
  variantName: string;
  price: number;
  onAddToCart: () => void;
  isVisible: boolean;
}

export const StickyMobileBar = ({ 
  productName, 
  variantName, 
  price, 
  onAddToCart,
  isVisible 
}: StickyMobileBarProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-50 md:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate text-sm">{productName}</p>
          <p className="text-xs text-muted-foreground truncate">{variantName}</p>
          <p className="font-headline text-lg text-foreground">{formatEGP(price)}</p>
        </div>
        <Button 
          onClick={onAddToCart}
          className="bg-bronze hover:bg-bronze/90 text-white px-6 flex-shrink-0"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
