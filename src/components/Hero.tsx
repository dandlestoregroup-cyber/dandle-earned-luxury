import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Animated text overlay scenes
const overlayScenes = [
  { en: "The Art of Rest", ar: "فن الراحة" },
  { en: "Crafted in Egypt. Made for real homes.", ar: "صناعة مصرية… لبيوت حقيقية." },
  { en: "White-glove service • 5-year warranty", ar: "خدمة راقية • ضمان 5 سنوات" },
];

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Default muted
  const [currentScene, setCurrentScene] = useState(0);
  const [isArabic, setIsArabic] = useState(false);

  // Check for Arabic language
  useEffect(() => {
    const checkLanguage = () => {
      setIsArabic(document.documentElement.lang === 'ar');
    };
    checkLanguage();

    const observer = new MutationObserver(checkLanguage);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  // Video sound preference from localStorage (persisted)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if user has a saved preference in localStorage
    const savedMutePreference = localStorage.getItem('dandleHeroMuted');

    // Always start muted for autoplay compatibility and user preference
    video.muted = true;
    setIsMuted(true);

    // Only unmute if user explicitly saved preference as unmuted
    if (savedMutePreference === 'false') {
      // Attempt to unmute after user interaction
      const attemptUnmute = () => {
        if (videoRef.current) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
        document.removeEventListener('click', attemptUnmute);
        document.removeEventListener('touchstart', attemptUnmute);
      };
      document.addEventListener('click', attemptUnmute, { once: true });
      document.addEventListener('touchstart', attemptUnmute, { once: true });
    }
  }, []);

  // Animated text overlay scene rotation (4 seconds each)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % overlayScenes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);

      // Save user preference to localStorage (persists across sessions)
      localStorage.setItem('dandleHeroMuted', String(newMutedState));
    }
  };

  const scene = overlayScenes[currentScene];

  return (
    <motion.section
      id="gift-of-comfort"
      className="relative h-[70vh] w-full flex items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Hero Video */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src="/dandle-hero.mp4"
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />

        {/* Scrim overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

        {/* Animated Text Overlay - 3 scene loop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center px-4"
            >
              <p
                className="font-headline text-2xl md:text-4xl lg:text-5xl text-white font-semibold max-w-4xl mx-auto"
                style={{
                  textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                  fontFamily: isArabic ? 'Cairo, sans-serif' : '"Cormorant Garamond", serif'
                }}
              >
                {isArabic ? scene.ar : scene.en}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="relative z-10 text-warm-white px-6 max-w-5xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}
      >
        {/* Floating Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dandle-orange/20 backdrop-blur-md border border-dandle-orange/40 mb-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Sparkles className="w-4 h-4 text-dandle-orange" />
          <span className="text-sm font-body text-warm-white">
            {isArabic ? "صُنعت بحب للأرقى" : "Comfort Crafted for the Finest"}
          </span>
        </motion.div>

        <h1
          className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
        >
          <span className="block text-warm-white">
            {isArabic ? (
              <>هدية <span className="text-dandle-orange">الراحة</span></>
            ) : (
              <>The <span className="text-dandle-orange">Gift</span> of Comfort</>
            )}
          </span>
          <span className="block text-warm-white text-2xl md:text-3xl lg:text-4xl mt-2 font-normal">
            {isArabic ? "للذوق الرفيع" : "For refined taste"}
          </span>
        </h1>

        <p className="font-body text-lg md:text-xl text-warm-beige/90 mb-8 max-w-2xl mx-auto">
          {isArabic
            ? "راحة صُنعت بعناية — عملية لكل يوم، فاخرة تُكمل الغرفة."
            : "Comfort crafted with intention — practical enough for every day, premium enough to finish the room."
          }
        </p>

        {/* Belief Bullets */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-warm-white/90">
          <div className="flex items-center gap-2">
            <span className="text-dandle-orange">✓</span>
            <span className="font-body text-sm">{isArabic ? "تستمتع باستخدامه" : "You enjoy using it"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-dandle-orange">✓</span>
            <span className="font-body text-sm">{isArabic ? "تعتمد عليه كل يوم" : "You rely on it every day"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-dandle-orange">✓</span>
            <span className="font-body text-sm">{isArabic ? "الغرفة أصبحت مكتملة" : "The room feels right now"}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-[hsl(27,80%,52%)] hover:bg-[hsl(27,80%,45%)] text-warm-cream px-8 py-6 text-lg font-body rounded-md shadow-subtle hover:shadow-luxury transition-all duration-300"
          >
            {isArabic ? "استكشف المجموعة" : "Explore Collection"}
            <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isArabic ? 'mr-2 rotate-180' : 'ml-2'}`} />
          </Button>
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-transparent backdrop-blur-md border-2 border-[hsl(15,28%,19%)] hover:bg-warm-white/10 text-warm-white px-8 py-6 text-lg font-body rounded-md transition-all duration-300"
          >
            {isArabic ? "اختر موديلك" : "Find Your Model"}
          </Button>
        </div>

        {/* Promo block - static (valid through Jan 15) */}
        <p className="mt-6 text-warm-beige/70 text-sm font-body italic">
          {isArabic ? "عرض خاص حتى 15 يناير" : "Special offer valid through January 15"}
        </p>
      </motion.div>

      {/* Sound Toggle Button with label - bottom right */}
      <motion.button
        onClick={toggleMute}
        className="absolute bottom-24 right-8 flex items-center gap-2 px-4 py-2 rounded-full bg-warm-white/10 backdrop-blur-md border border-warm-white/30 hover:bg-warm-white/20 transition-all duration-300"
        style={{ zIndex: 1001 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-5 h-5 text-warm-white" />
            <span className="text-sm text-warm-white font-body">
              {isArabic ? "تشغيل الصوت" : "Sound Off"}
            </span>
          </>
        ) : (
          <>
            <Volume2 className="w-5 h-5 text-warm-white" />
            <span className="text-sm text-warm-white font-body">
              {isArabic ? "إيقاف الصوت" : "Sound On"}
            </span>
          </>
        )}
      </motion.button>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-bronze/60 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-bronze rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
