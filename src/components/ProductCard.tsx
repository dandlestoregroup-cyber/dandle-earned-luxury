import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { cn } from "@/lib/utils";
import { productColorImages, getProductColorImage } from "@/data/productColorImages";
import { PALETTE_MAP } from "@/data/palette";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

// Arabic product translations
const productTranslations: Record<string, { name: string; tagline: string }> = {
  relaxmax: { name: "ريلاكس ماكس", tagline: "ملاذك اليومي" },
  comfortplus: { name: "كومفورت بلس", tagline: "استرخاء عميق ومريح" },
  diva: { name: "ديفا", tagline: "حيث يلتقي الأناقة بالراحة" },
  cozycompanion: { name: "كوزي كومبانيون", tagline: "راحة لاثنين" },
  easyup: { name: "إيزي أب", tagline: "اجلس براحة، قوم بسهولة" },
  "easyup-compact": { name: "إيزي أب كومباكت", tagline: "اجلس براحة، قوم بسهولة" },
  worknest: { name: "وورك نست", tagline: "أداء بلا توقف" },
  spacesaver: { name: "سبيس سيفر", tagline: "راحة كبيرة، مساحة صغيرة" },
  "complete-set": { name: "طقم العائلة", tagline: "راحة لكل العائلة" },
};

// Map product color names to palette keys for image lookup
const colorToPaletteKey: Record<string, string> = {
  "Urban Charcoal": "desert-grey",
  "Off White": "alexandria-linen",
  "Elephant Grey": "coastal-fog",
  "Chic Red": "nile-mist",
  "Tan Beige": "amber-sand",
  "Pink Rose": "desert-sage",
  "Sunshine Yellow": "giza-gold",
  "Ocean Blue": "nile-sapphire",
  "Warm Grey": "mocha-taupe",
  "Creamy Beige": "alexandria-linen",
  "Slate Grey": "desert-grey",
  "Espresso Brown": "mocha-taupe",
  "Stone Grey": "coastal-fog",
  "Navy Blue": "blue-nile-denim",
  "Coordinated Styles": "alexandria-linen",
};

// Get hex color for display name
const getColorHex = (colorName: string): string => {
  const paletteKey = colorToPaletteKey[colorName];
  if (paletteKey) {
    const paletteEntry = PALETTE_MAP.get(paletteKey);
    if (paletteEntry) return paletteEntry.hex;
  }
  // Fallback colors
  const fallbackColors: Record<string, string> = {
    "Urban Charcoal": "#3D3D3D",
    "Off White": "#F5F5DC",
    "Elephant Grey": "#8B8B8B",
    "Chic Red": "#C41E3A",
    "Tan Beige": "#D2B48C",
    "Pink Rose": "#E8B4B8",
    "Sunshine Yellow": "#FFD700",
    "Ocean Blue": "#1E4D7B",
    "Warm Grey": "#9B8B7A",
    "Creamy Beige": "#F5E6D3",
    "Slate Grey": "#708090",
    "Espresso Brown": "#4A3728",
    "Stone Grey": "#928E85",
    "Navy Blue": "#1B365D",
    "Coordinated Styles": "#E8DFD1",
  };
  return fallbackColors[colorName] || "#CCC";
};

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const lovableProduct = getLovableProduct(product.id);
  const defaultHeroImage = lovableProduct?.heroImage.src || product.imageUrl;
  
  // Language state
  const [lang, setLang] = useState<LangKey>('en');
  
  useEffect(() => {
    const storedLang = getLangFromStorage();
    setLang(storedLang);
    const interval = setInterval(() => {
      const currentLang = getLangFromStorage();
      setLang(prev => prev !== currentLang ? currentLang : prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  const isArabic = lang === 'ar';
  const translation = productTranslations[product.id];
  
  // State for swatch-based image preview - use product color name
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Use product.colors from product.ts (same as modal)
  const colors = product.colors || [];

  // Determine current display image based on selected color
  const displayImage = useMemo(() => {
    if (selectedColor) {
      const paletteKey = colorToPaletteKey[selectedColor];
      if (paletteKey) {
        const colorImage = getProductColorImage(product.id, paletteKey);
        if (colorImage) return colorImage;
      }
    }
    return defaultHeroImage;
  }, [selectedColor, defaultHeroImage, product.id]);

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

  const handleSwatchClick = (e: React.MouseEvent, colorName: string) => {
    e.stopPropagation(); // Prevent card click
    setSelectedColor(colorName === selectedColor ? null : colorName);
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
          className="w-full h-full object-contain object-center p-1 md:p-2 transition-all duration-300"
          loading="lazy"
        />
      </div>

      {/* Content - larger fonts, bilingual */}
      <div className="p-4 md:p-5 text-center space-y-2 md:space-y-3" dir={isArabic ? 'rtl' : 'ltr'}>
        <h3 className="font-headline text-lg md:text-xl text-charcoal font-semibold leading-tight">
          {isArabic && translation ? translation.name : product.name}
        </h3>
        
        <p className="font-body text-sm md:text-base text-charcoal/70 line-clamp-2">
          {isArabic && translation ? translation.tagline : product.tagline}
        </p>
        
        <div className="font-headline text-lg md:text-2xl leading-tight">
          {getPriceDisplay()}
        </div>

        {/* Clickable color swatches - same colors as modal */}
        {colors.length > 0 && (
          <div className="pt-2 md:pt-3 space-y-1 md:space-y-2">
            <p className="text-xs md:text-sm text-charcoal/50 uppercase tracking-wider font-body hidden md:block">
              {isArabic ? 'الألوان المتاحة' : 'Available Colors'}
            </p>
            <div className="flex justify-center gap-1.5 md:gap-2 flex-wrap">
              {colors.map((colorName) => (
                <button
                  key={colorName}
                  type="button"
                  onClick={(e) => handleSwatchClick(e, colorName)}
                  className={cn(
                    "w-6 h-6 md:w-10 md:h-10 rounded md:rounded-lg border shadow-sm transition-all duration-200",
                    selectedColor === colorName 
                      ? "ring-2 ring-dandle-orange ring-offset-1 border-dandle-orange scale-110" 
                      : "border-charcoal/10 hover:scale-105"
                  )}
                  style={{ backgroundColor: getColorHex(colorName) }}
                  title={colorName}
                  aria-label={`Preview ${colorName} color`}
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