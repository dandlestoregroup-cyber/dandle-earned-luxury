import { useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Layer - sticky positioning for proper scroll behavior */}
      <div className="absolute inset-0 -z-10">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            poster="/images/relaxmax-hero-offwhite.jpg"
            className="w-full h-full object-cover"
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
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative h-full flex flex-col items-center justify-end pb-20 md:pb-28">
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
