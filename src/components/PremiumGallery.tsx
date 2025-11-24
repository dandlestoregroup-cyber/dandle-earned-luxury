import { motion } from "framer-motion";
import { useState } from "react";

const galleryCategories = [
  {
    title: "Hero Series",
    subtitle: "Flagship lifestyle visuals",
    frames: [
      { id: 1, url: "/images/premium/frame-01.jpg", alt: "Dandle Diva Recliner — Lifestyle Hero Cairo living room daylight, handcrafted comfort", model: "Diva" },
      { id: 2, url: "/images/premium/frame-02.jpg", alt: "Dandle RelaxMax Recliner — Studio Hero centered beige gradient, Cairo-made elegance", model: "RelaxMax" },
      { id: 3, url: "/images/premium/frame-03.jpg", alt: "Dandle ComfortPlus — Armrest Macro stitching detail craftsmanship", model: "ComfortPlus" },
      { id: 4, url: "/images/premium/frame-04.jpg", alt: "Dandle ComfortPlus — Control Button Macro power detail precision", model: "ComfortPlus" },
      { id: 5, url: "/images/premium/frame-05.jpg", alt: "Dandle CozyCompanion — Reading Model noon light emotional warmth", model: "CozyCompanion" },
      { id: 6, url: "/images/premium/frame-06.jpg", alt: "Dandle ComfortPlus — Nap Model zero-gravity calm comfort proof", model: "ComfortPlus" },
      { id: 7, url: "/images/premium/frame-07.jpg", alt: "Dandle RelaxMax — Texture Spotlight cushion grain tactile realism", model: "RelaxMax" },
      { id: 8, url: "/images/premium/frame-08.jpg", alt: "Dandle Diva + CozyCompanion — Dual Chairs family composition lifestyle connection", model: "Diva" },
    ]
  },
  {
    title: "Product Detail Gallery",
    subtitle: "Precision engineering & design",
    frames: [
      { id: 9, url: "/images/premium/frame-09.jpg", alt: "Dandle RelaxMax — Front View upright catalog primary angle", model: "RelaxMax" },
      { id: 10, url: "/images/premium/frame-10.jpg", alt: "Dandle RelaxMax — 45° Recline cross-model standard", model: "RelaxMax" },
      { id: 11, url: "/images/premium/frame-11.jpg", alt: "Dandle ComfortPlus — Zero-Gravity full recline technology showcase", model: "ComfortPlus" },
      { id: 12, url: "/images/premium/frame-12.jpg", alt: "Dandle Diva — Side View upright silhouette elegance", model: "Diva" },
      { id: 13, url: "/images/premium/frame-13.jpg", alt: "Dandle Diva — 3/4 Front Perspective sculptural presence", model: "Diva" },
      { id: 15, url: "/images/premium/frame-15.jpg", alt: "Dandle EasyUp — Footrest Macro engineering feature", model: "EasyUp" },
      { id: 16, url: "/images/premium/frame-16.jpg", alt: "Dandle RelaxMax — Base/Frame Macro stability proof", model: "RelaxMax" },
      { id: 17, url: "/images/premium/frame-17.jpg", alt: "Dandle ComfortPlus — Side Pocket Cupholder Macro practical luxury", model: "ComfortPlus" },
      { id: 18, url: "/images/premium/frame-18.jpg", alt: "Dandle ComfortPlus — Power Button Macro discreet tech", model: "ComfortPlus" },
    ]
  },
  {
    title: "Color Variants",
    subtitle: "Curated Egyptian palette",
    frames: [
      { id: 19, url: "/images/premium/frame-19.jpg", alt: "Dandle Diva in Nile Blue — calm hero color, handcrafted comfort", model: "Diva", color: "Nile Blue" },
      { id: 20, url: "/images/premium/frame-20.jpg", alt: "Dandle Diva in Chic Red — passion signature, Cairo-made elegance", model: "Diva", color: "Chic Red" },
      { id: 21, url: "/images/premium/frame-21.jpg", alt: "Dandle ComfortPlus in Tan Beige — warm neutral tone", model: "ComfortPlus", color: "Tan Beige" },
      { id: 22, url: "/images/premium/frame-22.jpg", alt: "Dandle RelaxMax in Urban Charcoal — sophisticated professional", model: "RelaxMax", color: "Urban Charcoal" },
    ]
  }
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
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-dandle-orange via-bronze to-warm-beige bg-clip-text text-transparent">
            DANDLE VISUALFORGE™
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Egyptian-crafted excellence captured through precision storytelling
          </p>
        </motion.div>

        {galleryCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h3 className="font-headline text-2xl md:text-3xl font-bold text-foreground mb-2">
                {category.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {category.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.frames.map((frame, index) => (
                <motion.div
                  key={frame.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group bg-muted"
                  onClick={() => setSelectedFrame(frame.id)}
                >
                  <img
                    src={frame.url}
                    alt={frame.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <p className="font-body text-xs font-medium">{frame.model}</p>
                      {frame.color && <p className="font-body text-xs opacity-80">{frame.color}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Lightbox Modal */}
        {selectedFrame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedFrame(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={galleryCategories.flatMap(c => c.frames).find(f => f.id === selectedFrame)?.url}
              alt={galleryCategories.flatMap(c => c.frames).find(f => f.id === selectedFrame)?.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PremiumGallery;
