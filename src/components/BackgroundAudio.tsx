import { useEffect, useRef, useState } from 'react';
import { useAudioStore } from '@/stores/audioStore';

// Placeholder - will be replaced with generated audio
// For now, we'll generate on first load if no audio exists
const AMBIENT_MUSIC_URL = '/audio/luxury-ambient.mp3';

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const { isMuted, volume, hasInteracted, setPlaying, setHasInteracted } = useAudioStore();

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    
    // Try to load the audio
    audio.src = AMBIENT_MUSIC_URL;
    
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    
    audio.addEventListener('error', () => {
      console.log('Background music not available yet. Add luxury-ambient.mp3 to public/audio/');
      setAudioLoaded(false);
    });
    
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle play/pause based on interaction
  useEffect(() => {
    if (audioRef.current && hasInteracted && audioLoaded) {
      if (!isMuted) {
        audioRef.current.play().then(() => {
          setPlaying(true);
        }).catch(() => {
          // Autoplay blocked, will retry on next interaction
        });
      } else {
        audioRef.current.pause();
        setPlaying(false);
      }
    }
  }, [hasInteracted, isMuted, audioLoaded, setPlaying]);

  // Listen for first user interaction to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, [hasInteracted, setHasInteracted]);

  return null; // This component doesn't render anything visible
}
