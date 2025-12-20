import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import HeroSlide from "./HeroSlide";
import HeroControls from "./HeroControls";
import { useHeroAnalytics } from "@/hooks/useHeroAnalytics";

// 9 Hero slides configuration
const heroSlides = [
  { color: 'Alexandria Linen', message: 'هدية الراحة الحقيقية' },
  { color: 'Mocha Taupe', message: 'ليالي الشتاء الدافئة' },
  { color: 'Giza Gold Weave', message: 'اهدِ من تحب' },
  { color: 'Desert Sage', message: 'استرخاء بلا حدود' },
  { color: 'Alexandria Linen', message: 'طقم العائلة الكامل' },
  { color: 'Nile Mist Terracotta', message: 'أناقة المساحات الصغيرة' },
  { color: 'Original Beige', message: 'هدية الاستقلالية' },
  { color: 'Desert Sage', message: 'رفيق الراحة' },
  { color: 'Mocha Taupe', message: 'إنتاجية بأناقة' },
];

const SLIDE_DURATION = 6670; // 60 seconds / 9 slides = 6.67s per slide
const MAX_LOOPS = 2;

interface HeroCarouselProps {
  musicUrl?: string;
  onReplayVideo?: () => void;
  useGeneratedImages?: boolean;
}

const HeroCarousel = ({ 
  musicUrl, 
  onReplayVideo,
  useGeneratedImages = false 
}: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [loopCount, setLoopCount] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { trackSlideView, trackCarouselComplete } = useHeroAnalytics();

  // Calculate progress (0-100 for current loop)
  const progress = ((currentSlide + 1) / heroSlides.length) * 100;

  // Handle slide transitions
  const nextSlide = useCallback(() => {
    if (!isPlaying || isComplete) return;

    setCurrentSlide(prev => {
      const next = prev + 1;
      
      if (next >= heroSlides.length) {
        // Completed one loop
        if (loopCount >= MAX_LOOPS) {
          setIsComplete(true);
          setIsPlaying(false);
          trackCarouselComplete(loopCount);
          return prev;
        } else {
          setLoopCount(prev => prev + 1);
          return 0;
        }
      }
      
      return next;
    });
  }, [isPlaying, isComplete, loopCount, trackCarouselComplete]);

  // Auto-advance timer
  useEffect(() => {
    if (isPlaying && !isComplete) {
      timerRef.current = setTimeout(nextSlide, SLIDE_DURATION);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentSlide, isPlaying, isComplete, nextSlide]);

  // Track slide views
  useEffect(() => {
    const slide = heroSlides[currentSlide];
    trackSlideView(currentSlide, slide.color, isMuted, loopCount);
  }, [currentSlide, isMuted, loopCount, trackSlideView]);

  // Audio control
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted || !isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [isMuted, isPlaying]);

  const handlePlayPause = () => {
    if (isComplete) {
      // Replay
      setIsComplete(false);
      setLoopCount(1);
      setCurrentSlide(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleReplay = () => {
    setIsComplete(false);
    setLoopCount(1);
    setCurrentSlide(0);
    setIsPlaying(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Background Audio */}
      {musicUrl && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          preload="auto"
        />
      )}

      {/* Slides */}
      <AnimatePresence mode="sync">
        {heroSlides.map((slide, index) => (
          <HeroSlide
            key={index}
            slideIndex={index}
            colorName={slide.color}
            arabicMessage={slide.message}
            isActive={index === currentSlide}
            useGeneratedImages={useGeneratedImages}
          />
        ))}
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 pointer-events-none" />

      {/* Completion Overlay */}
      {isComplete && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            <h2 
              className="text-3xl md:text-4xl font-headline text-white mb-6"
              dir="rtl"
            >
              شارك الراحة مع أحبائك
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleReplay}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-dandle-orange hover:bg-dandle-orange/90 text-white font-body transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                dir="rtl"
              >
                <RotateCcw className="w-5 h-5" />
                <span>إعادة التشغيل</span>
              </motion.button>

              {onReplayVideo && (
                <motion.button
                  onClick={onReplayVideo}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-body transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  dir="rtl"
                >
                  <span>مشاهدة الفيديو</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Controls */}
      {!isComplete && (
        <HeroControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          progress={progress}
          loopCount={loopCount}
          maxLoops={MAX_LOOPS}
          onPlayPause={handlePlayPause}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-6 bg-dandle-orange'
                : index < currentSlide
                ? 'w-1.5 bg-white/70'
                : 'w-1.5 bg-white/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
