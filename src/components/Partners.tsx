import { motion } from "framer-motion";

const partners = [
  {
    initial: "O",
    nameEn: "OMASH",
    nameAr: "OMASH",
    taglineEn: "Signature Mesh Engineering",
    taglineAr: "هندسة الشبك المميزة",
    descEn: "Premium fabric technology delivering breathable comfort and lasting durability.",
    descAr: "تقنية أقمشة فاخرة توفر راحة تسمح بالتهوية ومتانة طويلة الأمد.",
  },
  {
    initial: "I",
    nameEn: "Istikbal",
    nameAr: "Istikbal",
    taglineEn: "Showroom Excellence",
    taglineAr: "تميز صالات العرض",
    descEn: "Experience Dandle in person at Istikbal showrooms across Egypt. Touch, sit, decide.",
    descAr: "جرب Dandle شخصياً في صالات عرض إستيكبال في مصر. المس، اجلس، قرر.",
  },
  {
    initial: "V",
    nameEn: "Vivian",
    nameAr: "Vivian",
    taglineEn: "Interior Styling",
    taglineAr: "تصميم داخلي",
    descEn: "The stylist who brings pieces together — home, office, or hotel.",
    descAr: "المصممة التي تجمع القطع معاً — منزل، مكتب، أو فندق.",
  },
];

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
          <h2 
            className="font-headline text-4xl md:text-5xl text-charcoal mb-3"
            data-en="Our Partnerships"
            data-ar="شراكاتنا"
          >
            Our Partnerships
          </h2>
          <p 
            className="font-body text-sm tracking-[0.2em] uppercase text-dandle-orange"
            data-en="Crafted Together. Delivered With Pride."
            data-ar="صُنعت معاً. تُسلَّم بفخر."
          >
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
          {partners.map((partner) => (
            <div key={partner.initial} className="flex-1 flex items-start gap-4 p-4 bg-warm-white rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-dandle-orange/10 flex items-center justify-center flex-shrink-0">
                <span className="font-headline text-lg text-dandle-orange">{partner.initial}</span>
              </div>
              <div className="text-left">
                <h3 className="font-headline text-lg text-charcoal">{partner.nameEn}</h3>
                <p 
                  className="font-body text-xs tracking-[0.1em] uppercase text-dandle-orange mb-1"
                  data-en={partner.taglineEn}
                  data-ar={partner.taglineAr}
                >
                  {partner.taglineEn}
                </p>
                <p 
                  className="font-body text-sm text-muted-foreground leading-relaxed"
                  data-en={partner.descEn}
                  data-ar={partner.descAr}
                >
                  {partner.descEn}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
