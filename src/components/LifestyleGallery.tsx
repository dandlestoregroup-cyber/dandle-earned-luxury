import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const lifestyleImages = [
  {
    src: "/images/complete-set-classic.jpg",
    alt: "DANDLE recliner in elegant home living room",
    caption: "At Home",
    subtitle: "Where comfort meets family"
  },
  {
    src: "/images/worknest-blue-front.webp", 
    alt: "WorkNest recliner in executive office setting",
    caption: "Executive Office",
    subtitle: "Productivity in supreme comfort"
  },
  {
    src: "/images/complete-set-coastal-modern.jpg",
    alt: "Modern home office with DANDLE recliner",
    caption: "Work From Home",
    subtitle: "Your personal productivity sanctuary"
  },
  {
    src: "/images/complete-set-sunset-fireplace.jpg",
    alt: "Luxury vacation rental with premium recliner",
    caption: "Vacation Rental",
    subtitle: "Elevate guest experiences"
  },
  {
    src: "/images/complete-set-family-modern.jpg",
    alt: "Boutique hotel suite with DANDLE comfort",
    caption: "Boutique Hotel",
    subtitle: "Premium hospitality comfort"
  }
];

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
          <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
            In Your Home
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-warm-white mt-3">
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
                key={image.caption}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                  {/* Ken Burns Effect on Active Slide */}
                  <motion.img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                    initial={{ scale: 1.1 }}
                    animate={{ 
                      scale: selectedIndex === index ? 1.15 : 1.1,
                    }}
                    transition={{ 
                      duration: 8,
                      ease: "easeOut"
                    }}
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
                        <h3 className="font-headline text-3xl md:text-5xl text-warm-white mb-2">
                          {image.caption}
                        </h3>
                        <p className="font-body text-lg md:text-xl text-warm-white/80">
                          {image.subtitle}
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

        {/* Swipe Hint for Mobile */}
        <motion.div 
          className="absolute bottom-20 left-1/2 -translate-x-1/2 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-warm-white/60 text-sm font-body flex items-center gap-2"
          >
            <span>Swipe</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleGallery;
