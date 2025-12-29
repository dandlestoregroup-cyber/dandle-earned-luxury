/* Prompt 2C: I2I Image Generation Manifest */

export type TargetScene =
  | 'mediterranean_home'
  | 'cozy_adobe'
  | 'hotel_room'
  | 'reception_area'
  | 'office'
  | 'lounge';

export interface GenerationEntry {
  productKey: string;
  baseImageUrl: string;
  targetScene: TargetScene;
  constraints: string[];
  outputFileName: string;
}

/**
 * Image Generation Manifest — I2I ONLY
 *
 * Upload generated outputs to:
 *   /public/images/generated/<outputFileName>
 *
 * The gallery will pick them up automatically once present.
 * Do NOT run any generation in-app.
 */
export const generationManifest: GenerationEntry[] = [
  // RelaxMax scenes
  {
    productKey: 'relaxmax',
    baseImageUrl: '/images/relaxmax-hero-offwhite.jpg',
    targetScene: 'mediterranean_home',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'relaxmax__mediterranean_home__01.jpg',
  },
  {
    productKey: 'relaxmax',
    baseImageUrl: '/images/relaxmax-hero-offwhite.jpg',
    targetScene: 'hotel_room',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'relaxmax__hotel_room__01.jpg',
  },
  {
    productKey: 'relaxmax',
    baseImageUrl: '/images/relaxmax-hero-offwhite.jpg',
    targetScene: 'cozy_adobe',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'relaxmax__cozy_adobe__01.jpg',
  },
  {
    productKey: 'relaxmax',
    baseImageUrl: '/images/relaxmax-hero-offwhite.jpg',
    targetScene: 'lounge',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'relaxmax__lounge__01.jpg',
  },
  
  // Diva scenes
  {
    productKey: 'diva',
    baseImageUrl: '/images/diva-red-front.jpg',
    targetScene: 'mediterranean_home',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'diva__mediterranean_home__01.jpg',
  },
  {
    productKey: 'diva',
    baseImageUrl: '/images/diva-red-front.jpg',
    targetScene: 'lounge',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'diva__lounge__01.jpg',
  },
  
  // CozyCompanion scenes
  {
    productKey: 'cozycompanion',
    baseImageUrl: '/images/cozycompanion-beige-front.jpg',
    targetScene: 'cozy_adobe',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'cozycompanion__cozy_adobe__01.jpg',
  },
  {
    productKey: 'cozycompanion',
    baseImageUrl: '/images/cozycompanion-yellow-front.jpg',
    targetScene: 'hotel_room',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'cozycompanion__hotel_room__01.jpg',
  },
  
  // SpaceSaver scenes
  {
    productKey: 'spacesaver',
    baseImageUrl: '/images/spacesaver-red-front.webp',
    targetScene: 'office',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'spacesaver__office__01.jpg',
  },
  
  // EasyUp scenes
  {
    productKey: 'easyup',
    baseImageUrl: '/images/easyup-beige-front.jpg',
    targetScene: 'reception_area',
    constraints: ['I2I only', 'preserve 100% Dandle chair design', 'no added/removed parts', 'no generic chairs', 'no clinic/medical context'],
    outputFileName: 'easyup__reception_area__01.jpg',
  },
];
