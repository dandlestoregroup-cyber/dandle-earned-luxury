import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
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

  const links = [
    { labelEn: "Collection", labelAr: "المجموعة", href: "/#products" },
    { labelEn: "Our Story", labelAr: "قصتنا", href: "/our-story" },
    { labelEn: "Careers", labelAr: "الوظائف", href: "/careers" },
    { labelEn: "Contact", labelAr: "تواصل", href: "/contact" },
    { labelEn: "Warranty", labelAr: "الضمان", href: "/warranty" },
    { labelEn: "Delivery", labelAr: "التوصيل", href: "/delivery" },
  ];

  const toolLinks = [
    { labelEn: "Gift Finder", labelAr: "دليل الهدايا", href: "/gift" },
    { labelEn: "Room Fit", labelAr: "مقاس الركن", href: "/room-fit" },
  ];

  return (
    <footer className="bg-deep-brown py-20 border-t border-dandle-orange/10" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Logo & Tagline */}
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-headline text-4xl md:text-5xl font-light text-warm-white tracking-tight mb-4">
            DANDLE
          </h3>
          <p className={`text-warm-white/70 text-sm tracking-[0.15em] uppercase font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}>
            {isArabic ? "راحة تصنع الفرق" : "Comfort That Transforms"}
          </p>
        </motion.div>
        
        {/* Navigation Links */}
        <motion.div 
          className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-warm-white/80 hover:text-dandle-orange transition-colors duration-300 font-light tracking-wide link-underline ${isArabic ? 'font-body-ar' : 'font-body'}`}
            >
              {isArabic ? link.labelAr : link.labelEn}
            </Link>
          ))}
        </motion.div>

        {/* Quick Tools Links */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 text-xs mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <span className={`text-warm-white/60 uppercase tracking-widest ${isArabic ? 'font-body-ar' : 'font-body'}`}>
            {isArabic ? "أدوات سريعة:" : "Quick Tools:"}
          </span>
          {toolLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-dandle-orange/90 hover:text-dandle-orange transition-colors duration-300 font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}
            >
              {isArabic ? link.labelAr : link.labelEn}
            </Link>
          ))}
        </motion.div>
        
        {/* Social Links - Updated to dandlestoregroup */}
        <motion.div 
          className="flex justify-center gap-6 mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <a
            href="https://facebook.com/dandlestoregroup"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-warm-white/40 flex items-center justify-center text-warm-white/80 hover:text-dandle-orange hover:border-dandle-orange/50 transition-all duration-300"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
          <a
            href="https://instagram.com/dandlestoregroup"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-warm-white/40 flex items-center justify-center text-warm-white/80 hover:text-dandle-orange hover:border-dandle-orange/50 transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
        </motion.div>
        
        {/* Phone Number */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.32, duration: 0.6 }}
        >
          <a 
            href="tel:+201222804255" 
            className={`text-warm-white/90 hover:text-dandle-orange transition-colors text-lg font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}
          >
            01222804255
          </a>
        </motion.div>
        
        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-dandle-orange/30 to-transparent mx-auto mb-10" />
        
        {/* Locked Service Info */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <p className={`text-warm-white/80 text-sm font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}>
            {isArabic 
              ? "التسليم خلال 14 يوم في جميع المحافظات. ضمان سنتين."
              : "Delivery in 14 days nationwide. 2-year warranty."
            }
          </p>
        </motion.div>
        
        {/* Copyright */}
        <div className={`text-center text-warm-white/60 text-xs font-light tracking-wide space-y-2 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
          <p>
            {isArabic 
              ? `© ${currentYear} مجموعة داندل ستور`
              : `© ${currentYear} Dandle Store Group`
            }
          </p>
          <p className="text-warm-white/50">
            <Link to="/privacy" className="hover:text-warm-white/80 transition-colors">
              {isArabic ? "الخصوصية" : "Privacy"}
            </Link>
            <span className="mx-3">·</span>
            <Link to="/terms" className="hover:text-warm-white/80 transition-colors">
              {isArabic ? "الشروط" : "Terms"}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;