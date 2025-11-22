import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Warranty Information", href: "#warranty" },
    { label: "Care Guide", href: "#care" },
    { label: "Gifting Options", href: "#gifting" },
    { label: "Privacy Policy", href: "#privacy" },
  ];

  return (
    <footer className="bg-card text-card-foreground py-20 border-t border-gold/20">
      <div className="container mx-auto px-6 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-headline text-3xl font-bold mb-4">
              <span className="text-gradient-luxury">DANDLE</span>
            </h3>
            <p className="text-card-foreground/80 mb-4 max-w-md leading-relaxed">
              Creating world-class recliners that serve as tangible symbols of
              achievement. Where comfort meets sophistication.
            </p>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="hover:text-accent transition-colors ease-out touch-target"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors ease-out touch-target"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors ease-out touch-target"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
            </div>
            {/* Partner Logos */}
            <div className="flex items-center gap-4 pt-4 border-t border-bronze/20">
              <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity ease-out">
                <div className="h-8 px-3 py-1 bg-muted/50 rounded flex items-center">
                  <span className="text-xs font-semibold text-foreground">Istikbal</span>
                </div>
              </div>
              <div className="w-px h-6 bg-bronze/40"></div>
              <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity ease-out">
                <div className="h-8 px-3 py-1 bg-muted/50 rounded flex items-center">
                  <span className="text-xs font-semibold text-foreground">Raytex</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-card-foreground font-headline">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-card-foreground/80 hover:text-accent transition-colors ease-out touch-target inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-card-foreground font-headline">Contact</h4>
            <ul className="space-y-2 text-card-foreground/80">
              <li className="touch-target">01222804255</li>
              <li className="touch-target break-words">Tell.me@DandleStoreGroup.com</li>
              <li className="pt-2 text-sm font-caption">Daily: 10AM-3PM & 7PM-9PM</li>
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
