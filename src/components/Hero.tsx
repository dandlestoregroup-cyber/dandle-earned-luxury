import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedMutePreference = sessionStorage.getItem('heroVideoMuted');
    const userPrefersMuted = savedMutePreference === 'true';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      video.muted = true;
      setIsMuted(true);

      if (savedMutePreference === 'false') {
        const attemptUnmute = () => {
          video.muted = false;
          setIsMuted(false);
          document.removeEventListener('touchstart', attemptUnmute);
        };
        document.addEventListener('touchstart', attemptUnmute, { once: true });
      }
    } else {
      if (savedMutePreference === null) {
        video.muted = false;
        setIsMuted(false);
      } else {
        video.muted = userPrefersMuted;
        setIsMuted(userPrefersMuted);
      }
    }

    const handleEnded = () => {
      if (!hasPlayedOnce) {
        setHasPlayedOnce(true);
        video.loop = true;

        if (!userHasInteracted) {
          video.muted = true;
          setIsMuted(true);
          sessionStorage.setItem('heroVideoMuted', 'true');
        }
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [hasPlayedOnce, userHasInteracted]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      setUserHasInteracted(true);
      sessionStorage.setItem('heroVideoMuted', String(newMutedState));
    }
  };

  return (
    <motion.section
      className="relative w-full h-screen md:h-[80vh] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Full-screen Video - Portrait fills on mobile, contained on desktop */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <video
          ref={videoRef}
          src="/dandle-hero.mp4"
          className="w-full h-full object-cover md:object-contain"
          autoPlay
          loop={false}
          playsInline
          muted
          preload="auto"
        />
      </div>

      {/* Mute/Unmute Toggle Button */}
      <motion.button
        onClick={toggleMute}
        className="absolute bottom-24 right-6 md:right-8 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/50 transition-all duration-300 z-20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
