import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ARDemo = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section id="ar-demo" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Video Demo */}
          <div className="relative group animate-fade-in-up">
            <div className="relative rounded-2xl overflow-hidden shadow-luxury">
              <img
                src="https://picsum.photos/600/400?random=tech"
                alt="AR Demo - View recliner in your space"
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary-dark/40 group-hover:bg-primary-dark/30 transition-colors duration-300 flex items-center justify-center">
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-6 shadow-gold hover:shadow-luxury transition-all duration-300 hover:scale-110"
                  aria-label="Play AR demo video"
                >
                  <Play size={48} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Experience Before You Invest
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              With Dandle's AR visualization, you can see exactly how your
              chosen recliner will look and fit in your space before making a
              commitment. No guesswork, no surprises—just confidence in your
              decision.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Smartphone className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    True-to-Scale Visualization
                  </h3>
                  <p className="text-muted-foreground">
                    See your recliner in actual size within your room
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Smartphone className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Color & Material Preview
                  </h3>
                  <p className="text-muted-foreground">
                    Test different colors and finishes in your lighting
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Smartphone className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Share with Family
                  </h3>
                  <p className="text-muted-foreground">
                    Save and share your AR view to get everyone's input
                  </p>
                </div>
              </li>
            </ul>
            <Button variant="hero" size="lg">
              <Smartphone className="mr-2" size={20} />
              Try AR Now
            </Button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-card-foreground">
              AR Visualization Demo
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">AR Demo Video Placeholder</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ARDemo;
