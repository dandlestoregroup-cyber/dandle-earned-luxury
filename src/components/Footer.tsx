import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const products = [
    { label: "RelaxMax", href: "/product/relaxmax" },
    { label: "ComfortPlus", href: "/product/comfortplus" },
    { label: "Diva", href: "/product/diva" },
    { label: "CozyCompanion", href: "/product/cozycompanion" },
    { label: "WorkNest", href: "/product/worknest" },
    { label: "SpaceSaver", href: "/product/spacesaver" },
    { label: "EasyUp", href: "/product/easyup" },
    { label: "Complete Sets", href: "/complete-set" },
  ];

  const partners = [
    { label: "Istikbal Showrooms", href: "/contact" },
    { label: "OMASH", href: "/#products" },
    { label: "Vivian", href: "/#products" },
  ];

  const support = [
    { label: "Warranty", href: "/warranty" },
    { label: "Delivery", href: "/delivery" },
    { label: "Installation", href: "/installation" },
    { label: "Returns", href: "/returns" },
    { label: "FAQ", href: "/faq" },
  ];

  const company = [
    { label: "Our Story", href: "/our-story" },
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-charcoal text-warm-white py-16 border-t border-bronze/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-headline text-3xl font-bold mb-4">
              <span className="text-dandle-orange">DANDLE</span>
            </h3>
            <p className="text-warm-white/70 mb-4 text-sm leading-relaxed">
              Comfort crafted for the finest.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/dandlestore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-white/60 hover:text-dandle-orange transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com/dandlestore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-white/60 hover:text-dandle-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-body font-semibold mb-4 text-warm-white text-sm uppercase tracking-wide">
              Products
            </h4>
            <ul className="space-y-2">
              {products.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 hover:text-dandle-orange transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-body font-semibold mb-4 text-warm-white text-sm uppercase tracking-wide">
              Partners
            </h4>
            <ul className="space-y-2">
              {partners.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 hover:text-dandle-orange transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold mb-4 text-warm-white text-sm uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-2">
              {support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 hover:text-dandle-orange transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h4 className="font-body font-semibold mb-4 text-warm-white text-sm uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 mb-6">
              {company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 hover:text-dandle-orange transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-bronze/20">
              <p className="text-warm-white/80 text-sm">01222804255</p>
              <p className="text-warm-white/60 text-xs mt-1">Daily: 10AM-3PM & 7PM-9PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-bronze/20 text-center text-warm-white/50 text-xs space-y-2">
          <p>
            © {currentYear} Dandle Store Group. All rights reserved.
          </p>
          <p>
            Dandle™, RelaxMax™, and CozyCompanion™ are trademarks of Dandle Store Group.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
