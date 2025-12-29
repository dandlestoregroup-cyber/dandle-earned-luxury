export interface ProductSpecifications {
  dimensions: {
    length: number; // cm
    width: number; // cm
    height: number; // cm
    seatHeight: number; // cm
  };
  weightCapacity: number; // kg
  productWeight: number; // kg
  recliningAngles: string; // e.g., "90° - 180°"
  frameMaterial: string;
  cushionFill: string;
  mechanism: 'manual' | 'power' | 'power-lift' | 'both';
  assemblyRequired: boolean;
  warranty: {
    frame: string; // e.g., "5 years"
    fabric: string; // e.g., "2 years"
    mechanism: string; // e.g., "3 years"
  };
  careInstructions: string[];
}

export interface Product {
  id: string;
  name: string;
  nameAr: string; // Arabic transliterated name
  tagline: string;
  taglineAr: string; // Arabic translated tagline
  threeWordTruth: string; // Brand Bible: 3-word truth in ALL CAPS with period
  tier: 'gateway' | 'core' | 'prestige';
  priceManual?: number;
  pricePower?: number;
  price?: number;
  maxDiscount: number; // Max consumer discount percentage
  colors: string[];
  features: string[];
  featuresAr?: string[]; // Arabic translated features
  targetAudience: string;
  imageUrl: string;
  comingSoon?: boolean;
  specifications?: ProductSpecifications;
  hasAR?: boolean; // Whether AR model is available
  arModelSrc?: string; // Path to .glb file
  arIosSrc?: string; // Path to .usdz file for iOS
}

