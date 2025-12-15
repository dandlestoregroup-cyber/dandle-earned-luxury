import { useState } from "react";
import { Check } from "lucide-react";
import { ProductColor } from "@/data/productDetails";

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: string;
  onColorChange: (colorName: string) => void;
}

export const ColorSelector = ({ colors, selectedColor, onColorChange }: ColorSelectorProps) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-body text-sm font-medium text-foreground">
          Color / Fabric
        </label>
        <span className="text-sm text-bronze font-medium">
          {hoveredColor || selectedColor}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.name)}
            onMouseEnter={() => setHoveredColor(color.name)}
            onMouseLeave={() => setHoveredColor(null)}
            className={`
              relative w-12 h-12 rounded-full transition-all duration-200
              ring-2 ring-offset-2 ring-offset-background
              ${selectedColor === color.name 
                ? 'ring-bronze scale-110' 
                : 'ring-transparent hover:ring-muted-foreground/30 hover:scale-105'
              }
            `}
            style={{ backgroundColor: color.hex }}
            aria-label={`Select ${color.name}`}
            title={color.name}
          >
            {selectedColor === color.name && (
              <Check 
                className={`
                  absolute inset-0 m-auto w-5 h-5 
                  ${isLightColor(color.hex) ? 'text-charcoal' : 'text-white'}
                `} 
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Helper to determine if a color is light (for contrast)
function isLightColor(hex: string): boolean {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 160;
}
