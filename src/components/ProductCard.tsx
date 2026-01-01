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
  
  // State for swatch-based image preview
  const [selectedSwatchKey, setSelectedSwatchKey] = useState<string | null>(null);
  
  // Get product-specific swatches from the color image mapping
  const colorVariants = productColorImages[product.id] || [];
  const swatches = useMemo(() => 
    colorVariants.map(v => ({
      ...PALETTE_MAP.get(v.swatchKey),
      imageSrc: v.imageSrc
    })).filter(s => s.key),
    [product.id]
  );

  // Determine current display image based on selected swatch
  const displayImage = useMemo(() => {
    if (selectedSwatchKey) {
      const colorImage = getProductColorImage(product.id, selectedSwatchKey);
      if (colorImage) return colorImage;
    }
    return defaultHeroImage;
  }, [selectedSwatchKey, defaultHeroImage, product.id]);

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

        {/* Clickable color swatches */}
        {swatches.length > 0 && (
          <div className="pt-2 md:pt-3 space-y-1 md:space-y-2">
            <p className="text-xs md:text-sm text-charcoal/50 uppercase tracking-wider font-body hidden md:block">
              {isArabic ? 'الألوان المتاحة' : 'Available Colors'}
            </p>
            <div className="flex justify-center gap-1.5 md:gap-2">
              {swatches.map((swatch) => (
                <button
                  key={swatch!.key}
                  type="button"
                  onClick={(e) => handleSwatchClick(e, swatch!.key)}
                  className={cn(
                    "w-6 h-6 md:w-10 md:h-10 rounded md:rounded-lg border shadow-sm transition-all duration-200",
                    selectedSwatchKey === swatch!.key 
                      ? "ring-2 ring-dandle-orange ring-offset-1 border-dandle-orange scale-110" 
                      : "border-charcoal/10 hover:scale-105"
                  )}
                  style={{ backgroundColor: swatch!.hex }}
                  title={isArabic ? swatch!.nameAr : swatch!.nameEn}
                  aria-label={isArabic ? swatch!.nameAr : `Preview ${swatch!.nameEn} color`}
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
