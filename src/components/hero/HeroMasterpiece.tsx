import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroMasterpiece = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const words = [
    { en: "Comfort", ar: "الراحة" },
    { en: "Elegance", ar: "الأناقة" },
    { en: "Luxury", ar: "الفخامة" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-charcoal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Cinematic Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal z-10" />
        <motion.img
          src="/images/relaxmax-hero-offwhite.jpg"
          alt="DANDLE Luxury Recliner"
          className="w-full h-full object-cover"
          initial={{ scale: 1.2, filter: "blur(10px)" }}
          animate={{ 
            scale: isLoaded ? 1 : 1.2, 
            filter: isLoaded ? "blur(0px)" : "blur(10px)" 
          }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-charcoal via-transparent to-charcoal/30" />
      
      {/* Floating Orbs - Ambient Light Effects */}
      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--dandle-orange) / 0.15) 0%, transparent 70%)",
            top: "10%",
            right: "-10%",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--bronze) / 0.1) 0%, transparent 70%)",
            bottom: "20%",
            left: "-5%",
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-20 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
        style={{ opacity }}
      >
        <div className="pt-24 pb-12 md:pt-32">
          {/* Pre-headline Badge */}
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-dandle-orange" />
            <span 
              className="text-sm md:text-base text-white/70 font-body tracking-[0.2em] uppercase"
              data-en="The Art of Rest"
              data-ar="فن الراحة"
            >
              The Art of Rest
            </span>
          </motion.div>

          {/* Main Headline with Animated Word */}
          <div className="mb-6">
            <motion.h1
              className="font-headline text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="block mb-2" data-en="The Gift of" data-ar="هدية">
                The Gift of
              </span>
              <span className="relative inline-block h-[1.1em] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWord}
                    className="block bg-gradient-to-r from-dandle-orange via-[hsl(24_90%_60%)] to-bronze bg-clip-text text-transparent"
                    initial={{ y: 60, opacity: 0, rotateX: -45 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -60, opacity: 0, rotateX: 45 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    data-en={words[activeWord].en}
                    data-ar={words[activeWord].ar}
                  >
                    {words[activeWord].en}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/70 font-body max-w-xl mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            data-en="For refined taste"
            data-ar="لأصحاب الذوق الرفيع"
          >
            For refined taste
          </motion.p>

          {/* Origin Line */}
          <motion.p
            className="text-base md:text-lg text-white/50 font-body mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            data-en="Crafted in Egypt. Made for Real Homes."
            data-ar="صناعة مصرية. لبيوت حقيقية."
          >
            Crafted in Egypt. Made for Real Homes.
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap gap-4 md:gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            {[
              { en: "14-Day Delivery", ar: "تسليم خلال 14 يوم" },
              { en: "2-Year Warranty", ar: "ضمان سنتين" },
              { en: "Free Installation", ar: "تركيب مجاني" },
            ].map((badge, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 text-white/60 text-sm font-body"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-dandle-orange" />
                <span data-en={badge.en} data-ar={badge.ar}>{badge.en}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <Button
              onClick={scrollToProducts}
              className="group relative overflow-hidden bg-dandle-orange hover:bg-dandle-orange text-white px-8 py-6 text-lg font-body rounded-sm"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span data-en="Explore Collection" data-ar="استكشف المجموعة">
                  Explore Collection
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-dandle-orange to-bronze"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>

            <Button
              onClick={() => setShowVideo(true)}
              variant="outline"
              className="group bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 hover:border-white/40 text-white px-8 py-6 text-lg font-body rounded-sm"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span data-en="Watch Story" data-ar="شاهد القصة">Watch Story</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span 
          className="text-xs text-white/50 font-body tracking-widest uppercase"
          data-en="Scroll to explore"
          data-ar="اسحب للاستكشاف"
        >
          Scroll to explore
        </span>
        <motion.div
          className="w-6 h-10 rounded-full border border-white/30 flex items-start justify-center p-2"
          animate={{ borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-white/70"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Side Accent Line */}
      <motion.div
        className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 z-20"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 200 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <div className="w-px h-full bg-gradient-to-b from-transparent via-dandle-orange/50 to-transparent" />
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              className="relative w-full max-w-5xl mx-4 aspect-video bg-charcoal rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src="/videos/festive-hero.mp4"
                autoPlay
                controls
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default HeroMasterpiece;
