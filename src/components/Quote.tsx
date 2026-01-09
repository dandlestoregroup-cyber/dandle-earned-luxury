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
        {/* Main Quote - Locked */}
        <p 
          className="font-headline text-3xl md:text-5xl lg:text-6xl text-warm-white font-light leading-tight tracking-tight"
          data-en="Dandle doesn't explain."
          data-ar="داندل لا يشرح."
        >
          Dandle doesn't explain.
        </p>
        
        <motion.p
          className="font-headline text-3xl md:text-5xl lg:text-6xl text-dandle-orange font-light leading-tight tracking-tight mt-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          data-en="Dandle attracts."
          data-ar="داندل يجذب."
        >
          Dandle attracts.
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
            className="text-champagne/80 text-xs md:text-sm tracking-wide font-body font-light"
            data-en="Since 2022"
            data-ar="منذ ٢٠٢٢"
          >
            Since 2022
          </span>
          <span className="w-16 h-px bg-gradient-to-l from-transparent to-champagne/60" />
        </motion.footer>
      </motion.blockquote>
    </section>
  );
};

export default Quote;