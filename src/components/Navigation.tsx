import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import CartDrawer from "@/components/CartDrawer";

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
    { labelEn: "Home", labelAr: "الرئيسية", href: "/", isRoute: true },
    { labelEn: "Collection", labelAr: "المجموعة", href: "#collection" },
    { labelEn: "Gift of Comfort", labelAr: "هدية الراحة", href: "#gift-of-comfort" },
    { labelEn: "Our Story", labelAr: "قصتنا", href: "/our-story", isRoute: true },
    { labelEn: "Careers", labelAr: "الوظائف", href: "/careers", isRoute: true },
    { labelEn: "Contact", labelAr: "تواصل", href: "#contact" },
    { labelEn: "Nour ✨", labelAr: "نور ✨", href: "/nour-chat", isRoute: true, badge: "Soon", badgeAr: "قريباً" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg" : "bg-charcoal/40 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')} 
            className="font-serif text-3xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className={cn(
              "transition-colors",
              isScrolled ? "text-foreground" : "text-warm-white"
            )}>DANDLE</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center gap-1",
                    isScrolled ? "text-card-foreground hover:text-accent" : "text-warm-white hover:text-accent"
                  )}
                >
                  <span data-en={link.labelEn} data-ar={link.labelAr}>{link.labelEn}</span>
                  {link.badge && (
                    <span 
                      className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full"
                      data-en={link.badge}
                      data-ar={link.badgeAr}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isScrolled ? "text-card-foreground hover:text-accent" : "text-warm-white hover:text-accent"
                  )}
                  data-en={link.labelEn}
                  data-ar={link.labelAr}
                >
                  {link.labelEn}
                </a>
              )
            ))}
            <CartDrawer />
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate('/#collection')}
              data-en="Place Your Order"
              data-ar="قدّم طلبك"
            >
              Place Your Order
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "md:hidden transition-colors",
              isScrolled ? "text-card-foreground" : "text-warm-white"
            )}
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
                  className="flex items-center gap-2 py-3 text-card-foreground hover:text-accent transition-colors text-left w-full"
                >
                  <span data-en={link.labelEn} data-ar={link.labelAr}>{link.labelEn}</span>
                  {link.badge && (
                    <span 
                      className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full"
                      data-en={link.badge}
                      data-ar={link.badgeAr}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-card-foreground hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                  data-en={link.labelEn}
                  data-ar={link.labelAr}
                >
                  {link.labelEn}
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
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span data-en={`Cart (${getTotalItems()})`} data-ar={`السلة (${getTotalItems()})`}>
                Cart ({getTotalItems()})
              </span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;