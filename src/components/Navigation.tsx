import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import CartDrawer from "@/components/CartDrawer";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { labelEn: "Collection", labelAr: "المجموعة", href: "#products" },
    { labelEn: "Our Story", labelAr: "قصتنا", href: "/our-story", isRoute: true },
    { labelEn: "Careers", labelAr: "الوظائف", href: "/careers", isRoute: true },
    { labelEn: "Contact", labelAr: "تواصل", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={cn(
        "fixed z-50 transition-all duration-500",
        isScrolled 
          ? "top-0 left-0 right-0 bg-obsidian/90 backdrop-blur-xl shadow-elegant border-b border-champagne/10" 
          : "top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 rounded-2xl bg-obsidian/60 backdrop-blur-lg border border-white/10"
      )}
    >
      <div className={cn(
        "mx-auto px-4 md:px-8",
        isScrolled ? "container" : ""
      )}>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.button 
            onClick={() => navigate('/')} 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-serif text-2xl md:text-3xl font-light tracking-tight text-warm-white">
              DANDLE
            </span>
            <motion.span 
              className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-champagne to-transparent group-hover:w-full transition-all duration-500"
            />
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link, index) => (
              link.isRoute ? (
                <motion.button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="relative text-sm font-body font-light text-warm-white/80 hover:text-warm-white transition-colors tracking-wide link-underline"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <span data-en={link.labelEn} data-ar={link.labelAr}>{link.labelEn}</span>
                </motion.button>
              ) : (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-body font-light text-warm-white/80 hover:text-warm-white transition-colors tracking-wide link-underline"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  data-en={link.labelEn}
                  data-ar={link.labelAr}
                >
                  {link.labelEn}
                </motion.a>
              )
            ))}
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <CartDrawer />
              <Button 
                className="btn-luxury text-xs px-6 py-3 rounded-none"
                onClick={() => navigate('/#products')}
                data-en="Explore"
                data-ar="استكشف"
              >
                Explore
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-warm-white/80 hover:text-warm-white transition-colors p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden py-6 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map((link, index) => (
                link.isRoute ? (
                  <motion.button
                    key={link.href}
                    onClick={() => {
                      navigate(link.href);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left py-3 text-warm-white/80 hover:text-warm-white transition-colors font-body font-light tracking-wide"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span data-en={link.labelEn} data-ar={link.labelAr}>{link.labelEn}</span>
                  </motion.button>
                ) : (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="block py-3 text-warm-white/80 hover:text-warm-white transition-colors font-body font-light tracking-wide"
                    onClick={() => setIsOpen(false)}
                    data-en={link.labelEn}
                    data-ar={link.labelAr}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.labelEn}
                  </motion.a>
                )
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  className="w-full mt-4 btn-luxury rounded-none"
                  onClick={() => {
                    navigate('/cart');
                    setIsOpen(false);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span data-en={`Cart (${getTotalItems()})`} data-ar={`السلة (${getTotalItems()})`}>
                    Cart ({getTotalItems()})
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
