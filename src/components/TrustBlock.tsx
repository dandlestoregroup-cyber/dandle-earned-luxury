import { motion } from "framer-motion";
import { MapPin, Shield, Truck, Palette } from "lucide-react";

const trustPoints = [
  {
    icon: MapPin,
    titleEn: "Handcrafted in Cairo",
    titleAr: "مصنوع يدويًا في القاهرة",
  },
  {
    icon: Shield,
    titleEn: "5-Year Warranty",
    titleAr: "ضمان 5 سنوات",
  },
  {
    icon: Truck,
    titleEn: "White-Glove Delivery",
    titleAr: "توصيل راقي",
  },
  {
    icon: Palette,
    titleEn: "Egyptian-Inspired Colors",
    titleAr: "ألوان مستوحاة من مصر",
  },
];

const TrustBlock = () => {
  return (
    <section className="bg-warm-white py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-headline text-3xl md:text-4xl text-charcoal text-center mb-4 font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          data-en="Why Families Choose Dandle"
          data-ar="لماذا تختار العائلات Dandle"
        >
          Why Families Choose Dandle
        </motion.h2>
        
        <motion.div 
          className="w-16 h-px bg-champagne mx-auto mb-16"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-4">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center px-6 md:px-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <point.icon className="w-6 h-6 text-bronze mb-4 stroke-[1.5]" />
              <p 
                className="font-body text-sm text-charcoal/80 font-light tracking-wide"
                data-en={point.titleEn}
                data-ar={point.titleAr}
              >
                {point.titleEn}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Dividers between items on desktop */}
        <div className="hidden md:flex justify-center items-center gap-0 mt-[-60px] pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center" style={{ width: `${100/4}%` }}>
              <div className="flex-1" />
              <div className="w-px h-8 bg-bronze/20" />
              <div className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBlock;
