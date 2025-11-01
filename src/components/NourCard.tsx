import { Card, CardContent } from "@/components/ui/card";
import Lottie from "lottie-react";
import { Upload, Eye, Sparkles } from "lucide-react";

interface NourCardProps {
  onClick: () => void;
}

const NourCard = ({ onClick }: NourCardProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 overflow-hidden border-0 rounded-3xl relative"
      onClick={onClick}
      style={{ boxShadow: '0 20px 60px -10px rgba(251, 146, 60, 0.25)' }}
    >
      <CardContent className="p-0">
        <div className="relative min-h-[24rem] flex flex-col items-center justify-center text-center p-8 overflow-hidden bg-gradient-to-br from-orange-50/80 via-rose-50/60 to-amber-50/40">
          {/* Peach glow backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-rose-300/8 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.15),transparent_70%)] 
                          group-hover:bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.25),transparent_80%)] 
                          transition-all duration-1000" />
          
          {/* Lottie animation (placeholder - will work when JSON is added) */}
          <div className="relative z-10 w-32 h-32 mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-orange-500 animate-pulse" />
            </div>
          </div>
          
          <div className="relative z-10 space-y-6 max-w-md mx-auto">
            {/* Title */}
            <div>
              <h3 className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                Nour
              </h3>
              <p className="text-xl font-semibold text-gray-700">
                AI Comfort Stylist
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
            <div className="pt-2">
              <div className="inline-block px-8 py-3 rounded-full 
                              bg-gradient-to-r from-orange-500 to-rose-500 text-white
                              text-sm font-bold 
                              group-hover:from-orange-600 group-hover:to-rose-600
                              transition-all duration-500
                              shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/40">
                Try Nour Now →
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NourCard;
