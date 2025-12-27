import { motion } from "framer-motion";

const Partners = () => {
  return (
    <section className="py-16 md:py-24 bg-warm-beige">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-headline text-4xl md:text-5xl text-charcoal mb-3">
            DANDLE × OMASH
          </h2>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-dandle-orange">
            Fabric Partnership
          </p>
        </motion.div>

        {/* Single Partnership Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-sm shadow-luxury">
            <img
              src="/images/dandle-omash-partnership.webp"
              alt="DANDLE × OMASH Fabric Partnership - Premium mesh engineering with breathable comfort"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Partnership Description */}
          <div className="text-center mt-8 space-y-4">
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Premium fabric technology partner delivering breathable comfort and lasting durability. 
              Our signature mesh engineering ensures every Dandle recliner feels as good as it looks.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
