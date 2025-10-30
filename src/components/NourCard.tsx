import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NourCardProps {
  onClick: () => void;
}

const NourCard = ({ onClick }: NourCardProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden border-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative min-h-[16rem] flex flex-col items-center justify-center text-center p-6 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/15 to-background animate-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.3),transparent_60%)] group-hover:bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.5),transparent_70%)] transition-all duration-700" />
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/40 animate-float" style={{ animationDelay: '0s' }} />
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-500 animate-soft-pulse shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20">
              <Sparkles className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Nour
              </h3>
              <p className="text-lg font-semibold text-foreground/80">
                AI Comfort Stylist
              </p>
            </div>
            
            <p className="text-sm max-w-xs mx-auto text-muted-foreground leading-relaxed">
              ✨ See how our recliners look in your space with AI-powered visualization
            </p>
            
            <div className="pt-2">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold group-hover:bg-primary/20 transition-colors duration-300">
                Try it now →
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NourCard;
