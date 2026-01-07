import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-obsidian py-20 border-t border-champagne/10">
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
          <p 
            className="text-warm-white/70 text-sm tracking-[0.15em] uppercase font-body font-light"
            data-en="The Art of Rest"
            data-ar="فن الراحة"
          >
            The Art of Rest
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
              className="text-warm-white/80 hover:text-champagne transition-colors duration-300 font-body font-light tracking-wide link-underline"
              data-en={link.labelEn}
              data-ar={link.labelAr}
            >
              {link.labelEn}
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
          <span className="text-warm-white/60 uppercase tracking-widest" data-en="Quick Tools" data-ar="أدوات سريعة">Quick Tools:</span>
          {toolLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-champagne/90 hover:text-champagne transition-colors duration-300 font-body font-light"
              data-en={link.labelEn}
              data-ar={link.labelAr}
            >
              {link.labelEn}
            </Link>
          ))}
        </motion.div>
        
        {/* Social Links */}
        <motion.div 
          className="flex justify-center gap-6 mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <a
            href="https://facebook.com/dandlestore"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-warm-white/80 hover:text-champagne hover:border-champagne/50 transition-all duration-300"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
          <a
            href="https://instagram.com/dandlestore"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-warm-white/80 hover:text-champagne hover:border-champagne/50 transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
        </motion.div>
        
        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent mx-auto mb-10" />
        
        {/* Copyright */}
        <div className="text-center text-warm-white/60 text-xs font-body font-light tracking-wide space-y-2">
          <p data-en={`© ${currentYear} Dandle Store Group`} data-ar={`© ${currentYear} مجموعة داندل ستور`}>
            © {currentYear} Dandle Store Group
          </p>
          <p className="text-warm-white/50">
            <Link to="/privacy" className="hover:text-warm-white/80 transition-colors">Privacy</Link>
            <span className="mx-3">·</span>
            <Link to="/terms" className="hover:text-warm-white/80 transition-colors">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
