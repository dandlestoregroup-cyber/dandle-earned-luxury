// Lovable Catalog - Single Source of Truth for Product Images
// This catalog is INDEPENDENT of Shopify and controls all visual rendering

import { siteImageManifest } from "@/data/siteImageManifest";
import { getStorageUrl } from "@/utils/siteImageResolver";

export interface LovableImage {
  src: string; // Import path or asset URL
  fallbackSrc?: string; // Optional fallback URL if src 404s
  width: number; // Exact pixel width
  height: number; // Exact pixel height
  alt: string; // Descriptive alt text
}

export interface LovableProduct {
  productHandle: string;
  title: string;
  subtitle: string;
  heroImage: LovableImage;
  gallery: LovableImage[];
  aspectRatio: number;  // width/height for perfect containers
}

// 27 HD Product Images - Lovable as Visual Master
export const lovableCatalog: LovableProduct[] = [
  {
    productHandle: "diva",
    title: "Diva Recliner",
    subtitle: "Where Style Meets Comfort",
    aspectRatio: 1,
    heroImage: {
      src: "/images/dandle-diva.jpg",
      width: 1024,
      height: 1024,
      alt: "Dandle Diva Signature Persona Lounge"
    },
    gallery: [
      {
        src: "/images/diva-red-front.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Front View"
      }
    ]
  },
  {
    productHandle: "relaxmax",
    title: "RelaxMax Recliner",
    subtitle: "Your Daily Sanctuary",
    aspectRatio: 1,
    heroImage: {
      src: "/images/relaxmax-hero.png",
      width: 1024,
      height: 1024,
      alt: "Dandle RelaxMax: The flagship 90cm standard recliner. Iconic cinematic comfort and perfectly balanced proportions."
    },
    gallery: [
      {
        src: "/images/relaxmax-lifestyle-day.png",
        width: 2752,
        height: 1536,
        alt: "RelaxMax Recliner - Day Lifestyle"
      },
      {
        src: "/images/relaxmax-lifestyle-night.png",
        width: 2752,
        height: 1536,
        alt: "RelaxMax Recliner - Night Lifestyle"
      },
      {
        src: "/images/relaxmax-brown-lifestyle.jpg",
        width: 2752,
        height: 1536,
        alt: "RelaxMax Recliner - Brown Lifestyle"
      }
    ]
  },
  {
    productHandle: "cozycompanion",
    title: "CozyCompanion Loveseat",
    subtitle: "Comfort for Two",
    aspectRatio: 1,
    heroImage: {
      src: "/images/cozycompanion-hero.png",
      width: 1024,
      height: 1024,
      alt: "Dandle CozyCompanion: A premium two-seated couch recliner. Boutique comfort designed for intimate, upscale living."
    },
    gallery: [
      {
        src: "/images/cozycompanion-yellow-front.jpg",
        width: 2752,
        height: 1536,
        alt: "CozyCompanion - Yellow Front View"
      },
      {
        src: "/images/cozycompanion-couple-lifestyle.jpg",
        width: 2752,
        height: 1536,
        alt: "CozyCompanion - Lifestyle Couple"
      }
    ]
  },
  {
    productHandle: "worknest",
    title: "WorkNest Recliner",
    subtitle: "Flow-first performance",
    aspectRatio: 1,
    heroImage: {
      src: "/images/worknest-hero.png",
      width: 1024,
      height: 1024,
      alt: "Dandle WorkNest Productive Sanctuary"
    },
    gallery: []
  },
  {
    productHandle: "spacesaver",
    title: "SpaceSaver Recliner",
    subtitle: "Big Comfort, Small Footprint",
    aspectRatio: 1,
    heroImage: {
      src: "/images/spacesaver-hero.png",
      width: 1024,
      height: 1024,
      alt: "Dandle SpaceSaver Intelligent Footprint"
    },
    gallery: [
      {
        src: "/images/spacesaver-offwhite-reclined.jpg",
        width: 2752,
        height: 1536,
        alt: "SpaceSaver - Off-White Reclined"
      },
      {
        src: "/images/spacesaver-offwhite-side.jpg",
        width: 2752,
        height: 1536,
        alt: "SpaceSaver - Side View"
      }
    ]
  },
  {
    productHandle: "comfortplus",
    title: "ComfortPlus Recliner",
    subtitle: "Indulgent deep relaxation",
    aspectRatio: 1,
    heroImage: {
      src: "/images/dandle-comfortplus.jpg",
      width: 1024,
      height: 1024,
      alt: "Dandle ComfortPlus Rolling Massage Retreat"
    },
    gallery: [
      {
        src: "/images/relaxmax-hero-offwhite.jpg",
        width: 2752,
        height: 1536,
        alt: "ComfortPlus - Off-White Variant"
      }
    ]
  },
  {
    productHandle: "easyup",
    title: "EasyUp Lift Recliner",
    subtitle: "Sit Easy, Stand Easier",
    aspectRatio: 1,
    heroImage: {
      src: "/images/easyup-standard-hero.png",
      width: 1024,
      height: 1024,
      alt: "Dandle EasyUp Standard 90cm Power Lift"
    },
    gallery: [
      {
        src: "/images/easyup-beige-front.jpg",
        width: 2752,
        height: 1536,
        alt: "EasyUp - Beige Front"
      },
      {
        src: "/images/easyup-beige-lifted.jpg",
        width: 2752,
        height: 1536,
        alt: "EasyUp - Lifted Position"
      }
    ]
  },
  {
    productHandle: "easyup-compact",
    title: "EasyUp Compact Lift Recliner",
    subtitle: "Gentle Lift, Compact Design",
    aspectRatio: 1,
    heroImage: {
      src: "/images/dandle-easyup-compact.jpg",
      width: 1024,
      height: 1024,
      alt: "Dandle EasyUp Compact Slim Power Lift"
    },
    gallery: [
      {
        src: "/images/easyup-compact-charcoal-front.png",
        width: 2752,
        height: 1536,
        alt: "EasyUp Compact - Charcoal Front"
      },
      {
        src: "/images/easyup-compact-charcoal-reclined.png",
        width: 2752,
        height: 1536,
        alt: "EasyUp Compact - Charcoal Reclined"
      },
      {
        src: "/images/easyup-compact-charcoal-side.png",
        width: 2752,
        height: 1536,
        alt: "EasyUp Compact - Charcoal Side"
      }
    ]
  },
  {
    productHandle: "complete-set",
    title: "Complete Living Room Set",
    subtitle: "Comfort for the Whole Family",
    aspectRatio: 1,
    heroImage: {
      src: "/images/complete-set-hero.png",
      width: 1024,
      height: 1024,
      alt: "Dandle Heritage Set Cinematic Suite"
    },
    gallery: [
      {
        src: "/images/complete-set-coastal-modern.jpg",
        width: 2752,
        height: 1536,
        alt: "Complete Set - Coastal Modern"
      },
      {
        src: "/images/complete-set-family-modern.jpg",
        width: 2752,
        height: 1536,
        alt: "Complete Set - Family Modern"
      },
      {
        src: "/images/complete-set-modern-fireplace.jpg",
        width: 2752,
        height: 1536,
        alt: "Complete Set - Modern Fireplace"
      },
      {
        src: "/images/complete-set-sunset-fireplace.jpg",
        width: 2752,
        height: 1536,
        alt: "Complete Set - Sunset Fireplace"
      }
    ]
  }
];

