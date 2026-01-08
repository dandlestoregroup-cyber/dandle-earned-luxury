import { motion } from "framer-motion";

const Quote = () => {
  return (
    <section className="min-h-[50vh] flex items-center justify-center bg-obsidian py-24 px-6">
      <motion.blockquote
        className="text-center max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p 
          className="font-headline text-3xl md:text-5xl lg:text-6xl text-warm-white font-light leading-tight tracking-tight"
          data-en="You know you found it the moment you see it."
          data-ar="تعرف أنك وجدته لحظة ما تشوفه."
        >
          You know you found it<br className="hidden md:block" /> the moment you see it.
        </p>
        
        <motion.p
          className="font-body text-lg md:text-xl text-champagne/80 mt-6 font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          data-en="Comfort crafted for the finest."
          data-ar="راحة صُممت للأرقى."
        >
          Comfort crafted for the finest.
        </motion.p>

        <motion.p
          className="font-body text-xl md:text-2xl text-dandle-orange mt-4 font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          data-en="Give yourself the gift of comfort 🎁"
          data-ar="أهدِ نفسك هدية الراحة 🎁"
        >
          Give yourself the gift of comfort 🎁
        </motion.p>
        
        <motion.footer 
          className="mt-10 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="w-16 h-px bg-gradient-to-r from-transparent to-champagne/60" />
          <span 
            className="text-champagne/80 text-xs md:text-sm tracking-[0.2em] uppercase font-body font-light"
            data-en="Since 2010"
            data-ar="منذ ٢٠١٠"
          >
            Since 2010
          </span>
          <span className="w-16 h-px bg-gradient-to-l from-transparent to-champagne/60" />
        </motion.footer>
      </motion.blockquote>
    </section>
  );
};

export default Quote;
