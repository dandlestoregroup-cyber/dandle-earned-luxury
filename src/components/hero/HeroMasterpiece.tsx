import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Premium easing (as tuple for framer-motion)
const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Animated words with proper sizing buffer
const HERO_WORDS = [
  { en: "Comfort", ar: "الراحة" },
  { en: "Elegance", ar: "الأناقة" },
  { en: "Luxury", ar: "الفخامة" },
];

// Video overlay scenes
const VIDEO_SCENES = [
  { en: "The Art of Rest", ar: "فن الراحة" },
  { en: "Crafted in Egypt", ar: "صناعة مصرية" },
  { en: "For Real Homes", ar: "لبيوت حقيقية" },
];

const HeroMasterpiece = () => {
  // States
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFadingOut, setVideoFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadedVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  // Preload video aggressively on mount
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/dandle-hero.mp4";
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.load();
    preloadedVideoRef.current = video;
    
    // Mark loaded
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Rotate animated words (static hero)
  useEffect(() => {
    if (showVideo) return;
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [showVideo]);

  // Rotate video scene text
  useEffect(() => {
    if (!showVideo || !videoReady) return;
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % VIDEO_SCENES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [showVideo, videoReady]);

  // Video progress & end handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      // Smooth fade out
      setVideoFadingOut(true);
      setTimeout(() => {
        setShowVideo(false);
        setVideoFadingOut(false);
        setVideoReady(false);
        setProgress(0);
        setCurrentScene(0);
      }, 800);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [showVideo]);

  // Play video handler
  const handlePlayVideo = useCallback(() => {
    setShowVideo(true);
    setVideoReady(false);
    setProgress(0);
    
    // Slight delay to ensure DOM is ready
    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.muted = isMuted;
        video.play()
          .then(() => setVideoReady(true))
          .catch(console.error);
      }
    });
  }, [isMuted]);

  // Skip video handler
  const handleSkipVideo = useCallback(() => {
    setVideoFadingOut(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setShowVideo(false);
      setVideoFadingOut(false);
      setVideoReady(false);
      setProgress(0);
      setCurrentScene(0);
    }, 600);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  // Scroll to products
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-obsidian"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ===== STATIC HERO BACKGROUND ===== */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <motion.img
          src="/images/relaxmax-hero-offwhite.jpg"
          alt="DANDLE Luxury Recliner"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, filter: "blur(6px)" }}
          animate={{ 
            scale: isLoaded ? 1 : 1.1, 
            filter: isLoaded ? "blur(0px)" : "blur(6px)" 
          }}
          transition={{ duration: 2, ease: LUXURY_EASE }}
        />
      </motion.div>

      {/* Gradient Overlays for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/40" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-obsidian via-obsidian/20 to-obsidian/50" />
      
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Ambient Champagne Orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none z-5"
        style={{
          background: "radial-gradient(circle, hsl(var(--champagne) / 0.06) 0%, transparent 60%)",
          top: "10%",
          right: "-10%",
        }}
        animate={{
          x: [0, 15, 0],
          y: [0, -10, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ===== STATIC HERO CONTENT ===== */}
      <AnimatePresence>
        {!showVideo && (
          <motion.div 
            className="relative z-20 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-24 max-w-7xl mx-auto"
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="pt-28 pb-16 md:pt-36 md:pb-20">
              {/* Pre-headline */}
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <motion.div 
                  className="h-px w-12 md:w-16 bg-gradient-to-r from-champagne/70 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                />
                <span className="text-xs md:text-sm text-champagne font-body font-light tracking-[0.25em] uppercase">
                  The Art of Rest
                </span>
              </motion.div>

              {/* Main Headline - "The Gift of" */}
              <motion.p
                className="text-cream/70 font-body font-light text-lg md:text-xl mb-3 tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                The Gift of
              </motion.p>
              
              {/* Animated Word - Fixed overflow with proper container */}
              <motion.div
                className="mb-6 md:mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: LUXURY_EASE }}
              >
                <div className="relative h-[72px] md:h-[100px] lg:h-[130px] overflow-visible">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={activeWord}
                      className="absolute left-0 font-headline text-6xl md:text-8xl lg:text-[9rem] text-cream leading-none tracking-tight font-light text-gradient-luxury whitespace-nowrap"
                      initial={{ y: 60, opacity: 0, scale: 0.98 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -50, opacity: 0, scale: 1.01 }}
                      transition={{ duration: 0.65, ease: LUXURY_EASE }}
                    >
                      {HERO_WORDS[activeWord].en}
                    </motion.h1>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                className="text-cream/60 font-body font-light text-base md:text-lg lg:text-xl max-w-md lg:max-w-lg mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7 }}
              >
                Premium Egyptian recliners crafted for real homes — calm comfort that lasts.
              </motion.p>

              {/* Trust Line */}
              <motion.div
                className="flex flex-wrap items-center gap-4 md:gap-6 mb-10 text-xs md:text-sm text-cream/50 font-body font-light tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.7 }}
              >
                <span>14-Day Delivery</span>
                <span className="w-px h-3 bg-champagne/40" />
                <span>5-Year Warranty</span>
                <span className="w-px h-3 bg-champagne/40" />
                <span>Free Installation</span>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.7 }}
              >
                <Button
                  onClick={scrollToProducts}
                  className="group relative overflow-hidden bg-transparent border border-champagne/50 hover:border-champagne text-cream px-8 md:px-10 py-5 md:py-6 text-sm font-body font-light tracking-[0.1em] uppercase rounded-none transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Explore Collection
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-champagne"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4, ease: LUXURY_EASE }}
                  />
                  <span className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 text-obsidian transition-opacity duration-300">
                    Explore Collection
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>

                <Button
                  onClick={handlePlayVideo}
                  variant="ghost"
                  className="group bg-cream/5 hover:bg-cream/10 border-0 text-cream/70 hover:text-cream px-6 md:px-8 py-5 md:py-6 text-sm font-body font-light tracking-wide rounded-none transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-full border border-cream/40 flex items-center justify-center mr-3 group-hover:border-cream/60 group-hover:scale-105 transition-all duration-300">
                    <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                  </div>
                  Watch Film
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator */}
      {!showVideo && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.7 }}
        >
          <span className="text-[10px] text-cream/40 font-body font-light tracking-[0.25em] uppercase">
            Scroll
          </span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-champagne/50 to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Side Accent - Desktop */}
      {!showVideo && (
        <motion.div
          className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-champagne/30 to-transparent" />
          <span className="text-[10px] text-champagne/50 font-body tracking-[0.15em] uppercase [writing-mode:vertical-lr] rotate-180">
            Since 2010
          </span>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-champagne/30 to-transparent" />
        </motion.div>
      )}

      {/* ===== FULLSCREEN VIDEO EXPERIENCE ===== */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 z-50 bg-obsidian"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoFadingOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
          >
            {/* Video - Full Screen, Portrait-Aware */}
            <video
              ref={videoRef}
              src="/dandle-hero.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              muted={isMuted}
              playsInline
              preload="auto"
              style={{
                transform: "translateZ(0)",
                willChange: "transform, opacity",
              }}
            />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

            {/* Bottom Gradient for Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-obsidian/30 pointer-events-none" />

            {/* Video Scene Text Overlay */}
            <AnimatePresence mode="wait">
              {videoReady && (
                <motion.div
                  className="absolute bottom-28 md:bottom-24 left-0 right-0 z-20 px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScene}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-center"
                    >
                      <p 
                        className="text-2xl md:text-4xl lg:text-5xl font-headline text-cream font-light tracking-tight"
                        style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
                      >
                        {VIDEO_SCENES[currentScene].en}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip Button - Top Right */}
            <motion.button
              onClick={handleSkipVideo}
              className="absolute top-20 md:top-24 right-4 md:right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-cream/10 backdrop-blur-xl border border-cream/20 hover:bg-cream/20 transition-all duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-sm text-cream font-medium">Skip</span>
              <X className="w-4 h-4 text-cream" />
            </motion.button>

            {/* Sound Toggle - Bottom Right */}
            <motion.button
              onClick={toggleMute}
              className="absolute bottom-20 md:bottom-24 right-4 md:right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-cream/10 backdrop-blur-xl border border-cream/20 hover:bg-cream/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-cream" />
              ) : (
                <Volume2 className="w-4 h-4 text-cream" />
              )}
              <span className="text-sm text-cream">
                {isMuted ? "Sound On" : "Sound Off"}
              </span>
            </motion.button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
              <div className="w-full h-1 bg-cream/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-champagne via-amber-300 to-champagne"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default HeroMasterpiece;
