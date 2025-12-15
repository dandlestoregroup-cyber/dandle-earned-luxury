import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  hasInteracted: boolean;
  setPlaying: (playing: boolean) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setHasInteracted: (interacted: boolean) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      isPlaying: false,
      isMuted: false,
      volume: 0.3,
      hasInteracted: false,
      setPlaying: (playing) => set({ isPlaying: playing }),
      setMuted: (muted) => set({ isMuted: muted }),
      setVolume: (volume) => set({ volume }),
      setHasInteracted: (interacted) => set({ hasInteracted: interacted }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      name: 'dandle-audio-preferences',
      partialize: (state) => ({ isMuted: state.isMuted, volume: state.volume }),
    }
  )
);
