import { motion } from "framer-motion";
import { Upload, Eye, Sparkles, Palette, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ARDemo = () => {
  return (
    <section className="bg-warm-beige py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-dandle-orange/20 text-dandle-orange border-dandle-orange/30 mb-4">
            Coming Soon
          </Badge>
          <h2 className="font-headline text-4xl md:text-5xl text-charcoal mb-4">
            Experience Before You Buy
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Revolutionary features to help you make the perfect choice
          </p>
        </motion.div>

        {/* Two Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* See It In My Room */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Eye className="w-7 h-7 text-dandle-orange" />
              </div>
              <div>
                <h3 className="font-headline text-2xl text-charcoal">See It In My Room</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  <Clock className="w-3 h-3 mr-1" /> Coming Soon
                </Badge>
              </div>
            </div>
            
            <p className="text-charcoal/70 mb-6">
              Upload a photo of your living space and watch Nour, our AI assistant, 
              place your chosen recliner perfectly in your room.
            </p>

            <div className="flex gap-4 text-sm text-charcoal/60">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Room</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Placement</span>
              </div>
            </div>
          </motion.div>

          {/* Chair Recoloring */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Palette className="w-7 h-7 text-dandle-orange" />
              </div>
              <div>
                <h3 className="font-headline text-2xl text-charcoal">Chair Recoloring</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  <Clock className="w-3 h-3 mr-1" /> Coming Soon
                </Badge>
              </div>
            </div>
            
            <p className="text-charcoal/70 mb-6">
              Preview any recliner in your preferred fabric and color before you buy. 
              From Nile Sapphire Blue to Sandstorm Ochre — see your perfect match.
            </p>

            <div className="flex gap-2">
              {["#2B547E", "#C4A35A", "#8B7355", "#6B8E23", "#CD5C5C", "#708090"].map((color) => (
                <div 
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ARDemo;