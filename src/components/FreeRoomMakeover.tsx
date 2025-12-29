import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, MessageCircle, Check, Sparkles, Home, Palette, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/i18n/config';
import { submitRoomMakeoverRequest, openWhatsApp, formatRoomMakeoverMessage } from '@/services/whatsappService';

// Fabric colors for dropdown (same as ReclinerColorStudio)
const FABRIC_OPTIONS = [
  { id: 'nile-blue', name: 'Nile Blue', nameAr: 'أزرق النيل', hex: '#1A3C5E' },
  { id: 'antique-linen', name: 'Antique Linen', nameAr: 'كتان عتيق', hex: '#F5E8C7' },
  { id: 'desert-sage', name: 'Desert Sage', nameAr: 'أخضر صحراوي', hex: '#A8B99C' },
  { id: 'nile-velvet', name: 'Nile Velvet', nameAr: 'مخمل النيل', hex: '#2E4F4F' },
  { id: 'mocha-taupe', name: 'Mocha Taupe', nameAr: 'موكا تاوب', hex: '#8B6F47' },
  { id: 'coastal-grey', name: 'Coastal Grey', nameAr: 'رمادي ساحلي', hex: '#7D8A99' },
  { id: 'nubuck-leather', name: 'Nubuck Leather', nameAr: 'جلد نوباك', hex: '#D2B48C' },
  { id: 'chenille-grey', name: 'Chenille Grey', nameAr: 'شانيل رمادي', hex: '#A9A9A9' },
  { id: 'terracotta', name: 'Terracotta', nameAr: 'تيراكوتا', hex: '#E2725B' },
  { id: 'sandstone', name: 'Sandstone', nameAr: 'حجر رملي', hex: '#C9AE7B' },
  { id: 'lagoon-stripe', name: 'Lagoon Stripe', nameAr: 'لاجون مخطط', hex: '#4682B4' },
  { id: 'textured-weave', name: 'Textured Weave', nameAr: 'نسيج محبوك', hex: '#8B4513' },
  { id: 'sand-dunes', name: 'Sand Dunes', nameAr: 'كثبان رملية', hex: '#F4A460' },
  { id: 'linen-blend', name: 'Linen Blend', nameAr: 'مزيج كتان', hex: '#E6D8AD' },
  { id: 'textured-woven', name: 'Textured Woven', nameAr: 'منسوج محبوك', hex: '#CD853F' },
  { id: 'midnight-navy', name: 'Midnight Navy', nameAr: 'كحلي داكن', hex: '#1e3a5f' },
];

type ServiceType = 'perfect-fit' | 'fine-tuning' | 'complete-transformation';

interface ServiceOption {
  id: ServiceType;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: typeof Home;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'perfect-fit',
    name: 'Perfect Fit',
    nameAr: 'المقاس المثالي',
    description: 'We\'ll show you exactly how your recliner will look in your space',
    descriptionAr: 'هنوريك بالظبط شكل الكرسي في مساحتك',
    icon: Home,
  },
  {
    id: 'fine-tuning',
    name: 'Room Fine-Tuning',
    nameAr: 'تحسين الغرفة',
    description: 'Curtains, rugs, posters, lighting suggestions to match',
    descriptionAr: 'ستائر، سجاد، ديكور، إضاءة متناسقة',
    icon: Palette,
  },
  {
    id: 'complete-transformation',
    name: 'Complete Transformation',
    nameAr: 'تحول كامل',
    description: 'Full room redesign with your new recliner as centerpiece',
    descriptionAr: 'إعادة تصميم كاملة للغرفة مع الكرسي كقطعة رئيسية',
    icon: Wand2,
  },
];

