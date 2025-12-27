import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Default muted for button display
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if user has a saved preference
    const savedMutePreference = sessionStorage.getItem('heroVideoMuted');
    const userPrefersMuted = savedMutePreference === 'true';

    // Mobile autoplay requires muted, desktop can start unmuted
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile: Start muted for autoplay compatibility
      video.muted = true;
      setIsMuted(true);
      
      // If user previously unmuted, respect that after first interaction
      if (savedMutePreference === 'false') {
        const attemptUnmute = () => {
          video.muted = false;
          setIsMuted(false);
          document.removeEventListener('touchstart', attemptUnmute);
        };
        document.addEventListener('touchstart', attemptUnmute, { once: true });
      }
    } else {
      // Desktop: Start unmuted for first play (unless user previously muted)
      if (savedMutePreference === null) {
        video.muted = false;
        setIsMuted(false);
      } else {
        video.muted = userPrefersMuted;
        setIsMuted(userPrefersMuted);
      }
    }

    // Handle first play completion
    const handleTimeUpdate = () => {
      if (!hasPlayedOnce && video.currentTime > 0 && video.duration > 0) {
        // Check if we're near the end (within 0.5 seconds)
        if (video.duration - video.currentTime < 0.5) {
          setHasPlayedOnce(true);
          
          // Only auto-mute if user hasn't manually changed the setting
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
        
        // Only auto-mute if user hasn't manually changed the setting
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
      console.log('Toggle mute clicked. Current:', videoRef.current.muted, 'New:', newMutedState);
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      setUserHasInteracted(true);
      
      // Save user preference to session
      sessionStorage.setItem('heroVideoMuted', String(newMutedState));
      console.log('Video muted state after toggle:', videoRef.current.muted);
    } else {
      console.log('Video ref not available');
    }
  };

  return (
    <motion.section
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
          loop={false}
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
        {/* Gradient Overlay - More Colorful */}
        <div className="absolute inset-0 bg-gradient-to-br from-nile-blue/50 via-black/40 to-dandle-orange/30" />
        {/* Animated Gradient Accent */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-bronze/20 to-transparent"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut"
          }}
        />
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
          <span className="text-sm font-body text-warm-white">Comfort Crafted for the Finest</span>
        </motion.div>

        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="block text-warm-white">
            The seat you <span className="text-dandle-orange">keep</span> coming back to.
          </span>
        </h1>

        <p className="font-body text-lg md:text-xl text-warm-beige/90 mb-8 max-w-2xl mx-auto">
          Comfort crafted with intention — practical enough for every day, premium enough to finish the room.
        </p>

        {/* Belief Bullets */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-warm-white/90">
          <div className="flex items-center gap-2">
            <span className="text-dandle-orange">✓</span>
            <span className="font-body text-sm">You enjoy using it</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-dandle-orange">✓</span>
            <span className="font-body text-sm">You rely on it every day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-dandle-orange">✓</span>
            <span className="font-body text-sm">The room feels right now</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-[hsl(27,80%,52%)] hover:bg-[hsl(27,80%,45%)] text-warm-cream px-8 py-6 text-lg font-body rounded-md shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            Explore Collection
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-transparent backdrop-blur-md border-2 border-[hsl(15,28%,19%)] hover:bg-warm-white/10 text-warm-white px-8 py-6 text-lg font-body rounded-md transition-all duration-300"
          >
            Find Your Model
          </Button>
        </div>

        {/* Microline */}
        <p className="mt-6 text-warm-beige/70 text-sm font-body italic">
          Comfort crafted for the finest.
        </p>
      </motion.div>

      {/* Mute/Unmute Toggle Button */}
      <motion.button
        onClick={toggleMute}
        className="absolute bottom-24 right-8 p-3 rounded-full bg-warm-white/10 backdrop-blur-md border border-warm-white/30 hover:bg-warm-white/20 transition-all duration-300 group"
        style={{ zIndex: 1001 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-warm-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-warm-white" />
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
