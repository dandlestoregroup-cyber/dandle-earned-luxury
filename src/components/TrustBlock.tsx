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
    titleEn: "5-year warranty on every recliner",
    titleAr: "ضمان 5 سنوات على كل كرسي",
  },
  {
    icon: Truck,
    titleEn: "White-glove delivery to your door",
    titleAr: "توصيل راقي لباب بيتك",
  },
  {
    icon: Palette,
    titleEn: "Colors inspired by Egypt — from Nile Sapphire Blue to Sandstorm Ochre",
    titleAr: "ألوان مستوحاة من مصر — من أزرق الياقوت النيلي إلى المغرة الرملية",
  },
];

const TrustBlock = () => {
  return (
    <section className="bg-warm-white py-16 md:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="font-headline text-3xl md:text-4xl lg:text-5xl text-charcoal text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          data-en="Why Families Choose Dandle"
          data-ar="لماذا تختار العائلات Dandle"
        >
          Why Families Choose Dandle
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-5 rounded-xl bg-warm-beige/50 border border-bronze/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-dandle-orange/10 flex items-center justify-center flex-shrink-0">
                <point.icon className="w-6 h-6 text-dandle-orange" />
              </div>
              <p 
                className="font-body text-lg text-charcoal leading-relaxed pt-2"
                data-en={point.titleEn}
                data-ar={point.titleAr}
              >
                {point.titleEn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBlock;
