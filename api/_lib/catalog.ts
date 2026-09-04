export type Mechanism = "manual" | "power";

export type CheckoutLineInput = {
  productId?: unknown;
  model?: unknown;
  color?: unknown;
  mechanism?: unknown;
  quantity?: unknown;
  massageFeature?: unknown;
  sku?: unknown;
};

type ColorDefinition = { name: string; fabric: string };
type ProductDefinition = {
  title: string;
  imageUrl: string;
  prices: { manual: number; power: number };
  colors: ColorDefinition[];
  massageEligible?: boolean;
};

const COLORS = {
  nileSapphireBlue: { name: "Nile Sapphire Blue", fabric: "Velvet" },
  alexandriaLinen: { name: "Alexandria Linen", fabric: "Belgian Linen" },
  desertSage: { name: "Desert Sage", fabric: "Microsuede" },
  desertGrey: { name: "Desert Grey", fabric: "Leather" },
  amberSand: { name: "Amber Sand", fabric: "Nubuck Leather" },
  mochaTaupe: { name: "Mocha Taupe", fabric: "Chenille" },
  coastalFogGrey: { name: "Coastal Fog Grey", fabric: "Chenille" },
  nileMistTerracotta: { name: "Nile Mist Terracotta", fabric: "Cotton Velvet" },
  gizaGoldWeave: { name: "Giza Gold Weave", fabric: "Woven Fabric" },
  oasisGreen: { name: "Oasis Green", fabric: "Performance Fabric" },
  blueNileDenim: { name: "Blue Nile Denim", fabric: "Recycled Denim" },
  sandstormOchre: { name: "Sandstorm Ochre", fabric: "Cotton Blend" },
  papyrusStripe: { name: "Papyrus Stripe", fabric: "Linen Blend" },
  clayPottery: { name: "Clay Pottery", fabric: "Textured Woven" },
} as const satisfies Record<string, ColorDefinition>;

const ALL_FABRICS: ColorDefinition[] = Object.values(COLORS);

export const SERVER_CATALOG: Record<string, ProductDefinition> = {
  relaxmax: {
    title: "Dandle RelaxMax",
    imageUrl: "/images/relaxmax-hero-offwhite.jpg",
    prices: { manual: 21_900, power: 28_900 },
    colors: [COLORS.nileSapphireBlue, COLORS.alexandriaLinen, COLORS.desertGrey, COLORS.coastalFogGrey, COLORS.amberSand],
    massageEligible: true,
  },
  spacesaver: {
    title: "Dandle SpaceSaver",
    imageUrl: "/images/spacesaver-offwhite-reclined.jpg",
    prices: { manual: 24_000, power: 29_000 },
    colors: [COLORS.desertGrey, COLORS.blueNileDenim, COLORS.oasisGreen, COLORS.alexandriaLinen],
    massageEligible: true,
  },
  "easyup-compact": {
    title: "Dandle EasyUp Compact",
    imageUrl: "/images/easyup-compact-charcoal-front.jpg",
    prices: { manual: 28_000, power: 28_000 },
    colors: [COLORS.desertGrey, COLORS.coastalFogGrey, COLORS.mochaTaupe],
  },
  worknest: {
    title: "Dandle WorkNest",
    imageUrl: "/images/worknest-blue-front.webp",
    prices: { manual: 32_000, power: 38_000 },
    colors: [COLORS.coastalFogGrey, COLORS.mochaTaupe, COLORS.desertSage, COLORS.blueNileDenim],
    massageEligible: true,
  },
  easyup: {
    title: "Dandle EasyUp Power",
    imageUrl: "/images/easyup-beige-front.jpg",
    prices: { manual: 35_000, power: 35_000 },
    colors: [COLORS.alexandriaLinen, COLORS.desertGrey, COLORS.sandstormOchre, COLORS.amberSand],
  },
  comfortplus: {
    title: "Dandle ComfortPlus Power",
    imageUrl: "/images/comfortplus-tan-front.webp",
    prices: { manual: 32_000, power: 38_000 },
    colors: [COLORS.nileMistTerracotta, COLORS.amberSand, COLORS.mochaTaupe, COLORS.clayPottery],
  },
  cozycompanion: {
    title: "Dandle CozyCompanion",
    imageUrl: "/images/cozycompanion-beige-front.jpg",
    prices: { manual: 42_000, power: 48_000 },
    colors: [COLORS.nileSapphireBlue, COLORS.mochaTaupe, COLORS.blueNileDenim, COLORS.coastalFogGrey],
  },
  diva: {
    title: "Dandle Diva",
    imageUrl: "/images/diva-red-front.jpg",
    prices: { manual: 48_000, power: 54_000 },
    colors: [COLORS.nileMistTerracotta, COLORS.papyrusStripe, COLORS.gizaGoldWeave, COLORS.oasisGreen, COLORS.clayPottery],
  },
  "complete-set": {
    title: "Dandle Complete Sets",
    imageUrl: "/images/complete-set-classic.jpg",
    prices: { manual: 65_000, power: 95_000 },
    // The existing Complete Set selector intentionally exposes the full fabric collection.
    colors: ALL_FABRICS,
  },
};

