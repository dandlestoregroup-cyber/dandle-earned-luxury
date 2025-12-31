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

        {/* Three Partners - Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-6 md:gap-4 mt-12 max-w-5xl mx-auto"
        >
          {/* OMASH */}
          <div className="flex-1 flex items-start gap-4 p-4 bg-warm-white rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-dandle-orange/10 flex items-center justify-center flex-shrink-0">
              <span className="font-headline text-lg text-dandle-orange">O</span>
            </div>
            <div className="text-left">
              <h3 className="font-headline text-lg text-charcoal">OMASH</h3>
              <p className="font-body text-xs tracking-[0.1em] uppercase text-dandle-orange mb-1">
                Signature Mesh Engineering
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Premium fabric technology delivering breathable comfort and lasting durability.
              </p>
            </div>
          </div>

          {/* Istikbal */}
          <div className="flex-1 flex items-start gap-4 p-4 bg-warm-white rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-dandle-orange/10 flex items-center justify-center flex-shrink-0">
              <span className="font-headline text-lg text-dandle-orange">I</span>
            </div>
            <div className="text-left">
              <h3 className="font-headline text-lg text-charcoal">Istikbal</h3>
              <p className="font-body text-xs tracking-[0.1em] uppercase text-dandle-orange mb-1">
                Showroom Excellence
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Experience Dandle in person at Istikbal showrooms across Egypt. Touch, sit, decide.
              </p>
            </div>
          </div>

          {/* Vivian */}
          <div className="flex-1 flex items-start gap-4 p-4 bg-warm-white rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-dandle-orange/10 flex items-center justify-center flex-shrink-0">
              <span className="font-headline text-lg text-dandle-orange">V</span>
            </div>
            <div className="text-left">
              <h3 className="font-headline text-lg text-charcoal">Vivian</h3>
              <p className="font-body text-xs tracking-[0.1em] uppercase text-dandle-orange mb-1">
                Interior Styling
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                The stylist who brings pieces together — home, office, or hotel.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
