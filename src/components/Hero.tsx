import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

const LIFESTYLE_IMAGES = [
  "/images/hero-lifestyle-penthouse.jpg",
  "/images/hero-lifestyle-diva.jpg",
  "/images/hero-lifestyle-reading.jpg",
  "/images/hero-lifestyle-evening.jpg",
  "/images/hero-lifestyle-morning.jpg",
  "/images/hero-lifestyle-couple.jpg"
];

const VIDEO_DURATION = 15000; // 15 seconds
const IMAGE_DURATION = 4000; // 4 seconds

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<'video' | number>('video');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advanceSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => {
        if (prev === 'video') {
          return 0;
        } else if (prev >= LIFESTYLE_IMAGES.length - 1) {
          return 'video';
        } else {
          return prev + 1;
        }
      });
      setIsTransitioning(false);
    }, 500);
  }, []);

  useEffect(() => {
    const duration = currentSlide === 'video' ? VIDEO_DURATION : IMAGE_DURATION;
    const timer = setTimeout(advanceSlide, duration);
    return () => clearTimeout(timer);
  }, [currentSlide, advanceSlide]);

  // Preload images
  useEffect(() => {
    LIFESTYLE_IMAGES.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Video Layer */}
        <div 
          className={`absolute inset-0 flex items-center justify-center p-[5%] transition-opacity duration-500 ${
            currentSlide === 'video' && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {!videoError ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onError={() => setVideoError(true)}
              onLoadedData={() => console.log('Video loaded successfully')}
              poster="/images/relaxmax-hero-offwhite.jpg"
              className="max-w-full max-h-full w-full h-full object-cover rounded-lg"
              style={{ 
                imageRendering: 'auto', 
                WebkitBackfaceVisibility: 'hidden',
                objectPosition: 'center 70%'
              }}
            >
              <source src="/dandle-hero.mp4" type="video/mp4" />
            </video>
          ) : (
            <img 
              src="/images/relaxmax-hero-offwhite.jpg"
              alt="Dandle Luxury Recliner"
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-cover rounded-lg"
            />
          )}
        </div>

        {/* Image Layers - Lifestyle images with proper sizing */}
        {LIFESTYLE_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 flex items-center justify-center p-[5%] transition-opacity duration-500 ${
              currentSlide === index && !isTransitioning ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={src}
              alt={`Dandle Lifestyle ${index + 1}`}
              width={1920}
              height={1080}
              className="max-w-full max-h-full w-full h-full object-cover rounded-lg"
              style={{ 
                imageRendering: 'auto', 
                WebkitBackfaceVisibility: 'hidden',
                willChange: currentSlide === index ? 'opacity' : 'auto'
              }}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={index === 0 ? "high" : "low"}
            />
          </div>
        ))}
        
        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        <button
          onClick={() => setCurrentSlide('video')}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            currentSlide === 'video' ? 'bg-bronze w-8' : 'bg-white/60 hover:bg-white/80'
          }`}
          aria-label="Show video"
        />
        {LIFESTYLE_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-bronze w-8' : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Show image ${index + 1}`}
          />
        ))}
      </div>

      {/* Icon-only Scroll Indicator (Option B) */}
      <div className="relative z-20 h-full flex flex-col items-center justify-end pb-8">
        <a
          href="/#collection"
          className="bg-bronze/80 backdrop-blur-sm p-4 rounded-full hover:bg-bronze transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label="تسوق الآن - Shop Now"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </a>
      </div>
    </section>
  );
}
