import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Partner {
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  linkText: string;
  linkHref: string;
}

const partners: Partner[] = [
  {
    name: "OMASH",
    tagline: "Signature mesh engineering",
    description: "Premium fabric technology partner delivering breathable comfort and lasting durability.",
    imageUrl: "/images/partners/omash-cozycompanion.jpg",
    linkText: "Explore OMASH Collection",
    linkHref: "#products",
  },
  {
    name: "Istikbal",
    tagline: "Showroom excellence",
    description: "Experience Dandle in person at Istikbal showrooms across Egypt. Touch, sit, decide.",
    imageUrl: "/images/partners/istikbal-showroom.jpg",
    linkText: "Find Nearest Showroom",
    linkHref: "/contact",
  },
  {
    name: "Vivian",
    tagline: "Refined living solutions",
    description: "Complementary home furniture partner for complete room transformations.",
    imageUrl: "/images/partners/vivian-collection.jpg",
    linkText: "View Vivian Collection",
    linkHref: "#products",
  },
];

const Partners = () => {
  return (
    <section className="py-20 bg-warm-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-dandle-brown mb-4">
            Trusted Partnerships
          </h2>
          <p className="three-word-truth text-lg tracking-wider">
            CRAFTED TOGETHER. DELIVERED WITH PRIDE
          </p>
        </motion.div>

        {/* Partner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="group bg-warm-cream border border-[hsl(15,28%,19%)] rounded-sm overflow-hidden corner-brackets-sm corner-brackets-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Partner Image */}
              <div className="relative h-48 overflow-hidden bg-warm-beige">
                <img
                  src={partner.imageUrl}
                  alt={partner.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback for missing images
                    (e.target as HTMLImageElement).src = `https://placehold.co/400x300/FAF7F2/3E2723?text=${partner.name}`;
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(15,28%,19%,0.3)] to-transparent" />
              </div>

              {/* Partner Content */}
              <div className="p-6">
                <h3 className="text-2xl font-headline font-bold text-dandle-brown mb-1">
                  {partner.name}
                </h3>
                <p className="text-dandle-orange font-body text-sm font-medium uppercase tracking-wide mb-3">
                  {partner.tagline}
                </p>
                <p className="text-foreground/80 font-body text-sm mb-4 leading-relaxed">
                  {partner.description}
                </p>
                <a
                  href={partner.linkHref}
                  className="inline-flex items-center text-dandle-orange font-body text-sm font-medium hover:text-dandle-brown transition-colors group/link"
                >
                  {partner.linkText}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
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
