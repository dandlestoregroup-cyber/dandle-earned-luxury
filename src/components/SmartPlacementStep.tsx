import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SmartPlacementStepProps {
  roomImageBase64: string;
  onPlacementSelected: (placement: string) => void;
  onBack?: () => void;
}

export const SmartPlacementStep = ({
  onPlacementSelected,
  onBack,
}: SmartPlacementStepProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    { label: "Near the floor lamp", benefit: "Cozy reading nook with built-in light." },
    { label: "Opposite the L-shape", benefit: "Completes the conversation circle." },
    { label: "Corner by the plant", benefit: "Uses dead space, keeps pathways clear." },
    { label: "Custom spot", benefit: "You draw the exact spot." },
  ];

  const handleOptionClick = (label: string) => {
    setSelectedOption(label);
    onPlacementSelected(label);
    toast.success("Great choice! That spot will feel like a hug every evening.");
  };

  return (
    <div className="w-full max-h-[60vh] overflow-y-auto px-4 py-2">
      <p className="text-center text-lg font-semibold mb-4">Where should we place your recliner?</p>
      <p className="text-center text-sm text-muted-foreground mb-6">AI analyzed your room and suggests these optimal placements</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center mb-6">
        {options.map((o) => (
          <button
            key={o.label}
            onClick={() => handleOptionClick(o.label)}
            className={`group relative w-40 h-40 rounded-3xl overflow-hidden shadow-lg transition transform hover:scale-105 bg-gradient-to-br from-primary/20 to-primary/40 ${
              selectedOption === o.label ? 'ring-4 ring-primary' : ''
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-white text-sm font-semibold">{o.label}</span>
            <span className="absolute top-2 left-2 text-white text-xs">{o.benefit}</span>
          </button>
        ))}
      </div>

      {onBack && (
        <div className="flex justify-start pt-4">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
};
