import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const partners = [
    { labelEn: "Istikbal Showrooms", labelAr: "صالات عرض إستيكبال", href: "/contact" },
    { labelEn: "OMASH", labelAr: "أوماش", href: "/#products" },
    { labelEn: "Vivian", labelAr: "فيفيان", href: "/#products" },
  ];

  const support = [
    { labelEn: "Warranty", labelAr: "الضمان", href: "/warranty" },
    { labelEn: "Delivery", labelAr: "التوصيل", href: "/delivery" },
    { labelEn: "Installation", labelAr: "التركيب", href: "/installation" },
    { labelEn: "Returns", labelAr: "الاسترجاع", href: "/returns" },
    { labelEn: "FAQ", labelAr: "الأسئلة الشائعة", href: "/faq" },
  ];

  const company = [
    { labelEn: "Our Story", labelAr: "قصتنا", href: "/our-story" },
    { labelEn: "About Us", labelAr: "عنّا", href: "/about" },
    { labelEn: "Gift of Comfort", labelAr: "هدية الراحة", href: "/#gift-of-comfort" },
    { labelEn: "Careers", labelAr: "الوظائف", href: "/careers" },
    { labelEn: "Privacy Policy", labelAr: "سياسة الخصوصية", href: "/privacy" },
    { labelEn: "Terms of Service", labelAr: "شروط الخدمة", href: "/terms" },
  ];

  return (
    <footer className="bg-charcoal text-warm-white py-16 border-t border-bronze/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-headline text-3xl font-bold mb-4">
              <span className="text-dandle-orange">DANDLE</span>
            </h3>
            <p 
              className="text-warm-white/70 mb-4 text-sm leading-relaxed"
              data-en="Comfort you'll love for years."
              data-ar="راحة ستحبها لسنوات."
            >
              Comfort you'll love for years.
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

          {/* Partners */}
          <div>
            <h4 
              className="font-body font-semibold mb-4 text-warm-white text-sm uppercase tracking-wide"
              data-en="Partners"
              data-ar="الشركاء"
            >
              Partners
            </h4>
            <ul className="space-y-2">
              {partners.map((link) => (
                <li key={link.href + link.labelEn}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 hover:text-dandle-orange transition-colors text-sm"
                    data-en={link.labelEn}
                    data-ar={link.labelAr}
                  >
                    {link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 
              className="font-body font-semibold mb-4 text-warm-white text-sm uppercase tracking-wide"
              data-en="Support"
              data-ar="الدعم"
            >
              Support
            </h4>
            <ul className="space-y-2">
              {support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 hover:text-dandle-orange transition-colors text-sm"
                    data-en={link.labelEn}
                    data-ar={link.labelAr}
                  >
                    {link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h4 
              className="font-body font-semibold mb-4 text-warm-white text-sm uppercase tracking-wide"
              data-en="Company"
              data-ar="الشركة"
            >
              Company
            </h4>
            <ul className="space-y-2 mb-6">
              {company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-warm-white/60 hover:text-dandle-orange transition-colors text-sm"
                    data-en={link.labelEn}
                    data-ar={link.labelAr}
                  >
                    {link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-bronze/20">
              <p className="text-warm-white/80 text-sm">01222804255</p>
              <p 
                className="text-warm-white/60 text-xs mt-1"
                data-en="Daily: 10AM-3PM & 7PM-9PM"
                data-ar="يومياً: 10ص-3م & 7م-9م"
              >
                Daily: 10AM-3PM & 7PM-9PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-bronze/20 text-center text-warm-white/50 text-xs space-y-2">
          <p data-en={`© ${currentYear} Dandle Store Group. All rights reserved.`} data-ar={`© ${currentYear} مجموعة داندل ستور. جميع الحقوق محفوظة.`}>
            © {currentYear} Dandle Store Group. All rights reserved.
          </p>
          <p data-en="Dandle™, RelaxMax™, and CozyCompanion™ are trademarks of Dandle Store Group." data-ar="Dandle™ و RelaxMax™ و CozyCompanion™ علامات تجارية لمجموعة داندل ستور.">
            Dandle™, RelaxMax™, and CozyCompanion™ are trademarks of Dandle Store Group.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;