import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { formatShopifyPrice } from "@/hooks/useShopifyProducts";

interface ShopifyData {
  minPrice: number;
  maxPrice: number;
  currencyCode: string;
  availableForSale: boolean;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    available: boolean;
  }>;
}

interface ProductCardProps {
  product: Product;
  shopifyData?: ShopifyData | null;
  onClick: () => void;
}

const ProductCard = ({ product, shopifyData, onClick }: ProductCardProps) => {
  // Try to load hero image from Lovable catalog (master)
  const lovableProduct = getLovableProduct(product.id);
  const heroImage = lovableProduct?.heroImage.src || product.imageUrl;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPriceDisplay = () => {
    // Use live Shopify data if available
    if (shopifyData) {
      if (shopifyData.minPrice === shopifyData.maxPrice) {
        return formatShopifyPrice(shopifyData.minPrice, shopifyData.currencyCode);
      }
      return `${formatShopifyPrice(shopifyData.minPrice, shopifyData.currencyCode)} - ${formatShopifyPrice(shopifyData.maxPrice, shopifyData.currencyCode)}`;
    }
    
    // Fallback to static data
    if (product.comingSoon) return "Notify Me";
    if (product.priceManual && product.pricePower) {
      return `${formatPrice(product.priceManual)} - ${formatPrice(product.pricePower)}`;
    }
    return product.price ? formatPrice(product.price) : "Contact for Price";
  };

  const isAvailable = shopifyData ? shopifyData.availableForSale : !product.comingSoon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-lg bg-card shadow-subtle cursor-pointer group"
      onClick={onClick}
    >
      {/* Product Image - CONTAINED with clear boundaries */}
      <div className="relative w-full bg-muted/50 border-b border-border/40 shadow-inner" style={{ aspectRatio: '4/5' }}>
        <img
          src={heroImage}
          alt={`${product.name} Recliner — ${product.tagline}`}
          className="absolute inset-0 w-full h-full object-contain p-6 max-w-full max-h-full"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium px-4 py-2 bg-black/70 rounded-md text-sm">
              Coming Soon
            </span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-5 space-y-3">
        <h3 className="font-headline text-xl text-foreground">
          {product.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground line-clamp-1">
          {product.tagline}
        </p>
        <p className="font-body text-lg font-medium text-foreground">
          {getPriceDisplay()}
        </p>
        {product.colors && (
          <div className="flex gap-2">
            {product.colors.slice(0, 4).map((color, idx) => (
              <button
                key={idx}
                className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center font-body text-xs text-muted-foreground hover:border-bronze transition-colors min-w-[32px] min-h-[32px]"
                onClick={(e) => e.stopPropagation()}
              >
                {color.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <button className="w-full py-3 rounded-md bg-bronze text-white font-body font-medium hover:bg-bronze/90 transition-colors min-h-[48px]">
          Customize Now
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
