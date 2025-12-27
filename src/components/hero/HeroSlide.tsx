import { motion } from "framer-motion";
import { getHeroImageUrl, getFallbackImage } from "@/hooks/useResponsiveImage";

interface HeroSlideProps {
  slideIndex: number;
  colorName: string;
  arabicMessage: string;
  isActive: boolean;
  useGeneratedImages?: boolean;
}

const HeroSlide = ({
  slideIndex,
  colorName,
  arabicMessage,
  isActive,
  useGeneratedImages = false
}: HeroSlideProps) => {
  // Get image sources
  const getImageSrc = (size: 'mobile' | 'tablet' | 'desktop' | 'ultrawide') => {
    if (useGeneratedImages) {
      return getHeroImageUrl(slideIndex, size);
    }
    return getFallbackImage(slideIndex);
  };

  const fallbackSrc = getFallbackImage(slideIndex);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        scale: isActive ? 1 : 1.03 
      }}
      transition={{ 
        opacity: { duration: 1.5, ease: "easeInOut" },
        scale: { duration: 6.67, ease: "easeOut" }
      }}
    >
      {/* Responsive Picture Element */}
      <picture className="w-full h-full">
        {useGeneratedImages ? (
          <>
            <source
              media="(max-width: 767px)"
              srcSet={getImageSrc('mobile')}
              type="image/webp"
            />
            <source
              media="(min-width: 768px) and (max-width: 1023px)"
              srcSet={getImageSrc('tablet')}
              type="image/webp"
            />
            <source
              media="(min-width: 1024px) and (max-width: 1919px)"
              srcSet={getImageSrc('desktop')}
              type="image/webp"
            />
            <source
              media="(min-width: 1920px)"
              srcSet={getImageSrc('ultrawide')}
              type="image/webp"
            />
          </>
        ) : null}
        <img
          src={fallbackSrc}
          alt={`Dandle ${colorName} recliner`}
          className="w-full h-full object-cover object-center"
          loading={slideIndex === 0 ? "eager" : "lazy"}
        />
      </picture>

      {/* Color Badge - Hidden on mobile to reduce clutter */}
      {colorName !== 'BACKGROUND_ONLY' && (
        <motion.div
          className="absolute top-20 md:top-6 left-4 md:left-6 z-10 hidden md:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
            <span className="text-xs text-white/90 font-body">{colorName}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HeroSlide;
