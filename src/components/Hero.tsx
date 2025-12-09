import { useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Hero Video with upscale effect */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-110"
      >
        <source src="/dandle-hero.mp4" type="video/mp4" />
      </video>

      {/* Mobile fallback poster */}
      <div className="md:hidden absolute inset-0 bg-[url('/hero-poster.jpg')] bg-cover" />

      {/* Shop Now Button */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
        <a
          href="/#products"
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
        >
          تسوق الآن
        </a>
      </div>
    </div>
  );
}
