import { Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicControl() {
  const { isMuted, toggleMute, hasInteracted, setHasInteracted } = useAudioStore();

  const handleClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    toggleMute();
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      onClick={handleClick}
      className="fixed bottom-24 md:bottom-6 left-4 z-50 w-12 h-12 rounded-full bg-[hsl(var(--bronze))] text-[hsl(var(--warm-white))] flex items-center justify-center shadow-luxury hover:shadow-elegant transition-all duration-300 hover:scale-105"
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
    >
      <AnimatePresence mode="wait">
        {isMuted ? (
          <motion.div
            key="muted"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeX className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="unmuted"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Volume2 className="w-5 h-5" />
            {/* Subtle pulse rings when playing */}
            <motion.div
              className="absolute inset-0 rounded-full border border-[hsl(var(--bronze))]"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
