import { motion } from "framer-motion";
import { ArrowRight, Users, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WorkWithUs = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-nile-blue/5 via-background to-dandle-orange/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dandle-orange/10 text-dandle-orange text-sm font-body mb-4">
                <Users className="w-4 h-4" />
                Join Our Team
              </span>
              
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Work With Us
              </h2>
              
              <p className="font-body text-lg text-foreground/70 mb-6 leading-relaxed">
                At DANDLE, we're more than a company — we're a family of craftspeople, dreamers, and perfectionists. 
                If you believe in earned excellence and quiet sophistication, you might be one of us.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm font-body text-foreground/60">
                  <Heart className="w-4 h-4 text-dandle-orange" />
                  <span>Family Culture</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-foreground/60">
                  <Sparkles className="w-4 h-4 text-dandle-orange" />
                  <span>Growth & Learning</span>
                </div>
              </div>

              <Button
                onClick={() => navigate("/careers")}
                className="bg-dandle-orange hover:bg-dandle-orange/90 text-white font-body group"
              >
                View Open Positions
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-4/3 bg-gradient-to-br from-nile-blue/20 via-muted/50 to-dandle-orange/20 rounded-xl overflow-hidden border border-bronze/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-dandle-orange/20 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-dandle-orange" />
                    </div>
                    <p className="font-headline text-2xl font-semibold text-foreground mb-2">
                      We're Hiring
                    </p>
                    <p className="font-body text-sm text-foreground/60">
                      Join 20+ craftspeople
                    </p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-dandle-orange/10 blur-xl" />
                <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-nile-blue/10 blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkWithUs;
