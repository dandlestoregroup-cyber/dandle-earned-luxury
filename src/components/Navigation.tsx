import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-card-foreground"
            >
              <Languages className="w-5 h-5" />
            </Button>
            <CartDrawer />
            <Button variant="hero" size="lg" onClick={() => navigate('/cart')}>
              {t('nav.shopNow')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-card-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
                  className="block py-3 text-card-foreground hover:text-accent transition-colors text-left w-full"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-card-foreground hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              )
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start mt-2"
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
            >
              <Languages className="w-5 h-5 mr-2" />
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full mt-4"
              onClick={() => {
                navigate('/cart');
                setIsOpen(false);
              }}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('nav.cart')} ({getTotalItems()})
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
