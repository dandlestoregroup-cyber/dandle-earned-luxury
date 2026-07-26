import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

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
    { label: "Gift of Comfort", href: "#gift-of-comfort" },
    { label: "Collection", href: "#products" },
    { label: "Complete Set", href: "/complete-set", isRoute: true },
    { label: "AR View", href: "#ar-demo" },
    { label: "About", href: "#story" },
    { label: "Contact", href: "#contact" },
    { label: "Ask Nour", href: "/nour-chat", isRoute: true },
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
              className="relative"
              onClick={() => navigate("/cart")}
              aria-label={`Open cart with ${getTotalItems()} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs text-accent-foreground">
                  {getTotalItems()}
                </span>
              )}
            </Button>
            <Button variant="hero" size="lg" onClick={() => navigate('/#collection')}>
              Shop Now
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
