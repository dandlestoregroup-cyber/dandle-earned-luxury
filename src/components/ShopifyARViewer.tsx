import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Box, Loader2 } from "lucide-react";
import { getProductARMedia, isARSupported, getARViewerUrl, Product3dMedia } from "@/lib/shopify-ar";
import { toast } from "sonner";

interface ShopifyARViewerProps {
  productHandle: string;
  productName: string;
}

export const ShopifyARViewer = ({ productHandle, productName }: ShopifyARViewerProps) => {
  const [models, setModels] = useState<Product3dMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    const checkARAndFetchModels = async () => {
      setArSupported(isARSupported());
      
      try {
        const media = await getProductARMedia(productHandle);
        setModels(media);
      } catch (error) {
        console.error('Error loading AR models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkARAndFetchModels();
  }, [productHandle]);

  const handleViewInAR = (model: Product3dMedia) => {
    const arUrl = getARViewerUrl(model);
    
    if (!arUrl) {
      toast.error("AR not available for this device");
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS AR Quick Look
      const anchor = document.createElement('a');
      anchor.setAttribute('rel', 'ar');
      anchor.href = arUrl;
      anchor.click();
    } else {
      // Android Scene Viewer
      window.location.href = arUrl;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking AR availability...</span>
      </div>
    );
  }

  if (!arSupported) {
    return (
      <div className="text-sm text-muted-foreground">
        AR viewing requires iOS or Android device
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No 3D models available for this product
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={() => handleViewInAR(models[0])}
        variant="outline"
        className="w-full"
      >
        <Box className="w-4 h-4 mr-2" />
        View in Your Space (AR)
      </Button>
      {models.length > 1 && (
        <p className="text-xs text-muted-foreground text-center">
          {models.length} 3D models available
        </p>
      )}
    </div>
  );
};
