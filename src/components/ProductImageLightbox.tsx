import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Share2, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LightboxImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ProductImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const ProductImageLightbox = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  productName = 'Product',
}: ProductImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const isArabic = isRTL();

  // Reset state when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
      setIsLoading(true);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setCurrentIndex((prev) =>
            isArabic
              ? (prev + 1) % images.length
              : (prev - 1 + images.length) % images.length
          );
          setIsLoading(true);
          break;
        case 'ArrowRight':
          setCurrentIndex((prev) =>
            isArabic
              ? (prev - 1 + images.length) % images.length
              : (prev + 1) % images.length
          );
          setIsLoading(true);
          break;
        case ' ':
          e.preventDefault();
          setIsZoomed((prev) => !prev);
          break;
      }
    },
    [isOpen, images.length, onClose, isArabic]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsLoading(true);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsLoading(true);
  };

  const handleShare = async () => {
    const currentImage = images[currentIndex];
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out this ${productName} from Dandle Recliners!`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    const currentImage = images[currentIndex];
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = `${productName}-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Header with controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          {/* Image counter */}
          <span className="text-white/80 text-sm">
            {currentIndex + 1} {t('ui.of')} {images.length}
          </span>

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed((prev) => !prev);
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {isZoomed ? (
                <ZoomOut size={20} className="text-white" />
              ) : (
                <ZoomIn size={20} className="text-white" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Share"
            >
              <Share2 size={20} className="text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Download"
            >
              <Download size={20} className="text-white" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={t('ui.close')}
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Main image container */}
        <motion.div
          className={cn(
            'relative w-full h-full flex items-center justify-center px-16',
            isZoomed && 'cursor-zoom-out',
            !isZoomed && 'cursor-zoom-in'
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed((prev) => !prev);
          }}
        >
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          <motion.img
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt}
            className={cn(
              'max-w-full max-h-[80vh] object-contain transition-transform duration-300',
              isZoomed && 'scale-150',
              isLoading && 'opacity-0'
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onLoad={() => setIsLoading(false)}
            draggable={false}
          />
        </motion.div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                isArabic ? goToNext() : goToPrevious();
              }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors',
                isArabic ? 'right-4' : 'left-4'
              )}
              aria-label={t('ui.previous')}
            >
              <ChevronLeft size={28} className="text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                isArabic ? goToPrevious() : goToNext();
              }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors',
                isArabic ? 'left-4' : 'right-4'
              )}
              aria-label={t('ui.next')}
            >
              <ChevronRight size={28} className="text-white" />
            </button>
          </>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setIsLoading(true);
                }}
                className={cn(
                  'w-12 h-12 rounded-md overflow-hidden border-2 transition-all',
                  currentIndex === index
                    ? 'border-[#d4af37] scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image caption */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white/80 text-sm">{currentImage.alt}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductImageLightbox;
