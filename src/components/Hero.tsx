import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

const Hero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [showStills, setShowStills] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Three-frame still sequence after scroll
  const frames = [
    { image: "/images/premium/frame-01.jpg", duration: 4000 },
    { image: "/images/premium/frame-06.jpg", duration: 3000 },
    { image: "/images/premium/frame-13.jpg", duration: 3000 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30 && !showStills) {
        setShowStills(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showStills]);

  useEffect(() => {
    if (!showStills) return;
    
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, frames[currentFrame].duration);

    return () => clearInterval(timer);
  }, [showStills, currentFrame, frames]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.section
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Hero Video or Still Sequence */}
      <div className="absolute inset-0">
        {!showStills ? (
          <>
            <video
              ref={videoRef}
              src="/dandle-hero.mp4"
              className="w-full h-full object-cover brightness-90"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{ 
                minWidth: '100%', 
                minHeight: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-6 right-6 z-10 bg-background/80 hover:bg-background/90 backdrop-blur-sm p-3 rounded-full transition-all duration-200 hover:scale-110 touch-target"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-foreground" />
              )}
            </button>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentFrame}
              src={frames[currentFrame].image}
              alt=""
              className="w-full h-full object-cover brightness-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            />
          </AnimatePresence>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        className="relative z-10 text-warm-white px-4 sm:px-6 max-w-5xl mx-auto w-full"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}
      >
        <h1 className="font-headline text-5xl md:text-6xl lg:text-8xl mb-6 font-normal">
          <span className="block">DANDLE</span>
          <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 opacity-90">
            الراحة المستحقة
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Button 
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium shadow-elegant hover:shadow-glow transition-all duration-200 ease-out touch-target"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </motion.div>

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
