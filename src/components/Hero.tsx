import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero slides: images + video
  const heroSlides = [
    { type: 'video', src: '/dandle-hero.mp4' },
    { type: 'image', src: '/images/relaxmax-lifestyle-night.png', alt: 'RelaxMax in elegant night setting' },
    { type: 'image', src: '/images/cozycompanion-couple-lifestyle.jpg', alt: 'CozyCompanion couple enjoying comfort' },
    { type: 'image', src: '/images/relaxmax-brown-lifestyle.jpg', alt: 'RelaxMax brown in lifestyle setting' },
    { type: 'image', src: '/images/relaxmax-lifestyle-day.png', alt: 'RelaxMax in bright daytime setting' },
    { type: 'image', src: '/images/relaxmax-hero-offwhite.jpg', alt: 'RelaxMax hero shot' },
  ];

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoPlaying, heroSlides.length]);

  // Video handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedMutePreference = sessionStorage.getItem('heroVideoMuted');
    const userPrefersMuted = savedMutePreference === 'true';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      video.muted = true;
      setIsMuted(true);

      if (savedMutePreference === 'false') {
        const attemptUnmute = () => {
          video.muted = false;
          setIsMuted(false);
          document.removeEventListener('touchstart', attemptUnmute);
        };
        document.addEventListener('touchstart', attemptUnmute, { once: true });
      }
    } else {
      if (savedMutePreference === null) {
        video.muted = false;
        setIsMuted(false);
      } else {
        video.muted = userPrefersMuted;
        setIsMuted(userPrefersMuted);
      }
    }

    const handleTimeUpdate = () => {
      if (!hasPlayedOnce && video.currentTime > 0 && video.duration > 0) {
        if (video.duration - video.currentTime < 0.5) {
          setHasPlayedOnce(true);

          if (!userHasInteracted) {
            video.muted = true;
            setIsMuted(true);
            sessionStorage.setItem('heroVideoMuted', 'true');
          }
        }
      }
    };

    const handleEnded = () => {
      if (!hasPlayedOnce) {
        setHasPlayedOnce(true);
        video.loop = true;

        if (!userHasInteracted) {
          video.muted = true;
          setIsMuted(true);
          sessionStorage.setItem('heroVideoMuted', 'true');
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [hasPlayedOnce, userHasInteracted]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      setUserHasInteracted(true);
      sessionStorage.setItem('heroVideoMuted', String(newMutedState));
    }

    // Also control background audio if present
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <motion.section
      className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Background Audio - Optional */}
      <audio ref={audioRef} loop muted>
        {/* Add your background music file here */}
        {/* <source src="/hero-music.mp3" type="audio/mpeg" /> */}
      </audio>

      {/* Hero Slides (Images + Video) */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          {currentSlideData.type === 'video' ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full bg-black"
            >
              <video
                ref={videoRef}
                src={currentSlideData.src}
                className="w-full h-full object-cover"
                autoPlay
                loop
                playsInline
                preload="auto"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`image-${currentSlide}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 w-full h-full bg-black"
            >
              <img
                src={currentSlideData.src}
                alt={currentSlideData.alt}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

        {/* Subtle animated gradient accent */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-nile-blue/20 via-transparent to-dandle-orange/20"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content Overlay with improved contrast */}
      <motion.div
        className="relative z-10 px-6 max-w-5xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}
      >
        {/* Floating Badge with better visibility */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-dandle-orange/60 mb-6 shadow-lg"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Sparkles className="w-4 h-4 text-dandle-orange" />
          <span className="text-sm font-body text-white font-semibold">Crafted Since 2010</span>
        </motion.div>

        {/* Main heading with text shadow for better visibility */}
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
          <span className="block bg-gradient-to-r from-white via-warm-beige to-bronze bg-clip-text text-transparent">
            DANDLE
          </span>
          <span className="block text-white mt-2">Because You've Earned It</span>
        </h1>

        {/* Description with background for better readability */}
        <div className="inline-block bg-black/30 backdrop-blur-sm rounded-lg px-6 py-3 mb-10">
          <p className="font-body text-lg md:text-xl text-white leading-relaxed max-w-2xl" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}>
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

      {/* Carousel Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/30 hover:bg-black/60 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/30 hover:bg-black/60 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-dandle-orange'
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mute/Unmute Toggle Button - Repositioned */}
      <motion.button
        onClick={toggleMute}
        className="absolute top-24 right-8 z-30 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/30 hover:bg-black/60 transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* Scroll Indicator - Repositioned to avoid overlap */}
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

export default Hero;
