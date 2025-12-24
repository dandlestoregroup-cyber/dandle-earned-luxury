import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface HeroCountdownProps {
  targetISO: string; // e.g. "2026-01-15T23:59:59+02:00"
  label?: string;
}

const HeroCountdown = ({ targetISO, label = "Ends in" }: HeroCountdownProps) => {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  return (
    <motion.div 
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <span className="text-xs tracking-wide text-white/70 font-body">{label}</span>
      <span className="text-xs font-semibold text-white font-body">
        {days}d : {pad(hours)}h : {pad(mins)}m
      </span>
    </motion.div>
  );
};

export default HeroCountdown;
