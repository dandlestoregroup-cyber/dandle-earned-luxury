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

      {/* CTA Overlay - Always visible */}
      <motion.div
        className="absolute z-20 px-6 max-w-5xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 80, damping: 20 }}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        {/* Floating Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-dandle-orange/60 mb-6 shadow-lg"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Sparkles className="w-4 h-4 text-dandle-orange" />
          <span className="text-sm font-body text-white font-semibold">Crafted Since 2010</span>
        </motion.div>

        {/* Main heading */}
        <h1 
          className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          <span className="block bg-gradient-to-r from-white via-warm-beige to-bronze bg-clip-text text-transparent">
            DANDLE
          </span>
          <span className="block text-white mt-2">Because You've Earned It</span>
        </h1>

        {/* Description */}
        <div className="inline-block bg-black/30 backdrop-blur-sm rounded-lg px-6 py-3 mb-10">
          <p 
            className="font-body text-lg md:text-xl text-white leading-relaxed max-w-2xl"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}
          >
            Egyptian-crafted luxury recliners designed for those who value lasting comfort and quiet excellence
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-gradient-to-r from-dandle-orange to-dandle-orange/80 hover:from-dandle-orange/90 hover:to-dandle-orange/70 text-white px-8 py-6 text-lg font-body shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            Explore Collection
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => navigate('/nour-chat')}
            className="group bg-white/90 backdrop-blur-md border-2 border-white hover:bg-white text-nile-blue px-8 py-6 text-lg font-body font-semibold transition-all duration-300 shadow-lg"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            View in Your Space
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
