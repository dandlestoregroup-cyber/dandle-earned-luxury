import { useState, useMemo } from "react";
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
  const defaultHeroImage = lovableProduct?.heroImage.src || product.imageUrl;
  
  // State for swatch-based image preview
  const [selectedSwatchKey, setSelectedSwatchKey] = useState<string | null>(null);
  
  // Get product-specific swatches (first 5 for card display)
  const swatchKeys = (productSwatches[product.id] || []).slice(0, 5);
  const swatches = useMemo(() => 
    swatchKeys.map(key => PALETTE_MAP.get(key)).filter(Boolean),
    [product.id]
  );

  // Determine current display image based on selected swatch
  const displayImage = useMemo(() => {
    if (!selectedSwatchKey) return defaultHeroImage;
    // For now, return default - in future this could map to swatch-specific images
    return defaultHeroImage;
  }, [selectedSwatchKey, defaultHeroImage]);

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

  const handleSwatchClick = (e: React.MouseEvent, swatchKey: string) => {
    e.stopPropagation(); // Prevent card click
    setSelectedSwatchKey(swatchKey === selectedSwatchKey ? null : swatchKey);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer bg-warm-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      onClick={onClick}
    >
      {/* Image - 4:5 mobile, 4:3 heritage set */}
      <div className={cn(
        "relative bg-gradient-to-b from-warm-beige/30 to-warm-white",
        isHeritageSet ? "aspect-[4/3]" : "aspect-[4/5]"
      )}>
        <img
          src={displayImage}
          alt={`Dandle ${product.name}`}
          className="w-full h-full object-contain object-center p-1 md:p-2"
          loading="lazy"
        />
      </div>

      {/* Content - compact mobile */}
      <div className="p-2 md:p-4 text-center space-y-1 md:space-y-2">
        <h3 className="font-headline text-sm md:text-lg text-charcoal font-semibold leading-tight">
          Dandle {product.name}
        </h3>
        
        <p className="font-body text-[10px] md:text-sm text-charcoal/70 line-clamp-2">
          {product.tagline}
        </p>
        
        <div className="font-headline text-sm md:text-xl leading-tight">
          {getPriceDisplay()}
        </div>

        {/* Clickable color swatches */}
        {swatches.length > 0 && (
          <div className="pt-1 md:pt-2 space-y-0.5 md:space-y-1">
            <p className="text-[8px] md:text-xs text-charcoal/50 uppercase tracking-wider font-body hidden md:block">
              Available Colors
            </p>
            <div className="flex justify-center gap-1 md:gap-2">
              {swatches.map((swatch) => (
                <button
                  key={swatch!.key}
                  type="button"
                  onClick={(e) => handleSwatchClick(e, swatch!.key)}
                  className={cn(
                    "w-5 h-5 md:w-10 md:h-10 rounded md:rounded-lg border shadow-sm transition-all duration-200",
                    selectedSwatchKey === swatch!.key 
                      ? "ring-2 ring-dandle-orange ring-offset-1 border-dandle-orange scale-110" 
                      : "border-charcoal/10 hover:scale-105"
                  )}
                  style={{ backgroundColor: swatch!.hex }}
                  title={swatch!.nameEn}
                  aria-label={`Preview ${swatch!.nameEn} color`}
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
