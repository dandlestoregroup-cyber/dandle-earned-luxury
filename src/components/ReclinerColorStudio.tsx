import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, Download, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/i18n/config';
import { recolorRecliner, simulateRecolor, isApiConfigured } from '@/services/homedesignsApi';
import { openWhatsApp, formatOrderMessage } from '@/services/whatsappService';

// Nour Fabric Colors - 16 premium swatches
const FABRIC_COLORS = [
  { id: 'nile-blue', name: 'Nile Blue', nameAr: 'أزرق النيل', hex: '#1A3C5E', apiColor: 'blue' },
  { id: 'antique-linen', name: 'Antique Linen', nameAr: 'كتان عتيق', hex: '#F5E8C7', apiColor: 'beige' },
  { id: 'desert-sage', name: 'Desert Sage', nameAr: 'أخضر صحراوي', hex: '#A8B99C', apiColor: 'green' },
  { id: 'nile-velvet', name: 'Nile Velvet', nameAr: 'مخمل النيل', hex: '#2E4F4F', apiColor: 'dark green' },
  { id: 'mocha-taupe', name: 'Mocha Taupe', nameAr: 'موكا تاوب', hex: '#8B6F47', apiColor: 'brown' },
  { id: 'coastal-grey', name: 'Coastal Grey', nameAr: 'رمادي ساحلي', hex: '#7D8A99', apiColor: 'grey' },
  { id: 'nubuck-leather', name: 'Nubuck Leather', nameAr: 'جلد نوباك', hex: '#D2B48C', apiColor: 'tan' },
  { id: 'chenille-grey', name: 'Chenille Grey', nameAr: 'شانيل رمادي', hex: '#A9A9A9', apiColor: 'light grey' },
  { id: 'terracotta', name: 'Terracotta', nameAr: 'تيراكوتا', hex: '#E2725B', apiColor: 'orange' },
  { id: 'sandstone', name: 'Sandstone', nameAr: 'حجر رملي', hex: '#C9AE7B', apiColor: 'sand' },
  { id: 'lagoon-stripe', name: 'Lagoon Stripe', nameAr: 'لاجون مخطط', hex: '#4682B4', apiColor: 'steel blue' },
  { id: 'textured-weave', name: 'Textured Weave', nameAr: 'نسيج محبوك', hex: '#8B4513', apiColor: 'saddle brown' },
  { id: 'sand-dunes', name: 'Sand Dunes', nameAr: 'كثبان رملية', hex: '#F4A460', apiColor: 'sandy brown' },
  { id: 'linen-blend', name: 'Linen Blend', nameAr: 'مزيج كتان', hex: '#E6D8AD', apiColor: 'cream' },
  { id: 'textured-woven', name: 'Textured Woven', nameAr: 'منسوج محبوك', hex: '#CD853F', apiColor: 'peru' },
  { id: 'midnight-navy', name: 'Midnight Navy', nameAr: 'كحلي داكن', hex: '#1e3a5f', apiColor: 'navy' },
];

interface ColorResult {
  colorId: string;
  colorName: string;
  imageUrl: string;
  isOriginal?: boolean;
}

