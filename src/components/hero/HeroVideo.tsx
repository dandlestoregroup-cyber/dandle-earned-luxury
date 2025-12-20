import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

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
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={onEnded}
      />

      {/* Dark Overlay for Text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Hero Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center px-6"
        >
          <h1 
            className="text-5xl md:text-7xl font-headline text-white mb-4"
            style={{ textShadow: '0 2px 30px rgba(0,0,0,0.8)' }}
            dir="rtl"
          >
            موسم الهدايا
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 font-body"
            style={{ textShadow: '0 1px 15px rgba(0,0,0,0.8)' }}
            dir="rtl"
          >
            راحتك، التزامنا
          </p>
        </motion.div>
      </div>

      {/* Skip Button */}
      <motion.button
        onClick={onSkip}
        className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all duration-300"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        dir="rtl"
      >
        <span className="text-sm text-white font-body">تخطي</span>
        <ChevronLeft className="w-4 h-4 text-white" />
      </motion.button>

      {/* Video Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="w-full h-1 bg-white/20">
          <motion.div
            className="h-full bg-dandle-orange"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HeroVideo;
