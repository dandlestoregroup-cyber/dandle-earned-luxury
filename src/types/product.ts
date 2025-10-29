export interface Product {
  id: string;
  name: string;
  tagline: string;
  priceManual?: number;
  pricePower?: number;
  price?: number;
  colors: string[];
  features: string[];
  targetAudience: string;
  imageUrl: string;
  comingSoon?: boolean;
}

export const products: Product[] = [
  {
    id: "relaxmax",
    name: "Dandle RelaxMax",
    tagline: "The Wellness Sanctuary",
    priceManual: 21900,
    pricePower: 28900,
    colors: ["Urban Charcoal", "Off White", "Elephant Grey"],
    features: [
      "170° Zero-Gravity Recline",
      "Smart Storage Compartments",
      "Integrated USB Charging Port",
      "Premium Leather Upholstery",
    ],
    targetAudience: "High-performing professionals",
    imageUrl: "/src/assets/relaxmax-hero-offwhite.jpg",
  },
  {
    id: "comfortplus",
    name: "Dandle ComfortPlus",
    tagline: "The Therapeutic Upgrade",
    price: 41724,
    colors: ["Chic Red", "Tan Beige"],
    features: [
      "8-Point Rolling Massage System",
      "Heating Elements (Back & Legs)",
      "Zero-Gravity Positioning",
      "Memory Foam Cushioning",
    ],
    targetAudience: "Wellness enthusiasts seeking therapy",
    imageUrl: "https://picsum.photos/400/300?random=chair2",
  },
  {
    id: "diva",
    name: "Dandle Diva",
    tagline: "The Statement of Style",
    priceManual: 35000,
    pricePower: 37763,
    colors: ["Chic Red", "Pink Rose", "Sunshine Yellow"],
    features: [
      "360° Swivel Base",
      "Zero-Gravity Recline",
      "Integrated Cupholder",
      "Bold Color Options",
    ],
    targetAudience: "Design-conscious taste makers",
    imageUrl: "https://picsum.photos/400/300?random=chair3",
  },
  {
    id: "cozycompanion",
    name: "Dandle CozyCompanion",
    tagline: "The Anchor of Connection",
    priceManual: 58000,
    pricePower: 62690,
    colors: ["Ocean Blue", "Warm Grey"],
    features: [
      "Duo Seating Design",
      "Independent Reclining Controls",
      "Dual Storage Consoles",
      "Center Console with Storage",
    ],
    targetAudience: "Couples and families",
    imageUrl: "https://picsum.photos/400/300?random=chair4",
  },
  {
    id: "easyup",
    name: "Dandle EasyUp",
    tagline: "The Empowerment Tool",
    price: 40375,
    colors: ["Creamy Beige"],
    features: [
      "Power Lift Mechanism",
      "Zero-Gravity Positioning",
      "Enhanced Safety Features",
      "Easy-Clean Fabric",
    ],
    targetAudience: "Seniors and mobility assistance",
    imageUrl: "https://picsum.photos/400/300?random=chair5",
  },
  {
    id: "worknest",
    name: "Dandle WorkNest",
    tagline: "COMING SOON",
    price: 50160,
    colors: ["Coming Soon"],
    features: [
      "Integrated Work Table",
      "Wireless Charging Pad",
      "Zero-Gravity Recline",
      "Laptop Storage",
    ],
    targetAudience: "Remote workers and executives",
    imageUrl: "https://picsum.photos/400/300?random=tech",
    comingSoon: true,
  },
  {
    id: "spacesaver",
    name: "Dandle SpaceSaver",
    tagline: "COMING SOON",
    price: 37050,
    colors: ["Coming Soon"],
    features: [
      "Compact Design",
      "Wall-Hugger Technology",
      "Space-Efficient Recline",
      "Modern Aesthetics",
    ],
    targetAudience: "Urban dwellers with small spaces",
    imageUrl: "https://picsum.photos/400/300?random=compact",
    comingSoon: true,
  },
];
