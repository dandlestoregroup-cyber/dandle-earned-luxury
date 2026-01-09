import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LCornerFrame from "@/components/ui/LCornerFrame";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

// Refined easing
const REFINED_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Video overlay scenes - Arabic ONLY for Arabic text, English ONLY for English
const VIDEO_SCENES = [
  { en: "Comfort That Transforms", ar: "راحة تصنع الفرق" },
  { en: "Crafted in Egypt", ar: "صناعة مصرية" },
  { en: "For Real Homes", ar: "لبيوت حقيقية" },
];

// Hero belief rotation - 4th line: non-snobby version per spec
const BELIEF_STATEMENTS = [
  { en: "This is my seat.", ar: "هذا مقعدي." },
  { en: "The room feels right.", ar: "الغرفة تبدو صحيحة." },
  { en: "I enjoy using it.", ar: "أستمتع باستخدامه." },
  { en: "A gift I'd be happy to give.", ar: "هدية أسعد بتقديمها." },
];

const HeroMasterpiece = () => {
  // States
  const [lang, setLang] = useState<LangKey>('ar');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFadingOut, setVideoFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  const [currentBelief, setCurrentBelief] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Language detection
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

  // Auto-play video on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.muted = true;
        video.play()
          .then(() => setVideoReady(true))
          .catch(() => {
            setShowVideo(false);
          });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Rotate video scene text
  useEffect(() => {
    if (!showVideo || !videoReady) return;
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % VIDEO_SCENES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [showVideo, videoReady]);

  // Rotate belief statements in static hero
  useEffect(() => {
    if (showVideo) return;
    const interval = setInterval(() => {
      setCurrentBelief((prev) => (prev + 1) % BELIEF_STATEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [showVideo]);

  // Video progress & end handling - fade out 2 seconds before end to hide "Mediterra" artifact
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
        
        // Fade out 2 seconds before end to hide "Mediterra" artifact
        const timeRemaining = video.duration - video.currentTime;
        if (timeRemaining <= 2 && !videoFadingOut) {
          setVideoFadingOut(true);
          setTimeout(() => {
            video.pause();
            setShowVideo(false);
            setVideoFadingOut(false);
            setVideoReady(false);
            setProgress(0);
            setCurrentScene(0);
          }, 800);
        }
      }
    };

    const handleEnded = () => {
      if (!videoFadingOut) {
        setVideoFadingOut(true);
        setTimeout(() => {
          setShowVideo(false);
          setVideoFadingOut(false);
          setVideoReady(false);
          setProgress(0);
          setCurrentScene(0);
        }, 800);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [showVideo, videoFadingOut]);

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
      className="relative min-h-screen w-full overflow-hidden bg-deep-brown"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ===== FULLSCREEN VIDEO EXPERIENCE ===== */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 z-50 bg-deep-brown"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoFadingOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: REFINED_EASE }}
          >
            {/* Video - Full Screen */}
            <video
              ref={videoRef}
              src="/dandle-hero.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              muted={isMuted}
              playsInline
              preload="auto"
              poster="/images/relaxmax-hero-offwhite.jpg"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-deep-brown via-deep-brown/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-brown/60 via-transparent to-deep-brown/40 pointer-events-none" />

            {/* Scene Text Overlay - Proper language direction */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: REFINED_EASE }}
              >
                <div className="text-center px-6">
                  {/* English text - LTR */}
                  <h2 
                    className="font-headline text-4xl md:text-6xl lg:text-7xl text-off-white font-light tracking-wide"
                    dir="ltr"
                  >
                    {VIDEO_SCENES[currentScene].en}
                  </h2>
                  {/* Arabic text - RTL */}
                  <p 
                    className="font-body-ar text-xl md:text-2xl text-dandle-orange/90 mt-4" 
                    dir="rtl"
                  >
                    {VIDEO_SCENES[currentScene].ar}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
              {/* Progress Bar */}
              <div className="w-full h-0.5 bg-off-white/20 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-dandle-orange"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={handleSkipVideo}
                  variant="ghost"
                  className="text-off-white/70 hover:text-off-white hover:bg-off-white/10 text-sm font-body font-light tracking-wide"
                >
                  {isArabic ? "تخطي" : "Skip"}
                  <X className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full border border-off-white/30 hover:border-off-white/60 text-off-white/70 hover:text-off-white"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* L-Corner Brackets on Video */}
            <LCornerFrame className="absolute inset-0 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== STATIC HERO (After video ends) ===== */}
      <AnimatePresence>
        {!showVideo && (
          <motion.div 
            className="relative z-10 min-h-screen bg-off-white"
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* L-Corner Brackets */}
            <LCornerFrame className="absolute inset-0 z-30 pointer-events-none" />
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/images/relaxmax-hero-offwhite.jpg" 
                alt="Dandle Recliner"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-off-white via-off-white/95 to-off-white/80" />
            </div>
            
            {/* Content */}
            <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 h-full min-h-screen relative z-20">
              <div className="flex flex-col justify-center min-h-screen py-28 md:py-32 lg:py-24 max-w-3xl">
                
                {/* Pre-headline */}
                <motion.div
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <div className="h-0.5 w-12 md:w-16 bg-dandle-orange" />
                  <span className="text-xs md:text-sm text-dandle-orange font-body font-medium tracking-wide">
                    Dandle Recliners
                  </span>
                </motion.div>

                {/* Main Headline - Changed per spec: not repeating belief line */}
                <motion.h1
                  className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-deep-brown leading-none tracking-tight font-bold mb-4 ${isArabic ? 'font-body-ar' : 'font-headline'}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: REFINED_EASE }}
                >
                  {isArabic ? (
                    <>
                      المكان<br />
                      <span className="text-dandle-orange">اكتمل</span>
                    </>
                  ) : (
                    <>
                      The Room<br />
                      <span className="text-dandle-orange">Feels Complete</span>
                    </>
                  )}
                </motion.h1>

                {/* Divider */}
                <motion.div
                  className="h-0.5 w-32 bg-dandle-orange mb-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                />

                {/* Subline - Locked Hook with full version per spec */}
                <motion.p
                  className={`text-deep-brown/80 text-base md:text-lg mb-4 max-w-xl ${isArabic ? 'font-body-ar' : 'font-body'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                >
                  {isArabic 
                    ? "تعرف أنك وجدته لحظة ما تشوفه. راحة صُنعت لأصحاب الذوق الرفيع. أهدِ نفسك هدية الراحة 🎁"
                    : "You know you found it the moment you see it. Comfort crafted for the finest. Give yourself the gift of comfort 🎁"
                  }
                </motion.p>

                {/* Rotating Belief Statement */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentBelief}
                    className={`text-dandle-orange font-medium text-lg md:text-xl mb-8 ${isArabic ? 'font-body-ar' : 'font-body'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isArabic 
                      ? BELIEF_STATEMENTS[currentBelief].ar 
                      : BELIEF_STATEMENTS[currentBelief].en
                    }
                  </motion.p>
                </AnimatePresence>

                {/* Trust Line */}
                <motion.div
                  className={`flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-deep-brown/60 font-light tracking-wide mb-10 ${isArabic ? 'font-body-ar' : 'font-body'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                >
                  <span>{isArabic ? "توصيل خلال ١٤ يوم" : "14-Day Delivery"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-dandle-orange" />
                  <span>{isArabic ? "ضمان سنتين" : "2-Year Warranty"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-dandle-orange" />
                  <span>{isArabic ? "تركيب مجاني" : "Free Installation"}</span>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.7 }}
                >
                  {/* Primary CTA - WhatsApp */}
                  <Button
                    onClick={() => window.open('https://wa.link/dandle-recliners', '_blank', 'noopener,noreferrer')}
                    className="group relative overflow-hidden bg-dandle-orange hover:bg-dandle-orange/90 text-off-white px-8 md:px-10 py-5 md:py-6 text-sm font-body font-medium tracking-wide rounded-none transition-all duration-500"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isArabic ? "قدّم طلبك" : "Place Your Order"}
                      <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ${isArabic ? 'rotate-180' : ''}`} />
                    </span>
                  </Button>

                  {/* Secondary CTA - Explore Collection */}
                  <Button
                    onClick={scrollToProducts}
                    variant="ghost"
                    className="group bg-transparent hover:bg-deep-brown/5 border-2 border-deep-brown/30 hover:border-deep-brown text-deep-brown px-6 md:px-8 py-5 md:py-6 text-sm font-body font-medium tracking-wide rounded-none transition-all duration-300"
                  >
                    {isArabic ? "استكشف المجموعة" : "Explore Collection"}
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Brand Lock at Bottom */}
            <motion.div
              className="absolute bottom-8 left-0 right-0 z-30 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <p className="font-headline text-xl md:text-2xl text-dandle-orange font-bold tracking-wide">
                Dandle
              </p>
              <div className="w-20 h-0.5 bg-dandle-orange mx-auto my-2" />
              <p className="font-body text-xs text-deep-brown/60 tracking-wide">
                Recliners
              </p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className={`absolute bottom-8 z-30 hidden lg:flex flex-col items-center gap-3 ${isArabic ? 'left-8' : 'right-8'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.7 }}
            >
              <span className="text-[10px] text-deep-brown/40 font-body font-light tracking-wide">
                {isArabic ? "مرر" : "Scroll"}
              </span>
              <motion.div
                className="w-px h-10 bg-gradient-to-b from-dandle-orange/50 to-transparent"
                animate={{ scaleY: [1, 0.5, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default HeroMasterpiece;