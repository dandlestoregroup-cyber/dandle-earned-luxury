import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { cn } from "@/lib/utils";
import { productSwatches } from "@/data/productSwatches";
import { PALETTE_MAP } from "@/data/palette";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const lovableProduct = getLovableProduct(product.id);
  const heroImage = lovableProduct?.heroImage.src || product.imageUrl;
  
  // Get product-specific swatches (first 5 for card display)
  const swatchKeys = (productSwatches[product.id] || []).slice(0, 5);
  const swatches = swatchKeys
    .map(key => PALETTE_MAP.get(key))
    .filter(Boolean);

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
      return (
        <>
          <span className="text-dandle-orange">{formatPrice(product.priceManual)} -</span>
          <br />
          <span className="text-dandle-orange">{formatPrice(product.pricePower)}</span>
        </>
      );
    }
    return product.price ? formatPrice(product.price) : "Contact for Price";
  };

  const isHeritageSet = product.id === "complete-set";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer bg-warm-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      onClick={onClick}
    >
      {/* Image - compact square aspect with soft background */}
      <div className={cn(
        "relative bg-gradient-to-b from-warm-beige/30 to-warm-white",
        isHeritageSet ? "aspect-[4/3]" : "aspect-square"
      )}>
        <img
          src={heroImage}
          alt={`Dandle ${product.name}`}
          className="w-full h-full object-contain object-center p-2"
          loading="lazy"
        />
      </div>

      {/* Content - centered, compact */}
      <div className="p-3 md:p-4 text-center space-y-2">
        <h3 className="font-headline text-base md:text-lg text-charcoal font-semibold">
          Dandle {product.name}
        </h3>
        
        <p className="font-body text-xs md:text-sm text-charcoal/70">
          {product.tagline}
        </p>
        
        <div className="font-headline text-lg md:text-xl leading-tight">
          {getPriceDisplay()}
        </div>

        {/* Color swatches - rounded squares like reference */}
        {swatches.length > 0 && (
          <div className="pt-2 space-y-1">
            <p className="text-[10px] md:text-xs text-charcoal/50 uppercase tracking-wider font-body">
              Available Colors
            </p>
            <div className="flex justify-center gap-2">
              {swatches.map((swatch) => (
                <div
                  key={swatch!.key}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-charcoal/10 shadow-sm"
                  style={{ backgroundColor: swatch!.hex }}
                  title={swatch!.nameEn}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
