import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReclinerModel {
  name: string;
  tagline: string;
  id: string;
}

interface ReclinerCarouselProps {
  onSelect: (modelName: string, colorName: string) => void;
  activeModel?: string;
  activeColor?: string;
}

const models: ReclinerModel[] = [
  { id: "relaxmax", name: "RelaxMax", tagline: "Gravity of Comfort" },
  { id: "diva", name: "Diva", tagline: "Elegance with Attitude" },
  { id: "comfortplus", name: "ComfortPlus", tagline: "Smart Comfort Engineered" },
  { id: "cozycompanion", name: "CozyCompanion", tagline: "Your Everyday Retreat" },
  { id: "easyup", name: "EasyUp", tagline: "Effortless Lift, Effortless Living" },
];

const colors = [
  { name: "Tan Beige", hex: "#D4C4A8", id: "tan-beige" },
  { name: "Royal Blue", hex: "#4169E1", id: "royal-blue" },
  { name: "Off White", hex: "#FAF9F6", id: "off-white" },
  { name: "Chic Red", hex: "#DC143C", id: "chic-red" },
  { name: "Elephant Grey", hex: "#8B8589", id: "elephant-grey" },
];

export default function ReclinerCarousel({ onSelect, activeModel, activeColor }: ReclinerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const minSwipeDistance = 50;

  useEffect(() => {
    if (activeModel) {
      const index = models.findIndex(m => m.name === activeModel);
      if (index !== -1) setCurrentIndex(index);
    }
    if (activeColor) {
      setSelectedColor(activeColor);
    }
  }, [activeModel, activeColor]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % models.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + models.length) % models.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handleCardClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    onSelect(models[currentIndex].name, colorName);
  };

  const handlePreview = () => {
    onSelect(models[currentIndex].name, selectedColor);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex;
    if (diff === 0) return "center";
    if (diff === 1 || diff === -(models.length - 1)) return "right";
    if (diff === -1 || diff === models.length - 1) return "left";
    return "hidden";
  };

  const getImagePath = (modelId: string) => {
    // Map to existing assets - using RelaxMax images as placeholder
    const imageMap: Record<string, string> = {
      relaxmax: "/images/relaxmax-hero-offwhite.jpg",
      diva: "/images/relaxmax-hero-offwhite.jpg",
      comfortplus: "/images/relaxmax-hero-offwhite.jpg",
      cozycompanion: "/images/cozycompanion-yellow-front.jpg",
      easyup: "/images/relaxmax-hero-offwhite.jpg",
    };
    return imageMap[modelId] || "/images/relaxmax-hero-offwhite.jpg";
  };

  return (
    <div className="w-full py-12 px-4 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Carousel Container */}
        <div 
          className="relative h-[500px] md:h-[600px] mb-8"
          style={{ perspective: "1000px" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Navigation Arrows - Desktop */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={isTransitioning}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:scale-110 transition-transform"
            aria-label="Previous model"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={isTransitioning}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:scale-110 transition-transform"
            aria-label="Next model"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Cards */}
          <div className="relative h-full flex items-center justify-center">
            {models.map((model, index) => {
              const position = getCardPosition(index);
              return (
                <div
                  key={model.id}
                  onClick={() => handleCardClick(index)}
                  className={cn(
                    "absolute transition-all duration-500 ease-out cursor-pointer",
                    position === "center" && "z-10 scale-100 opacity-100 translate-x-0",
                    position === "left" && "z-5 scale-75 md:scale-80 opacity-60 -translate-x-[60%] md:-translate-x-[80%]",
                    position === "right" && "z-5 scale-75 md:scale-80 opacity-60 translate-x-[60%] md:translate-x-[80%]",
                    position === "hidden" && "opacity-0 scale-50 pointer-events-none"
                  )}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="bg-card rounded-3xl shadow-2xl overflow-hidden w-[280px] md:w-[400px] border border-border">
                    {/* Image */}
                    <div className="relative h-[280px] md:h-[400px] bg-gradient-to-br from-secondary/20 to-background overflow-hidden">
                      <img
                        src={getImagePath(model.id)}
                        alt={model.name}
                        className="w-full h-full object-contain transition-opacity duration-200"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-3">
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        {model.name}
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base font-medium">
                        {model.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Color Picker */}
        <div className="flex justify-center gap-3 mb-6">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorSelect(color.name)}
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-200 hover:scale-110",
                "ring-offset-2 ring-offset-background",
                selectedColor === color.name && "ring-2 ring-primary scale-110"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name}`}
            />
          ))}
        </div>

        {/* Preview Button */}
        <div className="flex justify-center">
          <Button
            onClick={handlePreview}
            size="lg"
            className="bg-[#E76A24] hover:bg-[#E76A24]/90 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Preview in My Room
          </Button>
        </div>

        {/* Mobile Indicators */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {models.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
