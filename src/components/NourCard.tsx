import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Lottie from "lottie-react";
import { Upload, Eye, Sparkles } from "lucide-react";
import windStars from "../../public/lottie/nour-wind-stars.json";

interface NourCardProps {
  onClick: () => void;
}

const NourCard = ({ onClick }: NourCardProps) => {
  const [ctaActive, setCtaActive] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setCtaActive(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Card 
      className="group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 overflow-hidden border-0 rounded-3xl relative"
      onClick={onClick}
      style={{ boxShadow: '0 20px 60px -10px rgba(251, 146, 60, 0.25)' }}
    >
      <CardContent className="p-0">
        <div className="relative min-h-[90vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center p-8 overflow-hidden bg-gradient-to-br from-orange-50/80 via-rose-50/60 to-amber-50/40">
          {/* Peach glow backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-rose-300/8 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.15),transparent_70%)] 
                          group-hover:bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.25),transparent_80%)] 
                          transition-all duration-1000" />
          
          {/* Lottie animation */}
          <Lottie 
            animationData={windStars} 
            loop 
            autoPlay 
            className="absolute top-6 left-1/2 -translate-x-1/2 w-24 md:w-32 opacity-90 pointer-events-none"
          />
          
          <div className="relative z-10 space-y-6 max-w-md mx-auto">
            {/* Title */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                See your recliner come alive in your own room ✨
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
                Upload a photo, choose your Dandle recliner, and watch Nour make it real.
              </p>
            </div>
            
            {/* 3-step guide */}
            <div className="grid grid-cols-3 gap-3 text-left">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Upload Room</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-rose-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">Pick Spot</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">See Magic</span>
              </div>
            </div>
            
            {/* CTA */}
            {ctaActive && (
              <div className="pt-2 animate-fade-in">
                <div className="inline-block px-8 py-3 rounded-full 
                                bg-gradient-to-r from-orange-500 to-rose-500 text-white
                                text-sm font-bold 
                                group-hover:from-orange-600 group-hover:to-rose-600
                                transition-all duration-500
                                shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/40">
                  Try it in My Room →
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NourCard;
