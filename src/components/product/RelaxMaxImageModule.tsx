/* Prompt 2: RelaxMax Image Module (additive) */
import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Feature flags
const SWATCH_IMAGE_SWAP_ENABLED = false;

// Configuration
const CONFIG = {
  phoneNumber: "201000000000", // Placeholder - update with real number
  productName: {
    ar: "ريلاكس ماكس",
    en: "RelaxMax"
  }
};

// Fabric swatches with exact colors
const FABRICS: Record<string, { ar: string; en: string; hex: string }> = {
  "nile": { ar: "أزرق النيل", en: "Nile Blue", hex: "#274B8F" },
  "alexandria": { ar: "رمادي الإسكندرية", en: "Alexandria Grey", hex: "#8B8B8B" },
  "desert-sage": { ar: "أخضر صحراوي", en: "Desert Sage", hex: "#9CAF88" },
  "desert-grey": { ar: "رمادي صحراوي", en: "Desert Grey", hex: "#A89F91" },
  "amber": { ar: "كهرماني", en: "Amber", hex: "#FFBF00" },
  "mocha": { ar: "موكا", en: "Mocha", hex: "#6F4E37" },
  "coastal": { ar: "ساحلي", en: "Coastal", hex: "#87CEEB" },
  "nile-mist": { ar: "ضباب النيل", en: "Nile Mist", hex: "#B0C4DE" },
  "giza": { ar: "جيزة", en: "Giza", hex: "#D4A574" },
  "oasis": { ar: "واحة", en: "Oasis", hex: "#228B22" },
  "blue-nile": { ar: "النيل الأزرق", en: "Blue Nile", hex: "#1E3A5F" },
  "sandstorm": { ar: "عاصفة رملية", en: "Sandstorm", hex: "#C2B280" },
  "papyrus": { ar: "بردي", en: "Papyrus", hex: "#F5F5DC" },
  "clay": { ar: "طيني", en: "Clay", hex: "#B66A50" }
};

// Gallery images (references only - files must exist)
const GALLERY_IMAGES = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/relaxmax-gallery-0${i + 1}.webp`,
  alt: `RelaxMax Gallery ${i + 1}`
}));

// Get language from localStorage
function getLang(): "en" | "ar" {
  if (typeof window === "undefined") return "en";
  const dandleLang = localStorage.getItem("dandle_lang");
  if (dandleLang === "ar" || dandleLang === "en") return dandleLang;
  const lang = localStorage.getItem("lang");
  if (lang === "ar" || lang === "en") return lang;
  return "en";
}

// Generate WhatsApp deep link
function generateWhatsAppLink(fabricKey: string, lang: "en" | "ar"): string {
  const fabric = FABRICS[fabricKey];
  const fabricName = lang === "ar" ? fabric.ar : fabric.en;
  
  const messageAr = `مرحبا فريق داندل! 📸

صورة الغرفة مرفقة 👇

عايز: ريلاكس ماكس بلون ${fabricName}
✅ تصميم الغرفة كاملة خلال 72 ساعة
✅ الكرسي متكامل مع الديكور
✅ جاهز للطباعة

شكرا! ✨`;

  const messageEn = `Hi Dandle team! 📸

Room photo attached 👇

I want: RelaxMax in ${fabricName} fabric
✅ FULL room redesign within 72hrs
✅ Recliner perfectly integrated
✅ Print-ready high-res

Thanks! ✨`;

  const message = lang === "ar" ? messageAr : messageEn;
  return `https://wa.me/${CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
}

interface RelaxMaxImageModuleProps {
  currentImageSrc: string;
  onImageChange?: (newSrc: string) => void;
}

export function RelaxMaxImageModule({ currentImageSrc, onImageChange }: RelaxMaxImageModuleProps) {
  const [selectedFabric, setSelectedFabric] = useState<string>("nile");
  const [lang, setLang] = useState<"en" | "ar">(getLang);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Listen for language changes
  const updateLang = useCallback(() => {
    setLang(getLang());
  }, []);

  // Handle swatch click
  const handleSwatchClick = (fabricKey: string) => {
    setSelectedFabric(fabricKey);
    
    // Only swap image if flag is enabled
    if (SWATCH_IMAGE_SWAP_ENABLED && onImageChange) {
      onImageChange(`/images/relaxmax_${fabricKey}.webp`);
    }
  };

  // Gallery scroll
  const scrollGallery = (direction: "left" | "right") => {
    if (!galleryRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    galleryRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Open gallery image in new tab
  const openGalleryImage = (src: string) => {
    window.open(src, "_blank", "noopener,noreferrer");
  };

  const whatsappLabel = lang === "ar" 
    ? "ارسل غرفتي → جاهز خلال 72 ساعة" 
    : "Send Room → Ready in 72hrs";

  return (
    <div className="relaxmax-image-module space-y-6 mt-8">
      {/* Fabric Swatches */}
      <div className="space-y-3">
        <h4 className="font-headline text-lg text-foreground">
          {lang === "ar" ? "اختر القماش" : "Select Fabric"}
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(FABRICS).map(([key, fabric]) => (
            <button
              key={key}
              onClick={() => handleSwatchClick(key)}
              title={lang === "ar" ? fabric.ar : fabric.en}
              className={`
                w-10 h-10 rounded-full border-2 transition-all duration-200
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2
                ${selectedFabric === key 
                  ? "border-bronze ring-2 ring-bronze ring-offset-2 scale-110" 
                  : "border-border hover:border-bronze/50"
                }
              `}
              style={{ backgroundColor: fabric.hex }}
              aria-label={lang === "ar" ? fabric.ar : fabric.en}
            >
              {selectedFabric === key && (
                <span className="sr-only">Selected</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {lang === "ar" 
            ? `المحدد: ${FABRICS[selectedFabric].ar}` 
            : `Selected: ${FABRICS[selectedFabric].en}`
          }
        </p>
      </div>

      {/* WhatsApp CTA */}
      <a
        id="whatsapp-order"
        href={generateWhatsAppLink(selectedFabric, lang)}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center justify-center gap-3 w-full py-4 px-6
          bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold
          rounded-lg transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2
        "
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        {whatsappLabel}
      </a>

      {/* Gallery with Horizontal Scroll */}
      <div className="space-y-3">
        <h4 className="font-headline text-lg text-foreground">
          {lang === "ar" ? "معرض الصور" : "Gallery"}
        </h4>
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scrollGallery("left")}
            className="
              absolute left-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 bg-background/90 backdrop-blur-sm border border-border
              rounded-full flex items-center justify-center
              hover:bg-background transition-colors
              focus:outline-none focus:ring-2 focus:ring-bronze
            "
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Gallery Container */}
          <div
            ref={galleryRef}
            className="
              flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
              px-12 py-2 -mx-2
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            "
          >
            {GALLERY_IMAGES.map((img, index) => (
              <button
                key={index}
                onClick={() => openGalleryImage(img.src)}
                className="
                  flex-shrink-0 snap-start
                  w-72 h-48 rounded-lg overflow-hidden
                  border border-border hover:border-bronze
                  transition-all duration-200 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2
                "
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollGallery("right")}
            className="
              absolute right-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 bg-background/90 backdrop-blur-sm border border-border
              rounded-full flex items-center justify-center
              hover:bg-background transition-colors
              focus:outline-none focus:ring-2 focus:ring-bronze
            "
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {lang === "ar" ? "اضغط على الصورة لفتحها" : "Click image to open in new tab"}
        </p>
      </div>
    </div>
  );
}
