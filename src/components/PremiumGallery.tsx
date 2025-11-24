import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const galleryCategories = [
  {
    frames: [
      { 
        id: 1, 
        url: "/images/premium/frame-01.jpg", 
        alt: "",
        hoverReveal: "Nile Blue velvet, cut on bias.",
        model: "Diva"
      },
      { 
        id: 2, 
        url: "/images/premium/frame-02.jpg", 
        alt: "",
        hoverReveal: "Studio light, 45° recline.",
        model: "RelaxMax"
      },
      { 
        id: 3, 
        url: "/images/premium/frame-03.jpg", 
        alt: "",
        hoverReveal: "192 stitches per inch.",
        model: "ComfortPlus"
      },
      { 
        id: 4, 
        url: "/images/premium/frame-04.jpg", 
        alt: "",
        hoverReveal: "Whisper-silent mechanism.",
        model: "ComfortPlus"
      },
      { 
        id: 5, 
        url: "/images/premium/frame-05.jpg", 
        alt: "",
        hoverReveal: "Linen, noon light.",
        model: "CozyCompanion"
      },
      { 
        id: 6, 
        url: "/images/premium/frame-06.jpg", 
        alt: "",
        hoverReveal: "Zero-gravity calm.",
        model: "ComfortPlus"
      },
      { 
        id: 7, 
        url: "/images/premium/frame-07.jpg", 
        alt: "",
        hoverReveal: "Raytex weave, Alexandria.",
        model: "RelaxMax"
      },
      { 
        id: 8, 
        url: "/images/premium/frame-08.jpg", 
        alt: "",
        hoverReveal: "Family composition.",
        model: "Diva + CozyCompanion"
      },
      { 
        id: 9, 
        url: "/images/premium/frame-09.jpg", 
        alt: "",
        hoverReveal: "Beech frame, mortise joints.",
        model: "RelaxMax"
      },
      { 
        id: 10, 
        url: "/images/premium/frame-10.jpg", 
        alt: "",
        hoverReveal: "Reference standard, 45°.",
        model: "RelaxMax"
      },
      { 
        id: 11, 
        url: "/images/premium/frame-11.jpg", 
        alt: "",
        hoverReveal: "Italian dual-motor system.",
        model: "ComfortPlus"
      },
      { 
        id: 12, 
        url: "/images/premium/frame-12.jpg", 
        alt: "",
        hoverReveal: "Sculptural silhouette.",
        model: "Diva"
      },
      { 
        id: 13, 
        url: "/images/premium/frame-13.jpg", 
        alt: "",
        hoverReveal: "Emerald perspective.",
        model: "Diva"
      },
      { 
        id: 15, 
        url: "/images/premium/frame-15.jpg", 
        alt: "",
        hoverReveal: "Blush, 192 stitches.",
        model: "Diva",
        color: "Blush"
      },
      { 
        id: 16, 
        url: "/images/premium/frame-16.jpg", 
        alt: "",
        hoverReveal: "Terracotta warmth.",
        model: "RelaxMax",
        color: "Terracotta"
      },
      { 
        id: 17, 
        url: "/images/premium/frame-17.jpg", 
        alt: "",
        hoverReveal: "Tan beige balance.",
        model: "ComfortPlus",
        color: "Tan Beige"
      },
      { 
        id: 18, 
        url: "/images/premium/frame-18.jpg", 
        alt: "",
        hoverReveal: "Urban charcoal tone.",
        model: "RelaxMax",
        color: "Urban Charcoal"
      },
      { 
        id: 19, 
        url: "/images/premium/frame-19.jpg", 
        alt: "",
        hoverReveal: "Off white minimal.",
        model: "RelaxMax",
        color: "Off White"
      },
      { 
        id: 20, 
        url: "/images/premium/frame-20.jpg", 
        alt: "",
        hoverReveal: "Elephant grey refined.",
        model: "ComfortPlus",
        color: "Elephant Grey"
      },
      { 
        id: 21, 
        url: "/images/premium/frame-21.jpg", 
        alt: "",
        hoverReveal: "Pink rose soft.",
        model: "CozyCompanion",
        color: "Pink Rose"
      },
      { 
        id: 22, 
        url: "/images/premium/frame-22.jpg", 
        alt: "",
        hoverReveal: "Sunshine yellow energy.",
        model: "EasyUp",
        color: "Sunshine Yellow"
      },
    ]
  }
];

interface Frame {
  id: number;
  url: string;
  alt: string;
  hoverReveal?: string;
  model: string;
  color?: string;
}

const PremiumGallery = () => {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryCategories[0].frames.map((frame) => (
            <motion.div
              key={frame.id}
              className="relative aspect-square overflow-hidden rounded-sm cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedFrame(frame)}
            >
              <img
                src={frame.url}
                alt={frame.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Hover reveal - single line, 14 words max */}
              {frame.hoverReveal && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-sm text-primary font-normal max-w-[200px] text-right">
                    {frame.hoverReveal}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal - swipe down to close */}
      <AnimatePresence>
        {selectedFrame && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            onClick={() => setSelectedFrame(null)}
          >
            <motion.img
              src={selectedFrame.url}
              alt=""
              className="w-full h-full object-contain"
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1 }}
              transition={{ duration: 0 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  setSelectedFrame(null);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PremiumGallery;
