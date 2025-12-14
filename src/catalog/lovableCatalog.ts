// Lovable Catalog - Single Source of Truth for Product Images
// This catalog is INDEPENDENT of Shopify and controls all visual rendering

export interface LovableImage {
  src: string;        // Import path or asset URL
  width: number;      // Exact pixel width
  height: number;     // Exact pixel height
  alt: string;        // Descriptive alt text
}

export interface LovableProduct {
  productHandle: string;
  title: string;
  subtitle: string;
  heroImage: LovableImage;
  gallery: LovableImage[];
  aspectRatio: number;  // width/height for perfect containers
}

// Full-frame 4:5 product card images + lifestyle gallery
export const lovableCatalog: LovableProduct[] = [
  {
    productHandle: "diva",
    title: "Diva Recliner",
    subtitle: "Statement Luxury Seating",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/diva-red-card.jpg",
      width: 1024,
      height: 1280,
      alt: "Diva Recliner - Red Leather Statement Piece"
    },
    gallery: [
      {
        src: "/images/diva-red-front.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Front View"
      },
      {
        src: "/images/diva-pink-lifestyle.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Pink Rose Lifestyle"
      },
      {
        src: "/images/diva-yellow-lifestyle.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Yellow Modern Apartment"
      }
    ]
  },
  {
    productHandle: "relaxmax",
    title: "RelaxMax Recliner",
    subtitle: "Ultimate Comfort Engineering",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/relaxmax-offwhite-card.jpg",
      width: 1024,
      height: 1280,
      alt: "RelaxMax Recliner - Off-White Hero"
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
      },
      {
        src: "/images/hero-lifestyle-library.jpg",
        width: 2752,
        height: 1536,
        alt: "RelaxMax Recliner - Egyptian Library"
      }
    ]
  },
  {
    productHandle: "cozycompanion",
    title: "CozyCompanion Loveseat",
    subtitle: "Two-Seater Power Recliner",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/cozycompanion-beige-card.jpg",
      width: 1024,
      height: 1280,
      alt: "CozyCompanion Loveseat - Beige Hero"
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
      },
      {
        src: "/images/hero-lifestyle-couple.jpg",
        width: 2752,
        height: 1536,
        alt: "CozyCompanion - Cairo Family Room"
      }
    ]
  },
  {
    productHandle: "worknest",
    title: "WorkNest Recliner",
    subtitle: "Executive Productivity Chair",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/worknest-blue-card.jpg",
      width: 1024,
      height: 1280,
      alt: "WorkNest Recliner - Blue with Swivel Table"
    },
    gallery: [
      {
        src: "/images/worknest-brown-office.jpg",
        width: 2752,
        height: 1536,
        alt: "WorkNest Recliner - Brown Home Office"
      }
    ]
  },
  {
    productHandle: "spacesaver",
    title: "SpaceSaver Recliner",
    subtitle: "Wall-Hugger Technology",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/spacesaver-red-card.jpg",
      width: 1024,
      height: 1280,
      alt: "SpaceSaver Recliner - Red Leather"
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
    subtitle: "Enhanced Ergonomic Design",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/comfortplus-tan-card.jpg",
      width: 1024,
      height: 1280,
      alt: "ComfortPlus Recliner - Tan Leather"
    },
    gallery: [
      {
        src: "/images/relaxmax-hero-offwhite.jpg",
        width: 2752,
        height: 1536,
        alt: "ComfortPlus - Off-White Variant"
      },
      {
        src: "/images/comfortplus-red-spa.jpg",
        width: 2752,
        height: 1536,
        alt: "ComfortPlus - Red Spa Setting"
      }
    ]
  },
  {
    productHandle: "easyup",
    title: "EasyUp Lift Recliner",
    subtitle: "Power Lift Assistance",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/easyup-grey-card.jpg",
      width: 1024,
      height: 1280,
      alt: "EasyUp Standard Lift Recliner - Grey"
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
    subtitle: "Compact Power Lift",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/easyup-compact-grey-card.jpg",
      width: 1024,
      height: 1280,
      alt: "EasyUp Compact Lift Recliner - Grey"
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
    subtitle: "Curated Room Configurations",
    aspectRatio: 0.8,
    heroImage: {
      src: "/images/complete-set-card.jpg",
      width: 1024,
      height: 1280,
      alt: "Complete Set - Classic Configuration"
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

// Helper: Get product by handle - fail-safe
export function getLovableProduct(handle: string): LovableProduct | null {
  return lovableCatalog.find(p => p.productHandle === handle) || null;
}

// Helper: Get all product handles for routing
export function getAllProductHandles(): string[] {
  return lovableCatalog.map(p => p.productHandle);
}