const ReclinerColorStudio = () => {
  const { t } = useTranslation();
  const isArabic = isRTL();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingColor, setProcessingColor] = useState<string | null>(null);
  const [colorResults, setColorResults] = useState<ColorResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ColorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(isArabic ? 'من فضلك ارفع صورة فقط' : 'Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(isArabic ? 'حجم الصورة كبير جداً (الحد الأقصى 10MB)' : 'Image too large (max 10MB)');
      return;
    }

    setError(null);
    setUploadedFile(file);
    setColorResults([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      // Add original as first result
      setColorResults([{
        colorId: 'original',
        colorName: isArabic ? 'الأصلي' : 'Original',
        imageUrl: result,
        isOriginal: true
      }]);
    };
    reader.readAsDataURL(file);
  }, [isArabic]);

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

  const processColor = async (fabric: typeof FABRIC_COLORS[0]) => {
    if (!uploadedFile || !uploadedImage || isProcessing) return;

    // Check if already processed
    if (colorResults.some(r => r.colorId === fabric.id)) {
      setSelectedResult(colorResults.find(r => r.colorId === fabric.id) || null);
      return;
    }

    setIsProcessing(true);
    setProcessingColor(fabric.id);
    setError(null);

    try {
      let resultImageUrl: string;

      if (isApiConfigured()) {
        // Use real HomeDesigns AI API
        const result = await recolorRecliner({
          image: uploadedFile,
          color: fabric.apiColor,
        });

        if (!result.success || !result.imageUrl) {
          throw new Error(result.error || 'Failed to process image');
        }

        resultImageUrl = result.imageUrl;
      } else {
        // Use simulation fallback for demo/development
        resultImageUrl = await simulateRecolor(uploadedImage, fabric.hex);
      }

      const newResult: ColorResult = {
        colorId: fabric.id,
        colorName: isArabic ? fabric.nameAr : fabric.name,
        imageUrl: resultImageUrl,
      };

      setColorResults(prev => [...prev, newResult]);
      setSelectedResult(newResult);

    } catch (err) {
      console.error('Color processing error:', err);
      setError(isArabic ? 'حدث خطأ في المعالجة' : 'Processing error occurred');
    } finally {
      setIsProcessing(false);
      setProcessingColor(null);
    }
  };

  const processAllColors = async () => {
    if (!uploadedFile) return;

    for (const fabric of FABRIC_COLORS) {
      if (!colorResults.some(r => r.colorId === fabric.id)) {
        await processColor(fabric);
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  const scrollFabrics = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleWhatsAppOrder = () => {
    const colorName = selectedResult?.colorName || (isArabic ? 'مخصص' : 'custom');
    const message = formatOrderMessage(isArabic, colorName);
    openWhatsApp(message);
  };

  const resetStudio = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setColorResults([]);
    setSelectedResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="py-16 bg-gradient-to-b from-warm-cream to-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-charcoal mb-3">
            {isArabic ? 'استوديو ألوان الكراسي' : 'Recliner Color Studio'}
          </h2>
          <p className="text-charcoal/70 max-w-2xl mx-auto">
            {isArabic
              ? 'ارفع صورة كرسيك وشوف شكله بـ 16 لون قماش مختلف فوراً'
              : 'Upload your recliner photo and see it in 16 different fabric colors instantly'}
          </p>
        </motion.div>

        {/* Upload Zone */}
        {!uploadedImage && (
          <motion.div
            className="max-w-lg mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative aspect-[4/3] rounded-2xl border-2 border-dashed cursor-pointer
                transition-all duration-300 flex flex-col items-center justify-center p-8
                ${dragActive
                  ? 'border-dandle-orange bg-dandle-orange/5 scale-102'
                  : 'border-charcoal/20 hover:border-dandle-orange/50 hover:bg-warm-cream/50'
                }
              `}
            >
              <div className={`
                w-16 h-16 rounded-full bg-dandle-orange/10 flex items-center justify-center mb-4
                transition-transform ${dragActive ? 'scale-110' : ''}
              `}>
                <Upload className="w-8 h-8 text-dandle-orange" />
              </div>
              <p className="text-charcoal font-medium text-lg mb-1">
                {isArabic ? 'اسحب صورة الكرسي هنا' : 'Drag your recliner photo here'}
              </p>
              <p className="text-charcoal/60 text-sm">
                {isArabic ? 'أو اضغط للاختيار' : 'or click to browse'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content - After Upload */}
        {uploadedImage && (
          <div className="space-y-8">
            {/* Fabric Color Swatches - Horizontal Scroll */}
            <div className="relative">
              <button
                onClick={() => scrollFabrics('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-warm-cream transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide px-12 py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {FABRIC_COLORS.map((fabric) => {
                  const isActive = processingColor === fabric.id;
                  const isProcessed = colorResults.some(r => r.colorId === fabric.id);
                  const isSelected = selectedResult?.colorId === fabric.id;

                  return (
                    <button
                      key={fabric.id}
                      onClick={() => processColor(fabric)}
                      disabled={isProcessing && processingColor !== fabric.id}
                      className={`
                        flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl
                        transition-all duration-300 min-w-[90px]
                        ${isSelected
                          ? 'bg-dandle-orange/10 ring-2 ring-dandle-orange'
                          : 'hover:bg-warm-cream'
                        }
                        ${isProcessing && !isActive ? 'opacity-50' : ''}
                      `}
                    >
                      <div
                        className={`
                          w-12 h-12 rounded-full border-2 transition-all
                          ${isActive ? 'animate-pulse border-dandle-orange' : ''}
                          ${isProcessed ? 'border-green-500' : 'border-charcoal/20'}
                          ${isSelected ? 'ring-2 ring-offset-2 ring-dandle-orange scale-110' : ''}
                        `}
                        style={{ backgroundColor: fabric.hex }}
                      >
                        {isActive && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-charcoal/80 font-medium text-center whitespace-nowrap">
                        {isArabic ? fabric.nameAr : fabric.name}
                      </span>
                      <span className="text-[10px] text-charcoal/50 font-mono">
                        {fabric.hex}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => scrollFabrics('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-warm-cream transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Process All Button */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={processAllColors}
                disabled={isProcessing}
                className="bg-dandle-orange hover:bg-dandle-orange/90 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isArabic ? 'جاري المعالجة...' : 'Processing...'}
                  </>
                ) : (
                  isArabic ? 'معالجة كل الألوان' : 'Process All Colors'
                )}
              </Button>
              <Button
                onClick={resetStudio}
                variant="outline"
                className="border-charcoal/20"
              >
                {isArabic ? 'صورة جديدة' : 'New Photo'}
              </Button>
            </div>

            {/* Results Grid - 4x4 Masonry */}
            {colorResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {colorResults.map((result, index) => (
                  <motion.div
                    key={result.colorId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedResult(result)}
                    className={`
                      relative aspect-square rounded-xl overflow-hidden cursor-pointer
                      transition-all duration-300 group
                      ${selectedResult?.colorId === result.colorId
                        ? 'ring-4 ring-[#d4af37] shadow-xl scale-105'
                        : 'hover:ring-2 hover:ring-dandle-orange/50 hover:shadow-lg'
                      }
                    `}
                  >
                    <img
                      src={result.imageUrl}
                      alt={result.colorName}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-medium text-sm">{result.colorName}</p>
                        {result.isOriginal && (
                          <span className="text-white/70 text-xs">
                            {isArabic ? 'الأصلي' : 'Original'}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Gold border for selected */}
                    {selectedResult?.colorId === result.colorId && (
                      <div className="absolute inset-0 border-4 border-[#d4af37] rounded-xl pointer-events-none" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* WhatsApp Order Button */}
            {selectedResult && !selectedResult.isOriginal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-6"
              >
                <Button
                  onClick={handleWhatsAppOrder}
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white gap-2 px-8 py-6 text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  {isArabic ? 'اطلب هذا اللون عبر واتساب' : 'Order This Color via WhatsApp'}
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReclinerColorStudio;
