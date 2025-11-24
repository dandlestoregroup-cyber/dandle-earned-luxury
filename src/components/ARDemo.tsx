import { motion } from "framer-motion";
import { Upload, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ARDemo = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-warm-beige py-24 px-6 text-center">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-headline text-4xl md:text-6xl mb-6 text-dandle-orange leading-tight">
          See your recliner<br />
          come alive in<br />
          your own room ✨
        </h2>
        
        <p className="text-lg md:text-xl text-charcoal/80 mb-12 max-w-2xl mx-auto">
          Upload a photo, choose your Dandle recliner, and watch Nour make it real.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-dandle-orange/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-dandle-orange" />
            </div>
            <h3 className="font-headline text-xl text-charcoal">Upload Room</h3>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-dandle-orange/20 flex items-center justify-center">
              <Eye className="w-8 h-8 text-dandle-orange" />
            </div>
            <h3 className="font-headline text-xl text-charcoal">Pick Spot</h3>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-dandle-orange/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-dandle-orange" />
            </div>
            <h3 className="font-headline text-xl text-charcoal">See Magic</h3>
          </motion.div>
        </div>

        <Button
          onClick={() => navigate('/nour-chat')}
          size="lg"
          className="bg-gradient-to-r from-dandle-orange to-pink-500 hover:from-dandle-orange/90 hover:to-pink-500/90 text-white px-8 py-6 text-lg font-headline rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Try it in My Room →
        </Button>
      </motion.div>
    </section>
  );
};

export default ARDemo;
