import { useState, useMemo, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Product } from "@/types/product";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { cn } from "@/lib/utils";
import { productColorImages, getProductColorImage } from "@/data/productColorImages";
import { PALETTE_MAP } from "@/data/palette";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";
import WishlistButton from "@/components/WishlistButton";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const lovableProduct = getLovableProduct(product.id);
  const defaultHeroImage = lovableProduct?.heroImage.src || product.imageUrl;
  const defaultHeroFallback = lovableProduct?.heroImage.fallbackSrc || product.imageUrl;
  
  const [lang, setLang] = useState<LangKey>('en');
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSwatchIndex, setHoveredSwatchIndex] = useState<number | null>(null);
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  
  // 3D Tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // Cursor position for custom cursor
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
    
    // Update custom cursor position
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowCustomCursor(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowCustomCursor(false);
    mouseX.set(0);
    mouseY.set(0);
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

  // Animation variants for choreographed sequence
  const choreographyDelays = {
    badge: 0,
    imageZoom: 0.2,
    gradient: 0.3,
    tagline: 0.4,
    productName: 0.5,
    price: 0.6,
    swatches: 0.6,
    cta: 0.7,
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-sm",
        "bg-cream transition-colors duration-300",
        showCustomCursor && "cursor-none"
      )}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      animate={{
        y: isHovered ? -4 : 0,
        boxShadow: isHovered 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(212, 175, 55, 0.15), inset 0 0.5px 0 rgba(212, 175, 55, 0.3)" 
          : "0 4px 12px -4px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Custom Champagne Cursor */}
      {showCustomCursor && (
        <motion.div
          className="pointer-events-none absolute z-50 w-5 h-5 rounded-full bg-champagne/80 mix-blend-difference"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}

      {/* Champagne edge shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-40 rounded-sm"
        style={{
          background: isHovered 
            ? "linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, transparent 30%, transparent 70%, rgba(212, 175, 55, 0.2) 100%)"
            : "transparent",
          border: isHovered ? "1px solid rgba(212, 175, 55, 0.4)" : "1px solid transparent",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Canvas grain texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Image Container - Multi-layer depth */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-cream to-warm-beige/30">
        {/* Wishlist Button - Top Left */}
        {!product.comingSoon && (
          <div className="absolute top-4 left-4 z-30">
            <WishlistButton 
              product={{ 
                id: product.id, 
                name: product.name,
                color: selectedColor || undefined 
              }} 
              size="sm"
            />
          </div>
        )}
        {/* Layer 1: Product Image with zoom and brightness */}
        <motion.img
          src={displayImage}
          alt={product.name}
          onError={(e) => {
            const target = e.currentTarget;
            // Prevent endless loops if the fallback also fails
            if (target.dataset.fallbackApplied === "1") return;
            target.dataset.fallbackApplied = "1";
            target.src = defaultHeroFallback;
          }}
          className="w-full h-full object-contain object-center"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(0px)" }}
          animate={{ 
            scale: isHovered ? 1.15 : 1,
            filter: isHovered ? "brightness(1.1)" : "brightness(1)",
          }}
          transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1],
            delay: isHovered ? choreographyDelays.imageZoom : 0,
          }}
          loading="lazy"
        />

        {/* Layer 2: Vignette overlay with parallax */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(13, 13, 13, 0.4) 100%)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            x: isHovered ? mouseX.get() * -10 : 0,
            y: isHovered ? mouseY.get() * -10 : 0,
          }}
        />
        
        {/* Layer 3: Dark gradient wipes up - frosted glass */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(15deg, rgba(13, 13, 13, 0.9) 0%, rgba(13, 13, 13, 0.6) 35%, transparent 70%)",
            backdropFilter: isHovered ? "blur(2px)" : "blur(0px)",
          }}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ 
            y: isHovered ? "0%" : "100%", 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ 
            duration: 0.4, 
            ease: [0.22, 1, 0.36, 1],
            delay: isHovered ? choreographyDelays.gradient : 0,
          }}
        />
        
        {/* ComingSoon Badge - 3D ribbon with shimmer */}
        {product.comingSoon && (
          <motion.div 
            className="absolute top-4 left-4 z-20"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative overflow-hidden">
              <motion.span 
                className="inline-block bg-gradient-to-r from-champagne via-champagne-light to-champagne text-obsidian px-4 py-2 text-xs font-semibold tracking-wide rounded-sm"
                style={{
                  boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
                animate={{
                  boxShadow: isHovered 
                    ? "0 8px 24px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)"
                    : "0 4px 12px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                قريباً - اضغط للإشعار
              </motion.span>
              {/* Shimmer pass effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                }}
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>
        )}
        
        {/* Hover Content - Text with individual shadows */}
        <motion.div 
          className="absolute inset-0 flex flex-col justify-end p-5 z-10"
          dir={isArabic ? 'rtl' : 'ltr'}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Tagline - letter-spacing expansion */}
          <motion.p 
            className="font-body text-champagne text-[11px] uppercase mb-1"
            style={{ 
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              transformStyle: "preserve-3d",
              transform: "translateZ(20px)",
            }}
            initial={{ opacity: 0, y: 20, letterSpacing: "0.1em" }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20,
              letterSpacing: isHovered ? "0.2em" : "0.1em",
            }}
            transition={{ 
              duration: 0.4, 
              delay: isHovered ? choreographyDelays.tagline : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {displayTagline}
          </motion.p>
          
          {/* Product Name - with champagne shimmer pass */}
          <motion.div className="relative overflow-hidden mb-3">
            <motion.h3 
              className="font-headline text-2xl text-warm-white font-bold"
              style={{ 
                textShadow: "0 4px 16px rgba(0,0,0,0.6)",
                transformStyle: "preserve-3d",
                transform: "translateZ(30px)",
              }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 25,
              }}
              transition={{ 
                duration: 0.5, 
                delay: isHovered ? choreographyDelays.productName : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* First letter gold foil effect */}
              <span className="relative inline-block">
                <span className="bg-gradient-to-br from-champagne via-champagne-light to-champagne bg-clip-text text-transparent">
                  {displayName.charAt(0)}
                </span>
              </span>
              {displayName.slice(1)}
            </motion.h3>
            {/* Shimmer pass on name */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: isHovered ? "200%" : "-100%" }}
              transition={{
                duration: 0.8,
                delay: isHovered ? choreographyDelays.productName + 0.2 : 0,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          
          {/* Price with scale bounce or WhatsApp CTA */}
          <motion.div
            style={{ 
              transformStyle: "preserve-3d",
              transform: "translateZ(40px)",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.9,
              y: isHovered ? 0 : 15,
            }}
            transition={{ 
              duration: 0.5, 
              delay: isHovered ? choreographyDelays.price : 0,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            {product.comingSoon ? (
              <motion.span 
                className="relative inline-flex items-center gap-2 text-warm-white text-sm font-medium px-5 py-2.5 rounded-sm overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
                whileHover={{ 
                  background: "rgba(212, 175, 55, 0.2)",
                }}
              >
                {/* Border draw animation */}
                <motion.span
                  className="absolute inset-0 rounded-sm pointer-events-none"
                  style={{ border: "1px solid rgba(212, 175, 55, 0.6)" }}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: isHovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: isHovered ? choreographyDelays.cta : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                إشعار على واتساب
              </motion.span>
            ) : (
              <div className="relative inline-block">
                <p 
                  className="font-body text-warm-white text-xl font-medium"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                >
                  {getPriceDisplay()}
                </p>
                {/* Price underline draws itself */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-champagne/60 to-transparent"
                  initial={{ width: "0%" }}
                  animate={{ width: isHovered ? "100%" : "0%" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: isHovered ? choreographyDelays.price + 0.1 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Swatches - Top Right with staggered reveal */}
        {colors.length > 0 && !product.comingSoon && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            {colors.slice(0, 4).map((colorName, index) => (
              <motion.button
                key={colorName}
                type="button"
                onClick={(e) => handleSwatchClick(e, colorName)}
                onMouseEnter={() => setHoveredSwatchIndex(index)}
                onMouseLeave={() => setHoveredSwatchIndex(null)}
                className={cn(
                  "w-7 h-7 rounded-full border-2 transition-all duration-200",
                  selectedColor === colorName 
                    ? "border-champagne scale-110 ring-2 ring-champagne/50" 
                    : "border-white/50"
                )}
                style={{ 
                  backgroundColor: getColorHex(colorName),
                  boxShadow: hoveredSwatchIndex === index 
                    ? "0 0 16px rgba(212, 175, 55, 0.5)"
                    : "0 4px 8px rgba(0,0,0,0.2)",
                }}
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ 
                  opacity: isHovered ? (hoveredSwatchIndex !== null && hoveredSwatchIndex !== index ? 0.5 : 1) : 1, 
                  scale: isHovered ? 1 : 1,
                  x: 0,
                }}
                whileHover={{ scale: 1.15 }}
                transition={{ 
                  duration: 0.3, 
                  delay: isHovered ? choreographyDelays.swatches + (index * 0.1) : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                title={colorName}
                aria-label={`Preview ${colorName}`}
              />
            ))}
          </div>
        )}

        {/* Corner champagne inner glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            boxShadow: "inset 0 0 20px rgba(212, 175, 55, 0.08)",
          }}
          animate={{
            boxShadow: isHovered 
              ? "inset 0 0 30px rgba(212, 175, 55, 0.15)"
              : "inset 0 0 20px rgba(212, 175, 55, 0.08)",
          }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Static Info (visible when not hovering) - Exit animation */}
      <motion.div 
        className="p-4 md:p-5 text-center"
        dir={isArabic ? 'rtl' : 'ltr'}
        animate={{ 
          opacity: isHovered ? 0 : 1,
          y: isHovered ? 10 : 0,
        }}
        transition={{ 
          duration: 0.3,
          ease: isHovered ? "easeIn" : "easeOut",
        }}
      >
        <h3 className="font-headline text-lg md:text-xl text-charcoal font-bold mb-0.5">
          {displayName}
        </h3>
        <p className="font-body text-[11px] md:text-xs text-champagne-dark tracking-[0.15em] uppercase mb-2">
          {displayTagline}
        </p>
        {product.comingSoon ? (
          <p className="font-body text-sm text-champagne-dark font-medium">
            قريباً
          </p>
        ) : (
          <p className="font-headline text-lg md:text-xl text-charcoal font-medium">
            {getPriceDisplay()}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
