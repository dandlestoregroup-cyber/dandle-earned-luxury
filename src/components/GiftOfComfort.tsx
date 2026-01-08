import { motion } from "framer-motion";
import { Gift, Heart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getGiftCampaignBackground } from "@/utils/siteImageResolver";
import { useState, useEffect } from "react";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

// Get background from resolver (manifest-driven with fallback)
const { src: backgroundImage, fallbackSrc: backgroundFallback } = getGiftCampaignBackground();

const GiftOfComfort = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<LangKey>('ar');

  useEffect(() => {
    const storedLang = getLangFromStorage();
    setLang(storedLang);
    const interval = setInterval(() => {
      const currentLang = getLangFromStorage();
      setLang(prev => prev !== currentLang ? currentLang : prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isArabic = lang === 'ar';
  
  const features = [
    {
      icon: Gift,
      titleEn: "Premium Presentation",
      titleAr: "تقديم فاخر",
    },
    {
      icon: Heart,
      titleEn: "Personalized Note",
      titleAr: "رسالة شخصية",
    },
    {
      icon: Truck,
      titleEn: "White-Glove Setup",
      titleAr: "تركيب راقي",
    }
  ];

  return (
    <section 
      id="gift-of-comfort" 
      className="relative py-24 md:py-32 overflow-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Image with proper containment */}
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
        {/* Strong overlay for text readability */}
        <div className="absolute inset-0 bg-deep-brown/90" />
      </div>
      
      {/* Content container with guaranteed safe-area */}
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-2xl py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span 
              className={`text-xs text-dandle-orange tracking-[0.2em] uppercase font-light drop-shadow-md ${isArabic ? 'font-body-ar' : 'font-body'}`}
            >
              {isArabic ? "هدية الراحة" : "Gift of Comfort"}
            </span>
            
            {/* Headline - max 2 lines, clamped font */}
            <h2 
              className={`text-[clamp(1.5rem,4vw,2.5rem)] text-off-white font-light leading-tight ${isArabic ? 'font-body-ar' : 'font-headline'}`}
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
            >
              {isArabic ? "لأصحاب الذوق الرفيع" : "For Refined Taste"}
            </h2>
            
            {/* Subline - one short line */}
            <p 
              className={`text-off-white/85 text-sm md:text-base font-light leading-relaxed max-w-lg ${isArabic ? 'font-body-ar' : 'font-body'}`}
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
            >
              {isArabic 
                ? "هدية تصبح جزءًا من حياته اليومية — بهدوء، بجمال، لسنوات."
                : "A gift that becomes part of their daily life — quietly, beautifully, for years."
              }
            </p>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="flex flex-wrap gap-4 md:gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 md:gap-3">
                <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-dandle-orange stroke-[1.5] drop-shadow-sm" />
                <span 
                  className={`text-off-white/90 text-xs md:text-sm font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                >
                  {isArabic ? feature.titleAr : feature.titleEn}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 md:mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              onClick={() => navigate('/gift')}
              className={`bg-dandle-orange hover:bg-dandle-orange/90 text-off-white rounded-none px-6 md:px-8 py-5 md:py-6 font-medium tracking-wide uppercase shadow-lg ${isArabic ? 'font-body-ar' : 'font-body'}`}
            >
              {isArabic ? "اختر الهدية المثالية" : "Find the Perfect Gift"}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GiftOfComfort;