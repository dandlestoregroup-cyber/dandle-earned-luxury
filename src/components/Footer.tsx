import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Our Story", href: "/our-story" },
    { label: "About Us", href: "/about" },
    { label: "Warranty", href: "/warranty" },
    { label: "Delivery", href: "/delivery" },
    { label: "Careers", href: "/careers" },
  ];

  const customerService = [
    { label: "Payment", href: "/payment" },
    { label: "Installation", href: "/installation" },
    { label: "Returns", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-card text-card-foreground py-12 border-t border-gold/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-3xl font-bold mb-4">
              <span className="text-gradient-luxury">DANDLE</span>
            </h3>
            <p className="text-card-foreground/80 mb-4 max-w-md">
              Creating world-class recliners that serve as tangible symbols of
              achievement. Where comfort meets sophistication.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-card-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-card-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 text-card-foreground">
              Customer Service
            </h4>
            <ul className="space-y-2">
              {customerService.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-card-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-card-foreground">Contact</h4>
            <ul className="space-y-2 text-card-foreground/80">
              <li>01222804255</li>
              <li>Tell.me@DandleStoreGroup.com</li>
              <li className="pt-2 text-sm">Daily: 10AM-3PM & 7PM-9PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/10 text-center text-card-foreground/60 text-sm">
          <p>
            © {currentYear} Dandle Store Group. All rights reserved. | Crafted
            with care for those who appreciate earned luxury.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
