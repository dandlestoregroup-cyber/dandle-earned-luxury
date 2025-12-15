import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 5 
}: QuantitySelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="font-body text-sm font-medium text-foreground">
        Quantity
      </label>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
          disabled={quantity <= min}
          className="h-10 w-10"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="h-10 w-10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
