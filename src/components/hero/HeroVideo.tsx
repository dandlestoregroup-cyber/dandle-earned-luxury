import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Gift, Volume2, VolumeX } from "lucide-react";
import HeroParticles from "./HeroParticles";

const SOUND_PREF_KEY = 'dandle_hero_sound_pref';

// Animated text overlay scenes (3-scene loop)
const OVERLAY_SCENES = [
  { en: "The Art of Rest", ar: "فن الراحة" },
  { en: "Crafted in Egypt. Made for real homes.", ar: "صناعة مصرية… لبيوت حقيقية." },
  { en: "White-glove service • 5-year warranty", ar: "خدمة راقية • ضمان 5 سنوات" },
];

interface HeroVideoProps {
  src: string;
  onEnded: () => void;
  onSkip: () => void;
}

const HeroVideo = ({ src, onEnded, onSkip }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem(SOUND_PREF_KEY);
    return saved !== 'unmuted'; // Default to muted
  });

  // Scene rotation (4s per scene)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % OVERLAY_SCENES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  // Handle sound toggle
  const toggleSound = () => {
    const video = videoRef.current;
    if (video) {
      const newMuted = !isMuted;
      video.muted = newMuted;
      setIsMuted(newMuted);
      localStorage.setItem(SOUND_PREF_KEY, newMuted ? 'muted' : 'unmuted');
    }
  };

  // Sync muted state with video on load
  useEffect(() => {
    const video = videoRef.current;
    if (video && isLoaded) {
      video.muted = isMuted;
    }
  }, [isLoaded, isMuted]);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full dandle-hero-video"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Poster image - shows immediately */}
      <img
        src="/dandle-og-image.jpg"
        alt="Dandle"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
      
      {/* Video Element - High Quality with instant play */}
      <video
        id="heroVideo"
        ref={videoRef}
        src={src}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={onEnded}
        preload="auto"
        style={{ 
          imageRendering: 'auto',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Soft radial vignette for cinematic feel */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.3)_100%)]" />

      {/* Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Brass particles floating upward */}
      <HeroParticles density={20} tone="brass" />

      {/* Festive Season Badge - Below navigation */}
      <motion.div
        className="absolute top-24 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -20 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dandle-orange/90 backdrop-blur-sm shadow-lg">
          <Gift className="w-4 h-4 text-white" />
          <span className="text-sm font-body text-white font-semibold tracking-wide">
            Festive Season 2025
          </span>
        </div>
      </motion.div>

      {/* Animated Text Overlay - 3 Scene Loop */}
      <div className="absolute bottom-20 left-0 right-0 z-20 pointer-events-none">
        {/* Subtle gradient scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        
        <div className="relative px-6 md:px-12 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <p 
                className="text-2xl md:text-4xl lg:text-5xl font-headline text-white font-semibold"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
                data-en={OVERLAY_SCENES[currentScene].en}
                data-ar={OVERLAY_SCENES[currentScene].ar}
              >
                {OVERLAY_SCENES[currentScene].en}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Skip Button */}
      <motion.button
        onClick={onSkip}
        className="absolute top-24 right-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all duration-300"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm text-white font-body">Skip</span>
        <ChevronRight className="w-4 h-4 text-white" />
      </motion.button>

      {/* Sound Toggle Pill - Bottom Right */}
      <motion.button
        onClick={toggleSound}
        className="absolute bottom-8 right-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black/70 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
        <span 
          className="text-sm text-white font-body"
          data-en={isMuted ? "Sound On" : "Sound Off"}
          data-ar={isMuted ? "تشغيل الصوت" : "إيقاف الصوت"}
        >
          {isMuted ? "Sound On" : "Sound Off"}
        </span>
      </motion.button>

      {/* Glowing Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="w-full h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-dandle-orange via-amber-400 to-dandle-orange"
            style={{ 
              width: `${progress}%`,
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HeroVideo;
