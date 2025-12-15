// Rich Product Details - Extends base catalog with commerce data

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductFeature {
  icon: string;
  text: string;
}

export interface ProductDimensions {
  width: string;
  depth: string;
  height: string;
  reclined?: string;
  seatHeight?: string;
  weightCapacity: string;
}

export interface ProductSpecs {
  frame: string;
  cushion: string;
  upholstery: string;
  mechanism: string;
  weightCapacity: string;
}

export interface ProductReview {
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
}

export interface ProductDetail {
  handle: string;
  name: string;
  subtitle: string;
  basePrice: number;
  powerUpgrade: number;
  currency: string;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  features: ProductFeature[];
  dimensions: ProductDimensions;
  specs: ProductSpecs;
  reviews: ProductReview[];
  warrantyYears: number;
  leadTimeWeeks: string;
  relatedProducts: string[];
}

export const productDetails: Record<string, ProductDetail> = {
  diva: {
    handle: "diva",
    name: "Diva Recliner",
    subtitle: "Statement Luxury Seating",
    basePrice: 23900,
    powerUpgrade: 7000,
    currency: "EGP",
    rating: 4.8,
    reviewCount: 12,
    colors: [
      { name: "Ruby Red", hex: "#C41E3A", image: "/images/diva-red-card.jpg" },
      { name: "Pink Rose", hex: "#E8A0B0", image: "/images/diva-pink-lifestyle.jpg" },
      { name: "Sunshine Yellow", hex: "#F4D03F", image: "/images/diva-yellow-lifestyle.jpg" },
    ],
    features: [
      { icon: "✨", text: "Italian-inspired ergonomic design" },
      { icon: "🔄", text: "360° swivel base for flexibility" },
      { icon: "⚙️", text: "Smooth zero-gravity recline" },
      { icon: "🎨", text: "20+ customization options" },
      { icon: "🏆", text: "Built for lifelong comfort" },
    ],
    dimensions: {
      width: "90cm",
      depth: "95cm",
      height: "105cm",
      reclined: "160cm",
      seatHeight: "48cm",
      weightCapacity: "150kg",
    },
    specs: {
      frame: "Hardwood & steel reinforcement",
      cushion: "High-density foam (35kg/m³)",
      upholstery: "Genuine leather or premium microfiber",
      mechanism: "Manual lever or power recline",
      weightCapacity: "150kg",
    },
    reviews: [
      {
        name: "Ahmed M.",
        city: "Zamalek, Cairo",
        rating: 5,
        text: "After 15 years of hard work, I finally treated myself to the Diva. Best decision ever. The leather is buttery soft, and it's the perfect spot for my evening coffee.",
        date: "2024-11-10",
      },
      {
        name: "Mariam S.",
        city: "Alexandria",
        rating: 5,
        text: "Bought this for my husband's home office. He says it's better than his hospital chair! Quality is exceptional.",
        date: "2024-10-22",
      },
      {
        name: "Omar F.",
        city: "New Cairo",
        rating: 4,
        text: "The swivel feature is a game-changer. Great for watching TV from different angles. Delivery team was professional.",
        date: "2024-09-15",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "4-6",
    relatedProducts: ["relaxmax", "comfortplus", "worknest"],
  },
  relaxmax: {
    handle: "relaxmax",
    name: "RelaxMax Recliner",
    subtitle: "Ultimate Comfort Engineering",
    basePrice: 21900,
    powerUpgrade: 7000,
    currency: "EGP",
    rating: 4.9,
    reviewCount: 24,
    colors: [
      { name: "Off White", hex: "#FAF5F0", image: "/images/relaxmax-offwhite-card.jpg" },
      { name: "Urban Charcoal", hex: "#36454F" },
      { name: "Elephant Grey", hex: "#9E9E9E" },
    ],
    features: [
      { icon: "🌟", text: "170° zero-gravity recline position" },
      { icon: "🔌", text: "Integrated USB charging port" },
      { icon: "📦", text: "Smart storage compartments" },
      { icon: "🛋️", text: "Premium leather upholstery" },
      { icon: "💆", text: "Lumbar support system" },
    ],
    dimensions: {
      width: "85cm",
      depth: "90cm",
      height: "102cm",
      reclined: "165cm",
      seatHeight: "46cm",
      weightCapacity: "150kg",
    },
    specs: {
      frame: "Kiln-dried hardwood frame",
      cushion: "High-resilience foam (38kg/m³)",
      upholstery: "Top-grain leather or microfiber",
      mechanism: "Manual or motorized recline",
      weightCapacity: "150kg",
    },
    reviews: [
      {
        name: "Karim H.",
        city: "Maadi, Cairo",
        rating: 5,
        text: "The zero-gravity position is incredible for my back pain. Worth every piaster. USB port is surprisingly useful.",
        date: "2024-11-28",
      },
      {
        name: "Nadia T.",
        city: "6th October City",
        rating: 5,
        text: "We bought two for our living room. The quality difference from our old recliners is night and day.",
        date: "2024-11-05",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "4-6",
    relatedProducts: ["diva", "comfortplus", "spacesaver"],
  },
  cozycompanion: {
    handle: "cozycompanion",
    name: "CozyCompanion Loveseat",
    subtitle: "Two-Seater Power Recliner",
    basePrice: 42000,
    powerUpgrade: 12000,
    currency: "EGP",
    rating: 4.7,
    reviewCount: 8,
    colors: [
      { name: "Warm Beige", hex: "#D4B896", image: "/images/cozycompanion-beige-card.jpg" },
      { name: "Ocean Blue", hex: "#4A90A4" },
      { name: "Warm Grey", hex: "#8B8589" },
    ],
    features: [
      { icon: "👥", text: "Duo seating for couples" },
      { icon: "🎮", text: "Independent reclining controls" },
      { icon: "📦", text: "Dual storage consoles" },
      { icon: "🥤", text: "Center console with cupholders" },
      { icon: "💑", text: "Perfect for movie nights" },
    ],
    dimensions: {
      width: "160cm",
      depth: "95cm",
      height: "105cm",
      reclined: "170cm",
      seatHeight: "48cm",
      weightCapacity: "300kg (150kg per seat)",
    },
    specs: {
      frame: "Steel-reinforced hardwood",
      cushion: "Dual-layer memory foam",
      upholstery: "Stain-resistant fabric or leather",
      mechanism: "Dual manual or dual power",
      weightCapacity: "300kg total",
    },
    reviews: [
      {
        name: "Hassan & Dina K.",
        city: "Heliopolis, Cairo",
        rating: 5,
        text: "Finally, a loveseat where we can both recline independently! The center console is perfect for our TV remotes.",
        date: "2024-10-30",
      },
      {
        name: "Laila M.",
        city: "Hurghada",
        rating: 5,
        text: "Delivery to Hurghada was seamless. The team assembled everything perfectly. Best furniture purchase we've made.",
        date: "2024-09-20",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "5-7",
    relatedProducts: ["complete-set", "diva", "relaxmax"],
  },
  worknest: {
    handle: "worknest",
    name: "WorkNest Recliner",
    subtitle: "Executive Productivity Chair",
    basePrice: 26900,
    powerUpgrade: 7000,
    currency: "EGP",
    rating: 4.8,
    reviewCount: 15,
    colors: [
      { name: "Slate Blue", hex: "#6A7B8B", image: "/images/worknest-blue-card.jpg" },
      { name: "Espresso Brown", hex: "#3C2415", image: "/images/worknest-brown-office.jpg" },
      { name: "Slate Grey", hex: "#708090" },
    ],
    features: [
      { icon: "💻", text: "Integrated swivel work table" },
      { icon: "🔋", text: "Wireless charging pad built-in" },
      { icon: "📱", text: "Device holder & cable management" },
      { icon: "💼", text: "Laptop storage compartment" },
      { icon: "⚡", text: "USB-A & USB-C ports" },
    ],
    dimensions: {
      width: "88cm",
      depth: "92cm",
      height: "108cm",
      reclined: "165cm",
      seatHeight: "50cm",
      weightCapacity: "150kg",
    },
    specs: {
      frame: "Reinforced steel & hardwood",
      cushion: "Ergonomic memory foam",
      upholstery: "Breathable leather or fabric",
      mechanism: "Manual or electric recline",
      weightCapacity: "150kg",
    },
    reviews: [
      {
        name: "Dr. Youssef A.",
        city: "Dokki, Cairo",
        rating: 5,
        text: "As a remote consultant, I spend 10+ hours in this chair. The work table is genius - no more laptop on my lap!",
        date: "2024-11-15",
      },
      {
        name: "Sara E.",
        city: "Nasr City",
        rating: 5,
        text: "The wireless charging is so convenient. I work, recline for calls, and my phone stays charged. Perfect WFH setup.",
        date: "2024-10-08",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "4-6",
    relatedProducts: ["relaxmax", "diva", "spacesaver"],
  },
  spacesaver: {
    handle: "spacesaver",
    name: "SpaceSaver Recliner",
    subtitle: "Wall-Hugger Technology",
    basePrice: 24900,
    powerUpgrade: 5000,
    currency: "EGP",
    rating: 4.6,
    reviewCount: 11,
    colors: [
      { name: "Chic Red", hex: "#B22222", image: "/images/spacesaver-red-card.jpg" },
      { name: "Off White", hex: "#F5F5F0", image: "/images/spacesaver-offwhite-reclined.jpg" },
      { name: "Stone Grey", hex: "#928E85" },
    ],
    features: [
      { icon: "📐", text: "Wall-hugger technology (10cm clearance)" },
      { icon: "🏠", text: "Perfect for apartments" },
      { icon: "✨", text: "Full recline in tight spaces" },
      { icon: "🎯", text: "Space-efficient design" },
      { icon: "🛋️", text: "Modern aesthetic" },
    ],
    dimensions: {
      width: "80cm",
      depth: "85cm",
      height: "100cm",
      reclined: "155cm",
      seatHeight: "45cm",
      weightCapacity: "140kg",
    },
    specs: {
      frame: "Compact hardwood frame",
      cushion: "High-density foam",
      upholstery: "Microfiber or faux leather",
      mechanism: "Wall-hugger manual or power",
      weightCapacity: "140kg",
    },
    reviews: [
      {
        name: "Mona R.",
        city: "Mohandessin, Cairo",
        rating: 5,
        text: "My apartment is tiny but I can finally have a recliner! Only needs 10cm from the wall. Amazing engineering.",
        date: "2024-11-01",
      },
      {
        name: "Tarek B.",
        city: "Smouha, Alexandria",
        rating: 4,
        text: "Great space-saving design. Slightly smaller seat than expected, but perfect for my home office corner.",
        date: "2024-09-25",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "4-6",
    relatedProducts: ["relaxmax", "worknest", "diva"],
  },
  comfortplus: {
    handle: "comfortplus",
    name: "ComfortPlus Recliner",
    subtitle: "Enhanced Ergonomic Design",
    basePrice: 29900,
    powerUpgrade: 7000,
    currency: "EGP",
    rating: 4.9,
    reviewCount: 19,
    colors: [
      { name: "Tan Beige", hex: "#D2B48C", image: "/images/comfortplus-tan-card.jpg" },
      { name: "Chic Red", hex: "#CD5C5C", image: "/images/comfortplus-red-spa.jpg" },
      { name: "Charcoal", hex: "#36454F" },
    ],
    features: [
      { icon: "💆", text: "8-point rolling massage system" },
      { icon: "🔥", text: "Heating elements (back & lumbar)" },
      { icon: "🌟", text: "Zero-gravity positioning" },
      { icon: "🧠", text: "Memory foam cushioning" },
      { icon: "🎛️", text: "Customizable massage zones" },
    ],
    dimensions: {
      width: "88cm",
      depth: "95cm",
      height: "108cm",
      reclined: "170cm",
      seatHeight: "48cm",
      weightCapacity: "150kg",
    },
    specs: {
      frame: "Reinforced hardwood",
      cushion: "Memory foam with gel layer",
      upholstery: "Premium leather or fabric",
      mechanism: "Manual or power with massage",
      weightCapacity: "150kg",
    },
    reviews: [
      {
        name: "Dr. Amira S.",
        city: "Garden City, Cairo",
        rating: 5,
        text: "The massage feature is therapeutic-grade. As a physician, I appreciate the lumbar support. Highly recommend for anyone with back issues.",
        date: "2024-11-20",
      },
      {
        name: "Mahmoud H.",
        city: "Mansoura",
        rating: 5,
        text: "The heat function during winter is heavenly. This isn't furniture, it's wellness equipment.",
        date: "2024-10-15",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "4-6",
    relatedProducts: ["relaxmax", "diva", "easyup"],
  },
  easyup: {
    handle: "easyup",
    name: "EasyUp Lift Recliner",
    subtitle: "Power Lift Assistance",
    basePrice: 42900,
    powerUpgrade: 0,
    currency: "EGP",
    rating: 4.8,
    reviewCount: 16,
    colors: [
      { name: "Warm Grey", hex: "#9E9E9E", image: "/images/easyup-grey-card.jpg" },
      { name: "Creamy Beige", hex: "#F5DEB3", image: "/images/easyup-beige-front.jpg" },
      { name: "Urban Charcoal", hex: "#36454F" },
    ],
    features: [
      { icon: "⬆️", text: "Smooth power lift mechanism" },
      { icon: "🛡️", text: "Enhanced safety features" },
      { icon: "🎯", text: "Zero-gravity positioning" },
      { icon: "🧼", text: "Easy-clean fabric" },
      { icon: "🔋", text: "Battery backup for power outages" },
    ],
    dimensions: {
      width: "85cm",
      depth: "95cm",
      height: "110cm",
      reclined: "175cm",
      seatHeight: "52cm",
      weightCapacity: "160kg",
    },
    specs: {
      frame: "Heavy-duty steel reinforced",
      cushion: "Extra-firm support foam",
      upholstery: "Stain-resistant microfiber",
      mechanism: "Power lift with recline",
      weightCapacity: "160kg",
    },
    reviews: [
      {
        name: "Fatma A.",
        city: "Heliopolis, Cairo",
        rating: 5,
        text: "Bought for my father after his knee surgery. The lift function has given him independence back. Worth every penny.",
        date: "2024-11-12",
      },
      {
        name: "Mohamed G.",
        city: "Aswan",
        rating: 5,
        text: "The delivery team was respectful and patient explaining everything to my elderly mother. Excellent service.",
        date: "2024-10-28",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "4-6",
    relatedProducts: ["easyup-compact", "comfortplus", "relaxmax"],
  },
  "easyup-compact": {
    handle: "easyup-compact",
    name: "EasyUp Compact Lift Recliner",
    subtitle: "Compact Power Lift",
    basePrice: 46900,
    powerUpgrade: 0,
    currency: "EGP",
    rating: 4.7,
    reviewCount: 9,
    colors: [
      { name: "Warm Grey", hex: "#808080", image: "/images/easyup-compact-grey-card.jpg" },
      { name: "Urban Charcoal", hex: "#36454F", image: "/images/easyup-compact-charcoal-front.png" },
    ],
    features: [
      { icon: "📐", text: "Compact design for smaller spaces" },
      { icon: "⬆️", text: "Powerful lift mechanism" },
      { icon: "🛡️", text: "Anti-tip safety system" },
      { icon: "🔌", text: "Simple one-button control" },
      { icon: "🧹", text: "Easy-clean surfaces" },
    ],
    dimensions: {
      width: "78cm",
      depth: "88cm",
      height: "105cm",
      reclined: "160cm",
      seatHeight: "50cm",
      weightCapacity: "140kg",
    },
    specs: {
      frame: "Steel-reinforced compact frame",
      cushion: "Supportive high-density foam",
      upholstery: "Medical-grade microfiber",
      mechanism: "Compact power lift",
      weightCapacity: "140kg",
    },
    reviews: [
      {
        name: "Samira M.",
        city: "Sharm El Sheikh",
        rating: 5,
        text: "Perfect size for my mother's bedroom. She can get in and out safely now. The compact design fits perfectly.",
        date: "2024-10-20",
      },
      {
        name: "Hesham T.",
        city: "Tanta",
        rating: 4,
        text: "Great lift chair for smaller people. My aunt (155cm) finds it perfect. The charcoal color hides wear well.",
        date: "2024-09-18",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "4-6",
    relatedProducts: ["easyup", "spacesaver", "relaxmax"],
  },
  "complete-set": {
    handle: "complete-set",
    name: "Complete Living Room Set",
    subtitle: "Curated Room Configurations",
    basePrice: 62900,
    powerUpgrade: 28000,
    currency: "EGP",
    rating: 4.9,
    reviewCount: 6,
    colors: [
      { name: "Classic Collection", hex: "#8B7355", image: "/images/complete-set-classic.jpg" },
      { name: "Coastal Modern", hex: "#87CEEB", image: "/images/complete-set-coastal-modern.jpg" },
      { name: "Modern Fireplace", hex: "#2F4F4F", image: "/images/complete-set-modern-fireplace.jpg" },
    ],
    features: [
      { icon: "🏠", text: "3-piece curated living room set" },
      { icon: "🎨", text: "Coordinated design language" },
      { icon: "💰", text: "Premium package pricing" },
      { icon: "🛋️", text: "Mix & match configurations" },
      { icon: "✨", text: "Complete home comfort solution" },
    ],
    dimensions: {
      width: "Varies by config",
      depth: "Varies by config",
      height: "Varies by config",
      weightCapacity: "Varies by config",
    },
    specs: {
      frame: "Matching hardwood frames",
      cushion: "Coordinated foam densities",
      upholstery: "Matching fabric/leather",
      mechanism: "Choice of manual or power",
      weightCapacity: "Varies by piece",
    },
    reviews: [
      {
        name: "The El-Sayed Family",
        city: "Rehab City, Cairo",
        rating: 5,
        text: "Transformed our entire living room. The coordinated look is stunning. Guests always compliment our furniture now.",
        date: "2024-11-25",
      },
      {
        name: "Amr & Rania K.",
        city: "Sheikh Zayed",
        rating: 5,
        text: "The package deal saved us significant money compared to buying separately. Design consultation was invaluable.",
        date: "2024-10-10",
      },
    ],
    warrantyYears: 2,
    leadTimeWeeks: "6-8",
    relatedProducts: ["relaxmax", "diva", "cozycompanion"],
  },
};

export function getProductDetail(handle: string): ProductDetail | null {
  return productDetails[handle] || null;
}

export function formatEGP(amount: number): string {
  return `EGP ${amount.toLocaleString('en-EG')}`;
}
