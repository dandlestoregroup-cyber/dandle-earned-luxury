import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <motion.section
      className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-charcoal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="absolute inset-0">
        <img
          src="/images/relaxmax-hero-offwhite.jpg"
          alt="Dandle Recliner in Cairo dawn light"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        className="relative z-10 text-warm-white px-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}
      >
        <h1 className="font-headline text-5xl md:text-7xl font-semibold mb-6">
          DANDLE — Because You've Earned It
        </h1>
        <div className="mt-8 space-x-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="btn-primary">Explore Collection</Button>
          <Button className="btn-ghost">View in Your Space</Button>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-1 bg-bronze rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.section>
  );
};

export default Hero;
