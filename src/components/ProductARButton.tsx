import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";
import { getProductARMedia, isARSupported, getARViewerUrl, Product3dMedia } from "@/lib/shopify-ar";
import { toast } from "sonner";

interface ProductARButtonProps {
  productHandle: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export const ProductARButton = ({ productHandle, variant = "outline", className = "" }: ProductARButtonProps) => {
  const [models, setModels] = useState<Product3dMedia[]>([]);
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    const checkARAndFetchModels = async () => {
      setArSupported(isARSupported());
      
      try {
        const media = await getProductARMedia(productHandle);
        setModels(media);
      } catch (error) {
        console.error('Error loading AR models:', error);
      }
    };

    checkARAndFetchModels();
  }, [productHandle]);

  const handleViewInAR = () => {
    if (!models.length) {
      toast.error("No 3D model available for this product");
      return;
    }

    const arUrl = getARViewerUrl(models[0]);
    
    if (!arUrl) {
      toast.error("AR not available for this device");
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      const anchor = document.createElement('a');
      anchor.setAttribute('rel', 'ar');
      anchor.href = arUrl;
      anchor.click();
    } else {
      window.location.href = arUrl;
    }
  };

  // Don't show button if no AR support or no models
  if (!arSupported || models.length === 0) {
    return null;
  }

  return (
    <Button
      onClick={handleViewInAR}
      variant={variant}
      className={className}
    >
      <Box className="w-4 h-4 mr-2" />
      View in AR
    </Button>
  );
};
