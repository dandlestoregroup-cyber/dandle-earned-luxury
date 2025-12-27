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
            Our Partnerships
          </h2>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-dandle-orange">
            Crafted Together. Delivered With Pride.
          </p>
        </motion.div>

        {/* Partnership Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-sm shadow-luxury">
            <img
              src="/images/dandle-partnerships-room.png"
              alt="DANDLE partnerships - Premium recliners styled for home, office, and hospitality spaces"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Three Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto"
        >
          {/* OMASH */}
          <div className="text-center space-y-3">
            <h3 className="font-headline text-2xl text-charcoal">OMASH</h3>
            <p className="font-body text-sm tracking-[0.15em] uppercase text-dandle-orange">
              Signature Mesh Engineering
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Premium fabric technology delivering breathable comfort and lasting durability.
            </p>
          </div>

          {/* Istikbal */}
          <div className="text-center space-y-3">
            <h3 className="font-headline text-2xl text-charcoal">Istikbal</h3>
            <p className="font-body text-sm tracking-[0.15em] uppercase text-dandle-orange">
              Showroom Excellence
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Experience Dandle in person at Istikbal showrooms across Egypt. Touch, sit, decide.
            </p>
          </div>

          {/* Vivian */}
          <div className="text-center space-y-3">
            <h3 className="font-headline text-2xl text-charcoal">Vivian</h3>
            <p className="font-body text-sm tracking-[0.15em] uppercase text-dandle-orange">
              Interior Styling
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              The stylist who brings the pieces together — home, office, or hotel — into spaces you&apos;ll comfortably love.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
