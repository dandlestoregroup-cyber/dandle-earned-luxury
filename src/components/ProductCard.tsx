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
    if (product.comingSoon) return null;
    if (product.priceManual && product.pricePower) {
      return `${formatPrice(product.priceManual)} — ${formatPrice(product.pricePower)}`;
    }
    return product.price ? formatPrice(product.price) : "Contact for Price";
  };

  const handleSwatchClick = (e: React.MouseEvent, colorName: string) => {
    e.stopPropagation();
    setSelectedColor(colorName === selectedColor ? null : colorName);
  };

  // WhatsApp notification for ComingSoon products
  const handleCardClick = () => {
    if (product.comingSoon) {
      const productName = isArabic && translation ? translation.name : product.name;
      const message = `ممكن تنبهوني أول ما ${productName} يبقى متاح؟`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/201222804255?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    } else {
      onClick();
    }
  };

  const displayName = isArabic && translation ? translation.name : product.name;
  const displayTagline = isArabic && translation ? translation.tagline : product.tagline;

  return (
    <motion.div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-sm",
        "bg-cream transition-shadow duration-200"
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 16px -8px rgba(0, 0, 0, 0.1)' 
          : '0 4px 12px -4px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out'
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-cream to-warm-beige/30">
        {/* Product Image with zoom */}
        <motion.img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain object-center"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
        />
        
        {/* Bottom gradient overlay - fades in on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
        
        {/* ComingSoon Badge */}
        {product.comingSoon && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block bg-champagne/90 text-obsidian px-3 py-1.5 text-xs font-medium tracking-wide rounded-sm shadow-md">
              قريباً - اضغط للإشعار
            </span>
          </div>
        )}
        
        {/* Hover Content - Text reveal */}
        <motion.div 
          className="absolute inset-0 flex flex-col justify-end p-5"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* Tagline */}
          <motion.p 
            className="font-body text-champagne text-[10px] tracking-[0.2em] uppercase mb-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 12 
            }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {displayTagline}
          </motion.p>
          
          {/* Product Name */}
          <motion.h3 
            className="font-headline text-xl md:text-2xl text-warm-white font-semibold mb-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 15 
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {displayName}
          </motion.h3>
          
          {/* Price or WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 10 
            }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            {product.comingSoon ? (
              <span className="inline-flex items-center gap-2 text-warm-white/90 text-sm font-medium border border-champagne/40 px-4 py-2 rounded-sm hover:bg-champagne/10 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                إشعار على واتساب
              </span>
            ) : (
              <p className="font-body text-warm-white/90 text-lg font-medium">
                {getPriceDisplay()}
              </p>
            )}
          </motion.div>
        </motion.div>
        
        {/* Swatches - Top Right */}
        {colors.length > 0 && !product.comingSoon && (
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
        className="p-4 md:p-5 text-center"
        dir={isArabic ? 'rtl' : 'ltr'}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="font-headline text-base md:text-lg text-charcoal font-semibold mb-0.5">
          {displayName}
        </h3>
        <p className="font-body text-[11px] md:text-xs text-charcoal/60 tracking-[0.1em] uppercase mb-2">
          {displayTagline}
        </p>
        {product.comingSoon ? (
          <p className="font-body text-sm text-champagne-dark font-medium">
            قريباً
          </p>
        ) : (
          <p className="font-headline text-base md:text-lg text-charcoal font-medium">
            {getPriceDisplay()}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
