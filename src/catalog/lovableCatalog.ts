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

// 27 HD Product Images - Lovable as Visual Master
export const lovableCatalog: LovableProduct[] = [
  {
    productHandle: "diva",
    title: "Diva Recliner",
    subtitle: "Statement Luxury Seating",
    aspectRatio: 1.79, // 2752/1536
    heroImage: {
      src: "/src/assets/products/diva/diva-hero-01.jpg",
      width: 2752,
      height: 1536,
      alt: "Diva Recliner - Red Leather Statement Piece"
    },
    gallery: [
      {
        src: "/src/assets/products/diva/diva-gallery-01.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Front View"
      },
      {
        src: "/src/assets/products/diva/diva-gallery-02.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Side Angle"
      },
      {
        src: "/src/assets/products/diva/diva-gallery-03.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Detail Shot"
      },
      {
        src: "/src/assets/products/diva/diva-gallery-04.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Lifestyle Scene"
      },
      {
        src: "/src/assets/products/diva/diva-gallery-05.jpg",
        width: 2752,
        height: 1536,
        alt: "Diva Recliner - Close-up"
      }
    ]
  },
  {
    productHandle: "relaxmax",
    title: "RelaxMax Recliner",
    subtitle: "Ultimate Comfort Engineering",
    aspectRatio: 1.79,
    heroImage: {
      src: "/src/assets/products/relaxmax/relaxmax-hero-01.jpg",
      width: 2752,
      height: 1536,
      alt: "RelaxMax Recliner - Off-White Hero"
    },
    gallery: [
      {
        src: "/src/assets/products/relaxmax/relaxmax-gallery-01.jpg",
        width: 2752,
        height: 1536,
        alt: "RelaxMax Recliner - Detail View"
      }
    ]
  },
  {
    productHandle: "cozycompanion",
    title: "CozyCompanion Loveseat",
    subtitle: "Two-Seater Power Recliner",
    aspectRatio: 1.79,
    heroImage: {
      src: "/src/assets/products/cozycompanion/cozycompanion-hero-01.jpg",
      width: 2752,
      height: 1536,
      alt: "CozyCompanion Loveseat - Beige Hero"
    },
    gallery: [
      {
        src: "/src/assets/products/cozycompanion/cozycompanion-gallery-01.jpg",
        width: 2752,
        height: 1536,
        alt: "CozyCompanion - Yellow Front View"
      },
      {
        src: "/src/assets/products/cozycompanion/cozycompanion-gallery-02.jpg",
        width: 2752,
        height: 1536,
        alt: "CozyCompanion - Angle View"
      },
      {
        src: "/src/assets/products/cozycompanion/cozycompanion-gallery-03.jpg",
        width: 2752,
        height: 1536,
        alt: "CozyCompanion - Lifestyle Couple"
      },
      {
        src: "/src/assets/products/cozycompanion/cozycompanion-gallery-04.jpg",
        width: 2752,
        height: 1536,
        alt: "CozyCompanion - Side Detail"
      }
    ]
  },
  {
    productHandle: "worknest",
    title: "WorkNest Recliner",
    subtitle: "Executive Productivity Chair",
    aspectRatio: 1.79,
    heroImage: {
      src: "/src/assets/products/worknest/worknest-hero-01.jpg",
      width: 2752,
      height: 1536,
      alt: "WorkNest Recliner - Hero Shot"
    },
    gallery: [
      {
        src: "/src/assets/products/worknest/worknest-gallery-01.jpg",
        width: 2752,
        height: 1536,
        alt: "WorkNest - Front View"
      },
      {
        src: "/src/assets/products/worknest/worknest-gallery-02.jpg",
        width: 2752,
        height: 1536,
        alt: "WorkNest - Side Angle"
      }
    ]
  },
  {
    productHandle: "spacesaver",
    title: "SpaceSaver Recliner",
    subtitle: "Wall-Hugger Technology",
    aspectRatio: 1.79,
    heroImage: {
      src: "/src/assets/products/spacesaver/spacesaver-hero-01.jpg",
      width: 2752,
      height: 1536,
      alt: "SpaceSaver Recliner - Off-White"
    },
    gallery: [] // More images coming soon
  },
  {
    productHandle: "comfortplus",
    title: "ComfortPlus Recliner",
    subtitle: "Enhanced Ergonomic Design",
    aspectRatio: 1.79,
    heroImage: {
      src: "/src/assets/products/comfortplus/comfortplus-hero-01.jpg",
      width: 2752,
      height: 1536,
      alt: "ComfortPlus Recliner - Hero"
    },
    gallery: [] // More images coming soon
  },
  {
    productHandle: "easyup",
    title: "EasyUp Lift Recliner",
    subtitle: "Power Lift Assistance",
    aspectRatio: 1.79,
    heroImage: {
      src: "/src/assets/products/easyup/easyup-hero-01.jpg",
      width: 2752,
      height: 1536,
      alt: "EasyUp Lift Recliner - Beige"
    },
    gallery: [
      {
        src: "/src/assets/products/easyup/easyup-gallery-01.jpg",
        width: 2752,
        height: 1536,
        alt: "EasyUp - Lifted Position"
      }
    ]
  },
  {
    productHandle: "complete-set",
    title: "Complete Living Room Set",
    subtitle: "Curated Room Configurations",
    aspectRatio: 1.79,
    heroImage: {
      src: "/src/assets/products/complete-set/complete-set-hero-01.jpg",
      width: 2752,
      height: 1536,
      alt: "Complete Set - Clean Hero (No Watermark)"
    },
    gallery: [
      {
        src: "/src/assets/products/complete-set/complete-set-gallery-01.jpg",
        width: 2752,
        height: 1536,
        alt: "Complete Set - Classic Configuration"
      },
      {
        src: "/src/assets/products/complete-set/complete-set-gallery-02.jpg",
        width: 2752,
        height: 1536,
        alt: "Complete Set - Coastal Modern"
      },
      {
        src: "/src/assets/products/complete-set/complete-set-gallery-03.jpg",
        width: 2752,
        height: 1536,
        alt: "Complete Set - Family Modern"
      },
      {
        src: "/src/assets/products/complete-set/complete-set-gallery-04.jpg",
        width: 2752,
        height: 1536,
        alt: "Complete Set - Modern Fireplace"
      },
      {
        src: "/src/assets/products/complete-set/complete-set-gallery-05.jpg",
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
