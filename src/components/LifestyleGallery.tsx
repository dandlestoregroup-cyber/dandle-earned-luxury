import { motion } from "framer-motion";

const lifestyleImages = [
  {
    src: "/images/relaxmax-lifestyle-day.png",
    alt: "RelaxMax in modern living room during golden hour",
    caption: "Morning Serenity"
  },
  {
    src: "/images/relaxmax-lifestyle-night.png", 
    alt: "RelaxMax ambient evening lighting",
    caption: "Evening Comfort"
  },
  {
    src: "/images/cozycompanion-couple-lifestyle.jpg",
    alt: "Couple enjoying CozyCompanion together",
    caption: "Shared Moments"
  },
  {
    src: "/images/relaxmax-brown-lifestyle.jpg",
    alt: "Luxury living room setup with RelaxMax",
    caption: "Timeless Elegance"
  }
];

const LifestyleGallery = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
            In Your Home
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-foreground mt-3">
            Lifestyle Gallery
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {lifestyleImages.map((image, index) => (
            <motion.div
              key={image.caption}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-110"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-headline text-xl text-warm-white">
                  {image.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleGallery;
