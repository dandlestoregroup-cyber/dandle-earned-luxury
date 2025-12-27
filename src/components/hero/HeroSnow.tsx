import { useMemo, useEffect, useState } from "react";

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery?.matches ?? false);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery?.addEventListener?.("change", handler);
    return () => mediaQuery?.removeEventListener?.("change", handler);
  }, []);
  
  return prefersReduced;
}

type Flake = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

interface HeroSnowProps {
  density?: number;
}

const HeroSnow = ({ density = 14 }: HeroSnowProps) => {
  const prefersReduced = usePrefersReducedMotion();

  const flakes = useMemo<Flake[]>(() => {
    return Array.from({ length: density }).map(() => ({
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 4,
      opacity: 0.04 + Math.random() * 0.08,
    }));
  }, [density]);

  if (prefersReduced) return null;

  return (
    <div className="dandle-snow pointer-events-none absolute inset-0 overflow-hidden z-10">
      {flakes.map((f, idx) => (
        <span
          key={idx}
          className="absolute -top-10 rounded-full"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            background: "rgba(246, 241, 232, 0.9)", // ivory
            opacity: f.opacity,
            filter: "blur(0.4px)",
            animation: `dandleSnow ${f.duration}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroSnow;