export const SERVER_PRICES = Object.fromEntries(
  Object.entries(SERVER_CATALOG).map(([id, product]) => [id, { ...product.prices }]),
);

const MASSAGE_ADDON_EGP = 9_000;

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const roundMoney = (value: number) => Math.round(value * 100) / 100;

function slug(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function canonicalColorLabel(color: ColorDefinition) {
  return `${color.name} (${color.fabric})`;
}

function resolveColor(product: ProductDefinition, rawColor: unknown) {
  const requested = clean(rawColor, 120);
  const match = product.colors.find(
    (color) => requested === color.name || requested === canonicalColorLabel(color),
  );
  if (!match) throw new Error("Unsupported color for selected Dandle model");
  return canonicalColorLabel(match);
}

export function buildAuthoritativeSku(
  productId: string,
  color: string,
  mechanism: Mechanism,
  massageFeature = false,
) {
  const colorName = color.includes(" (") ? color.slice(0, color.indexOf(" (")) : color;
  return `DND-${slug(productId)}-${slug(colorName)}-${mechanism.toUpperCase()}${massageFeature ? "-MSG" : ""}`;
}

export function getVerifiedUnitPrice(productId: string, mechanism: string, massageFeature: boolean) {
  const product = SERVER_CATALOG[productId];
  if (!product) throw new Error(`Unknown product ${productId}`);
  if (mechanism !== "manual" && mechanism !== "power") {
    throw new Error(`Unsupported mechanism for ${productId}`);
  }
  if (massageFeature && !product.massageEligible) {
    throw new Error(`Massage add-on is not available for ${productId}`);
  }
  return roundMoney(product.prices[mechanism] + (massageFeature ? MASSAGE_ADDON_EGP : 0));
}

export function resolveAuthoritativeLine(input: CheckoutLineInput) {
  const productId = clean(input.productId, 80).toLowerCase();
  const product = SERVER_CATALOG[productId];
  if (!product) throw new Error("Unknown Dandle product");

  const suppliedModel = clean(input.model, 160);
  if (suppliedModel && suppliedModel !== product.title) {
    throw new Error("Model does not match authoritative catalogue");
  }

  const mechanism = clean(input.mechanism, 20).toLowerCase();
  if (mechanism !== "manual" && mechanism !== "power") {
    throw new Error("Invalid mechanism");
  }

  const quantityNumber = Number(input.quantity);
  if (!Number.isInteger(quantityNumber) || quantityNumber < 1 || quantityNumber > 20) {
    throw new Error("Invalid quantity");
  }

  const massageFeature = input.massageFeature === true;
  const color = resolveColor(product, input.color);
  const unitPrice = getVerifiedUnitPrice(productId, mechanism, massageFeature);
  const sku = buildAuthoritativeSku(productId, color, mechanism, massageFeature);
  const suppliedSku = clean(input.sku, 160).toUpperCase();
  if (suppliedSku && suppliedSku !== sku) {
    throw new Error("SKU does not match authoritative Dandle variant");
  }

  return {
    sku,
    productId,
    model: product.title,
    color,
    imageUrl: product.imageUrl,
    mechanism: mechanism as Mechanism,
    quantity: quantityNumber,
    massageFeature,
    unitPrice,
    lineTotal: roundMoney(unitPrice * quantityNumber),
  };
}

export function priceAuthoritativeCart(inputs: CheckoutLineInput[]) {
  if (!Array.isArray(inputs) || inputs.length === 0 || inputs.length > 20) {
    throw new Error("Cart must contain between 1 and 20 lines");
  }
  const lines = inputs.map(resolveAuthoritativeLine);
  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  // Dandle currently has no separate checkout shipping or discount schedule.
  // Keep those rules authoritative server-side rather than accepting browser values.
  const shipping = 0;
  const discount = 0;
  const total = roundMoney(subtotal + shipping - discount);
  if (total <= 0) throw new Error("Invalid order total");
  return { lines, subtotal, shipping, discount, total, currency: "EGP" as const };
}
