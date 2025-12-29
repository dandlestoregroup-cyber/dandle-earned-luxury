import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { Smartphone, QrCode, View, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ARModelViewerProps {
  productName: string;
  modelSrc?: string; // .glb file path
  iosSrc?: string; // .usdz file path for iOS
  posterSrc?: string; // Poster image while loading
  alt?: string;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          poster?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'shadow-intensity'?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'interaction' | 'manual';
        },
        HTMLElement
      >;
    }
  }
}

const ARModelViewer = ({
  productName,
  modelSrc,
  iosSrc,
  posterSrc,
  alt,
  className,
}: ARModelViewerProps) => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const { t } = useTranslation();
  const isArabic = isRTL();

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      // Check for WebXR support
      if ('xr' in navigator) {
        try {
          const isSupported = await (navigator as any).xr?.isSessionSupported?.(
            'immersive-ar'
          );
          if (isSupported) {
            setIsARSupported(true);
            return;
          }
        } catch (e) {
          // WebXR not supported
        }
      }

      // Check for iOS Quick Look support
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS && iosSrc) {
        setIsARSupported(true);
        return;
      }

      // Check for Android Scene Viewer support
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid && modelSrc) {
        setIsARSupported(true);
        return;
      }

      setIsARSupported(false);
    };

    checkARSupport();

    // Load Model Viewer script if not already loaded
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src =
        'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, [modelSrc, iosSrc]);

  // If no 3D model available, show placeholder
  if (!modelSrc) {
    return (
      <div
        className={cn(
          'relative bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 text-center',
          className
        )}
      >
        <div className="mb-4">
          <View className="w-16 h-16 mx-auto text-accent/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {t('ar.viewInYourRoom')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isArabic
            ? 'ميزة الواقع المعزز قريباً لهذا المنتج'
            : 'AR feature coming soon for this product'}
        </p>
        <Button variant="outline" disabled>
          <Smartphone className="w-4 h-4 mr-2" />
          {t('ar.viewInYourRoom')}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Model Viewer Container */}
      <div className="relative bg-gradient-to-br from-background to-muted rounded-2xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        <model-viewer
          src={modelSrc}
          ios-src={iosSrc}
          poster={posterSrc}
          alt={alt || `${productName} 3D Model`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          loading="lazy"
          reveal="auto"
          style={{
            width: '100%',
            height: '400px',
            backgroundColor: 'transparent',
          }}
          onLoad={() => setIsLoading(false)}
        >
          {/* AR Button Slot */}
          <Button
            slot="ar-button"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-full shadow-lg"
          >
            <Smartphone className={cn('w-5 h-5', isArabic ? 'ml-2' : 'mr-2')} />
            {t('ar.viewInYourRoom')}
          </Button>
        </model-viewer>
      </div>

      {/* Desktop fallback - Show QR code */}
      {!isARSupported && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowQRCode(!showQRCode)}
            className="mb-4"
          >
            <QrCode className={cn('w-4 h-4', isArabic ? 'ml-2' : 'mr-2')} />
            {t('ar.scanQRCode')}
          </Button>

          {showQRCode && (
            <div className="p-4 bg-white rounded-lg inline-block shadow-lg">
              {/* QR Code placeholder - In production, generate actual QR */}
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isArabic
                  ? 'امسح بكاميرا هاتفك'
                  : 'Scan with your phone camera'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fallback for unsupported devices */}
      {!isARSupported && (
        <div className="mt-4 p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t('ar.arNotSupported')}
          </p>
          <Button variant="link" className="text-accent">
            {t('ar.tryVirtualConsultation')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ARModelViewer;
