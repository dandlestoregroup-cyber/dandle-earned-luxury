import { motion } from "framer-motion";

interface AnimatedHeadlineProps {
  children: string;
  className?: string;
  delay?: number;
}

const AnimatedHeadline = ({ children, className = "", delay = 0.5 }: AnimatedHeadlineProps) => {
  const container = {
    hidden: {},
    show: { 
      transition: { 
        staggerChildren: 0.018,
        delayChildren: delay,
      } 
    },
  };

  const char = {
    hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } 
    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
      style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}
    >
      {children.split("").map((c, i) => (
        <motion.span key={i} variants={char} style={{ display: "inline-block" }}>
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default AnimatedHeadline;
