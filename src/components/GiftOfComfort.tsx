import { motion } from "framer-motion";
import { Gift, Heart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getGiftCampaignBackground } from "@/utils/siteImageResolver";

// Get background from resolver (manifest-driven with fallback)
const backgroundImage = getGiftCampaignBackground();

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
    <section id="gift-of-comfort" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Gift of Comfort"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-obsidian/70" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span 
              className="text-xs text-champagne tracking-[0.2em] uppercase font-body font-light"
              data-en="Gift of Comfort"
              data-ar="هدية الراحة"
            >
              Gift of Comfort
            </span>
            
            <h2 
              className="font-headline text-4xl md:text-5xl text-warm-white mt-4 mb-6 font-light leading-tight"
              data-en="For Refined Taste"
              data-ar="لأصحاب الذوق الرفيع"
            >
              For Refined Taste
            </h2>
            
            <p 
              className="text-warm-white/70 text-lg font-body font-light leading-relaxed mb-10"
              data-en="Give someone exceptional comfort. A gift that becomes part of their daily life — quietly, beautifully, for years."
              data-ar="أهدِ شخصًا راحة استثنائية. هدية تصبح جزءًا من حياته اليومية — بهدوء، بجمال، لسنوات."
            >
              Give someone exceptional comfort. A gift that becomes part of their daily life — quietly, beautifully, for years.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="flex flex-wrap gap-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <feature.icon className="w-5 h-5 text-champagne stroke-[1.5]" />
                <span 
                  className="text-warm-white/80 text-sm font-body font-light"
                  data-en={feature.title}
                  data-ar={feature.titleAr}
                >
                  {feature.title}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              onClick={() => navigate('/gift')}
              className="btn-refined rounded-none"
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
