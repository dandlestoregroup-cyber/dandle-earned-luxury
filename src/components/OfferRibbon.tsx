import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";

const LOCAL_STORAGE_KEY = 'dandle_offer_ribbon_dismissed';

const OfferRibbon = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (dismissed !== 'true') {
      setIsVisible(true);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && isScrolled && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-bronze via-dandle-orange to-bronze shadow-lg"
        >
          <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-warm-white animate-pulse" />
              <span className="text-sm font-body text-warm-white font-medium tracking-wide">
                <span className="hidden sm:inline">
                  <span data-en="🎁 Festive Season Special: " data-ar="🎁 عرض موسم الأعياد: ">🎁 Festive Season Special: </span>
                </span>
                <span className="font-semibold" data-en="Free Installation" data-ar="تركيب مجاني">Free Installation</span>
                <span data-en=" on all orders" data-ar=" على جميع الطلبات"> on all orders</span>
              </span>
              <Sparkles className="w-4 h-4 text-warm-white hidden sm:block" />
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="#collection" 
                className="text-sm font-body text-warm-white underline underline-offset-2 hover:no-underline transition-all"
                data-en="Shop Now"
                data-ar="تسوق الآن"
              >
                Shop Now
              </a>
              <button
                onClick={handleDismiss}
                className="p-1 text-warm-white/80 hover:text-warm-white transition-colors"
                aria-label="Dismiss offer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferRibbon;