// Helper: Map catalog handles to manifest handles
const normalizeHandleForManifest = (handle: string): string => {
  // The catalog uses "easyup" while the manifest uses "easyup-standard"
  if (handle === "easyup") return "easyup-standard";
  return handle;
};

// Helper: Get product by handle - fail-safe
export function getLovableProduct(handle: string): LovableProduct | null {
  const base = lovableCatalog.find((p) => p.productHandle === handle) || null;
  if (!base) return null;

  // Hydrate hero + gallery from the site image manifest (generated images live in storage)
  const manifestHandle = normalizeHandleForManifest(base.productHandle);

  const heroManifest = siteImageManifest.find(
    (img) => img.category === "product-hero" && img.productHandle === manifestHandle
  );
  const galleryManifest = siteImageManifest.filter(
    (img) => img.category === "product-gallery" && img.productHandle === manifestHandle
  );

  const heroImage = heroManifest
    ? {
        ...base.heroImage,
        src: getStorageUrl(heroManifest),
        fallbackSrc: heroManifest.referenceUrl,
        width: heroManifest.dimensions.width,
        height: heroManifest.dimensions.height,
      }
    : base.heroImage;

  const generatedGallery = galleryManifest.map((img) => ({
    src: getStorageUrl(img),
    fallbackSrc: img.referenceUrl,
    width: img.dimensions.width,
    height: img.dimensions.height,
    alt: `${base.title} — ${img.setting}`,
  }));

  return {
    ...base,
    heroImage,
    gallery: generatedGallery.length ? [...generatedGallery, ...base.gallery] : base.gallery,
  };
}

// Helper: Get all product handles for routing
export function getAllProductHandles(): string[] {
  return lovableCatalog.map(p => p.productHandle);
}
