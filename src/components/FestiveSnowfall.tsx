import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Snowflake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const FestiveSnowfall = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Check if snowfall was already shown this session
    const hasShown = sessionStorage.getItem('dandle-snowfall-shown');
    if (hasShown) {
      setIsVisible(false);
      return;
    }

    // Generate snowflakes
    const flakes: Snowflake[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position (0-100%)
      size: Math.random() * 0.8 + 0.4, // Size between 0.4 and 1.2em
      duration: Math.random() * 3 + 3, // Duration between 3-6s
      delay: Math.random() * 2, // Random delay 0-2s
    }));
    setSnowflakes(flakes);

    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('dandle-snowfall-shown', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            className="absolute text-white/60"
            style={{
              left: `${flake.x}%`,
              fontSize: `${flake.size}em`,
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.random() * 40 - 20],
              rotate: [0, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: flake.duration,
              delay: flake.delay,
              ease: 'linear',
            }}
          >
            *
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default FestiveSnowfall;
