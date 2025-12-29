import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { isRTL } from '@/i18n/config';
import { products } from '@/types/product';

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productInterest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();
  const isArabic = isRTL();

  // Check if popup should show (only once per 24h session)
  const shouldShowPopup = useCallback(() => {
    const lastShown = localStorage.getItem('dandle-exit-popup-shown');
    if (lastShown) {
      const lastShownTime = parseInt(lastShown, 10);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      return now - lastShownTime > twentyFourHours;
    }
    return true;
  }, []);

  // Handle mouse leaving viewport (exit intent detection)
  useEffect(() => {
    // Only enable on desktop (mouse-based devices)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top of the viewport
      if (e.clientY <= 0 && shouldShowPopup()) {
        setIsOpen(true);
        localStorage.setItem('dandle-exit-popup-shown', Date.now().toString());
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [shouldShowPopup]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store lead data locally (for demo purposes)
    const leads = JSON.parse(localStorage.getItem('dandle-leads') || '[]');
    leads.push({
      ...formData,
      timestamp: new Date().toISOString(),
      source: 'exit-intent-popup',
    });
    localStorage.setItem('dandle-leads', JSON.stringify(leads));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Close popup after showing success
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const validatePhone = (phone: string) => {
    // Egyptian phone number validation
    const egyptPhone = /^(\+20|0)?1[0125]\d{8}$/;
    return egyptPhone.test(phone.replace(/\s/g, ''));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div
        className={cn(
          'relative bg-card rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 border border-border',
          isArabic && 'text-right'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-popup-title"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            'absolute top-4 text-muted-foreground hover:text-foreground transition-colors',
            isArabic ? 'left-4' : 'right-4'
          )}
          aria-label={isArabic ? 'إغلاق' : 'Close'}
        >
          <X size={20} />
        </button>

        {isSubmitted ? (
          // Success state
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {isArabic ? 'شكراً لك!' : 'Thank You!'}
            </h3>
            <p className="text-muted-foreground">
              {isArabic
                ? 'سنتواصل معك قريباً'
                : "We'll contact you soon with your exclusive offer."}
            </p>
          </div>
        ) : (
          // Form state
          <>
            {/* Festive decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">
              ✨
            </div>

            {/* Header */}
            <div className="text-center mb-6 pt-4">
              <h2
                id="exit-popup-title"
                className="text-2xl font-bold text-foreground mb-2 font-headline"
              >
                {t('exitIntent.headline')}
              </h2>
              <p className="text-muted-foreground">{t('exitIntent.offer')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder={t('exitIntent.namePlaceholder')}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="text-right rtl:text-right ltr:text-left"
                dir={isArabic ? 'rtl' : 'ltr'}
              />

              <Input
                type="email"
                placeholder={t('exitIntent.emailPlaceholder')}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                dir="ltr"
              />

              <Input
                type="tel"
                placeholder={t('exitIntent.phonePlaceholder')}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                dir="ltr"
                pattern="(\+20|0)?1[0125]\d{8}"
                title={
                  isArabic
                    ? 'يرجى إدخال رقم هاتف مصري صحيح'
                    : 'Please enter a valid Egyptian phone number'
                }
              />

              <Select
                value={formData.productInterest}
                onValueChange={(value) =>
                  setFormData({ ...formData, productInterest: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('exitIntent.productInterest')} />
                </SelectTrigger>
                <SelectContent>
                  {products
                    .filter((p) => p.id !== 'complete-set')
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button
                type="submit"
                className="w-full bg-[#d4af37] hover:bg-[#c4a027] text-white font-semibold py-3 sparkle-hover relative"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isArabic
                    ? 'جاري الإرسال...'
                    : 'Submitting...'
                  : t('exitIntent.claimDiscount')}
              </Button>
            </form>

            {/* Trust signal */}
            <p className="text-xs text-center text-muted-foreground mt-4">
              {isArabic
                ? 'نحن نحترم خصوصيتك ولن نشارك بياناتك'
                : "We respect your privacy and won't share your data"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ExitIntentPopup;
