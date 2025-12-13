import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/shopifyStorefront";
import { cn } from "@/lib/utils";

interface Variant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string;
  onVariantChange: (variantId: string) => void;
}

export function VariantSelector({ variants, selectedVariantId, onVariantChange }: VariantSelectorProps) {
  // If only one variant (Default Title), don't show selector
  if (variants.length <= 1 && variants[0]?.title === "Default Title") {
    return null;
  }

  // Group variants by option name if there are multiple options
  const hasMultipleOptions = variants.some(v => v.selectedOptions.length > 1);

  if (hasMultipleOptions) {
    // Complex variant selection - show all variants as cards
    return (
      <div className="space-y-4">
        <Label className="text-sm font-medium">Select Option</Label>
        <RadioGroup value={selectedVariantId} onValueChange={onVariantChange} className="grid gap-3">
          {variants.map((variant) => (
            <Label
              key={variant.id}
              htmlFor={variant.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all",
                selectedVariantId === variant.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                !variant.availableForSale && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={variant.id}
                  id={variant.id}
                  disabled={!variant.availableForSale}
                />
                <div>
                  <span className="font-medium">{variant.title}</span>
                  {!variant.availableForSale && (
                    <span className="text-xs text-destructive ml-2">Out of stock</span>
                  )}
                </div>
              </div>
              <span className="font-semibold">
                {formatPrice(variant.price.amount, variant.price.currencyCode)}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>
    );
  }

  // Simple variant selection (e.g., Manual vs Power)
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Select Mechanism</Label>
      <RadioGroup value={selectedVariantId} onValueChange={onVariantChange} className="grid gap-3">
        {variants.map((variant) => (
          <Label
            key={variant.id}
            htmlFor={variant.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all",
              selectedVariantId === variant.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
              !variant.availableForSale && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value={variant.id}
                id={variant.id}
                disabled={!variant.availableForSale}
              />
              <div>
                <span className="font-medium">{variant.title}</span>
                {!variant.availableForSale && (
                  <span className="text-xs text-destructive ml-2">Out of stock</span>
                )}
              </div>
            </div>
            <span className="font-semibold">
              {formatPrice(variant.price.amount, variant.price.currencyCode)}
            </span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
