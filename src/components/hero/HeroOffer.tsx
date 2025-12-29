import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift, RotateCcw } from "lucide-react";
import HeroParticles from "./HeroParticles";
import HeroSnow from "./HeroSnow";
import HeroCountdown from "./HeroCountdown";
import AnimatedHeadline from "./AnimatedHeadline";

interface HeroOfferProps {
  onReplayVideo?: () => void;
}

const HeroOffer = ({ onReplayVideo }: HeroOfferProps) => {
  const [offerImage, setOfferImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for AI-generated offer image
  useEffect(() => {
    const checkOfferImage = async () => {
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const imageUrl = `${baseUrl}/storage/v1/object/public/product-images/hero/festive-offer.webp`;
      
      try {
        const res = await fetch(imageUrl, { method: "HEAD" });
        if (res.ok) {
          setOfferImage(imageUrl);
        }
      } catch {
        // Use fallback
      }
      setIsLoading(false);
    };

    checkOfferImage();
  }, []);

  // Fallback image from assets
  const fallbackImage = "/images/relaxmax-hero-offwhite.jpg";
  const displayImage = offerImage || fallbackImage;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image with Ken Burns */}
      <div className="absolute inset-0 overflow-hidden bg-[hsl(0_0%_10%)]">
        {isLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-[hsl(0_0%_10%)] via-[hsl(216_58%_36%/0.3)] to-[hsl(0_0%_10%)]" />
        ) : (
          <motion.img
            src={displayImage}
            alt="Festive Season Offer"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 12, ease: "easeOut" }}
          />
        )}
      </div>

      {/* Soft radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.35)_100%)]" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40 pointer-events-none" />

      {/* Atmospheric Effects - lower z-index */}
      <div className="z-0">
        <HeroParticles density={18} tone="ivory" />
        <HeroSnow density={12} />
      </div>

      {/* Content - higher z-index */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
        {/* Festive Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dandle-orange/90 backdrop-blur-sm mb-4 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Gift className="w-4 h-4 text-white" />
          <span className="text-sm font-body text-white font-semibold">
            Dec 2025 – Jan 2026
          </span>
        </motion.div>

        {/* Countdown Timer */}
        <div className="mb-6">
          <HeroCountdown targetISO="2026-01-15T23:59:59+02:00" label="Festive ends in" />
        </div>

        {/* Animated Headline */}
        <AnimatedHeadline 
          className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-white text-center mb-4"
          delay={0.6}
        >
          Festive Season Sale
        </AnimatedHeadline>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white/90 font-body text-center mb-2"
          style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Up to 10% Off Premium Recliners
        </motion.p>

        {/* Offer Details - Simplified */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 mb-8 border border-white/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <p className="text-white/90 text-center font-body text-lg">
            <span className="text-dandle-orange font-semibold">Free Delivery</span> on all orders • 
            <span className="text-dandle-orange font-semibold"> 5-Year Warranty</span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto group bg-dandle-orange hover:bg-dandle-orange/90 text-white px-8 py-5 text-lg font-body shadow-lg transition-all duration-300"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          {onReplayVideo && (
            <Button
              onClick={onReplayVideo}
              variant="outline"
              className="w-full sm:w-auto group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-5 text-lg font-body transition-all duration-300"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Replay Video
            </Button>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
        initial={{ opacity: 0 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center p-2 bg-black/20 backdrop-blur-sm">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full shadow-lg"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
        <span className="text-xs text-white/70 font-body" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          Scroll to Explore
        </span>
      </motion.div>
    </motion.div>
  );
};

export default HeroOffer;
