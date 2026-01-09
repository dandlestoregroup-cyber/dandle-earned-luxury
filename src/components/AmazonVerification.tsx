import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

// Amazon logo - Clean PNG reference for better rendering
const AmazonLogo = ({ className }: { className?: string }) => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
    alt="Amazon" 
    className={className}
    style={{ height: '1.5rem', width: 'auto' }}
  />
);

// WhatsApp icon SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface AmazonVerificationProps {
  variant?: "home" | "strip" | "accordion" | "faq";
}

const AmazonVerification = ({ variant = "home" }: AmazonVerificationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lang, setLang] = useState<LangKey>('ar');

  useEffect(() => {
    const storedLang = getLangFromStorage();
    setLang(storedLang);
    const interval = setInterval(() => {
      const currentLang = getLangFromStorage();
      setLang(prev => prev !== currentLang ? currentLang : prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isArabic = lang === 'ar';

  const handleVerify = () => {
    window.open("https://wa.link/dandle-recliners", "_blank", "noopener,noreferrer");
  };

  // Home variant - redesigned with Amazon logo and visual hierarchy
  if (variant === "home") {
    return (
      <>
        <section 
          className="bg-gradient-to-b from-off-white to-cream py-16 px-4 border-t border-champagne/20"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-off-white rounded-sm p-8 md:p-10 shadow-lg border border-champagne/10"
            >
              {/* Amazon Logo + Shield */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <AmazonLogo className="w-24 h-8 text-charcoal/80" />
                <div className="w-px h-8 bg-charcoal/20" />
                <ShieldCheck className="w-8 h-8 text-dandle-orange" />
              </div>
              
              {/* Title - Large and Clear */}
              <h3 className={`text-2xl md:text-3xl text-charcoal text-center mb-4 font-medium ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
                {isArabic ? "تحقق قبل الشراء" : "Verify Before You Buy"}
              </h3>
              
              {/* Explanation - One clear line */}
              <p className={`text-charcoal/70 text-center text-base mb-8 max-w-lg mx-auto ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                {isArabic 
                  ? "شايف Dandle على أمازون؟ بعض الإعلانات تستخدم اسمنا بدون ما تكون أصلية. ابعتلنا الرابط وهنأكدلك."
                  : "Seeing Dandle on Amazon? Some listings use our name without being genuine. Send us the link and we'll confirm it for you."
                }
              </p>
              
              {/* CTA Button - Strong and Clear */}
              <div className="flex justify-center">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-dandle-orange hover:bg-dandle-orange/90 text-off-white px-8 py-6 text-base font-medium rounded-sm gap-3"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {isArabic ? "تحقق من إعلان" : "Verify a Listing"}
                </Button>
              </div>
              
              {/* Trust note */}
              <p className={`text-charcoal/50 text-center text-xs mt-6 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                {isArabic 
                  ? "أسعار Dandle المباشرة أقل 10% من أمازون"
                  : "Dandle direct prices are 10% less than Amazon"
                }
              </p>
            </motion.div>
          </div>
        </section>

        <VerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleVerify} isArabic={isArabic} />
      </>
    );
  }

  // Strip variant - slim strip above collection grid
  if (variant === "strip") {
    return (
      <>
        <div className="bg-gradient-to-r from-champagne/10 via-champagne/5 to-champagne/10 py-4 px-4 border-y border-champagne/20" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 flex-wrap">
            <AmazonLogo className="w-16 h-5 text-charcoal/60" />
            <span className={`text-sm text-charcoal/70 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
              {isArabic ? "شايف Dandle في مكان تاني؟" : "Seeing Dandle elsewhere?"}
            </span>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              size="sm"
              className="border-dandle-orange/40 text-dandle-orange hover:bg-dandle-orange/5 gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {isArabic ? "تحقق الأول" : "Verify First"}
            </Button>
          </div>
        </div>

        <VerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleVerify} isArabic={isArabic} />
      </>
    );
  }

  // Accordion variant - for model pages
  if (variant === "accordion") {
    return (
      <div className="border-t border-champagne/20 pt-4 mt-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <details className="group">
          <summary className={`flex items-center gap-3 cursor-pointer text-sm text-charcoal/70 hover:text-charcoal transition-colors ${isArabic ? 'font-body-ar' : 'font-body'}`}>
            <AmazonLogo className="w-14 h-4 text-charcoal/50" />
            <ShieldCheck className="w-4 h-4 text-dandle-orange" />
            <span className="font-medium">{isArabic ? "تحقق من الأصالة" : "Verify Authenticity"}</span>
          </summary>
          <div className={`mt-4 pl-6 text-sm text-charcoal/60 leading-relaxed ${isArabic ? 'font-body-ar pr-6 pl-0' : 'font-body'}`}>
            <p className="mb-4">
              {isArabic 
                ? "شايف Dandle على أمازون؟ لقينا إعلانات بتستخدم اسمنا. بعضها مش منتجات Dandle أصلية. قبل ما تدفع، ابعتلنا الرابط على واتساب وهنأكدلك."
                : "Seeing Dandle on Amazon? We've found listings using our name. Some are not genuine Dandle products. Before you pay, send us the link on WhatsApp and we'll confirm it for you."
              }
            </p>
            <Button
              onClick={handleVerify}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              size="sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              {isArabic ? "تحقق على واتساب" : "Verify on WhatsApp"}
            </Button>
          </div>
        </details>
      </div>
    );
  }

  // FAQ variant
  if (variant === "faq") {
    return (
      <div className="border-b border-champagne/20 pb-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-3 mb-3">
          <AmazonLogo className="w-16 h-5 text-charcoal/60" />
        </div>
        <h4 className={`text-lg text-charcoal mb-2 ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
          {isArabic ? "شفت Dandle على أمازون. ده أصلي؟" : "I saw Dandle on Amazon. Is it genuine?"}
        </h4>
        <p className={`text-charcoal/70 text-sm leading-relaxed mb-4 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
          {isArabic 
            ? "بعض الإعلانات بتستخدم اسمنا من غير ما تكون منتجات Dandle أصلية. ابعتلنا الرابط على واتساب وهنأكدلك قبل ما تدفع."
            : "Some listings use our name without being genuine Dandle products. Send us the link on WhatsApp and we'll confirm it before you pay."
          }
        </p>
        <Button
          onClick={handleVerify}
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          <WhatsAppIcon className="w-5 h-5" />
          {isArabic ? "تحقق على واتساب" : "Verify on WhatsApp"}
        </Button>
      </div>
    );
  }

  return null;
};

// Verification Modal - Redesigned with Amazon logo and clear hierarchy
const VerificationModal = ({ 
  isOpen, 
  onClose, 
  onVerify,
  isArabic = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onVerify: () => void;
  isArabic?: boolean;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <motion.div
            className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-off-white rounded-sm shadow-2xl max-w-md w-full p-8 z-10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 p-2 text-charcoal/60 hover:text-charcoal ${isArabic ? 'left-4' : 'right-4'}`}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              {/* Amazon + Shield */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <AmazonLogo className="w-20 h-6 text-charcoal/70" />
                <ShieldCheck className="w-10 h-10 text-dandle-orange" />
              </div>
              
              {/* Title */}
              <h3 className={`text-2xl text-charcoal mb-3 font-medium ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
                {isArabic ? "تحقق من إعلان" : "Verify a Listing"}
              </h3>
              
              {/* Explanation */}
              <p className={`text-charcoal/70 text-sm leading-relaxed mb-6 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                {isArabic 
                  ? "ابعت رابط أمازون على واتساب وهنأكد إذا كان Dandle أصلي."
                  : "Send the Amazon link on WhatsApp and we'll confirm if it's genuine Dandle."
                }
              </p>
              
              {/* CTA */}
              <Button
                onClick={onVerify}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 rounded-sm gap-3 text-base"
              >
                <WhatsAppIcon className="w-6 h-6" />
                {isArabic ? "تحقق على واتساب" : "Verify on WhatsApp"}
              </Button>
              
              {/* Trust note */}
              <p className={`text-charcoal/50 text-xs mt-4 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                {isArabic 
                  ? "أسعارنا المباشرة أقل 10% من أمازون"
                  : "Our direct prices are 10% less than Amazon"
                }
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AmazonVerification;