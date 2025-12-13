import { useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      {/* Hero Video */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          poster="/images/relaxmax-hero-offwhite.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/dandle-hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Fallback Image */}
      {videoError && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/relaxmax-hero-offwhite.jpg')" }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Shop Now Button */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
        <a
          href="/#products"
          className="bg-bronze text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-bronze/90 transition-colors shadow-lg min-h-[48px] inline-flex items-center"
        >
          تسوق الآن
        </a>
      </div>
    </div>
  );
}
