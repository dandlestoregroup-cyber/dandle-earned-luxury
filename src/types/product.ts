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
    imageUrl: "/images/relaxmax-hero-offwhite.jpg",
  },
  {
    id: "comfortplus",
    name: "Dandle ComfortPlus",
    tagline: "The Therapeutic Upgrade",
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
    imageUrl: "https://picsum.photos/400/300?random=chair2",
  },
  {
    id: "diva",
    name: "Dandle Diva",
    tagline: "The Statement of Style",
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
    imageUrl: "https://picsum.photos/400/300?random=chair3",
  },
  {
    id: "cozycompanion",
    name: "Dandle CozyCompanion",
    tagline: "The Anchor of Connection",
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
    imageUrl: "/images/cozycompanion-yellow-front.jpg",
  },
  {
    id: "easyup",
    name: "Dandle EasyUp",
    tagline: "The Empowerment Tool",
    price: 42900,
    colors: ["Creamy Beige", "Urban Charcoal"],
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
    id: "easyup-compact",
    name: "Dandle EasyUp Compact",
    tagline: "The Compact Empowerment Tool",
    price: 46900,
    colors: ["Urban Charcoal"],
    features: [
      "Power Lift Mechanism",
      "Compact Design for Small Spaces",
      "Zero-Gravity Positioning",
      "Enhanced Safety Features",
    ],
    targetAudience: "Seniors and mobility assistance in smaller spaces",
    imageUrl: "/images/easyup-compact-charcoal-front.jpg",
  },
  {
    id: "worknest",
    name: "Dandle WorkNest",
    tagline: "The Productivity Haven",
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
    imageUrl: "https://picsum.photos/400/300?random=tech",
  },
  {
    id: "spacesaver",
    name: "Dandle SpaceSaver",
    tagline: "The Smart Solution",
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
    imageUrl: "https://picsum.photos/400/300?random=compact",
  },
  {
    id: "complete-set",
    name: "Dandle Complete Set",
    tagline: "The Ultimate Collection",
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
    imageUrl: "https://picsum.photos/400/300?random=set",
  },
];
