import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReclinerCarousel from "@/components/ReclinerCarousel";
import { toast } from "sonner";

const Visualize = () => {
  const [selectedModel, setSelectedModel] = useState<string>("RelaxMax");
  const [selectedColor, setSelectedColor] = useState<string>("Tan Beige");

  const handleModelColorSelect = (modelName: string, colorName: string) => {
    setSelectedModel(modelName);
    setSelectedColor(colorName);
    toast.success(`Selected ${modelName} in ${colorName}`, {
      description: "Ready to preview in your room",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-8 md:pt-32 md:pb-12 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Show It in My Room
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Choose your perfect Dandle recliner and visualize it in your space
            </p>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="py-8 md:py-12">
          <ReclinerCarousel
            onSelect={handleModelColorSelect}
            activeModel={selectedModel}
            activeColor={selectedColor}
          />
        </section>

        {/* Selected Info */}
        <section className="py-8 md:py-12 bg-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Currently Selected</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                {selectedModel}
              </h2>
              <p className="text-muted-foreground">{selectedColor}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Visualize;
