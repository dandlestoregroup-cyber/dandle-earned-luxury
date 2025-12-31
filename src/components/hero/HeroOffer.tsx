import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import HeroParticles from "./HeroParticles";
import HeroSnow from "./HeroSnow";
import AnimatedHeadline from "./AnimatedHeadline";

interface HeroOfferProps {
  onReplayVideo?: () => void;
}

const PROMO_CODE = "FESTIVE10";

const HeroOffer = ({ onReplayVideo }: HeroOfferProps) => {
  const [offerImage, setOfferImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      toast.success("Promo code copied!", { description: "Apply at checkout for 10% off" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

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
            alt="Dandle Recliners"
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
        {/* Animated Headline - Bilingual */}
        <div data-en="The Gift of Comfort" data-ar="هدية الراحة">
          <AnimatedHeadline 
            className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-white text-center mb-4"
            style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none', textWrap: 'balance' }}
            delay={0.4}
          >
            The Gift of Comfort
          </AnimatedHeadline>
        </div>

        {/* Subtitle - Bilingual */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-white/90 font-body text-center mb-3 max-w-3xl"
          style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)', wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          data-en="For refined taste"
          data-ar="لأصحاب الذوق الرفيع"
        >
          For refined taste
        </motion.p>

        {/* Proof Line - Bilingual */}
        <motion.p
          className="text-white/80 text-center font-body text-base md:text-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          data-en="Free delivery • 5-year warranty • White-glove service"
          data-ar="توصيل مجاني • ضمان 5 سنوات • خدمة راقية"
        >
          Free delivery • 5-year warranty • White-glove service
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto group bg-dandle-orange hover:bg-dandle-orange/90 text-white px-8 py-5 text-lg font-body shadow-lg transition-all duration-300"
            data-en="Find Your Perfect Recliner"
            data-ar="اعثر على كرسيك المثالي"
          >
            Find Your Perfect Recliner
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            onClick={() => {
              document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="outline"
            className="w-full sm:w-auto group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-5 text-lg font-body transition-all duration-300"
            data-en="Explore Collection"
            data-ar="استكشف المجموعة"
          >
            Explore Collection
          </Button>
        </motion.div>

        {/* Static Promo Block - De-emphasized, no countdown */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 max-w-md"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <p 
            className="text-white/90 text-center font-headline text-lg mb-1"
            data-en="Start 2026 in Comfort"
            data-ar="ابدأ 2026 براحة"
          >
            Start 2026 in Comfort
          </p>
          <p 
            className="text-white/70 text-center font-body text-sm mb-3"
            data-en="Up to 10% off + Free delivery + 5-year warranty"
            data-ar="خصم حتى 10% + توصيل مجاني + ضمان 5 سنوات"
          >
            Up to 10% off + Free delivery + 5-year warranty
          </p>
          <button
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-2 w-full group"
          >
            <span className="text-sm font-body text-white/60">Code:</span>
            <span className="text-lg font-headline font-semibold text-dandle-orange tracking-wider">
              {PROMO_CODE}
            </span>
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            )}
          </button>
          <p className="text-white/40 text-center font-body text-xs mt-2">Valid through January 15</p>
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
