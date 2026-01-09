import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

// Amazon logo SVG
const AmazonLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 603 182" fill="currentColor">
    <path d="M374.00 142.06C339.08 167.89 287.98 182.00 244.34 182.00C182.54 182.00 126.75 158.46 84.55 119.44C81.34 116.49 84.21 112.46 88.07 114.79C133.24 141.23 189.25 157.12 247.11 157.12C285.63 157.12 328.01 149.47 366.89 133.62C372.54 131.22 377.32 137.38 374.00 142.06Z"/>
    <path d="M385.53 128.66C381.18 123.05 355.85 126.04 344.53 127.36C341.23 127.75 340.73 124.88 343.70 122.79C363.85 108.59 397.14 112.76 400.87 117.41C404.61 122.10 399.85 155.50 381.05 171.49C378.28 173.85 375.63 172.59 376.87 169.49C381.01 158.99 389.91 134.31 385.53 128.66Z"/>
    <path d="M345.41 21.23L345.41 6.47C345.41 4.30 347.08 2.84 349.05 2.84L410.83 2.84C412.89 2.84 414.56 4.33 414.56 6.47L414.56 19.18C414.52 21.23 412.76 23.89 409.66 28.19L377.18 75.38C389.34 75.08 402.18 76.96 413.10 83.08C415.53 84.45 416.19 86.46 416.36 88.46L416.36 104.14C416.36 106.18 414.14 108.55 411.80 107.34C392.11 97.08 365.76 95.94 344.11 107.47C341.94 108.59 339.69 106.26 339.69 104.22L339.69 89.38C339.69 87.09 339.73 83.04 341.98 79.69L380.04 24.30L349.13 24.30C347.08 24.30 345.41 22.84 345.41 21.23Z"/>
    <path d="M124.78 110.69L105.26 110.69C103.39 110.56 101.89 109.14 101.76 107.34L101.76 6.64C101.76 4.59 103.52 2.97 105.64 2.97L123.91 2.97C125.83 3.05 127.37 4.55 127.50 6.39L127.50 20.22L127.87 20.22C132.72 7.24 141.78 1.09 154.29 1.09C167.00 1.09 175.02 7.24 180.87 20.22C185.68 7.24 196.60 1.09 208.61 1.09C217.09 1.09 226.44 4.76 232.37 12.58C239.18 21.36 237.77 33.96 237.77 45.19L237.73 107.09C237.73 109.14 235.97 110.69 233.89 110.69L214.41 110.69C212.46 110.56 210.92 109.01 210.92 107.09L210.92 54.22C210.92 49.62 211.42 38.35 210.30 34.00C208.65 27.10 204.01 25.14 198.07 25.14C193.05 25.14 187.78 28.56 185.52 33.96C183.27 39.36 183.48 48.27 183.48 54.22L183.48 107.09C183.48 109.14 181.72 110.69 179.64 110.69L160.16 110.69C158.17 110.56 156.67 109.01 156.67 107.09L156.63 54.22C156.63 42.05 158.67 24.89 143.74 24.89C128.60 24.89 129.23 41.55 129.23 54.22L129.23 107.09C129.23 109.14 127.46 110.69 125.39 110.69L124.78 110.69Z"/>
    <path d="M458.39 1.09C487.55 1.09 503.26 25.14 503.26 56.55C503.26 86.96 485.80 110.44 458.39 110.44C429.81 110.44 414.35 86.38 414.35 55.72C414.35 24.81 430.02 1.09 458.39 1.09ZM458.52 21.11C443.25 21.11 442.21 41.80 442.21 54.72C442.21 67.68 441.96 90.40 458.39 90.40C474.57 90.40 475.44 68.18 475.44 54.72C475.44 45.94 475.06 35.38 472.14 27.31C469.67 20.35 464.95 21.11 458.52 21.11Z"/>
    <path d="M534.45 110.69L515.05 110.69C513.10 110.56 511.56 109.01 511.56 107.09L511.52 6.35C511.69 4.47 513.31 2.97 515.30 2.97L533.45 2.97C535.15 3.05 536.56 4.22 536.94 5.81L536.94 21.86L537.31 21.86C543.24 7.74 550.89 1.09 565.81 1.09C575.00 1.09 583.90 4.51 589.87 13.58C595.47 22.03 595.47 36.20 595.47 46.52L595.47 107.51C595.22 109.31 593.60 110.69 591.73 110.69L572.13 110.69C570.39 110.56 568.94 109.22 568.73 107.51L568.73 53.47C568.73 41.55 570.15 24.64 554.88 24.64C549.82 24.64 545.13 28.10 542.75 33.29C539.70 39.78 539.28 46.23 539.28 53.47L539.28 107.09C539.24 109.14 537.44 110.69 535.32 110.69L534.45 110.69Z"/>
    <path d="M305.03 63.71C305.03 71.49 305.24 78.02 301.21 84.88C298.01 90.53 292.66 94.12 286.72 94.12C278.49 94.12 273.68 87.93 273.68 79.02C273.68 61.45 289.43 58.20 305.03 58.20L305.03 63.71ZM329.04 110.36C327.52 111.73 325.35 111.81 323.58 110.81C315.60 104.22 314.15 101.09 309.84 95.02C297.42 107.80 288.47 111.48 272.10 111.48C252.49 111.48 237.18 99.35 237.18 75.18C237.18 56.35 247.30 43.55 261.72 37.10C274.15 31.45 291.48 30.45 305.03 28.85L305.03 27.06C305.03 23.46 305.28 19.18 303.18 16.07C301.34 13.29 297.80 12.08 294.72 12.08C289.01 12.08 283.91 15.00 282.72 21.11C282.47 22.49 281.47 23.85 280.10 23.93L261.18 21.86C259.94 21.61 258.57 20.61 258.90 18.77C263.25 -4.51 283.07 -11.44 300.98 -11.44L310.17 -10.89C319.24 -9.68 330.54 -6.52 337.68 0.26C346.91 8.97 346.03 20.44 346.03 32.94L346.03 71.28C346.03 80.40 349.73 84.42 353.22 89.45C354.43 91.20 354.68 93.30 353.14 94.58C349.31 97.82 342.41 103.72 338.66 107.09L329.04 110.36Z"/>
    <path d="M56.82 63.71C56.82 71.49 57.03 78.02 53.01 84.88C49.81 90.53 44.45 94.12 38.51 94.12C30.29 94.12 25.47 87.93 25.47 79.02C25.47 61.45 41.23 58.20 56.82 58.20L56.82 63.71ZM80.83 110.36C79.32 111.73 77.14 111.81 75.38 110.81C67.39 104.22 65.94 101.09 61.64 95.02C49.21 107.80 40.26 111.48 23.89 111.48C4.29 111.48 -11.03 99.35 -11.03 75.18C-11.03 56.35 -0.91 43.55 13.52 37.10C25.94 31.45 43.27 30.45 56.82 28.85L56.82 27.06C56.82 23.46 57.07 19.18 54.97 16.07C53.13 13.29 49.60 12.08 46.51 12.08C40.80 12.08 35.70 15.00 34.51 21.11C34.27 22.49 33.26 23.85 31.89 23.93L12.97 21.86C11.73 21.61 10.36 20.61 10.69 18.77C15.04 -4.51 34.86 -11.44 52.78 -11.44L61.97 -10.89C71.03 -9.68 82.33 -6.52 89.48 0.26C98.70 8.97 97.82 20.44 97.82 32.94L97.82 71.28C97.82 80.40 101.52 84.42 105.02 89.45C106.23 91.20 106.48 93.30 104.94 94.58C101.10 97.82 94.20 103.72 90.45 107.09L80.83 110.36Z"/>
  </svg>
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