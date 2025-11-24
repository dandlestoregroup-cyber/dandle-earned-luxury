import { motion } from "framer-motion";
import { useState } from "react";

const premiumFrames = [
  { id: 1, url: "/images/premium/frame-01.jpg", alt: "Dandle premium collection - Modern living room setup" },
  { id: 2, url: "/images/premium/frame-02.jpg", alt: "Dandle premium collection - Elegant recliner showcase" },
  { id: 3, url: "/images/premium/frame-03.jpg", alt: "Dandle premium collection - Luxury comfort design" },
  { id: 4, url: "/images/premium/frame-04.jpg", alt: "Dandle premium collection - Contemporary seating" },
  { id: 5, url: "/images/premium/frame-05.jpg", alt: "Dandle premium collection - Premium craftsmanship" },
  { id: 6, url: "/images/premium/frame-06.jpg", alt: "Dandle premium collection - Sophisticated styling" },
  { id: 7, url: "/images/premium/frame-07.jpg", alt: "Dandle premium collection - Lifestyle comfort" },
  { id: 8, url: "/images/premium/frame-08.jpg", alt: "Dandle premium collection - Refined elegance" },
  { id: 9, url: "/images/premium/frame-09.jpg", alt: "Dandle premium collection - Modern luxury" },
  { id: 10, url: "/images/premium/frame-10.jpg", alt: "Dandle premium collection - Executive comfort" },
  { id: 11, url: "/images/premium/frame-11.jpg", alt: "Dandle premium collection - Designer seating" },
  { id: 12, url: "/images/premium/frame-12.jpg", alt: "Dandle premium collection - Premium materials" },
  { id: 13, url: "/images/premium/frame-13.jpg", alt: "Dandle premium collection - Handcrafted quality" },
  { id: 15, url: "/images/premium/frame-15.jpg", alt: "Dandle premium collection - Luxury lifestyle" },
  { id: 16, url: "/images/premium/frame-16.jpg", alt: "Dandle premium collection - Contemporary design" },
  { id: 17, url: "/images/premium/frame-17.jpg", alt: "Dandle premium collection - Elegant comfort" },
  { id: 18, url: "/images/premium/frame-18.jpg", alt: "Dandle premium collection - Modern aesthetics" },
  { id: 19, url: "/images/premium/frame-19.jpg", alt: "Dandle premium collection - Premium seating" },
  { id: 20, url: "/images/premium/frame-20.jpg", alt: "Dandle premium collection - Sophisticated comfort" },
  { id: 21, url: "/images/premium/frame-21.jpg", alt: "Dandle premium collection - Luxury craftsmanship" },
  { id: 22, url: "/images/premium/frame-22.jpg", alt: "Dandle premium collection - Designer furniture" },
];

const PremiumGallery = () => {
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-dandle-orange via-bronze to-warm-beige bg-clip-text text-transparent">
            Premium Collection
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our signature collection of Egyptian-crafted luxury recliners
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {premiumFrames.map((frame, index) => (
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedFrame(frame.id)}
            >
              <img
                src={frame.url}
                alt={frame.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedFrame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedFrame(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={premiumFrames.find(f => f.id === selectedFrame)?.url}
              alt={premiumFrames.find(f => f.id === selectedFrame)?.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PremiumGallery;
