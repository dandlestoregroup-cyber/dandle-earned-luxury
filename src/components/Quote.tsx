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
        {/* Main Quote */}
        <p 
          className="font-headline text-xl md:text-3xl lg:text-4xl text-warm-white opacity-90 font-light leading-relaxed tracking-tight"
          data-en="We don't sell; it's for people who don't need convincing —"
          data-ar="نحن لا نبيع؛ هذا لمن لا يحتاجون إقناعاً —"
        >
          We don't sell; it's for people who don't need convincing —
        </p>
        
        <motion.p
          className="font-headline text-xl md:text-3xl lg:text-4xl text-warm-white font-light leading-relaxed tracking-tight mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          data-en="people who know what they deserve and choose accordingly."
          data-ar="أناس يعرفون ما يستحقون ويختارون وفقاً لذلك."
        >
          people who know what they deserve and choose accordingly.
        </motion.p>
        
        <motion.p
          className="font-headline text-xl md:text-3xl lg:text-4xl text-warm-white opacity-80 font-light leading-relaxed tracking-tight mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          data-en="They don't compare."
          data-ar="لا يقارنون."
        >
          They don't compare.
        </motion.p>
        
        <motion.p
          className="font-headline text-xl md:text-3xl lg:text-4xl text-warm-white font-light leading-relaxed tracking-tight mt-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.38, duration: 0.6 }}
          data-en="They recognize."
          data-ar="يتعرّفون."
        >
          They recognize.
        </motion.p>
        
        <motion.p
          className="font-headline text-2xl md:text-4xl lg:text-5xl text-dandle-orange font-medium leading-tight tracking-tight mt-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.6 }}
          data-en="It attracts. No explanation."
          data-ar="يجذب. بلا تفسير."
        >
          It attracts. No explanation.
        </motion.p>
        
        <motion.footer 
          className="mt-10 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="w-16 h-px bg-gradient-to-r from-transparent to-champagne opacity-60" />
          <span 
            className="text-champagne opacity-80 text-xs md:text-sm tracking-wide font-body font-light"
            data-en="Since 2022"
            data-ar="منذ ٢٠٢٢"
          >
            Since 2022
          </span>
          <span className="w-16 h-px bg-gradient-to-l from-transparent to-champagne opacity-60" />
        </motion.footer>
      </motion.blockquote>
    </section>
  );
};

export default Quote;