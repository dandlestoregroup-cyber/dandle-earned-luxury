import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ARViewerProps {
  productTitle: string;
  productHandle: string;
  // AR model files - these need to be created and hosted
  usdzUrl?: string; // For iOS AR Quick Look
  glbUrl?: string;  // For Android Scene Viewer
}

export const ARViewer = ({ productTitle, productHandle, usdzUrl, glbUrl }: ARViewerProps) => {
  const { toast } = useToast();
  const [isARSupported] = useState(() => {
    // Check for AR support
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    return (isIOS && !!usdzUrl) || (isAndroid && !!glbUrl);
  });

  const handleARView = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS && usdzUrl) {
      // iOS AR Quick Look
      const anchor = document.createElement('a');
      anchor.rel = 'ar';
      anchor.href = usdzUrl;
      anchor.appendChild(document.createElement('img'));
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else if (isAndroid && glbUrl) {
      // Android Scene Viewer
      const intent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glbUrl)}&mode=ar_preferred&title=${encodeURIComponent(productTitle)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
      window.location.href = intent;
    } else {
      toast({
        title: "AR not available",
        description: "AR viewing is only available on compatible iOS and Android devices",
        variant: "default"
      });
    }
  };

  // Don't show button if no AR models are available
  if (!usdzUrl && !glbUrl) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleARView}
        variant="outline"
        className="w-full border-dandle-orange/40 hover:bg-dandle-orange/10 hover:border-dandle-orange"
        disabled={!isARSupported}
      >
        <Maximize2 className="w-5 h-5 mr-2" />
        {isARSupported ? "View in Your Space (AR)" : "AR View (Mobile Only)"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        See how this {productTitle} looks in your home using augmented reality
      </p>
    </div>
  );
};

// Note: To enable AR viewing, you need to:
// 1. Create 3D models of your products in USDZ format (for iOS) and GLB format (for Android)
// 2. Upload these files to your public directory or CDN
// 3. Pass the URLs to this component via the usdzUrl and glbUrl props
//
// Tools for creating 3D models:
// - Blender (free, open-source)
// - Adobe Dimension
// - SketchUp
// - Reality Composer (iOS, for USDZ files)
//
// Once you have the models, update the product catalog with the AR URLs
