import { useMemo } from 'react';

interface ResponsiveImageSources {
  mobile: string;
  tablet: string;
  desktop: string;
  ultrawide: string;
}

interface ResponsiveImageConfig {
  slideIndex: number;
  basePath?: string;
}

export const useResponsiveImage = ({ slideIndex, basePath = '/images/hero' }: ResponsiveImageConfig) => {
  const sources = useMemo((): ResponsiveImageSources => {
    const base = `${basePath}/slide-${slideIndex + 1}`;
    return {
      mobile: `${base}-mobile.webp`,
      tablet: `${base}-tablet.webp`,
      desktop: `${base}-desktop.webp`,
      ultrawide: `${base}-ultrawide.webp`,
    };
  }, [slideIndex, basePath]);

  const srcSet = useMemo(() => ({
    mobile: {
      media: '(max-width: 767px)',
      srcSet: `${sources.mobile} 750w`,
      sizes: '100vw'
    },
    tablet: {
      media: '(min-width: 768px) and (max-width: 1023px)',
      srcSet: `${sources.tablet} 1536w`,
      sizes: '100vw'
    },
    desktop: {
      media: '(min-width: 1024px) and (max-width: 1919px)',
      srcSet: `${sources.desktop} 1920w`,
      sizes: '100vw'
    },
    ultrawide: {
      media: '(min-width: 1920px)',
      srcSet: `${sources.ultrawide} 2560w`,
      sizes: '100vw'
    }
  }), [sources]);

  return { sources, srcSet };
};

// Static storage URL helper for generated images
export const getHeroImageUrl = (slideIndex: number, size: 'mobile' | 'tablet' | 'desktop' | 'ultrawide'): string => {
  const storageUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${storageUrl}/storage/v1/object/public/product-images/hero/slide-${slideIndex + 1}-${size}.webp`;
};

// Fallback local images (before AI generation)
export const getFallbackImage = (slideIndex: number): string => {
  const fallbacks = [
    '/images/relaxmax-hero-offwhite.jpg',
    '/images/relaxmax-lifestyle-night.png',
    '/images/cozycompanion-couple-lifestyle.jpg',
    '/images/relaxmax-lifestyle-day.png',
    '/images/complete-set-classic.jpg',
    '/images/spacesaver-offwhite-reclined.jpg',
    '/images/easyup-beige-lifted.jpg',
    '/images/cozycompanion-beige-front.jpg',
    '/images/worknest-blue-front.webp',
  ];
  return fallbacks[slideIndex] || fallbacks[0];
};
