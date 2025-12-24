import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const lifestyleImages = [
  {
    src: "/images/relaxmax-lifestyle-day.png",
    alt: "RelaxMax in modern living room during golden hour",
    caption: "Morning Serenity",
    subtitle: "Start your day in absolute comfort"
  },
  {
    src: "/images/relaxmax-lifestyle-night.png", 
    alt: "RelaxMax ambient evening lighting",
    caption: "Evening Comfort",
    subtitle: "Unwind as the city lights up"
  },
  {
    src: "/images/cozycompanion-couple-lifestyle.jpg",
    alt: "Couple enjoying CozyCompanion together",
    caption: "Shared Moments",
    subtitle: "Where conversations feel endless"
  },
  {
    src: "/images/relaxmax-brown-lifestyle.jpg",
    alt: "Luxury living room setup with RelaxMax",
    caption: "Timeless Elegance",
    subtitle: "Crafted for discerning tastes"
  }
];

const LifestyleGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "center",
      skipSnaps: false
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

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
      <div className="relative w-full">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {lifestyleImages.map((image, index) => (
              <div
                key={image.caption}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                {/* Image Container with Ken Burns Effect */}
                <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                  <motion.img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                    animate={{
                      scale: selectedIndex === index ? 1.08 : 1,
                    }}
                    transition={{
                      duration: 8,
                      ease: "easeOut"
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-charcoal/50" />
                  
                  {/* Caption Overlay with Parallax Effect */}
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.div
                        key={image.caption}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="absolute bottom-8 md:bottom-16 left-0 right-0 text-center px-4"
                      >
                        <h3 className="font-headline text-3xl md:text-5xl text-warm-white mb-2">
                          {image.caption}
                        </h3>
                        <p className="font-body text-lg md:text-xl text-warm-white/70">
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
        <div className="flex justify-center gap-3 mt-6 md:mt-8">
          {lifestyleImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-bronze w-8"
                  : "bg-warm-white/30 hover:bg-warm-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Touch Hint (mobile only) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-warm-white/40 text-sm mt-4 md:hidden"
        >
          Swipe to explore
        </motion.p>
      </div>
    </section>
  );
};

export default LifestyleGallery;
