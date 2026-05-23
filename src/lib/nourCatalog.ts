// S005 approved catalogue — single source of product truth for Nour recommendations.
// These prices and add-on eligibility rules are authoritative for the Nour chat flow
// and override anything else the model might invent. Do not edit without updating
// the matching constants in supabase/functions/nour-recommend/index.ts.

export type Mechanism = "manual" | "power";

export interface NourProduct {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  priceManual?: number;
  pricePower?: number;
  massageAddOnEligible: boolean;
  builtInMassage: boolean;
  tags: string[];
}

export const MASSAGE_ADDON_PRICE = 9000;

export const NOUR_CATALOG: NourProduct[] = [
  {
    id: "relaxmax",
    name: "Dandle RelaxMax",
    nameAr: "دانديل ريلاكس ماكس",
    image: "/images/relaxmax-hero-offwhite.jpg",
    priceManual: 21900,
    pricePower: 28900,
    massageAddOnEligible: false,
    builtInMassage: false,
    tags: ["everyday", "neutral", "calm", "modern"],
  },
  {
    id: "diva",
    name: "Dandle Diva",
    nameAr: "دانديل ديڤا",
    image: "/images/diva-red-front.jpg",
    priceManual: 23900,
    pricePower: 30900,
    massageAddOnEligible: true,
    builtInMassage: false,
    tags: ["statement", "bold", "design", "expressive"],
  },
  {
    id: "comfortplus",
    name: "Dandle ComfortPlus",
    nameAr: "دانديل كومفورت بلس",
    image: "/images/comfortplus-tan-front.webp",
    priceManual: 29900,
    pricePower: 36900,
    massageAddOnEligible: false,
    builtInMassage: true,
    tags: ["wellness", "warm", "premium"],
  },
  {
    id: "cozycompanion",
    name: "Dandle CozyCompanion",
    nameAr: "دانديل كوزي كومبانيون",
    image: "/images/cozycompanion-beige-front.jpg",
    priceManual: 42000,
    pricePower: 54000,
    massageAddOnEligible: true,
    builtInMassage: false,
    tags: ["family", "loveseat", "shared", "large"],
  },
  {
    id: "easyup",
    name: "Dandle EasyUp Standard",
    nameAr: "دانديل إيزي أب ستاندرد",
    image: "/images/easyup-standard-grey-front.webp",
    pricePower: 42900,
    massageAddOnEligible: true,
    builtInMassage: false,
    tags: ["lift", "mobility", "support"],
  },
  {
    id: "easyup-compact",
    name: "Dandle EasyUp Compact",
    nameAr: "دانديل إيزي أب كومباكت",
    image: "/images/easyup-compact-grey-front.webp",
    pricePower: 46900,
    massageAddOnEligible: false,
    builtInMassage: false,
    tags: ["lift", "compact", "small-space", "mobility"],
  },
  {
    id: "worknest",
    name: "Dandle WorkNest",
    nameAr: "دانديل وورك نيست",
    image: "/images/worknest-blue-front.webp",
    priceManual: 26900,
    pricePower: 33900,
    massageAddOnEligible: false,
    builtInMassage: false,
    tags: ["work", "desk", "office", "productivity"],
  },
  {
    id: "spacesaver",
    name: "Dandle SpaceSaver",
    nameAr: "دانديل سبيس سيڤر",
    image: "/images/spacesaver-red-front.webp",
    priceManual: 24900,
    pricePower: 29900,
    massageAddOnEligible: false,
    builtInMassage: false,
    tags: ["small-space", "wall-hugger", "compact", "urban"],
  },
  {
    id: "complete-set",
    name: "Dandle Complete Set",
    nameAr: "دانديل كومبليت سيت",
    image: "/images/complete-set-classic.jpg",
    priceManual: 62900,
    pricePower: 90900,
    massageAddOnEligible: false,
    builtInMassage: false,
    tags: ["whole-room", "family", "matched", "premium"],
  },
];

export const TRUST_LINES = {
  delivery_en: "Delivery in 14 days nationwide",
  delivery_ar: "التسليم خلال 14 يوم في جميع المحافظات",
  warranty_en: "2-year warranty",
  warranty_ar: "ضمان سنتين",
};

export function getNourProduct(id: string): NourProduct | undefined {
  return NOUR_CATALOG.find((p) => p.id === id);
}

export function priceFor(p: NourProduct, mech: Mechanism): number | undefined {
  return mech === "power" ? p.pricePower : p.priceManual;
}

// Returns the cheapest valid mechanism if the requested one is unavailable.
export function resolveMechanism(p: NourProduct, requested?: Mechanism): Mechanism {
  if (requested && priceFor(p, requested) != null) return requested;
  if (p.priceManual != null) return "manual";
  return "power";
}

export function isMassageAddOnAllowed(p: NourProduct): boolean {
  return p.massageAddOnEligible && !p.builtInMassage;
}
