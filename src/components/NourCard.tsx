import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NourCardProps {
  onClick: () => void;
}

const NourCard = ({ onClick }: NourCardProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-all duration-700 overflow-hidden border-0 rounded-3xl relative"
      onClick={onClick}
      style={{ boxShadow: 'var(--shadow-hero)' }}
    >
      <CardContent className="p-0">
        <div className="relative min-h-[20rem] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
          {/* Hero gradient with depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/10 to-background animate-gradient" 
               style={{ backgroundSize: '200% 200%' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--accent)/0.25),transparent_70%)] 
                          group-hover:bg-[radial-gradient(circle_at_50%_120%,hsl(var(--accent)/0.4),transparent_80%)] 
                          transition-all duration-1000" />
          
          {/* Shimmer watermark (Nour breathing motion) */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent 
                            animate-shimmer-breath" 
                 style={{ width: '200%' }} />
          </div>
          
          {/* Floating particles with parallax depth */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-accent/50 animate-parallax" 
                 style={{ animationDelay: '0s' }} />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-accent/40 animate-float" 
                 style={{ animationDelay: '0.7s' }} />
            <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 rounded-full bg-accent/30 animate-parallax" 
                 style={{ animationDelay: '1.4s' }} />
          </div>
          
          <div className="relative z-10 space-y-5">
            {/* Icon with intense glow on hover */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full 
                            bg-gradient-to-br from-accent/30 to-accent/10 
                            group-hover:from-accent/50 group-hover:to-accent/20 
                            transition-all duration-700 animate-soft-pulse 
                            shadow-lg group-hover:shadow-2xl 
                            group-hover:shadow-accent/40">
              <Sparkles className="w-12 h-12 text-accent group-hover:scale-125 transition-transform duration-500" />
            </div>
            
            {/* Title with text pulse */}
            <div className="animate-text-pulse">
              <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                Nour
              </h3>
              <p className="text-xl font-semibold text-foreground/90">
                AI Comfort Stylist
              </p>
            </div>
            
            {/* Refined microcopy - "See It. Feel It. Live It." */}
            <p className="text-base max-w-sm mx-auto text-muted-foreground leading-relaxed font-medium">
              See It. Feel It. Live It.<br />
              <span className="text-sm opacity-80">Visualize your perfect comfort in seconds</span>
            </p>
            
            {/* CTA with shimmer effect */}
            <div className="pt-3">
              <div className="inline-block px-6 py-2 rounded-full 
                              bg-accent/15 text-accent 
                              text-sm font-bold 
                              group-hover:bg-accent group-hover:text-accent-foreground 
                              transition-all duration-500
                              shadow-md group-hover:shadow-lg group-hover:shadow-accent/30">
                Start Your Journey →
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NourCard;
