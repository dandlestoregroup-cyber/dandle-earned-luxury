import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface ProductARButtonProps {
  productHandle: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showComingSoon?: boolean;
}

export const ProductARButton = ({ 
  productHandle, 
  variant = "outline", 
  className = "",
  showComingSoon = true 
}: ProductARButtonProps) => {
  // Don't show if coming soon is disabled
  if (!showComingSoon) {
    return null;
  }

  return (
    <Button
      disabled
      variant={variant}
      className={`${className} opacity-60 cursor-not-allowed`}
    >
      <Lock className="w-4 h-4 mr-2" />
      View in AR (Coming Soon)
    </Button>
  );
};
