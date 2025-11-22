import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  const navigate = useNavigate();

  return (
    <motion.section
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Hero Video */}
      <div className="absolute inset-0">
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
          className="absolute bottom-6 right-6 z-10 bg-background/80 hover:bg-background/90 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110 touch-target"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </button>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/60" />
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
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
        >
          <Sparkles className="w-4 h-4 text-dandle-orange" />
          <span className="text-sm font-body text-warm-white">Crafted Since 2010</span>
        </motion.div>

        <h1 className="font-headline text-2xl md:text-4xl lg:text-8xl font-bold mb-6">
          <span className="block bg-gradient-to-r from-warm-white via-warm-beige to-bronze bg-clip-text text-transparent">
            DANDLE
          </span>
          <span className="block text-warm-white mt-2">Because You've Earned It</span>
        </h1>
        
        <p className="font-body text-base md:text-xl text-warm-beige/90 mb-10 max-w-2xl mx-auto px-4">
          Egyptian-crafted luxury recliners designed for those who value lasting comfort and quiet excellence
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Button 
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-gradient-to-r from-dandle-orange to-dandle-orange/80 hover:from-dandle-orange/90 hover:to-dandle-orange/70 text-white px-8 py-6 text-lg font-body shadow-elegant hover:shadow-glow transition-all duration-300 ease-out touch-target"
          >
            Explore Collection
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            disabled
            className="group bg-warm-white/10 backdrop-blur-md border border-warm-white/30 text-warm-white px-8 py-6 text-lg font-body opacity-60 cursor-not-allowed touch-target"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            View in Your Space (Coming Soon)
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
