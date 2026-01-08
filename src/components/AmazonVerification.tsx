import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AmazonVerificationProps {
  variant?: "home" | "strip" | "accordion" | "faq";
}

const AmazonVerification = ({ variant = "home" }: AmazonVerificationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerify = () => {
    window.open("https://wa.link/dandle-recliners", "_blank", "noopener,noreferrer");
  };

  // Home variant - short section under Trust
  if (variant === "home") {
    return (
      <>
        <section className="bg-warm-white py-12 px-4 border-t border-champagne/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 text-charcoal/60">
                <ShieldCheck className="w-5 h-5 text-dandle-orange" />
                <span className="font-body text-sm tracking-wide">Authenticity Matters</span>
              </div>
              
              <p className="font-body text-charcoal/70 text-sm max-w-xl leading-relaxed">
                Seeing Dandle on Amazon? We've found listings using our name. Some are not genuine Dandle products.
              </p>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="font-body text-sm text-dandle-orange hover:text-dandle-orange/80 underline underline-offset-2 transition-colors"
              >
                Verify a listing
              </button>
            </motion.div>
          </div>
        </section>

        <VerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleVerify} />
      </>
    );
  }

  // Strip variant - slim strip above collection grid
  if (variant === "strip") {
    return (
      <>
        <div className="bg-champagne/10 py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
            <ShieldCheck className="w-4 h-4 text-dandle-orange" />
            <span className="font-body text-xs text-charcoal/70">
              Seeing Dandle elsewhere? Verify authenticity before you buy.
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-body text-xs text-dandle-orange hover:text-dandle-orange/80 underline underline-offset-2 transition-colors"
            >
              Verify a listing
            </button>
          </div>
        </div>

        <VerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleVerify} />
      </>
    );
  }

  // Accordion variant - for model pages
  if (variant === "accordion") {
    return (
      <div className="border-t border-champagne/20 pt-4 mt-4">
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer font-body text-sm text-charcoal/70 hover:text-charcoal transition-colors">
            <ShieldCheck className="w-4 h-4 text-dandle-orange" />
            Verify Authenticity
          </summary>
          <div className="mt-3 pl-6 text-sm text-charcoal/60 leading-relaxed">
            <p className="mb-3">
              Seeing Dandle on Amazon? We've found listings using our name. Some are not genuine Dandle products. 
              Before you pay, send the link on WhatsApp and we'll confirm it for you.
            </p>
            <Button
              onClick={handleVerify}
              variant="outline"
              size="sm"
              className="gap-2 text-dandle-orange border-dandle-orange/30 hover:bg-dandle-orange/5"
            >
              <MessageCircle className="w-4 h-4" />
              Verify on WhatsApp
            </Button>
          </div>
        </details>
      </div>
    );
  }

  // FAQ variant
  if (variant === "faq") {
    return (
      <div className="border-b border-champagne/20 pb-6">
        <h4 className="font-headline text-lg text-charcoal mb-2">
          I saw Dandle on Amazon. Is it genuine?
        </h4>
        <p className="font-body text-charcoal/70 text-sm leading-relaxed mb-4">
          Some listings use our name without being genuine Dandle products. Send the link on WhatsApp 
          and we'll confirm it before you pay.
        </p>
        <Button
          onClick={handleVerify}
          variant="outline"
          size="sm"
          className="gap-2 text-dandle-orange border-dandle-orange/30 hover:bg-dandle-orange/5"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp: wa.link/dandle-recliners
        </Button>
      </div>
    );
  }

  return null;
};

// Verification Modal
const VerificationModal = ({ 
  isOpen, 
  onClose, 
  onVerify 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onVerify: () => void; 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-warm-white rounded-sm shadow-2xl max-w-md w-full p-8 z-10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-charcoal/60 hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-dandle-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-dandle-orange" />
              </div>
              
              <h3 className="font-headline text-2xl text-charcoal mb-3">
                Verify a Listing
              </h3>
              
              <p className="font-body text-charcoal/70 text-sm leading-relaxed mb-6">
                Send the Amazon link on WhatsApp and we'll confirm if it's genuine Dandle.
              </p>
              
              <Button
                onClick={onVerify}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-body font-medium py-6 rounded-sm gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp: wa.link/dandle-recliners
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AmazonVerification;
