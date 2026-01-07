import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { getLifestyleImages, SiteImage } from "@/data/siteImageManifest";

// Get lifestyle images from manifest and format for carousel
const manifestLifestyleImages = getLifestyleImages();

// Group by category for tab navigation
const lifestyleCategories = [
  { id: 'all', labelEn: 'All Spaces', labelAr: 'كل الأماكن' },
  { id: 'lifestyle-home', labelEn: 'Home', labelAr: 'المنزل' },
  { id: 'lifestyle-hotel', labelEn: 'Hotel', labelAr: 'الفندق' },
  { id: 'lifestyle-office', labelEn: 'Office', labelAr: 'المكتب' },
];

// Format manifest images for carousel display
const formatManifestImages = (images: SiteImage[]) => images.map(img => ({
  src: img.generatedUrl || img.referenceUrl,
  alt: `${img.product} in ${img.setting}`,
  captionEn: img.captionEn || img.setting,
  captionAr: img.captionAr || img.setting,
  subtitleEn: img.subtitleEn || `Experience ${img.product}`,
  subtitleAr: img.subtitleAr || `تجربة ${img.product}`,
  category: img.category,
}));

// Fallback images if manifest is empty
const fallbackImages = [
  {
    src: "/images/complete-set-classic.jpg",
    alt: "DANDLE recliner in elegant home living room",
    captionEn: "At Home",
    captionAr: "في المنزل",
    subtitleEn: "Where comfort meets family",
    subtitleAr: "حيث تلتقي الراحة بالعائلة",
    category: 'lifestyle-home',
  },
  {
    src: "/images/complete-set-sunset-fireplace.jpg",
    alt: "Refined vacation rental with premium recliner",
    captionEn: "Vacation Rental",
    captionAr: "إيجار العطلات",
    subtitleEn: "Elevate guest experiences",
    subtitleAr: "ارتقِ بتجارب الضيوف",
    category: 'lifestyle-hotel',
  },
  {
    src: "/images/complete-set-family-modern.jpg",
    alt: "Boutique hotel suite with DANDLE comfort",
    captionEn: "Boutique Hotel",
    captionAr: "فندق بوتيك",
    subtitleEn: "Premium hospitality comfort",
    subtitleAr: "راحة ضيافة فاخرة",
    category: 'lifestyle-hotel',
  },
];

// Use manifest images if available, otherwise fallback
const lifestyleImages = manifestLifestyleImages.length > 0 
  ? formatManifestImages(manifestLifestyleImages)
  : fallbackImages;

const LifestyleGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      skipSnaps: false,
      align: "center"
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  return (
    <section className="py-16 md:py-24 bg-charcoal overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span 
            className="text-bronze font-body text-sm tracking-[0.2em] uppercase"
            data-en="In Your Home"
            data-ar="في منزلك"
          >
            In Your Home
          </span>
          <h2 
            className="font-headline text-4xl md:text-5xl text-warm-white mt-3"
            data-en="Lifestyle Gallery"
            data-ar="معرض أنماط الحياة"
          >
            Lifestyle Gallery
          </h2>
        </motion.div>
      </div>

      {/* Fullscreen Stacked Carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {lifestyleImages.map((image, index) => (
              <div 
                key={image.captionEn}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                  {/* Ken Burns Effect - Alternating zoom in/out */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`w-full h-full object-cover object-center ${
                      selectedIndex === index 
                        ? index % 2 === 0 
                          ? "animate-ken-burns-in" 
                          : "animate-ken-burns-out"
                        : ""
                    }`}
                    style={{ transform: selectedIndex !== index ? "scale(1.05)" : undefined }}
                  />
                  
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />
                  
                  {/* Caption Overlay with Parallax Effect */}
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="absolute bottom-20 md:bottom-24 left-0 right-0 text-center px-4"
                      >
                        <h3 
                          className="font-headline text-3xl md:text-5xl text-dandle-orange mb-2 drop-shadow-lg"
                          data-en={image.captionEn}
                          data-ar={image.captionAr}
                        >
                          {image.captionEn}
                        </h3>
                        <p 
                          className="font-body text-lg md:text-xl text-warm-white drop-shadow-md"
                          data-en={image.subtitleEn}
                          data-ar={image.subtitleAr}
                        >
                          {image.subtitleEn}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10">
          {lifestyleImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                selectedIndex === index 
                  ? "bg-bronze w-8" 
                  : "bg-warm-white/40 hover:bg-warm-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Swipe Hint for Mobile - positioned above captions */}
        <motion.div 
          className="absolute top-4 left-1/2 -translate-x-1/2 md:hidden z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: 2, duration: 3, times: [0, 0.1, 0.8, 1] }}
        >
          <div className="text-dandle-orange text-sm font-body flex items-center gap-2 bg-charcoal/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span data-en="Swipe to explore" data-ar="اسحب للاستكشاف">Swipe to explore</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleGallery;
