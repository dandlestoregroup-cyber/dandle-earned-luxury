export interface Product {
  id: string;
  name: string;
  tagline: string;
  threeWordTruth: string; // Brand Bible: 3-word truth in ALL CAPS with period
  tier: 'gateway' | 'core' | 'prestige';
  priceManual?: number;
  pricePower?: number;
  price?: number;
  maxDiscount: number; // Max consumer discount percentage
  colors: string[];
  features: string[];
  targetAudience: string;
  imageUrl: string;
  comingSoon?: boolean;
}

export const products: Product[] = [
  // GATEWAY TIER - Max 15% discount
  {
    id: "relaxmax",
    name: "Dandle RelaxMax",
    tagline: "Your Daily Sanctuary",
    threeWordTruth: "EASY EVERYDAY COMFORT",
    tier: 'gateway',
    priceManual: 21900,
    pricePower: 28900,
    maxDiscount: 15,
    colors: ["Nile Sapphire Blue", "Alexandria Linen", "Desert Grey", "Coastal Fog Grey", "Amber Sand"],
    features: [
      "170° Zero-Gravity Recline",
      "Smart Storage Compartments",
      "Integrated USB Charging Port",
      "Premium Leather Upholstery",
    ],
    targetAudience: "High-performing professionals",
    imageUrl: "/images/relaxmax-hero-offwhite.jpg",
  },
  {
    id: "spacesaver",
    name: "Dandle SpaceSaver",
    tagline: "Big Comfort, Small Footprint",
    threeWordTruth: "SMART SPACE COMFORT",
    tier: 'gateway',
    priceManual: 24000,
    pricePower: 29000,
    maxDiscount: 15,
    colors: ["Desert Grey", "Blue Nile Denim", "Oasis Green", "Alexandria Linen"],
    features: [
      "Compact Design",
      "Wall-Hugger Technology",
      "Space-Efficient Recline",
      "Modern Aesthetics",
    ],
    targetAudience: "Urban dwellers with small spaces",
    imageUrl: "/images/spacesaver-offwhite-reclined.jpg",
  },
  {
    id: "easyup-compact",
    name: "Dandle EasyUp Compact",
    tagline: "Gentle Lift, Compact Design",
    threeWordTruth: "DIGNITY IN SMALL SPACES",
    tier: 'gateway',
    price: 28000,
    maxDiscount: 15,
    colors: ["Desert Grey", "Coastal Fog Grey", "Mocha Taupe"],
    features: [
      "Power Lift Mechanism",
      "Compact Design for Small Spaces",
      "Zero-Gravity Positioning",
      "Enhanced Safety Features",
    ],
    targetAudience: "Seniors and mobility assistance in smaller spaces",
    imageUrl: "/images/easyup-compact-charcoal-front.jpg",
  },
  // CORE TIER - Max 10% discount
  {
    id: "worknest",
    name: "Dandle WorkNest",
    tagline: "Work Better, Feel Better",
    threeWordTruth: "PRACTICAL DAILY COMFORT",
    tier: 'core',
    priceManual: 32000,
    pricePower: 38000,
    maxDiscount: 10,
    colors: ["Coastal Fog Grey", "Mocha Taupe", "Desert Sage", "Blue Nile Denim"],
    features: [
      "Integrated Work Table",
      "Wireless Charging Pad",
      "Zero-Gravity Recline",
      "Laptop Storage",
    ],
    targetAudience: "Remote workers and executives",
    imageUrl: "https://picsum.photos/400/300?random=tech",
  },
  {
    id: "easyup",
    name: "Dandle EasyUp Power",
    tagline: "Sit Easy, Stand Easier",
    threeWordTruth: "DIGNIFIED EFFORTLESS RISE",
    tier: 'core',
    price: 35000,
    maxDiscount: 10,
    colors: ["Alexandria Linen", "Desert Grey", "Sandstorm Ochre", "Amber Sand"],
    features: [
      "Power Lift Mechanism",
      "Zero-Gravity Positioning",
      "Enhanced Safety Features",
      "Easy-Clean Fabric",
    ],
    targetAudience: "Seniors and mobility assistance",
    imageUrl: "/images/easyup-beige-front.jpg",
  },
  {
    id: "comfortplus",
    name: "Dandle ComfortPlus Power",
    tagline: "Feel Better Every Day",
    threeWordTruth: "INDULGENT DEEP RELAXATION",
    tier: 'core',
    priceManual: 32000,
    pricePower: 38000,
    maxDiscount: 10,
    colors: ["Nile Mist Terracotta", "Amber Sand", "Mocha Taupe", "Clay Pottery"],
    features: [
      "8-Point Rolling Massage System",
      "Heating Elements (Back & Legs)",
      "Zero-Gravity Positioning",
      "Memory Foam Cushioning",
    ],
    targetAudience: "Wellness enthusiasts seeking therapy",
    imageUrl: "/images/relaxmax-brown-lifestyle.jpg",
  },
  // PRESTIGE TIER - NO discount (0%)
  {
    id: "cozycompanion",
    name: "Dandle CozyCompanion",
    tagline: "Comfort for Two",
    threeWordTruth: "GRAVITATIONAL HOME ANCHOR",
    tier: 'prestige',
    priceManual: 42000,
    pricePower: 48000,
    maxDiscount: 0,
    colors: ["Nile Sapphire Blue", "Mocha Taupe", "Blue Nile Denim", "Coastal Fog Grey"],
    features: [
      "Duo Seating Design",
      "Independent Reclining Controls",
      "Dual Storage Consoles",
      "Center Console with Storage",
    ],
    targetAudience: "Couples and families",
    imageUrl: "/images/cozycompanion-beige-front.jpg",
  },
  {
    id: "diva",
    name: "Dandle Diva",
    tagline: "Where Style Meets Comfort",
    threeWordTruth: "EXPRESSIVE HIGH-TOUCH COMFORT",
    tier: 'prestige',
    priceManual: 48000,
    pricePower: 54000,
    maxDiscount: 0,
    colors: ["Nile Mist Terracotta", "Papyrus Stripe", "Giza Gold Weave", "Oasis Green", "Clay Pottery"],
    features: [
      "360° Swivel Base",
      "Zero-Gravity Recline",
      "Integrated Cupholder",
      "Bold Color Options",
    ],
    targetAudience: "Design-conscious taste makers",
    imageUrl: "/images/diva-red-front.jpg",
  },
  {
    id: "complete-set",
    name: "Dandle Complete Sets",
    tagline: "Comfort for the Whole Family",
    threeWordTruth: "WHOLE-ROOM COMFORT SYSTEM",
    tier: 'prestige',
    priceManual: 65000,
    pricePower: 95000,
    maxDiscount: 0,
    colors: ["Coordinated Styles"],
    features: [
      "3-Piece Living Room Set",
      "Matching Design Language",
      "Premium Package Deal",
      "Full Home Comfort Solution",
    ],
    targetAudience: "Families seeking complete home solutions",
    imageUrl: "https://picsum.photos/400/300?random=set",
  },
];
