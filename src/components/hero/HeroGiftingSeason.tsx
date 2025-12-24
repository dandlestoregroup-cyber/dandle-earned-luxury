import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroVideo from "./HeroVideo";
import HeroOffer from "./HeroOffer";
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
  const [phase, setPhase] = useState<'video' | 'offer'>('video');
  const [hasSeenVideo, setHasSeenVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState(VIDEO_SRC);
  const { trackVideoComplete, resetTimer } = useHeroAnalytics();

  // Check if returning visitor
  useEffect(() => {
    const seen = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (seen === 'true') {
      setPhase('offer');
      setHasSeenVideo(true);
    }
  }, []);

  const handleVideoEnd = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setHasSeenVideo(true);
    setPhase('offer');
    trackVideoComplete();
    resetTimer();
  };

  const handleSkipVideo = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setHasSeenVideo(true);
    setPhase('offer');
    resetTimer();
  };

  const handleReplayVideo = () => {
    setPhase('video');
    resetTimer();
  };

  return (
    <motion.section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {phase === 'video' ? (
          <HeroVideo
            key="video"
            src={videoSrc}
            onEnded={handleVideoEnd}
            onSkip={handleSkipVideo}
          />
        ) : (
          <HeroOffer
            key="offer"
            onReplayVideo={hasSeenVideo ? handleReplayVideo : undefined}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default HeroGiftingSeason;
