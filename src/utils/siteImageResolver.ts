/**
 * Site Image Resolver
 * 
 * Single source of truth for resolving image URLs across the site.
 * Priority: Storage URL → Reference URL → Local fallback
 */

import { siteImageManifest, SiteImage, ImageCategory } from '@/data/siteImageManifest';

// Supabase storage base URL for generated images
const STORAGE_BASE_URL = `https://rbvbrxjnhmgrtxvwusxr.supabase.co/storage/v1/object/public/product-images/site-images`;

/**
 * Build the expected storage URL for a manifest image
 */
export function getStorageUrl(image: SiteImage): string {
  return `${STORAGE_BASE_URL}/${image.category}/${image.filename}`;
}

/**
 * Resolve the best available URL for an image
 * Returns: generatedUrl (if set) → computed storage URL → referenceUrl
 */
export function resolveImageUrl(imageId: string): string {
  const image = siteImageManifest.find(img => img.id === imageId);
  if (!image) {
    console.warn(`[siteImageResolver] Image not found: ${imageId}`);
    return '/placeholder.svg';
  }
  
  // If already has a generated URL, use it
  if (image.generatedUrl) {
    return image.generatedUrl;
  }
  
  // Fall back to reference URL (these are real existing images)
  return image.referenceUrl;
}

/**
 * Get a resolved image object with URL and metadata
 */
export function getResolvedImage(imageId: string): SiteImage & { resolvedUrl: string } | null {
  const image = siteImageManifest.find(img => img.id === imageId);
  if (!image) return null;
  
  return {
    ...image,
    resolvedUrl: image.generatedUrl || image.referenceUrl,
  };
}

/**
 * Get all lifestyle images for the carousel
 */
export function getLifestyleImagesForCarousel(): Array<{
  src: string;
  alt: string;
  captionEn: string;
  captionAr: string;
  subtitleEn: string;
  subtitleAr: string;
  category: ImageCategory;
}> {
  const lifestyleCategories: ImageCategory[] = ['lifestyle-home', 'lifestyle-hotel', 'lifestyle-office'];
  
  return siteImageManifest
    .filter(img => lifestyleCategories.includes(img.category))
    .map(img => ({
      src: img.generatedUrl || img.referenceUrl,
      alt: `${img.product} in ${img.setting}`,
      captionEn: img.captionEn || img.setting,
      captionAr: img.captionAr || img.setting,
      subtitleEn: img.subtitleEn || '',
      subtitleAr: img.subtitleAr || '',
      category: img.category,
    }));
}

/**
 * Get the gift campaign background image
 */
export function getGiftCampaignBackground(): string {
  // Look for gift-hero in manifest
  const giftHero = siteImageManifest.find(img => img.id === 'gift-hero');
  if (giftHero) {
    return giftHero.generatedUrl || giftHero.referenceUrl;
  }
  
  // Fallback to a good lifestyle image
  const readingNook = siteImageManifest.find(img => img.id === 'lifestyle-home-reading');
  if (readingNook) {
    return readingNook.generatedUrl || readingNook.referenceUrl;
  }
  
  // Final fallback
  return '/images/lifestyle-reading-nook.jpg';
}

/**
 * Get images by category
 */
export function getImagesByCategory(category: ImageCategory): SiteImage[] {
  return siteImageManifest.filter(img => img.category === category);
}

/**
 * Get images for a specific product
 */
export function getImagesForProduct(productHandle: string): {
  hero: string;
  gallery: string[];
} {
  const productImages = siteImageManifest.filter(img => img.productHandle === productHandle);
  
  const heroImage = productImages.find(img => img.category === 'product-hero');
  const galleryImages = productImages.filter(img => img.category === 'product-gallery');
  
  return {
    hero: heroImage ? (heroImage.generatedUrl || heroImage.referenceUrl) : '/placeholder.svg',
    gallery: galleryImages.map(img => img.generatedUrl || img.referenceUrl),
  };
}
