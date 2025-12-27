import { useCallback, useRef } from 'react';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface HeroEngagementData {
  slide_viewed: number;
  time_spent: number;
  color_preference: string;
  sound_enabled: boolean;
  loop_count: number;
}

interface GiftingIntentData {
  slides_completed: number;
  video_watched: boolean;
  product_interest: string;
}

export const useHeroAnalytics = () => {
  const startTimeRef = useRef<number>(Date.now());
  const viewedSlidesRef = useRef<Set<number>>(new Set());

  const trackHeroEngagement = useCallback((data: HeroEngagementData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'HeroEngagement', data);
    }
    console.log('Hero Engagement:', data);
  }, []);

  const trackGiftingIntent = useCallback((data: GiftingIntentData) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'GiftingIntent', data);
    }
    console.log('Gifting Intent:', data);
  }, []);

  const trackSlideView = useCallback((slideIndex: number, colorName: string, isMuted: boolean, loopCount: number) => {
    viewedSlidesRef.current.add(slideIndex);
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    
    trackHeroEngagement({
      slide_viewed: slideIndex,
      time_spent: timeSpent,
      color_preference: colorName,
      sound_enabled: !isMuted,
      loop_count: loopCount
    });
  }, [trackHeroEngagement]);

  const trackVideoComplete = useCallback(() => {
    trackGiftingIntent({
      slides_completed: 0,
      video_watched: true,
      product_interest: 'video_intro'
    });
  }, [trackGiftingIntent]);

  const trackCarouselComplete = useCallback((loopCount: number) => {
    trackGiftingIntent({
      slides_completed: 9,
      video_watched: true,
      product_interest: 'full_carousel'
    });
  }, [trackGiftingIntent]);

  const resetTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    viewedSlidesRef.current.clear();
  }, []);

  return {
    trackSlideView,
    trackVideoComplete,
    trackCarouselComplete,
    resetTimer
  };
};
