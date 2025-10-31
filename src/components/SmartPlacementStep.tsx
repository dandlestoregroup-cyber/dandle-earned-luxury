import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PlacementSuggestion {
  label: string;
  text: string;
}

interface SmartPlacementStepProps {
  roomImageBase64: string;
  onPlacementSelected: (placement: string) => void;
  onBack?: () => void;
}

export const SmartPlacementStep = ({ 
  roomImageBase64, 
  onPlacementSelected,
  onBack 
}: SmartPlacementStepProps) => {
  const [suggestions, setSuggestions] = useState<PlacementSuggestion[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlacementSuggestions();
  }, []);

  const fetchPlacementSuggestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyzeRoom", {
        body: { roomImageBase64 }
      });

      if (error) throw error;

      if (data?.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      } else {
        // Fallback suggestions
        setSuggestions([
          { label: "Open area", text: "Place recliner in the most spacious area" },
          { label: "Near window", text: "Position near natural light source" },
          { label: "Corner spot", text: "Utilize corner for cozy placement" }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch placement suggestions:", error);
      toast({
        title: "Using default suggestions",
        description: "AI analysis unavailable, showing standard options",
        variant: "default"
      });
      // Fallback suggestions
      setSuggestions([
        { label: "Open area", text: "Place recliner in the most spacious area" },
        { label: "Near window", text: "Position near natural light source" },
        { label: "Corner spot", text: "Utilize corner for cozy placement" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    let placementFinal = "";
    
    if (selectedOption === "custom") {
      placementFinal = customText.trim();
      if (!placementFinal) {
        toast({
          title: "Custom placement required",
          description: "Please describe where to place the recliner",
          variant: "destructive"
        });
        return;
      }
    } else {
      const selected = suggestions.find(s => s.label === selectedOption);
      placementFinal = selected?.text || selectedOption;
    }

    if (!placementFinal) {
      toast({
        title: "Please select a placement",
        description: "Choose one of the suggested options or enter custom placement",
        variant: "destructive"
      });
      return;
    }

    onPlacementSelected(placementFinal);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Where should we place your recliner?</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          AI analyzed your room and suggests these optimal placements
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing your room...</p>
        </div>
      ) : (
        <RadioGroup value={selectedOption} onValueChange={(value) => {
          setSelectedOption(value);
          // Confirmation toast
          if (value !== "custom") {
            const selected = suggestions.find(s => s.label === value);
            toast({
              title: "Perfect choice!",
              description: `${selected?.label} – That spot will feel like a hug every evening.`,
            });
          }
        }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Label
                  htmlFor={suggestion.label}
                  className="cursor-pointer"
                >
                  <Card 
                    className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                      selectedOption === suggestion.label 
                        ? "border-primary shadow-lg ring-2 ring-primary/30 scale-[1.02]" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem 
                          value={suggestion.label} 
                          id={suggestion.label}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="font-semibold text-base leading-tight">
                            {suggestion.label}
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug">
                            {suggestion.text}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </motion.div>
            ))}

            {/* Custom placement option */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: suggestions.length * 0.1 }}
              className="sm:col-span-2"
            >
              <Label
                htmlFor="custom"
                className="cursor-pointer"
              >
                <Card 
                  className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                    selectedOption === "custom" 
                      ? "border-primary shadow-lg ring-2 ring-primary/30 scale-[1.01]" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem 
                        value="custom" 
                        id="custom"
                        className="mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="font-semibold text-base leading-tight">
                          Custom placement
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">
                          Describe exactly where you want the recliner
                        </p>
                        {selectedOption === "custom" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                          >
                            <Input
                              placeholder="e.g., Next to the bookshelf, facing the TV"
                              value={customText}
                              onChange={(e) => setCustomText(e.target.value)}
                              className="mt-2"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </motion.div>
          </div>
        </RadioGroup>
      )}

      <div className="flex gap-3 pt-4">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleContinue}
          disabled={!selectedOption || isLoading}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Show me
        </Button>
      </div>
    </div>
  );
};
