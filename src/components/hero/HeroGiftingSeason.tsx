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
}

const HeroGiftingSeason = ({ 
  useGeneratedImages = false
}: HeroGiftingSeasonProps) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'video' | 'carousel'>('video');
  const [hasSeenVideo, setHasSeenVideo] = useState(false);
  const [videoSrc] = useState(VIDEO_SRC);
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
            onReplayVideo={hasSeenVideo ? handleReplayVideo : undefined}
            useGeneratedImages={useGeneratedImages}
          />
        )}
      </AnimatePresence>

      {/* CTA Overlay - Positioned at bottom to not cover carousel text */}
      <motion.div
        className="absolute bottom-32 left-0 right-0 z-20 px-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 80, damping: 20 }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Floating Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-dandle-orange/60 mb-4 shadow-lg"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-dandle-orange" />
            <span className="text-sm font-body text-white font-semibold">Journey Began 2010</span>
          </motion.div>

          {/* Bilingual Headline */}
          <h1 
            className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}
          >
            <span className="block bg-gradient-to-r from-white via-warm-beige to-bronze bg-clip-text text-transparent">
              DANDLE
            </span>
            <span className="block text-white text-2xl md:text-3xl lg:text-4xl mt-2">
              Because You've Earned It
            </span>
            <span 
              className="block text-white/90 text-xl md:text-2xl lg:text-3xl mt-1 font-arabic"
              dir="rtl"
            >
              لأنك تستحق الراحة
            </span>
          </h1>

          {/* Description - Bilingual */}
          <div className="inline-block bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 mb-6">
            <p 
              className="font-body text-base md:text-lg text-white leading-relaxed max-w-2xl"
              style={{ textShadow: '0 2px 15px rgba(0,0,0,0.9)' }}
            >
              Egyptian-crafted luxury recliners for lasting comfort
            </p>
            <p 
              className="font-body text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mt-1"
              dir="rtl"
            >
              كراسي استرخاء مصرية فاخرة لراحة لا تنتهي
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group bg-gradient-to-r from-dandle-orange to-dandle-orange/80 hover:from-dandle-orange/90 hover:to-dandle-orange/70 text-white px-6 py-5 text-base font-body shadow-elegant hover:shadow-glow transition-all duration-300"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate('/nour-chat')}
              className="group bg-white/90 backdrop-blur-md border-2 border-white hover:bg-white text-nile-blue px-6 py-5 text-base font-body font-semibold transition-all duration-300 shadow-lg"
            >
              <Sparkles className="mr-2 w-4 h-4" />
              View in Your Space
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-white/80 flex items-start justify-center p-1.5 bg-black/20 backdrop-blur-sm">
          <motion.div
            className="w-1 h-1 bg-white rounded-full shadow-lg"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroGiftingSeason;
