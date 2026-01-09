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
      titleEn: "Free Setup",
      titleAr: "تركيب مجاني",
    }
  ];

  return (
    <section 
      id="gift-of-comfort" 
      className="relative min-h-[400px] md:min-h-[500px] overflow-hidden"
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
        {/* Strong overlay for text readability - increased opacity */}
        <div className="absolute inset-0 bg-deep-brown/95" />
      </div>
      
      {/* Content container with GUARANTEED safe-area on all sides */}
      <div className="relative z-10 w-full h-full">
        {/* Safe area padding container */}
        <div 
          className="container mx-auto h-full flex items-center"
          style={{
            paddingTop: 'max(2rem, env(safe-area-inset-top, 2rem))',
            paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))',
            paddingLeft: 'max(1.5rem, env(safe-area-inset-left, 1.5rem))',
            paddingRight: 'max(1.5rem, env(safe-area-inset-right, 1.5rem))',
          }}
        >
          <div className="max-w-xl py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {/* Label */}
              <span 
                className={`inline-block text-xs text-dandle-orange tracking-wide font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                {isArabic ? "هدية الراحة" : "Gift of Comfort"}
              </span>
              
              {/* Headline - max 2 lines, clamped font, strong shadow */}
              <h2 
                className={`text-off-white font-light leading-tight line-clamp-2 ${isArabic ? 'font-body-ar' : 'font-headline'}`}
                style={{ 
                  fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                  textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 4px 32px rgba(0,0,0,0.6)' 
                }}
              >
                {isArabic ? "لأصحاب الذوق الرفيع" : "For Refined Taste"}
              </h2>
              
              {/* Subline - max 2 lines, strong shadow */}
              <p 
                className={`text-off-white/90 font-light leading-relaxed max-w-lg line-clamp-2 ${isArabic ? 'font-body-ar' : 'font-body'}`}
                style={{ 
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  textShadow: '0 1px 12px rgba(0,0,0,0.8)' 
                }}
              >
                {isArabic 
                  ? "هدية تصبح جزءًا من حياته اليومية — بهدوء، بجمال، لسنوات."
                  : "A gift that becomes part of their daily life — quietly, beautifully, for years."
                }
              </p>
            </motion.div>

            {/* Features */}
            <motion.div 
              className="flex flex-wrap gap-4 md:gap-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <feature.icon 
                    className="w-4 h-4 text-dandle-orange stroke-[1.5]" 
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />
                  <span 
                    className={`text-off-white/95 text-xs md:text-sm font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
                  >
                    {isArabic ? feature.titleAr : feature.titleEn}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                onClick={() => navigate('/gift')}
                className={`bg-dandle-orange hover:bg-dandle-orange/90 text-off-white rounded-none px-6 py-5 font-medium tracking-wide shadow-xl ${isArabic ? 'font-body-ar' : 'font-body'}`}
                style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)' 
                }}
              >
                {isArabic ? "اختر الهدية المثالية" : "Find the Perfect Gift"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftOfComfort;