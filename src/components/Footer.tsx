import { Facebook, Instagram, Phone } from "lucide-react";
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
    { labelEn: "About", labelAr: "من نحن", href: "/about" },
    { labelEn: "Warranty", labelAr: "الضمان", href: "/warranty" },
    { labelEn: "Delivery", labelAr: "التوصيل", href: "/delivery" },
    { labelEn: "FAQ", labelAr: "أسئلة شائعة", href: "/faq" },
    { labelEn: "Contact", labelAr: "تواصل", href: "/contact" },
    { labelEn: "Careers", labelAr: "الوظائف", href: "/careers" },
  ];

  const toolLinks = [
    { labelEn: "Gift Finder", labelAr: "دليل الهدايا", href: "/gift" },
    { labelEn: "Chair Finder", labelAr: "دليل الكرسي", href: "/chair-finder" },
    { labelEn: "Room Fit", labelAr: "مقاس الركن", href: "/room-fit" },
    { labelEn: "Compare", labelAr: "قارن", href: "/compare" },
  ];

  return (
    <footer 
      className="bg-deep-brown border-t border-dandle-orange/10" 
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{
        paddingTop: '3rem',
        paddingBottom: 'max(5rem, calc(3rem + env(safe-area-inset-bottom, 0px)))', // Extra bottom padding for WhatsApp button
      }}
    >
      <div className="container mx-auto px-6">
        {/* Logo & Tagline */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-headline text-3xl md:text-4xl font-light text-off-white tracking-tight mb-3">
            Dandle
          </h3>
          <p className={`text-off-white/70 text-sm tracking-[0.12em] font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}>
            {isArabic ? "راحة تصنع الفرق" : "Comfort That Transforms"}
          </p>
        </motion.div>
        
        {/* Navigation Links */}
        <motion.div 
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-off-white/80 hover:text-dandle-orange transition-colors duration-300 font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}
            >
              {isArabic ? link.labelAr : link.labelEn}
            </Link>
          ))}
        </motion.div>

        {/* Quick Tools Links */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <span className={`text-off-white/50 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
            {isArabic ? "أدوات:" : "Tools:"}
          </span>
          {toolLinks.map((link, index) => (
            <span key={link.href} className="flex items-center gap-2">
              <Link
                to={link.href}
                className={`text-dandle-orange/90 hover:text-dandle-orange transition-colors duration-300 font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}
              >
                {isArabic ? link.labelAr : link.labelEn}
              </Link>
              {index < toolLinks.length - 1 && <span className="text-off-white/30">•</span>}
            </span>
          ))}
        </motion.div>
        
        {/* Social Links */}
        <motion.div 
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <a
            href="https://facebook.com/dandlestoregroup"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-off-white/30 flex items-center justify-center text-off-white/70 hover:text-dandle-orange hover:border-dandle-orange/50 transition-all duration-300"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
          <a
            href="https://instagram.com/dandlestoregroup"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-off-white/30 flex items-center justify-center text-off-white/70 hover:text-dandle-orange hover:border-dandle-orange/50 transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
        </motion.div>
        
        {/* Phone Number */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.32, duration: 0.6 }}
        >
          <a 
            href="tel:+201222804255" 
            className="inline-flex items-center gap-2 text-off-white/90 hover:text-dandle-orange transition-colors text-base font-light"
          >
            <Phone size={16} className="text-dandle-orange" />
            <span dir="ltr">01222804255</span>
          </a>
        </motion.div>
        
        {/* Divider */}
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-dandle-orange/40 to-transparent mx-auto mb-6" />
        
        {/* LOCKED Service Info - verbatim per spec */}
        <motion.div 
          className="text-center mb-6 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <p className={`text-off-white/90 text-sm font-medium ${isArabic ? 'font-body-ar' : 'font-body'}`}>
            {isArabic 
              ? "التسليم خلال 14 يوم في جميع المحافظات. ضمان سنتين."
              : "Delivery in 14 days nationwide. 2-year warranty."
            }
          </p>
        </motion.div>
        
        {/* Copyright & Legal */}
        <div className={`text-center text-off-white/50 text-xs font-light space-y-2 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
          <p>
            {isArabic 
              ? `© ${currentYear} مجموعة داندل ستور`
              : `© ${currentYear} Dandle Store Group`
            }
          </p>
          <p>
            <Link to="/privacy" className="hover:text-off-white/80 transition-colors">
              {isArabic ? "الخصوصية" : "Privacy"}
            </Link>
            <span className="mx-2">·</span>
            <Link to="/terms" className="hover:text-off-white/80 transition-colors">
              {isArabic ? "الشروط" : "Terms"}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;