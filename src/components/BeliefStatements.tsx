import { motion } from "framer-motion";
import { Heart, Award, Home } from "lucide-react";

const beliefs = [
  {
    statement: "Comfort you feel every day.",
    icon: Heart,
  },
  {
    statement: "Quality that speaks for itself.",
    icon: Award,
  },
  {
    statement: "A room that feels complete.",
    icon: Home,
  },
];

const BeliefStatements = () => {
  return (
    <section className="py-16 md:py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {beliefs.map((belief, index) => (
            <motion.div
              key={belief.statement}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex items-center gap-3 text-center md:text-left"
            >
              <belief.icon className="w-6 h-6 text-dandle-orange flex-shrink-0" />
              <span className="font-headline text-xl md:text-2xl text-warm-white">
                {belief.statement}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeliefStatements;
