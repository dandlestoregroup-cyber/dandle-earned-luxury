import { useEffect, useMemo, useRef, useState } from "react";
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
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);

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
        setSelectedIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((i) => Math.min(images.length - 1, i + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  // Keep index valid if images change
  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(0, images.length - 1)));
  }, [images.length]);

  const selectedImage = useMemo(() => images[selectedIndex], [images, selectedIndex]);

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

  const canGoPrev = selectedIndex > 0;
  const canGoNext = selectedIndex < images.length - 1;

  const scrollToMobileIndex = (idx: number) => {
    const container = mobileScrollerRef.current;
    if (!container) return;

    const itemWidth = container.clientWidth;
    container.scrollTo({ left: itemWidth * idx, behavior: "smooth" });
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Stage */}
      <div
        className="relative w-full overflow-hidden bg-muted rounded-lg group"
        style={{ aspectRatio: aspectRatio.toString() }}
      >
        <img
          src={selectedImage.src}
          alt={`${altPrefix} - ${selectedImage.alt}`}
          className="w-full h-full object-contain"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        {/* Navigation Arrows (Desktop) */}
        {!isMobile && images.length > 1 && (
          <>
            {canGoPrev && (
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                onClick={() => setSelectedIndex((i) => i - 1)}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {canGoNext && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                onClick={() => setSelectedIndex((i) => i + 1)}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Thumbnails (Desktop) */}
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
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      {/* Mobile Swipe Container */}
      {isMobile && images.length > 1 && (
        <div className="relative">
          <div
            ref={mobileScrollerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
            onScroll={(e) => {
              const container = e.currentTarget;
              const index = Math.round(container.scrollLeft / Math.max(1, container.clientWidth));
              setSelectedIndex(Math.min(images.length - 1, Math.max(0, index)));
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="snap-start flex-shrink-0 w-full"
                style={{ aspectRatio: aspectRatio.toString() }}
              >
                <img
                  src={img.src}
                  alt={`${altPrefix} - ${img.alt}`}
                  className="w-full h-full object-contain"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedIndex(idx);
                  scrollToMobileIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === selectedIndex
                    ? "bg-primary scale-125"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
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

