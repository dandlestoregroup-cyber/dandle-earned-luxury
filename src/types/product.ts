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
    tagline: "Your daily sanctuary",
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
    imageUrl: "/images/dandle-relaxmax-flagship.webp",
  },
  {
    id: "comfortplus",
    name: "Dandle ComfortPlus",
    tagline: "Indulgent deep relaxation",
    priceManual: 29900,
    pricePower: 36900,
    colors: ["Chic Red", "Tan Beige"],
    features: [
      "8-Point Rolling Massage System",
      "Heating Elements (Back & Legs)",
      "Zero-Gravity Positioning",
      "Memory Foam Cushioning",
    ],
    targetAudience: "Wellness enthusiasts seeking therapy",
    imageUrl: "/images/dandle-comfortplus.jpg",
  },
  {
    id: "diva",
    name: "Dandle Diva",
    tagline: "Where style meets comfort",
    priceManual: 23900,
    pricePower: 30900,
    colors: ["Chic Red", "Pink Rose", "Sunshine Yellow"],
    features: [
      "360° Swivel Base",
      "Zero-Gravity Recline",
      "Integrated Cupholder",
      "Bold Color Options",
    ],
    targetAudience: "Design-conscious taste makers",
    imageUrl: "/images/dandle-diva.jpg",
  },
  {
    id: "cozycompanion",
    name: "Dandle CozyCompanion",
    tagline: "Comfort for two",
    priceManual: 42000,
    pricePower: 54000,
    colors: ["Ocean Blue", "Warm Grey"],
    features: [
      "Duo Seating Design",
      "Independent Reclining Controls",
      "Dual Storage Consoles",
      "Center Console with Storage",
    ],
    targetAudience: "Couples and families",
    imageUrl: "/images/dandle-cozycompanion-hero.webp",
  },
  {
    id: "easyup",
    name: "Dandle EasyUp",
    tagline: "Sit easy, stand easier",
    price: 42900,
    colors: ["Creamy Beige", "Urban Charcoal"],
    features: [
      "Power Lift Mechanism",
      "Zero-Gravity Positioning",
      "Enhanced Safety Features",
      "Easy-Clean Fabric",
    ],
    targetAudience: "Seniors and mobility assistance",
    imageUrl: "/images/dandle-easyup-standard.jpg",
  },
  {
    id: "easyup-compact",
    name: "Dandle EasyUp Compact",
    tagline: "Sit easy, stand easier",
    price: 46900,
    colors: ["Urban Charcoal"],
    features: [
      "Power Lift Mechanism",
      "Compact Design for Small Spaces",
      "Zero-Gravity Positioning",
      "Enhanced Safety Features",
    ],
    targetAudience: "Seniors and mobility assistance in smaller spaces",
    imageUrl: "/images/dandle-easyup-compact.jpg",
  },
  {
    id: "worknest",
    name: "Dandle WorkNest",
    tagline: "Flow-first performance",
    priceManual: 26900,
    pricePower: 33900,
    colors: ["Slate Grey", "Espresso Brown"],
    features: [
      "Integrated Work Table",
      "Wireless Charging Pad",
      "Zero-Gravity Recline",
      "Laptop Storage",
    ],
    targetAudience: "Remote workers and executives",
    imageUrl: "/images/dandle-worknest.jpg",
    comingSoon: true,
  },
  {
    id: "spacesaver",
    name: "Dandle SpaceSaver",
    tagline: "Big comfort, small footprint",
    priceManual: 24900,
    pricePower: 29900,
    colors: ["Stone Grey", "Navy Blue"],
    features: [
      "Compact Design",
      "Wall-Hugger Technology",
      "Space-Efficient Recline",
      "Modern Aesthetics",
    ],
    targetAudience: "Urban dwellers with small spaces",
    imageUrl: "/images/dandle-spacesaver.jpg",
    comingSoon: true,
  },
  {
    id: "complete-set",
    name: "Dandle Complete Set",
    tagline: "Comfort for the whole family",
    priceManual: 62900,
    pricePower: 90900,
    colors: ["Coordinated Styles"],
    features: [
      "3-Piece Living Room Set",
      "Matching Design Language",
      "Premium Package Deal",
      "Full Home Comfort Solution",
    ],
    targetAudience: "Families seeking complete home solutions",
    imageUrl: "/images/dandle-heritage-set.jpg",
  },
];
