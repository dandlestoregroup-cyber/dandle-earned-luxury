import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
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
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

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
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-obsidian"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Cinematic Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <motion.img
          src="/images/relaxmax-hero-offwhite.jpg"
          alt="DANDLE Luxury Recliner"
          className="w-full h-full object-cover"
          initial={{ scale: 1.15, filter: "blur(8px)" }}
          animate={{ 
            scale: isLoaded ? 1 : 1.15, 
            filter: isLoaded ? "blur(0px)" : "blur(8px)" 
          }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-obsidian via-obsidian/70 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
      
      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Ambient Light Orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-5"
        style={{
          background: "radial-gradient(circle, hsl(var(--champagne) / 0.08) 0%, transparent 60%)",
          top: "5%",
          right: "-15%",
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Content */}
      <motion.div 
        className="relative z-20 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-24 max-w-7xl mx-auto"
        style={{ opacity }}
      >
        <div className="pt-32 pb-16 md:pt-40 md:pb-20">
          {/* Pre-headline */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <motion.div 
              className="h-px w-16 bg-gradient-to-r from-champagne/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
            <span 
              className="text-xs md:text-sm text-champagne/80 font-body font-light tracking-[0.25em] uppercase"
              data-en="The Art of Rest"
              data-ar="فن الراحة"
            >
              The Art of Rest
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="mb-8">
            <motion.p
              className="text-warm-white/50 font-body font-light text-lg md:text-xl mb-4 tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              data-en="The Gift of"
              data-ar="هدية"
            >
              The Gift of
            </motion.p>
            
            <motion.h1
              className="font-headline text-6xl md:text-8xl lg:text-[9rem] text-warm-white leading-none tracking-tight font-light"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="relative inline-block overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWord}
                    className="block text-gradient-luxury"
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
            className="text-warm-white/60 font-body font-light text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            data-en="Premium Egyptian recliners crafted for real homes — calm comfort that lasts."
            data-ar="كراسي استرخاء مصرية فاخرة صُنعت للبيوت الحقيقية — راحة هادئة تدوم."
          >
            Premium Egyptian recliners crafted for real homes — calm comfort that lasts.
          </motion.p>

          {/* Trust Line */}
          <motion.div
            className="flex items-center gap-8 mb-12 text-sm text-warm-white/40 font-body font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <span data-en="14-Day Delivery" data-ar="تسليم خلال 14 يوم">14-Day Delivery</span>
            <span className="w-px h-4 bg-champagne/30" />
            <span data-en="5-Year Warranty" data-ar="ضمان 5 سنوات">5-Year Warranty</span>
            <span className="w-px h-4 bg-champagne/30" />
            <span data-en="Free Installation" data-ar="تركيب مجاني">Free Installation</span>
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
              className="group relative overflow-hidden bg-transparent border border-champagne/40 hover:border-champagne text-warm-white px-10 py-6 text-sm font-body font-light tracking-[0.12em] uppercase rounded-none transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span data-en="Explore Collection" data-ar="استكشف المجموعة">
                  Explore Collection
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <motion.div
                className="absolute inset-0 bg-champagne"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 text-obsidian transition-opacity duration-300">
                <span data-en="Explore Collection" data-ar="استكشف المجموعة">
                  Explore Collection
                </span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>

            <Button
              onClick={() => setShowVideo(true)}
              variant="ghost"
              className="group bg-white/5 hover:bg-white/10 border-0 text-warm-white/70 hover:text-warm-white px-8 py-6 text-sm font-body font-light tracking-wide rounded-none transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center mr-3 group-hover:border-white/50 group-hover:scale-110 transition-all duration-300">
                <Play className="w-3 h-3 ml-0.5" />
              </div>
              <span data-en="Watch Story" data-ar="شاهد القصة">Watch Story</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span 
          className="text-[10px] text-warm-white/30 font-body font-light tracking-[0.3em] uppercase"
          data-en="Scroll"
          data-ar="اسحب"
        >
          Scroll
        </span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-champagne/50 to-transparent"
          animate={{ scaleY: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Side Accent */}
      <motion.div
        className="hidden lg:flex absolute right-16 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-champagne/40 to-transparent" />
        <span className="text-[10px] text-champagne/60 font-body tracking-[0.2em] uppercase [writing-mode:vertical-lr] rotate-180">
          Since 2010
        </span>
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-champagne/40 to-transparent" />
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              className="relative w-full max-w-5xl mx-4 aspect-video bg-obsidian rounded-sm overflow-hidden shadow-elegant"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-warm-white hover:bg-white/20 transition-colors text-sm"
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
