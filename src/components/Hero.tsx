import { useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Fixed Background Layer - NO scroll hijacking */}
      <div className="fixed inset-0 -z-10">
        {!videoError ? (
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
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/relaxmax-hero-offwhite.jpg')" }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Content Layer - scrolls normally */}
      <div className="relative h-full flex flex-col items-center justify-end pb-16 md:pb-24">
        <a
          href="/#collection"
          className="bg-bronze text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-bronze/90 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] inline-flex items-center"
        >
          تسوق الآن
        </a>
      </div>
      
      {/* Spacer to allow hero content to scroll away from fixed background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
