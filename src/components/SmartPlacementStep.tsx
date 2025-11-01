import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PlacementZone {
  id: number;
  title: string;
  subtitle: string;
  why: string;
  feasibility_score: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface SmartPlacementStepProps {
  roomImageBase64: string;
  placementSuggestions: PlacementZone[];
  onPlacementSelected: (placement: PlacementZone) => void;
  onBack?: () => void;
}

export const SmartPlacementStep = ({
  roomImageBase64,
  placementSuggestions,
  onPlacementSelected,
  onBack,
}: SmartPlacementStepProps) => {
  const [selectedZone, setSelectedZone] = useState<PlacementZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);

  const handleZoneClick = (zone: PlacementZone) => {
    setSelectedZone(zone);
    toast.success("AI verified: fits without blocking furniture", {
      description: zone.why,
      duration: 3000,
    });
  };

  const handleConfirm = () => {
    if (selectedZone) {
      onPlacementSelected(selectedZone);
    }
  };

  return (
    <div className="w-full max-h-[70vh] overflow-y-auto px-4 py-2">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold">Where should we place your recliner?</h2>
        <p className="text-sm text-muted-foreground">
          AI analyzed your room and detected valid floor zones
        </p>
        <p className="text-xs text-accent font-medium">
          Tap a highlighted zone to preview placement
        </p>
      </div>

      {/* Room Image with Overlay Zones */}
      <div className="relative w-full max-w-2xl mx-auto mb-6 rounded-xl overflow-hidden shadow-2xl">
        <img
          src={roomImageBase64}
          alt="Your room"
          className="w-full h-auto"
        />
        
        {/* Placement Zone Overlays */}
        {placementSuggestions.map((zone) => (
          <motion.div
            key={zone.id}
            className={`absolute border-4 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedZone?.id === zone.id
                ? 'border-accent bg-accent/30 shadow-[0_0_30px_rgba(243,122,29,0.6)]'
                : hoveredZone === zone.id
                ? 'border-accent/70 bg-accent/20'
                : 'border-accent/40 bg-accent/10'
            }`}
            style={{
              left: `${zone.coordinates.x}%`,
              top: `${zone.coordinates.y}%`,
              width: `${zone.coordinates.width}%`,
              height: `${zone.coordinates.height}%`,
            }}
            onClick={() => handleZoneClick(zone)}
            onMouseEnter={() => setHoveredZone(zone.id)}
            onMouseLeave={() => setHoveredZone(null)}
            animate={{
              scale: selectedZone?.id === zone.id ? 1.05 : 1,
              opacity: selectedZone && selectedZone.id !== zone.id ? 0.4 : 1,
            }}
            whileHover={{ scale: 1.03 }}
          >
            {/* Zone Label */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-background px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg">
              Zone {zone.id}
            </div>
            
            {/* Pulse Animation for Selected Zone */}
            {selectedZone?.id === zone.id && (
              <motion.div
                className="absolute inset-0 border-4 border-accent rounded-lg"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Zone Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {placementSuggestions.map((zone) => (
          <motion.button
            key={zone.id}
            onClick={() => handleZoneClick(zone)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedZone?.id === zone.id
                ? 'border-accent bg-accent/10 shadow-lg'
                : 'border-border bg-card hover:border-accent/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-sm">{zone.title}</h3>
              <span className="text-xs font-semibold text-accent">
                {Math.round(zone.feasibility_score * 100)}% fit
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{zone.subtitle}</p>
            <p className="text-xs text-foreground/80">{zone.why}</p>
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        )}
        
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ml-auto"
          >
            <Button
              onClick={handleConfirm}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-background font-semibold shadow-lg"
            >
              Render My Comfort Here
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};