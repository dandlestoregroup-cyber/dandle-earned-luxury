import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

interface HeroControlsProps {
  isPlaying: boolean;
  progress: number; // 0-100
  loopCount: number;
  maxLoops: number;
  onPlayPause: () => void;
}

const HeroControls = ({
  isPlaying,
  progress,
  loopCount,
  maxLoops,
  onPlayPause
}: HeroControlsProps) => {
  return (
    <div className="absolute bottom-6 left-0 right-0 z-30 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-dandle-orange to-dandle-orange/80 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Play/Pause */}
          <motion.button
            onClick={onPlayPause}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
            <span className="text-xs text-white/90 font-body">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </motion.button>

          {/* Loop Counter */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/70 font-body bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              {loopCount}/{maxLoops}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroControls;
