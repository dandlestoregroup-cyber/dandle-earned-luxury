import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroVideo from "./HeroVideo";
import HeroCarousel from "./HeroCarousel";
import { useHeroAnalytics } from "@/hooks/useHeroAnalytics";

const LOCAL_STORAGE_KEY = 'dandle_hero_video_seen';
const VIDEO_SRC = '/dandle-hero.mp4';

interface HeroGiftingSeasonProps {
  useGeneratedImages?: boolean;
  musicUrl?: string;
}

const HeroGiftingSeason = ({ 
  useGeneratedImages = false,
  musicUrl = ''
}: HeroGiftingSeasonProps) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'video' | 'carousel'>('video');
  const [hasSeenVideo, setHasSeenVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState(VIDEO_SRC);
  const { trackVideoComplete, resetTimer } = useHeroAnalytics();

  // Check if returning visitor
  useEffect(() => {
    const seen = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (seen === 'true') {
      setPhase('carousel');
      setHasSeenVideo(true);
    }
  }, []);

  const handleVideoEnd = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setHasSeenVideo(true);
    setPhase('carousel');
    trackVideoComplete();
    resetTimer();
  };

  const handleSkipVideo = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setHasSeenVideo(true);
    setPhase('carousel');
    resetTimer();
  };

  const handleReplayVideo = () => {
    setPhase('video');
    resetTimer();
  };

  return (
    <motion.section
      className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Phase Content */}
      <AnimatePresence mode="wait">
        {phase === 'video' ? (
          <HeroVideo
            key="video"
            src={videoSrc}
            onEnded={handleVideoEnd}
            onSkip={handleSkipVideo}
          />
        ) : (
          <HeroCarousel
            key="carousel"
            musicUrl={musicUrl}
            onReplayVideo={hasSeenVideo ? handleReplayVideo : undefined}
            useGeneratedImages={useGeneratedImages}
          />
        )}
      </AnimatePresence>

      {/* CTA Overlay - Always visible, properly positioned for mobile */}
      <motion.div
        className="absolute inset-x-0 z-20 px-4 md:px-6 flex flex-col items-center justify-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 80, damping: 20 }}
        style={{ top: '35%', transform: 'translateY(-50%)' }}
      >
        {/* Floating Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/50 backdrop-blur-md border border-dandle-orange/60 mb-4 md:mb-6 shadow-lg"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-dandle-orange" />
          <span className="text-xs md:text-sm font-body text-white font-semibold">Crafted Since 2010</span>
        </motion.div>

        {/* Main heading - cleaner mobile layout */}
        <h1 
          className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-center"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}
        >
          <span className="block text-white">
            DANDLE
          </span>
          <span className="block text-2xl md:text-4xl lg:text-5xl text-white/90 mt-1 md:mt-2 font-medium">
            Because You've Earned It
          </span>
        </h1>

        {/* Description - simplified for mobile */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8 max-w-lg">
          <p 
            className="font-body text-sm md:text-lg text-white/90 leading-relaxed text-center"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
          >
            Egyptian-crafted luxury recliners for lasting comfort
          </p>
        </div>

        {/* CTA Buttons - stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-md">
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto group bg-dandle-orange hover:bg-dandle-orange/90 text-white px-6 md:px-8 py-4 md:py-5 text-base md:text-lg font-body shadow-lg transition-all duration-300"
          >
            Explore Collection
            <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => navigate('/nour-chat')}
            variant="outline"
            className="w-full sm:w-auto group bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 text-white px-6 md:px-8 py-4 md:py-5 text-base md:text-lg font-body transition-all duration-300"
          >
            <Sparkles className="mr-2 w-4 h-4 md:w-5 md:h-5" />
            View in AR
          </Button>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/80 flex items-start justify-center p-2 bg-black/20 backdrop-blur-sm">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full shadow-lg"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
        <span className="text-xs text-white/80 font-body" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>Scroll</span>
      </motion.div>
    </motion.section>
  );
};

export default HeroGiftingSeason;
