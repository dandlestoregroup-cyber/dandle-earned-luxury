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

// Map product color names to palette keys
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

const getColorHex = (colorName: string): string => {
  const paletteKey = colorToPaletteKey[colorName];
  if (paletteKey) {
    const paletteEntry = PALETTE_MAP.get(paletteKey);
    if (paletteEntry) return paletteEntry.hex;
  }
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
  
  const [lang, setLang] = useState<LangKey>('en');
  const [isHovered, setIsHovered] = useState(false);
  
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
  
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const colors = product.colors || [];

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
      return `${formatPrice(product.priceManual)} — ${formatPrice(product.pricePower)}`;
    }
    return product.price ? formatPrice(product.price) : "Contact for Price";
  };

  const handleSwatchClick = (e: React.MouseEvent, colorName: string) => {
    e.stopPropagation();
    setSelectedColor(colorName === selectedColor ? null : colorName);
  };

  return (
    <motion.div
      className="group relative cursor-pointer bg-cream overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-cream to-warm-beige/30">
        <motion.img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain object-center"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Hover Content */}
        <motion.div 
          className="absolute inset-0 flex flex-col justify-end p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="font-headline text-2xl text-warm-white font-light mb-1">
            {isArabic && translation ? translation.name : product.name}
          </h3>
          <p className="font-body text-champagne text-xs tracking-[0.15em] uppercase mb-3">
            {isArabic && translation ? translation.tagline : product.tagline}
          </p>
          <p className="font-body text-warm-white/80 text-lg">
            {getPriceDisplay()}
          </p>
        </motion.div>
        
        {/* Swatches - Top Right */}
        {colors.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {colors.slice(0, 4).map((colorName) => (
              <button
                key={colorName}
                type="button"
                onClick={(e) => handleSwatchClick(e, colorName)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 shadow-lg transition-all duration-200",
                  selectedColor === colorName 
                    ? "border-champagne scale-110 ring-2 ring-champagne/50" 
                    : "border-white/50 hover:border-white hover:scale-105"
                )}
                style={{ backgroundColor: getColorHex(colorName) }}
                title={colorName}
                aria-label={`Preview ${colorName}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Static Info (visible when not hovering) */}
      <motion.div 
        className="p-5 text-center"
        dir={isArabic ? 'rtl' : 'ltr'}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="font-headline text-lg text-charcoal font-medium mb-1">
          {isArabic && translation ? translation.name : product.name}
        </h3>
        <p className="font-body text-sm text-charcoal/60 mb-2">
          {isArabic && translation ? translation.tagline : product.tagline}
        </p>
        <p className="font-headline text-lg text-charcoal">
          {getPriceDisplay()}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
