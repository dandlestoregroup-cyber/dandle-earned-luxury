import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useShopifyCartStore } from "@/stores/shopifyCartStore";
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
    { label: "Home", href: "/", isRoute: true },
    { label: "Collection", href: "#collection" },
    { label: "Gift of Comfort", href: "#gift-of-comfort" },
    { label: "Our Story", href: "/our-story", isRoute: true },
    { label: "Careers", href: "/careers", isRoute: true },
    { label: "Contact", href: "#contact" },
    { label: "Nour ✨", href: "/nour-chat", isRoute: true, badge: "Soon" },
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
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
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
                >
                  {link.label}
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
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
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
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({getTotalItems()})
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
