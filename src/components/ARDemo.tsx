import { motion } from "framer-motion";
import { Eye, Palette, Gift, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ARDemo = () => {
  const navigate = useNavigate();

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
          <h2 
            className="font-headline text-4xl md:text-5xl text-charcoal mb-4"
            data-en="Premium Tools"
            data-ar="أدوات مميزة"
          >
            Premium Tools
          </h2>
          <p 
            className="text-lg text-charcoal/70 max-w-2xl mx-auto"
            data-en="See your recliner in your space, in your color"
            data-ar="شوف كرسيك في مكانك، بلونك"
          >
            See your recliner in your space, in your color
          </p>
        </motion.div>

        {/* Three Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Room Fit */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-dandle-orange" />
              </div>
              <div>
                <h3 
                  className="font-headline text-xl text-charcoal"
                  data-en="Room & Space Fit"
                  data-ar="مقاس الركن"
                >
                  Room & Space Fit
                </h3>
              </div>
            </div>
            
            <p 
              className="text-charcoal/70 mb-6 text-sm"
              data-en="Check which recliner fits your space perfectly."
              data-ar="اكتشف الكرسي المناسب لمساحتك."
            >
              Check which recliner fits your space perfectly.
            </p>

            <Button
              onClick={() => navigate('/room-fit')}
              className="w-full bg-dandle-orange hover:bg-dandle-orange/90 text-white font-medium"
            >
              <span data-en="Check Fit" data-ar="تحقق من المقاس">Check Fit</span>
            </Button>
          </motion.div>

          {/* Fabric Matcher */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Palette className="w-6 h-6 text-dandle-orange" />
              </div>
              <div>
                <h3 
                  className="font-headline text-xl text-charcoal"
                  data-en="Fabric Matcher"
                  data-ar="مطابقة الأقمشة"
                >
                  Fabric Matcher
                </h3>
              </div>
            </div>
            
            <p 
              className="text-charcoal/70 mb-6 text-sm"
              data-en="Match fabrics to your existing décor instantly."
              data-ar="طابق الأقمشة مع ديكورك الحالي فوراً."
            >
              Match fabrics to your existing décor instantly.
            </p>

            <Button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="outline"
              className="w-full border-dandle-orange text-dandle-orange hover:bg-dandle-orange/10"
            >
              <span data-en="Explore" data-ar="استكشف">Explore</span>
            </Button>
          </motion.div>

          {/* Gift Finder */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-dandle-orange" />
              </div>
              <div className="flex items-center gap-2">
                <h3 
                  className="font-headline text-xl text-charcoal"
                  data-en="Gift Finder"
                  data-ar="دليل الهدايا"
                >
                  Gift Finder
                </h3>
                <Badge className="bg-dandle-orange/20 text-dandle-orange border-dandle-orange/30 text-xs">
                  <span data-en="New" data-ar="جديد">New</span>
                </Badge>
              </div>
            </div>
            
            <p 
              className="text-charcoal/70 mb-6 text-sm"
              data-en="Find the perfect recliner gift in 3 questions."
              data-ar="اختر هدية الكرسي المثالية في ٣ أسئلة."
            >
              Find the perfect recliner gift in 3 questions.
            </p>

            <Button
              onClick={() => navigate('/gift')}
              className="w-full bg-dandle-orange hover:bg-dandle-orange/90 text-white font-medium"
            >
              <span data-en="Start Gift Finder" data-ar="ابدأ دليل الهدايا">Start Gift Finder</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ARDemo;
