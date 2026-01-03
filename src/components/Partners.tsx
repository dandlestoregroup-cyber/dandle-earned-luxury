import { motion } from "framer-motion";

const partners = [
  {
    nameEn: "OMASH",
    taglineEn: "Fabric Technology",
    taglineAr: "تقنية الأقمشة",
  },
  {
    nameEn: "Istikbal",
    taglineEn: "Showroom Network",
    taglineAr: "شبكة المعارض",
  },
  {
    nameEn: "Vivian",
    taglineEn: "Interior Styling",
    taglineAr: "التصميم الداخلي",
  },
];

const Partners = () => {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span 
            className="text-xs text-bronze tracking-[0.2em] uppercase font-body font-light"
            data-en="Collaborations"
            data-ar="شراكاتنا"
          >
            Collaborations
          </span>
          <h2 
            className="font-headline text-3xl md:text-4xl text-charcoal mt-4 font-light"
            data-en="Crafted Together"
            data-ar="صُنعت معاً"
          >
            Crafted Together
          </h2>
        </motion.div>

        {/* Partnership Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="relative overflow-hidden shadow-elegant">
            <motion.img
              src="/images/dandle-partnerships-room.png"
              alt="DANDLE partnerships"
              className="w-full h-auto object-cover"
              loading="lazy"
              whileInView={{ scale: [1.05, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>

        {/* Partner Names - Minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-12 md:gap-20"
        >
          {partners.map((partner, index) => (
            <motion.div 
              key={partner.nameEn} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <h3 className="font-headline text-xl text-charcoal font-light mb-1">
                {partner.nameEn}
              </h3>
              <p 
                className="text-xs text-bronze tracking-[0.1em] uppercase font-body"
                data-en={partner.taglineEn}
                data-ar={partner.taglineAr}
              >
                {partner.taglineEn}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
