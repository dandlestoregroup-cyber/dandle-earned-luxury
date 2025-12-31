import { motion } from "framer-motion";

const CollectionIntro = () => {
  return (
    <section className="bg-warm-beige py-12 md:py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="font-headline text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          data-en="Comfort You'll Love Every Day"
          data-ar="راحة ستحبها كل يوم"
        >
          Comfort You'll Love Every Day
        </motion.h2>
        <motion.p
          className="font-body text-lg md:text-xl text-charcoal/80 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          data-en="From compact solutions to family-sized luxury — each Dandle recliner is built to feel right, day after day."
          data-ar="من الحلول المدمجة إلى الفخامة العائلية — كل كرسي Dandle مصمم ليشعرك بالراحة، يومًا بعد يوم."
        >
          From compact solutions to family-sized luxury — each Dandle recliner is built to feel right, day after day.
        </motion.p>
      </div>
    </section>
  );
};

export default CollectionIntro;
