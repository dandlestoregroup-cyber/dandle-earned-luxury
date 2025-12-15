import { useRef, useState, useEffect, useCallback } from "react";

const LIFESTYLE_IMAGES = [
  "/images/hero-lifestyle-penthouse.jpg",
  "/images/hero-lifestyle-diva.jpg",
  "/images/hero-lifestyle-couple.jpg",
  "/images/hero-lifestyle-morning.jpg",
  "/images/hero-lifestyle-evening.jpg",
  "/images/hero-lifestyle-nile.jpg",
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
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Video Layer */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
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
              className="w-full h-full object-cover"
              style={{ 
                imageRendering: 'auto', 
                WebkitBackfaceVisibility: 'hidden',
                // Crop the top portion to hide logo
                objectPosition: 'center 60%'
              }}
            >
              <source src="/dandle-hero.mp4" type="video/mp4" />
            </video>
          ) : (
            <img 
              src="/images/relaxmax-hero-offwhite.jpg"
              alt="Dandle Luxury Recliner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Image Layers */}
        {LIFESTYLE_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentSlide === index && !isTransitioning ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={src}
              alt={`Dandle Lifestyle ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden' }}
              loading="eager"
            />
          </div>
        ))}
        
        {/* Subtle Vignette Overlay - reduced opacity for clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button
          onClick={() => setCurrentSlide('video')}
          className={`w-2 h-2 rounded-full transition-all ${
            currentSlide === 'video' ? 'bg-bronze w-6' : 'bg-white/50 hover:bg-white/70'
          }`}
          aria-label="Show video"
        />
        {LIFESTYLE_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-bronze w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Show image ${index + 1}`}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-20 h-full flex flex-col items-center justify-end pb-20 md:pb-28">
        <a
          href="/#collection"
          className="bg-bronze text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-bronze/90 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] inline-flex items-center"
        >
          تسوق الآن
        </a>
      </div>
    </section>
  );
}