const FreeRoomMakeover = () => {
  const { t } = useTranslation();
  const isArabic = isRTL();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedService, setSelectedService] = useState<ServiceType>('perfect-fit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return;

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleWhatsAppSubmit = async () => {
    if (!uploadedFile) return;

    setIsSubmitting(true);

    try {
      // First, save the request to our backend
      await submitRoomMakeoverRequest({
        roomImage: uploadedFile,
        fabricColor: selectedFabric,
        serviceType: selectedService,
      });

      // Then open WhatsApp with pre-filled message
      const fabricName = FABRIC_OPTIONS.find(f => f.id === selectedFabric);
      const serviceName = SERVICE_OPTIONS.find(s => s.id === selectedService);

      const message = formatRoomMakeoverMessage(
        isArabic,
        isArabic ? (serviceName?.nameAr || '') : (serviceName?.name || ''),
        isArabic ? (fabricName?.nameAr || '') : (fabricName?.name || '')
      );

      openWhatsApp(message);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setSelectedFabric('');
    setSelectedService('perfect-fit');
    setIsSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-nile-blue/5 via-white to-dandle-orange/5" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 text-[#25D366] font-medium text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            {isArabic ? 'مجاني تماماً!' : 'COMPLETELY FREE!'}
          </div>

          <h2 className="font-headline text-3xl md:text-5xl font-bold text-charcoal mb-4">
            {isArabic ? 'تصميم غرفتك المجاني' : 'Free Room Makeover'}
          </h2>

          <p className="text-xl text-dandle-orange font-semibold mb-2">
            {isArabic
              ? 'احصلي على تصميم كرسيك المثالي خلال 72 ساعة - مجاناً!'
              : 'GET YOUR PERFECT RECLINER FIT IN 72 HOURS - FREE!'}
          </p>

          <p className="text-charcoal/70 max-w-2xl mx-auto">
            {isArabic
              ? 'ارفعي صورة غرفتك واختاري اللون المفضل، وفريقنا هيصمملك الغرفة مع الكرسي'
              : 'Upload your room photo, pick your fabric, and our team will design your space with the perfect recliner'}
          </p>
        </motion.div>

        {/* Success State */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-12"
            >
              <div className="w-20 h-20 rounded-full bg-[#25D366]/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-[#25D366]" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-3">
                {isArabic ? 'تم إرسال طلبك بنجاح! 🎉' : 'Request Submitted! 🎉'}
              </h3>
              <p className="text-charcoal/70 mb-6">
                {isArabic
                  ? 'فريقنا هيتواصل معاك على واتساب خلال 72 ساعة بالتصميم'
                  : 'Our team will reach out via WhatsApp within 72 hours with your design'}
              </p>
              <Button onClick={resetForm} variant="outline">
                {isArabic ? 'إرسال طلب جديد' : 'Submit Another Request'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        {!isSubmitted && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Upload + Fabric Selection */}
              <div className="space-y-6">
                {/* Room Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    {isArabic ? 'صورة الغرفة' : 'Room Photo'}
                  </label>

                  {!uploadedImage ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        aspect-[4/3] rounded-2xl border-2 border-dashed cursor-pointer
                        transition-all duration-300 flex flex-col items-center justify-center
                        ${dragActive
                          ? 'border-dandle-orange bg-dandle-orange/5'
                          : 'border-charcoal/20 hover:border-dandle-orange/50 bg-white'
                        }
                      `}
                    >
                      <Upload className="w-10 h-10 text-charcoal/40 mb-3" />
                      <p className="text-charcoal/60 text-center px-4">
                        {isArabic ? 'اسحبي صورة الغرفة أو اضغطي للاختيار' : 'Drag room photo or click to browse'}
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Room preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setUploadedFile(null);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Fabric Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    {isArabic ? 'لون القماش المفضل' : 'Preferred Fabric Color'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedFabric}
                      onChange={(e) => setSelectedFabric(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-charcoal/10 bg-white appearance-none cursor-pointer hover:border-dandle-orange/50 transition-colors"
                    >
                      <option value="">
                        {isArabic ? '-- اختاري اللون --' : '-- Select Color --'}
                      </option>
                      {FABRIC_OPTIONS.map((fabric) => (
                        <option key={fabric.id} value={fabric.id}>
                          {isArabic ? fabric.nameAr : fabric.name} ({fabric.hex})
                        </option>
                      ))}
                    </select>
                    {selectedFabric && (
                      <div
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-charcoal/20"
                        style={{ backgroundColor: FABRIC_OPTIONS.find(f => f.id === selectedFabric)?.hex }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Service Selection + Submit */}
              <div className="space-y-6">
                {/* Service Options */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    {isArabic ? 'نوع الخدمة' : 'Service Type'}
                  </label>
                  <div className="space-y-3">
                    {SERVICE_OPTIONS.map((service) => {
                      const Icon = service.icon;
                      const isActive = selectedService === service.id;

                      return (
                        <label
                          key={service.id}
                          className={`
                            flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all
                            ${isActive
                              ? 'bg-dandle-orange/10 border-2 border-dandle-orange'
                              : 'bg-white border-2 border-charcoal/10 hover:border-dandle-orange/30'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="service"
                            value={service.id}
                            checked={isActive}
                            onChange={() => setSelectedService(service.id)}
                            className="sr-only"
                          />
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                            ${isActive ? 'bg-dandle-orange text-white' : 'bg-charcoal/5 text-charcoal/60'}
                          `}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-charcoal">
                                {isArabic ? service.nameAr : service.name}
                              </span>
                              {isActive && (
                                <Check className="w-4 h-4 text-dandle-orange" />
                              )}
                            </div>
                            <p className="text-sm text-charcoal/60 mt-1">
                              {isArabic ? service.descriptionAr : service.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleWhatsAppSubmit}
                  disabled={!uploadedFile || isSubmitting}
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white gap-3 py-6 text-lg font-bold disabled:opacity-50"
                >
                  <MessageCircle className="w-6 h-6" />
                  {isSubmitting
                    ? (isArabic ? 'جاري الإرسال...' : 'Submitting...')
                    : (isArabic ? 'أرسلي طلبك عبر واتساب' : 'Submit via WhatsApp')
                  }
                </Button>

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-4 text-xs text-charcoal/50 pt-2">
                  <span>🎨 {isArabic ? 'تصميم احترافي' : 'Professional Design'}</span>
                  <span>⏰ {isArabic ? '72 ساعة' : '72 Hours'}</span>
                  <span>💯 {isArabic ? 'مجاني' : 'Free'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FreeRoomMakeover;
