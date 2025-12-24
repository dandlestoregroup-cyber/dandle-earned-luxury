import { motion } from "framer-motion";
import { Award, Users, Calendar, Wrench } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: "15+",
    label: "Years of Excellence"
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Families"
  },
  {
    icon: Wrench,
    value: "50+",
    label: "Master Craftsmen"
  },
  {
    icon: Award,
    value: "100%",
    label: "Quality Guaranteed"
  }
];

const PressRecognition = () => {
  return (
    <section className="py-20 bg-charcoal text-warm-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
            Trusted Legacy
          </span>
          <h2 className="font-headline text-3xl md:text-4xl text-warm-white mt-3">
            Numbers That Speak
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-bronze mx-auto mb-4" />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="font-headline text-4xl md:text-5xl text-dandle-orange font-bold"
              >
                {stat.value}
              </motion.div>
              <p className="font-body text-sm text-warm-white/70 mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PressRecognition;
