import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import CartDrawer from "@/components/CartDrawer";
import { useTranslation } from "react-i18next";
import { toggleLanguage, getCurrentLanguage, isRTL } from "@/i18n/config";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set initial RTL direction
  useEffect(() => {
    document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const handleLanguageToggle = () => {
    const newLang = toggleLanguage();
    setCurrentLang(newLang);
  };

  const navLinks = [
    { label: t('nav.home'), href: "/", isRoute: true },
    { label: t('nav.collection'), href: "#collection" },
    { label: t('nav.completeSet'), href: "/complete-set", isRoute: true },
    { label: t('nav.arView'), href: "#ar-demo" },
    { label: t('nav.about'), href: "#story" },
    { label: t('nav.contact'), href: "#contact" },
    { label: t('nav.nourAI'), href: "/nour-chat", isRoute: true },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="font-serif text-3xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-gradient-luxury">DANDLE</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="text-sm font-medium text-card-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-card-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}

            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-1 text-sm font-medium transition-colors"
              aria-label="Toggle language"
            >
              <span className={cn(
                "transition-colors",
                currentLang === 'en' ? "text-[#d4af37] font-bold" : "text-card-foreground hover:text-accent"
              )}>
                EN
              </span>
              <span className="text-card-foreground/50">|</span>
              <span className={cn(
                "transition-colors font-arabic",
                currentLang === 'ar' ? "text-[#d4af37] font-bold" : "text-card-foreground hover:text-accent"
              )}>
                العربية
              </span>
            </button>

            <CartDrawer />
            <Button variant="hero" size="lg" onClick={() => navigate('/#collection')}>
              {t('nav.shopNow')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              aria-label="Toggle language"
            >
              <span className={cn(
                "transition-colors",
                currentLang === 'en' ? "text-[#d4af37] font-bold" : "text-card-foreground"
              )}>
                EN
              </span>
              <span className="text-card-foreground/50">|</span>
              <span className={cn(
                "transition-colors font-arabic",
                currentLang === 'ar' ? "text-[#d4af37] font-bold" : "text-card-foreground"
              )}>
                العربية
              </span>
            </button>

            <button
              className="text-card-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in-up">
            {navLinks.map((link) => (
              link.isRoute ? (
                <button
                  key={link.href}
                  onClick={() => {
                    navigate(link.href);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "block py-3 text-card-foreground hover:text-accent transition-colors w-full",
                    isRTL() ? "text-right" : "text-left"
                  )}
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block py-3 text-card-foreground hover:text-accent transition-colors",
                    isRTL() ? "text-right" : "text-left"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              )
            ))}
            <Button
              variant="hero"
              size="lg"
              className="w-full mt-4"
              onClick={() => {
                navigate('/cart');
                setIsOpen(false);
              }}
            >
              <ShoppingCart className={cn("w-5 h-5", isRTL() ? "ml-2" : "mr-2")} />
              {t('nav.cart')} ({getTotalItems()})
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
