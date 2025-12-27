import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const partners = [
  {
    name: "OMASH",
    tagline: "Signature mesh engineering",
    description: "Premium fabric technology partner delivering breathable comfort and lasting durability.",
    image: "/images/complete-set-coastal-modern.jpg",
    link: "/#products",
    linkText: "Explore Collection"
  },
  {
    name: "Istikbal",
    tagline: "Showroom excellence", 
    description: "Experience Dandle in person at Istikbal showrooms across Egypt. Touch, sit, decide.",
    image: "/images/complete-set-modern-fireplace.jpg",
    link: "/contact",
    linkText: "Find Showroom"
  },
  {
    name: "Vivian",
    tagline: "Refined living solutions",
    description: "Complementary home furniture partner for complete room transformations.",
    image: "/images/complete-set-family-modern.jpg",
    link: "/#products",
    linkText: "View Collection"
  }
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
          <h2 className="font-headline text-4xl md:text-5xl text-charcoal mb-3">
            Trusted Partnerships
          </h2>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-dandle-orange">
            Crafted Together. Delivered With Pride.
          </p>
        </motion.div>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-warm-white border border-charcoal/10 rounded-sm overflow-hidden hover:shadow-luxury transition-all duration-300"
            >
              {/* Partner Image with Corner Brackets on Hover */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={partner.image}
                  alt={`${partner.name} partnership`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Corner Brackets Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-dandle-orange" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-dandle-orange" />
                </div>
              </div>

              {/* Partner Content */}
              <div className="p-6">
                <h3 className="font-headline text-2xl text-charcoal mb-1">
                  {partner.name}
                </h3>
                <p className="font-body text-sm text-dandle-orange uppercase tracking-wide mb-3">
                  {partner.tagline}
                </p>
                <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                  {partner.description}
                </p>
                <a
                  href={partner.link}
                  className="inline-flex items-center gap-2 font-body text-charcoal hover:text-dandle-orange transition-colors group/link"
                >
                  <span>{partner.linkText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
