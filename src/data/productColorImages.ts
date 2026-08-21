/**
 * Maps each product to available color variants with actual product images
 * Keys match the palette keys from palette.ts
 * Each product gets 4-6 strategic swatches with corresponding images
 */

export type ColorVariant = {
  swatchKey: string;
  imageSrc: string;
};

// Product-specific color variants with actual images
export const productColorImages: Record<string, ColorVariant[]> = {
  'relaxmax': [
    { swatchKey: 'nile-sapphire', imageSrc: '/images/dandle-relaxmax-flagship.webp' },
    { swatchKey: 'desert-grey', imageSrc: '/images/dandle-relaxmax.jpg' },
  ],
  'diva': [
    { swatchKey: 'nile-mist', imageSrc: '/images/diva-terracotta-reclined.webp' },
    { swatchKey: 'nile-sapphire', imageSrc: '/images/dandle-diva.jpg' },
  ],
  'cozycompanion': [
    { swatchKey: 'giza-gold', imageSrc: '/images/cozycompanion-yellow-front.jpg' },
    { swatchKey: 'alexandria-linen', imageSrc: '/images/cozycompanion-beige-front.jpg' },
    { swatchKey: 'mocha-taupe', imageSrc: '/images/cozycompanion-mocha-taupe.webp' },
    { swatchKey: 'coastal-fog', imageSrc: '/images/cozycompanion-coastal-fog.webp' },
    { swatchKey: 'amber-sand', imageSrc: '/images/cozycompanion-beige-front.jpg' },
  ],
  'comfortplus': [
    { swatchKey: 'alexandria-linen', imageSrc: '/images/comfortplus-tan-front.webp' },
    { swatchKey: 'desert-grey', imageSrc: '/images/dandle-comfortplus.jpg' },
    { swatchKey: 'mocha-taupe', imageSrc: '/images/dandle-comfortplus.jpg' },
    { swatchKey: 'coastal-fog', imageSrc: '/images/dandle-comfortplus.jpg' },
    { swatchKey: 'amber-sand', imageSrc: '/images/comfortplus-tan-front.webp' },
  ],
  'easyup': [
    { swatchKey: 'alexandria-linen', imageSrc: '/images/easyup-beige-front.jpg' },
    { swatchKey: 'desert-grey', imageSrc: '/images/easyup-standard-grey-front.webp' },
    { swatchKey: 'coastal-fog', imageSrc: '/images/easyup-standard-coastal-fog.webp' },
    { swatchKey: 'mocha-taupe', imageSrc: '/images/easyup-standard-mocha-taupe.webp' },
    { swatchKey: 'oasis-green', imageSrc: '/images/easyup-standard-oasis-green.webp' },
  ],
  'easyup-compact': [
    // Limited to 3 colors only: Navy Blue, Stone Grey, Espresso Brown (OMASH Damsuk textured leather)
    { swatchKey: 'nile-sapphire', imageSrc: '/images/easyup-compact-charcoal-front.jpg' }, // Navy Blue
    { swatchKey: 'desert-grey', imageSrc: '/images/easyup-compact-grey-front.webp' }, // Stone Grey
    { swatchKey: 'mocha-taupe', imageSrc: '/images/easyup-compact-charcoal-reclined.png' }, // Espresso Brown
  ],
  'worknest': [
    { swatchKey: 'blue-nile-denim', imageSrc: '/images/worknest-blue-front.webp' },
    { swatchKey: 'oasis-green', imageSrc: '/images/worknest-oasis-green.webp' },
    { swatchKey: 'desert-grey', imageSrc: '/images/worknest-desert-grey-reclined.webp' },
    { swatchKey: 'nile-sapphire', imageSrc: '/images/worknest-blue-front.webp' },
    { swatchKey: 'coastal-fog', imageSrc: '/images/dandle-worknest.jpg' },
  ],
  'spacesaver': [
    { swatchKey: 'alexandria-linen', imageSrc: '/images/spacesaver-offwhite-reclined.jpg' },
    { swatchKey: 'nile-mist', imageSrc: '/images/spacesaver-red-front.webp' },
    { swatchKey: 'desert-grey', imageSrc: '/images/spacesaver-desert-grey.webp' },
    { swatchKey: 'mocha-taupe', imageSrc: '/images/spacesaver-mocha-taupe.webp' },
    { swatchKey: 'desert-sage', imageSrc: '/images/spacesaver-burgundy-lifestyle.webp' },
  ],
  'complete-set': [
    { swatchKey: 'alexandria-linen', imageSrc: '/images/complete-set-classic.jpg' },
    { swatchKey: 'mocha-taupe', imageSrc: '/images/complete-set-modern-fireplace.jpg' },
    { swatchKey: 'coastal-fog', imageSrc: '/images/complete-set-coastal-modern.jpg' },
    { swatchKey: 'desert-sage', imageSrc: '/images/complete-set-family-modern.jpg' },
    { swatchKey: 'amber-sand', imageSrc: '/images/complete-set-sunset-fireplace.jpg' },
  ],
};

// Helper to get image for a product + color combination
export function getProductColorImage(productId: string, swatchKey: string): string | null {
  const variants = productColorImages[productId];
  if (!variants) return null;
  const variant = variants.find(v => v.swatchKey === swatchKey);
  return variant?.imageSrc || null;
}

// Helper to get available swatch keys for a product
export function getProductSwatchKeys(productId: string): string[] {
  const variants = productColorImages[productId];
  return variants?.map(v => v.swatchKey) || [];
}
