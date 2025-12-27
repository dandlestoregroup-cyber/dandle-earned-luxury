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

type Particle = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

interface HeroParticlesProps {
  density?: number;
  tone?: "brass" | "ivory";
}

const HeroParticles = ({ density = 24, tone = "brass" }: HeroParticlesProps) => {
  const prefersReduced = usePrefersReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < density; i++) {
      arr.push({
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.2,
        duration: 7 + Math.random() * 7,
        delay: Math.random() * 5,
        opacity: 0.05 + Math.random() * 0.12,
      });
    }
    return arr;
  }, [density]);

  if (prefersReduced) return null;

  // Brass: #B08A4A, Ivory: #F6F1E8
  const color = tone === "brass" 
    ? "rgba(176, 138, 74, 1)" 
    : "rgba(246, 241, 232, 1)";

  return (
    <div className="dandle-particles pointer-events-none absolute inset-0 overflow-hidden z-10">
      {particles.map((p, idx) => (
        <span
          key={idx}
          className="absolute top-[110%] rounded-full"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: color,
            opacity: p.opacity,
            filter: "blur(0.2px)",
            animation: `dandleFloat ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroParticles;
