import { useState, useMemo, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Product } from "@/types/product";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { cn } from "@/lib/utils";
import { productColorImages, getProductColorImage } from "@/data/productColorImages";
import { PALETTE_MAP } from "@/data/palette";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";
import WishlistButton from "@/components/WishlistButton";

// Arabic product translations with proper format: Arabic name (English name)
const productTranslations: Record<string, { name: string; nameWithEnglish: string; tagline: string; truth: string }> = {
  relaxmax: { 
    name: "ريلاكس ماكس", 
    nameWithEnglish: "ريلاكس ماكس (RelaxMax)",
    tagline: "المقعد الافتراضي", 
    truth: "مألوف. سهل. صحيح."
  },
  comfortplus: { 
    name: "كومفورت بلس", 
    nameWithEnglish: "كومفورت بلس (ComfortPlus)",
    tagline: "استرخِ عميقاً. فكّر بوضوح.", 
    truth: "تحرّر. تجدد. عودة."
  },
  diva: { 
    name: "ديفا", 
    nameWithEnglish: "ديفا (Diva)",
    tagline: "حيث تلتقي الأناقة بالراحة", 
    truth: "جريء. جميل. لا يُنسى."
  },
  cozycompanion: { 
    name: "كوزي كومبانيون", 
    nameWithEnglish: "كوزي كومبانيون (CozyCompanion)",
    tagline: "راحة لاثنين", 
    truth: "اجتمع. استرخِ. ابقَ."
  },
  easyup: { 
    name: "إيزي أب", 
    nameWithEnglish: "إيزي أب (EasyUp Lift)",
    tagline: "اجلس براحة، قوم بسهولة", 
    truth: "سهولة. دعم. ثقة."
  },
  "easyup-compact": { 
    name: "إيزي أب كومباكت", 
    nameWithEnglish: "إيزي أب كومباكت (EasyUp Compact)",
    tagline: "رفع لطيف، تصميم مدمج", 
    truth: "مدمج. نظيف. قادر."
  },
  worknest: { 
    name: "وورك نست", 
    nameWithEnglish: "وورك نست (WorkNest)",
    tagline: "اشعر أفضل. اعمل أفضل.", 
    truth: "راحة. وضوح. إنتاج."
  },
  spacesaver: { 
    name: "سبيس سيفر", 
    nameWithEnglish: "سبيس سيفر (SpaceSaver)",
    tagline: "راحة ذكية في مساحة صغيرة", 
    truth: "ذكي. مساحة. راحة."
  },
  "complete-set": { 
    name: "طقم العائلة", 
    nameWithEnglish: "طقم العائلة (Complete Set)",
    tagline: "راحة للعائلة بأكملها", 
    truth: "اجتمع. استرخِ. ابقَ."
  },
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
    if (product.comingSoon || product.beFirstToKnow) return null;
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

  // WhatsApp notification for ComingSoon or BeFirstToKnow products
  const handleCardClick = () => {
    if (product.comingSoon || product.beFirstToKnow) {
      const productName = isArabic && translation ? translation.nameWithEnglish : product.name;
      const message = `ممكن تنبهوني أول ما ${productName} يبقى متاح؟`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/201222804255?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    } else {
      onClick();
    }
  };

  // Display names with proper Arabic format
  const displayName = isArabic && translation ? translation.nameWithEnglish : product.name;
  const displayTagline = isArabic && translation ? translation.tagline : product.tagline;
  const displayTruth = isArabic && translation ? translation.truth : product.truth;

  // Animation variants for choreographed sequence
  const choreographyDelays = {
    badge: 0,
    imageZoom: 0.2,
    gradient: 0.3,
    tagline: 0.4,
    productName: 0.5,
    truth: 0.55,
    price: 0.6,
    swatches: 0.6,
    cta: 0.7,
  };

  // Determine badge type
  const showComingSoonBadge = product.comingSoon;
  const showBeFirstBadge = product.beFirstToKnow && !product.comingSoon;

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
        {!product.comingSoon && !product.beFirstToKnow && (
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
        
        {/* Coming Soon Badge */}
        {showComingSoonBadge && (
          <motion.div 
            className="absolute top-4 right-4 z-20"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative overflow-hidden">
              <motion.span 
                className="inline-block bg-gradient-to-r from-champagne via-champagne-light to-champagne text-obsidian px-4 py-2 text-xs font-semibold tracking-wide rounded-sm"
                style={{
                  boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                {isArabic ? "قريباً" : "Coming Soon"}
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Be First to Know Badge */}
        {showBeFirstBadge && (
          <motion.div 
            className="absolute top-4 right-4 z-20"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative overflow-hidden">
              <motion.span 
                className="inline-block bg-gradient-to-r from-dandle-orange via-dandle-orange/90 to-dandle-orange text-off-white px-4 py-2 text-xs font-semibold tracking-wide rounded-sm"
                style={{
                  boxShadow: "0 4px 12px rgba(199, 108, 61, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
                animate={{
                  boxShadow: isHovered 
                    ? "0 8px 24px rgba(199, 108, 61, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
                    : "0 4px 12px rgba(199, 108, 61, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                {isArabic ? "كن أول من يعرف" : "Be First to Know"}
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
            className={cn(
              "text-champagne text-[11px] uppercase mb-1",
              isArabic ? "font-body-ar" : "font-body"
            )}
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
          <motion.div className="relative overflow-hidden mb-2">
            <motion.h3 
              className={cn(
                "text-2xl text-warm-white font-bold",
                isArabic ? "font-body-ar" : "font-headline"
              )}
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
              {displayName}
            </motion.h3>
          </motion.div>

          {/* 3-Word Truth */}
          <motion.p 
            className={cn(
              "text-dandle-orange text-sm font-medium mb-3",
              isArabic ? "font-body-ar" : "font-body"
            )}
            style={{ 
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              transformStyle: "preserve-3d",
              transform: "translateZ(25px)",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 15,
            }}
            transition={{ 
              duration: 0.4, 
              delay: isHovered ? choreographyDelays.truth : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {displayTruth}
          </motion.p>
          
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
            {(product.comingSoon || product.beFirstToKnow) ? (
              <p className={cn(
                "text-champagne/90 text-sm",
                isArabic ? "font-body-ar" : "font-body"
              )}>
                {isArabic ? "إشعار على واتساب" : "Get notified on WhatsApp"}
              </p>
            ) : (
              <p className="font-body text-lg text-warm-white font-medium">
                {getPriceDisplay()}
              </p>
            )}
          </motion.div>

          {/* Color Swatches - staggered pop-in */}
          {colors.length > 0 && !product.comingSoon && !product.beFirstToKnow && (
            <motion.div 
              className="flex gap-2 mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 10,
              }}
              transition={{ 
                duration: 0.4, 
                delay: isHovered ? choreographyDelays.swatches : 0,
              }}
            >
              {colors.slice(0, 5).map((color, index) => (
                <motion.button
                  key={color}
                  onClick={(e) => handleSwatchClick(e, color)}
                  onMouseEnter={() => setHoveredSwatchIndex(index)}
                  onMouseLeave={() => setHoveredSwatchIndex(null)}
                  className={cn(
                    "relative w-6 h-6 rounded-full border-2 transition-all duration-200",
                    selectedColor === color 
                      ? "border-champagne scale-110" 
                      : "border-white/40 hover:border-champagne/60"
                  )}
                  style={{ 
                    backgroundColor: getColorHex(color),
                    boxShadow: selectedColor === color 
                      ? "0 0 12px rgba(212, 175, 55, 0.4)" 
                      : "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isHovered ? 1 : 0, 
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ 
                    duration: 0.3,
                    delay: isHovered ? choreographyDelays.swatches + (index * 0.05) : 0,
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  title={color}
                >
                  {/* Tooltip */}
                  {hoveredSwatchIndex === index && (
                    <motion.span
                      className="absolute -top-8 left-1/2 -translate-x-1/2 bg-obsidian/90 text-warm-white text-[10px] px-2 py-1 rounded whitespace-nowrap"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {color}
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Bottom Info - Always visible */}
      <div className={cn("p-5 bg-cream", isArabic ? "text-right" : "text-left")} dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Tagline visible always */}
        <p className={cn(
          "text-[10px] uppercase tracking-[0.15em] text-bronze/70 mb-1",
          isArabic ? "font-body-ar" : "font-body"
        )}>
          {displayTagline}
        </p>
        
        <h4 className={cn(
          "text-lg text-charcoal font-medium mb-1",
          isArabic ? "font-body-ar" : "font-headline"
        )}>
          {displayName}
        </h4>
        
        {/* 3-Word Truth - Always visible */}
        <p className={cn(
          "text-xs text-dandle-orange font-medium mb-2",
          isArabic ? "font-body-ar" : "font-body"
        )}>
          {displayTruth}
        </p>
        
        {(product.comingSoon || product.beFirstToKnow) ? (
          <p className={cn(
            "text-sm text-dandle-orange",
            isArabic ? "font-body-ar" : "font-body"
          )}>
            {showBeFirstBadge 
              ? (isArabic ? "كن أول من يعرف" : "Be First to Know")
              : (isArabic ? "قريباً" : "Coming Soon")}
          </p>
        ) : (
          <p className="font-body text-sm text-charcoal/80">
            {getPriceDisplay()}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;