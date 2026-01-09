/* Prompt 2B + 2C: Product image data with gallery placeholders */

import { generationManifest } from './imageGenerationManifest';

// Build generated images by product
const generatedByProduct: Record<string, string[]> = {};
for (const entry of generationManifest) {
  const url = `/images/generated/${entry.outputFileName}`;
  (generatedByProduct[entry.productKey] ||= []).push(url);
}

export const productImageData: Record<string, { mainImage: string; galleryImages: string[] }> = {
  'relaxmax': {
    mainImage: '/images/relaxmax-hero.png',
    galleryImages: [
      '/images/relaxmax-hero-offwhite.jpg',
      '/images/relaxmax-brown-lifestyle.jpg',
      '/images/relaxmax-lifestyle-day.png',
      '/images/relaxmax-lifestyle-night.png',
      ...(generatedByProduct['relaxmax'] || []),
    ],
  },
  'comfortplus': {
    mainImage: '/images/comfortplus-tan-front.webp',
    galleryImages: [
      ...(generatedByProduct['comfortplus'] || []),
    ],
  },
  'diva': {
    mainImage: '/images/dandle-diva.jpg',
    galleryImages: [
      '/images/diva-red-front.jpg',
      ...(generatedByProduct['diva'] || []),
    ],
  },
  'cozycompanion': {
    mainImage: '/images/cozycompanion-hero.png',
    galleryImages: [
      '/images/cozycompanion-beige-front.jpg',
      '/images/cozycompanion-yellow-front.jpg',
      '/images/cozycompanion-couple-lifestyle.jpg',
      '/images/cozycompanion-couple-lifestyle.webp',
      '/images/cozycompanion-mocha-taupe.webp',
      '/images/cozycompanion-coastal-fog.webp',
      ...(generatedByProduct['cozycompanion'] || []),
    ],
  },
  'easyup': {
    mainImage: '/images/easyup-standard-hero.png',
    galleryImages: [
      '/images/easyup-beige-front.jpg',
      '/images/easyup-beige-lifted.jpg',
      '/images/easyup-standard-grey-front.webp',
      '/images/easyup-standard-coastal-fog.webp',
      '/images/easyup-standard-oasis-green.webp',
      '/images/easyup-standard-mocha-taupe.webp',
      '/images/easyup-lift-assist-lifestyle.webp',
      ...(generatedByProduct['easyup'] || []),
    ],
  },
  'easyup-compact': {
    mainImage: '/images/dandle-easyup-compact.jpg',
    galleryImages: [
      '/images/easyup-compact-charcoal-front.jpg',
      '/images/easyup-compact-charcoal-reclined.png',
      '/images/easyup-compact-charcoal-side.png',
      '/images/easyup-compact-grey-front.webp',
      '/images/easyup-compact-oasis-green.webp',
      ...(generatedByProduct['easyup-compact'] || []),
    ],
  },
  'worknest': {
    mainImage: '/images/worknest-hero.png',
    galleryImages: [
      '/images/worknest-blue-front.webp',
      '/images/worknest-oasis-green.webp',
      ...(generatedByProduct['worknest'] || []),
    ],
  },
  'spacesaver': {
    mainImage: '/images/spacesaver-hero.png',
    galleryImages: [
      '/images/spacesaver-offwhite-reclined.jpg',
      '/images/spacesaver-offwhite-side.jpg',
      '/images/spacesaver-red-front.webp',
      '/images/spacesaver-desert-grey.webp',
      ...(generatedByProduct['spacesaver'] || []),
    ],
  },
  'complete-set': {
    mainImage: '/images/complete-set-hero.png',
    galleryImages: [
      '/images/complete-set-classic.jpg',
      '/images/complete-set-coastal-modern.jpg',
      '/images/complete-set-family-modern.jpg',
      '/images/complete-set-modern-fireplace.jpg',
      '/images/complete-set-sunset-fireplace.jpg',
      ...(generatedByProduct['complete-set'] || []),
    ],
  },
};
