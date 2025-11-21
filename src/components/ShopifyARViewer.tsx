import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface ShopifyARViewerProps {
  productHandle: string;
  productName: string;
}

export const ShopifyARViewer = ({ productHandle, productName }: ShopifyARViewerProps) => {
  return (
    <div className="space-y-3 p-4 rounded-lg bg-muted/30 border-2 border-dashed border-accent/30">
      <div className="flex items-center gap-2 mb-2">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Coming Soon
        </span>
      </div>
      
      <Button
        disabled
        variant="outline"
        className="w-full opacity-60 cursor-not-allowed"
      >
        <Lock className="w-4 h-4 mr-2" />
        View in Your Space (AR)
      </Button>
      
      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">AR viewing will be available soon.</p>
        <p className="text-xs">See your recliner in your room before you buy.</p>
      </div>
    </div>
  );
};
