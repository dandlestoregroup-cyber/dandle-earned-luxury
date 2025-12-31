import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const products = [
    { label: "RelaxMax", href: "#products" },
    { label: "ComfortPlus", href: "#products" },
    { label: "Diva", href: "#products" },
    { label: "CozyCompanion", href: "#products" },
    { label: "WorkNest", href: "#products" },
    { label: "SpaceSaver", href: "#products" },
    { label: "EasyUp", href: "#products" },
    { label: "Complete Sets", href: "/complete-set" },
  ];

  const partners = [
    { label: "Istikbal", href: "/contact" },
    { label: "OMASH", href: "#partners" },
    { label: "Vivian", href: "#partners" },
  ];

  const support = [
    { label: "Gift of Comfort", href: "/#gift-of-comfort" },
    { label: "About Us", href: "/about" },
    { label: "Warranty", href: "/warranty" },
    { label: "Delivery", href: "/delivery" },
    { label: "FAQ", href: "/faq" },
    { label: "Returns", href: "/returns" },
  ];

  return (
    <footer className="bg-dandle-brown text-warm-cream py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-headline text-3xl font-bold mb-4 text-warm-cream">
              DANDLE
            </h3>
            <p className="text-warm-cream/80 mb-4 max-w-md font-body leading-relaxed">
              Comfort crafted for the finest.
            </p>
            <p className="text-warm-cream/60 text-sm font-body mb-6">
              Egyptian-crafted luxury recliners designed for those who value lasting comfort and quiet excellence.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-warm-cream/70 hover:text-dandle-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="#"
                className="text-warm-cream/70 hover:text-dandle-orange transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-headline font-semibold mb-4 text-warm-cream">
              Products
            </h4>
            <ul className="space-y-2">
              {products.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-warm-cream/70 hover:text-dandle-orange transition-colors text-sm font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-headline font-semibold mb-4 text-warm-cream">
              Partners
            </h4>
            <ul className="space-y-2">
              {partners.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-warm-cream/70 hover:text-dandle-orange transition-colors text-sm font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-headline font-semibold mb-4 mt-6 text-warm-cream">
              Support
            </h4>
            <ul className="space-y-2">
              {support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-warm-cream/70 hover:text-dandle-orange transition-colors text-sm font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-headline font-semibold mb-4 text-warm-cream">Contact</h4>
            <ul className="space-y-3 text-warm-cream/70 text-sm font-body">
              <li>
                <a
                  href="https://wa.me/201222804255"
                  className="hover:text-dandle-orange transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp: 01222804255
                </a>
              </li>
              <li>
                <a
                  href="mailto:Tell.me@DandleStoreGroup.com"
                  className="hover:text-dandle-orange transition-colors"
                >
                  Tell.me@DandleStoreGroup.com
                </a>
              </li>
              <li className="pt-2 text-warm-cream/50">
                Daily: 10AM-3PM & 7PM-9PM
              </li>
              <li className="pt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-dandle-orange hover:text-warm-cream transition-colors font-medium"
                >
                  Find Showroom Locations →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-warm-cream/10 text-center">
          <p className="text-warm-cream/50 text-sm font-body">
            © {currentYear} Dandle Store Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
