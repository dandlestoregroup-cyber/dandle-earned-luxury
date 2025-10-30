import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NourCardProps {
  onClick: () => void;
}

const NourCard = ({ onClick }: NourCardProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-primary/20 hover:border-primary/40"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-64 bg-gradient-to-br from-primary/10 via-primary/5 to-background flex flex-col items-center justify-center text-center p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_70%)]" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors animate-soft-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2 animate-soft-pulse">Nour</h3>
              <p className="text-muted-foreground animate-soft-pulse" style={{ animationDelay: "0.2s" }}>
                AI Comfort Stylist
              </p>
            </div>
            
            <p className="text-sm max-w-xs mx-auto">
              See how our recliners look in your space with AI-powered visualization
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NourCard;