export const products: Product[] = [
  // GATEWAY TIER - Max 15% discount
  {
    id: "relaxmax",
    name: "Dandle RelaxMax",
    nameAr: "داندل ريلاكس ماكس",
    tagline: "The Wellness Sanctuary",
    taglineAr: "ملاذ العافية",
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
    featuresAr: [
      "إمالة صفر الجاذبية ١٧٠ درجة",
      "حجرات تخزين ذكية",
      "منفذ USB مدمج للشحن",
      "تنجيد جلد فاخر",
    ],
    targetAudience: "High-performing professionals",
    imageUrl: "/images/relaxmax-hero-offwhite.jpg",
    hasAR: true,
    specifications: {
      dimensions: { length: 95, width: 85, height: 105, seatHeight: 48 },
      weightCapacity: 150,
      productWeight: 45,
      recliningAngles: "90° - 170°",
      frameMaterial: "Steel reinforced hardwood",
      cushionFill: "High-density foam with memory foam top layer",
      mechanism: 'both',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Wipe with damp cloth",
        "Avoid direct sunlight",
        "Professional cleaning recommended annually",
      ],
    },
  },
  {
    id: "spacesaver",
    name: "Dandle SpaceSaver",
    nameAr: "داندل سبيس سيفر",
    tagline: "The Smart Solution",
    taglineAr: "الحل الذكي",
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
    featuresAr: [
      "تصميم مدمج",
      "تقنية ملاصقة الجدار",
      "إمالة موفرة للمساحة",
      "جمالية عصرية",
    ],
    targetAudience: "Urban dwellers with small spaces",
    imageUrl: "/images/spacesaver-offwhite-reclined.jpg",
    specifications: {
      dimensions: { length: 85, width: 75, height: 100, seatHeight: 46 },
      weightCapacity: 130,
      productWeight: 38,
      recliningAngles: "90° - 160°",
      frameMaterial: "Steel frame with engineered wood",
      cushionFill: "High-resilience foam",
      mechanism: 'both',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Vacuum regularly",
        "Spot clean with mild soap",
        "Keep away from heat sources",
      ],
    },
  },
  {
    id: "easyup-compact",
    name: "Dandle EasyUp Compact",
    nameAr: "داندل إيزي أب كومباكت",
    tagline: "The Compact Empowerment Tool",
    taglineAr: "أداة التمكين المدمجة",
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
    featuresAr: [
      "آلية رفع كهربائية",
      "تصميم مدمج للمساحات الصغيرة",
      "وضعية صفر الجاذبية",
      "ميزات أمان محسنة",
    ],
    targetAudience: "Seniors and mobility assistance in smaller spaces",
    imageUrl: "/images/easyup-compact-charcoal-front.jpg",
    specifications: {
      dimensions: { length: 80, width: 70, height: 98, seatHeight: 50 },
      weightCapacity: 140,
      productWeight: 42,
      recliningAngles: "90° - 180° with lift",
      frameMaterial: "Heavy-duty steel",
      cushionFill: "Therapeutic foam with lumbar support",
      mechanism: 'power-lift',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Clean with soft damp cloth",
        "Check lift mechanism monthly",
        "Keep remote in designated holder",
      ],
    },
  },
  // CORE TIER - Max 10% discount
  {
    id: "worknest",
    name: "Dandle WorkNest",
    nameAr: "داندل وورك نيست",
    tagline: "The Productivity Haven",
    taglineAr: "ملاذ الإنتاجية",
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
    featuresAr: [
      "طاولة عمل مدمجة",
      "لوحة شحن لاسلكي",
      "إمالة صفر الجاذبية",
      "تخزين لابتوب",
    ],
    targetAudience: "Remote workers and executives",
    imageUrl: "/images/worknest-blue-front.webp",
    specifications: {
      dimensions: { length: 100, width: 90, height: 110, seatHeight: 48 },
      weightCapacity: 150,
      productWeight: 52,
      recliningAngles: "90° - 165°",
      frameMaterial: "Premium steel with wood accents",
      cushionFill: "Ergonomic memory foam",
      mechanism: 'both',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Dust table surface regularly",
        "Clean wireless charger with dry cloth",
        "Condition leather quarterly",
      ],
    },
  },
  {
    id: "easyup",
    name: "Dandle EasyUp Standard",
    nameAr: "داندل إيزي أب ستاندرد",
    tagline: "The Empowerment Tool",
    taglineAr: "أداة التمكين",
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
    featuresAr: [
      "آلية رفع كهربائية",
      "وضعية صفر الجاذبية",
      "ميزات أمان محسنة",
      "قماش سهل التنظيف",
    ],
    targetAudience: "Seniors and mobility assistance",
    imageUrl: "/images/easyup-beige-front.jpg",
    specifications: {
      dimensions: { length: 90, width: 80, height: 105, seatHeight: 52 },
      weightCapacity: 160,
      productWeight: 48,
      recliningAngles: "90° - 180° with lift",
      frameMaterial: "Reinforced steel frame",
      cushionFill: "Orthopedic foam with gel layer",
      mechanism: 'power-lift',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Wipe spills immediately",
        "Test safety features monthly",
        "Battery backup check quarterly",
      ],
    },
  },
  {
    id: "comfortplus",
    name: "Dandle ComfortPlus",
    nameAr: "داندل كومفورت بلس",
    tagline: "The Therapeutic Upgrade",
    taglineAr: "الترقية العلاجية",
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
    featuresAr: [
      "نظام تدليك دوار ٨ نقاط",
      "عناصر تسخين (الظهر والساقين)",
      "وضعية صفر الجاذبية",
      "وسائد إسفنج ذاكرة",
    ],
    targetAudience: "Wellness enthusiasts seeking therapy",
    imageUrl: "/images/comfortplus-tan-front.webp",
    specifications: {
      dimensions: { length: 95, width: 85, height: 108, seatHeight: 48 },
      weightCapacity: 150,
      productWeight: 55,
      recliningAngles: "90° - 175°",
      frameMaterial: "Steel with acoustic dampening",
      cushionFill: "Multi-layer memory foam with heating elements",
      mechanism: 'both',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Do not use heating with wet fabric",
        "Massage system service annually",
        "Use surge protector for power",
      ],
    },
  },
  // PRESTIGE TIER - NO discount (0%)
  {
    id: "cozycompanion",
    name: "Dandle CozyCompanion",
    nameAr: "داندل كوزي كومبانيون",
    tagline: "The Anchor of Connection",
    taglineAr: "مرساة التواصل",
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
    featuresAr: [
      "تصميم مقعدين",
      "تحكم إمالة مستقل",
      "وحدات تخزين مزدوجة",
      "كونسول مركزي مع تخزين",
    ],
    targetAudience: "Couples and families",
    imageUrl: "/images/cozycompanion-beige-front.jpg",
    specifications: {
      dimensions: { length: 160, width: 90, height: 105, seatHeight: 48 },
      weightCapacity: 300,
      productWeight: 75,
      recliningAngles: "90° - 165° (each seat)",
      frameMaterial: "Premium hardwood with steel reinforcement",
      cushionFill: "Dual-zone comfort foam",
      mechanism: 'both',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Clean each section separately",
        "Keep console area dry",
        "Professional cleaning recommended",
      ],
    },
  },
  {
    id: "diva",
    name: "Dandle Diva",
    nameAr: "داندل ديفا",
    tagline: "The Statement of Style",
    taglineAr: "بيان الأناقة",
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
    featuresAr: [
      "قاعدة دوارة ٣٦٠ درجة",
      "إمالة صفر الجاذبية",
      "حامل أكواب مدمج",
      "خيارات ألوان جريئة",
    ],
    targetAudience: "Design-conscious taste makers",
    imageUrl: "/images/diva-red-front.jpg",
    specifications: {
      dimensions: { length: 90, width: 85, height: 102, seatHeight: 45 },
      weightCapacity: 140,
      productWeight: 48,
      recliningAngles: "90° - 170°",
      frameMaterial: "Sculptural steel with chrome accents",
      cushionFill: "Premium contoured foam",
      mechanism: 'both',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Polish chrome base monthly",
        "Rotate swivel mechanism quarterly",
        "Fabric-specific cleaning only",
      ],
    },
  },
  {
    id: "complete-set",
    name: "Dandle Heritage Set",
    nameAr: "داندل هيريتدج سيت",
    tagline: "The Ultimate Collection",
    taglineAr: "المجموعة الكاملة",
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
    featuresAr: [
      "طقم غرفة معيشة ٣ قطع",
      "لغة تصميم متناسقة",
      "عرض باقة فاخرة",
      "حل راحة منزلي كامل",
    ],
    targetAudience: "Families seeking complete home solutions",
    imageUrl: "/images/complete-set-classic.jpg",
    specifications: {
      dimensions: { length: 300, width: 90, height: 105, seatHeight: 48 },
      weightCapacity: 450,
      productWeight: 150,
      recliningAngles: "90° - 170° (all pieces)",
      frameMaterial: "Matched premium materials",
      cushionFill: "Coordinated comfort foam throughout",
      mechanism: 'both',
      assemblyRequired: false,
      warranty: { frame: "5 years", fabric: "2 years", mechanism: "3 years" },
      careInstructions: [
        "Treat all pieces uniformly",
        "Professional cleaning for set",
        "Coordinate maintenance schedule",
      ],
    },
  },
];

// Helper to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

// Helper to get products by tier
export const getProductsByTier = (tier: 'gateway' | 'core' | 'prestige'): Product[] => {
  return products.filter((p) => p.tier === tier);
};
