import { motion } from "framer-motion";
import { Gift, Heart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getGiftCampaignBackground } from "@/utils/siteImageResolver";

// Get background from resolver (manifest-driven with fallback)
const { src: backgroundImage, fallbackSrc: backgroundFallback } = getGiftCampaignBackground();

const GiftOfComfort = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Gift,
      title: "Premium Presentation",
      titleAr: "تقديم فاخر",
    },
    {
      icon: Heart,
      title: "Personalized Note",
      titleAr: "رسالة شخصية",
    },
    {
      icon: Truck,
      title: "White-Glove Setup",
      titleAr: "تركيب راقي",
    }
  ];

  return (
    <section id="gift-of-comfort" className="relative py-24 md:py-32 overflow-hidden min-h-[60vh]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Gift of Comfort"
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== backgroundFallback) {
              e.currentTarget.src = backgroundFallback;
            }
          }}
        />
        {/* Stronger overlay for text readability */}
        <div className="absolute inset-0 bg-deep-brown/85" />
      </div>
      
      {/* Content container with safe-area padding */}
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-2xl py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span 
              className="text-xs text-dandle-orange tracking-[0.2em] uppercase font-body font-light drop-shadow-md"
              data-en="Gift of Comfort"
              data-ar="هدية الراحة"
            >
              Gift of Comfort
            </span>
            
            {/* Headline - clamped font sizes, max 2 lines */}
            <h2 
              className="font-headline text-[clamp(1.75rem,5vw,3rem)] text-off-white font-light leading-tight drop-shadow-lg"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
              data-en="For Refined Taste"
              data-ar="لأصحاب الذوق الرفيع"
            >
              For Refined Taste
            </h2>
            
            {/* Subline - one short line */}
            <p 
              className="text-off-white/80 text-base md:text-lg font-body font-light leading-relaxed max-w-xl drop-shadow-md"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
              data-en="A gift that becomes part of their daily life — quietly, beautifully, for years."
              data-ar="هدية تصبح جزءًا من حياته اليومية — بهدوء، بجمال، لسنوات."
            >
              A gift that becomes part of their daily life — quietly, beautifully, for years.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="flex flex-wrap gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <feature.icon className="w-5 h-5 text-dandle-orange stroke-[1.5] drop-shadow-sm" />
                <span 
                  className="text-off-white/90 text-sm font-body font-light drop-shadow-md"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                  data-en={feature.title}
                  data-ar={feature.titleAr}
                >
                  {feature.title}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              onClick={() => navigate('/gift')}
              className="bg-dandle-orange hover:bg-dandle-orange/90 text-off-white rounded-none px-8 py-6 font-body font-medium tracking-wide uppercase shadow-lg"
            >
              <span data-en="Find the Perfect Gift" data-ar="اختر الهدية المثالية">
                Find the Perfect Gift
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GiftOfComfort;
