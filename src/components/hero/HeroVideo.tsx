import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Gift } from "lucide-react";
import HeroParticles from "./HeroParticles";

interface HeroVideoProps {
  src: string;
  onEnded: () => void;
  onSkip: () => void;
}

const HeroVideo = ({ src, onEnded, onSkip }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Element - High Quality */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay
        muted
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

      {/* Festive Season Badge - Simplified, no pulse */}
      <motion.div
        className="absolute top-6 left-6 z-20"
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

      {/* Skip Button */}
      <motion.button
        onClick={onSkip}
        className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all duration-300"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm text-white font-body">Skip</span>
        <ChevronRight className="w-4 h-4 text-white" />
      </motion.button>

      {/* Glowing Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="w-full h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-dandle-orange via-amber-400 to-dandle-orange"
            style={{ 
              width: `${progress}%`,
              animation: "glowPulse 2s ease-in-out infinite",
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HeroVideo;
