import { motion } from "framer-motion";

const CollectionIntro = () => {
  return (
    <section id="collection" className="bg-cream py-20 md:py-28 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="w-12 h-px bg-gradient-to-r from-transparent to-champagne" />
          <span 
            className="text-xs text-champagne tracking-[0.2em] uppercase font-body font-light"
            data-en="The Collection"
            data-ar="المجموعة"
          >
            The Collection
          </span>
          <span className="w-12 h-px bg-gradient-to-l from-transparent to-champagne" />
        </motion.div>
        
        <motion.h2
          className="font-headline text-3xl md:text-4xl lg:text-5xl text-charcoal mb-6 font-light tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          data-en="Comfort You'll Love Every Day"
          data-ar="راحة ستحبها كل يوم"
        >
          Comfort You'll Love Every Day
        </motion.h2>
        
        <motion.p
          className="font-body text-lg text-charcoal/60 leading-relaxed font-light max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          data-en="From compact solutions to family-sized comfort — each Dandle recliner is built to feel right, day after day."
          data-ar="من الحلول المدمجة إلى الراحة العائلية — كل كرسي Dandle مصمم ليشعرك بالراحة، يومًا بعد يوم."
        >
          From compact solutions to family-sized comfort — each Dandle recliner is built to feel right, day after day.
        </motion.p>
      </div>
    </section>
  );
};

export default CollectionIntro;
