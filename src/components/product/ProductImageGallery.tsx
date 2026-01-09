import { useState, useEffect, useRef } from "react";
import { LovableImage } from "@/catalog/lovableCatalog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageGalleryProps {
  images: LovableImage[];
  aspectRatio: number;
  altPrefix: string;
}

export const ProductImageGallery = ({
  images,
  aspectRatio,
  altPrefix
}: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedIndex(i => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex(i => Math.min(images.length - 1, i + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  // Scroll to selected image on mobile
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / images.length;
      container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
    }
    setSelectedIndex(index);
  };

  const goToPrev = () => {
    const newIndex = Math.max(0, selectedIndex - 1);
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = Math.min(images.length - 1, selectedIndex + 1);
    scrollToIndex(newIndex);
  };

  if (images.length === 0) {
    return (
      <div
        className="w-full bg-muted flex items-center justify-center"
        style={{ aspectRatio: aspectRatio.toString() }}
      >
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];
  const canGoPrev = selectedIndex > 0;
  const canGoNext = selectedIndex < images.length - 1;

  return (
    <div className="w-full space-y-4">
      {/* Main Stage */}
      <div
        className="relative w-full overflow-hidden bg-muted rounded-lg group"
        style={{ aspectRatio: aspectRatio.toString() }}
      >
        {/* Desktop: Show single image */}
        {!isMobile && (
          <img
            src={selectedImage.src}
            alt={`${altPrefix} - ${selectedImage.alt}`}
            className="w-full h-full object-contain"
            loading="eager"
            onError={(e) => {
              const fallback = selectedImage.fallbackSrc;
              if (!fallback) return;
              const target = e.currentTarget;
              if (target.dataset.fallbackApplied === "1") return;
              target.dataset.fallbackApplied = "1";
              target.src = fallback;
            }}
          />
        )}

        {/* Mobile: Horizontal scroll container */}
        {isMobile && images.length > 1 && (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
            style={{ scrollBehavior: "smooth" }}
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const itemWidth = e.currentTarget.scrollWidth / images.length;
              const index = Math.round(scrollLeft / itemWidth);
              if (index !== selectedIndex) {
                setSelectedIndex(index);
              }
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="snap-start flex-shrink-0 w-full h-full"
              >
                <img
                  src={img.src}
                  alt={`${altPrefix} - ${img.alt}`}
                  className="w-full h-full object-contain"
                  loading={idx === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    const fallback = img.fallbackSrc;
                    if (!fallback) return;
                    const target = e.currentTarget;
                    if (target.dataset.fallbackApplied === "1") return;
                    target.dataset.fallbackApplied = "1";
                    target.src = fallback;
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Mobile: Single image when only 1 */}
        {isMobile && images.length === 1 && (
          <img
            src={selectedImage.src}
            alt={`${altPrefix} - ${selectedImage.alt}`}
            className="w-full h-full object-contain"
            loading="eager"
            onError={(e) => {
              const fallback = selectedImage.fallbackSrc;
              if (!fallback) return;
              const target = e.currentTarget;
              if (target.dataset.fallbackApplied === "1") return;
              target.dataset.fallbackApplied = "1";
              target.src = fallback;
            }}
          />
        )}

        {/* Navigation Arrows - Both Desktop and Mobile */}
        {images.length > 1 && (
          <>
            {canGoPrev && (
              <Button
                variant="outline"
                size="icon"
                className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm shadow-lg z-10 ${
                  isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity`}
                onClick={goToPrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {canGoNext && (
              <Button
                variant="outline"
                size="icon"
                className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm shadow-lg z-10 ${
                  isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity`}
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </>
        )}

        {/* Mobile: Dots Indicator */}
        {isMobile && images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                  idx === selectedIndex
                    ? "bg-primary scale-125"
                    : "bg-background/80 hover:bg-primary/50"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails (Desktop only) */}
      {!isMobile && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 relative border-2 rounded-md transition-all overflow-hidden ${
                idx === selectedIndex
                  ? "border-primary scale-105"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ aspectRatio: aspectRatio.toString(), width: "80px" }}
              aria-label={`View ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const fallback = img.fallbackSrc;
                  if (!fallback) return;
                  const target = e.currentTarget;
                  if (target.dataset.fallbackApplied === "1") return;
                  target.dataset.fallbackApplied = "1";
                  target.src = fallback;
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          {selectedIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};