export type Mechanism = "manual" | "power";
export type BaseType = "fixed" | "swivel" | "swivel360";

export type CheckoutLineInput = {
  productId?: unknown;
  model?: unknown;
  color?: unknown;
  mechanism?: unknown;
  quantity?: unknown;
  options?: unknown;
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

export type ResolvedCheckoutOptions = {
  baseType: BaseType;
  giftWrap: boolean;
  engraving: boolean;
  cupHolder: boolean;
  usbPort: boolean;
  sidePocket: boolean;
  massageFeature: boolean;
  specialNotes: string;
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
    colors: ALL_FABRICS,
  },
};

export const SERVER_PRICES = Object.fromEntries(
  Object.entries(SERVER_CATALOG).map(([id, product]) => [id, { ...product.prices }]),
);

export const OPTION_PRICES_EGP = {
  swivel: 1_200,
  swivel360: 2_500,
  giftWrap: 1_500,
  engraving: 3_000,
  cupHolder: 450,
  usbPort: 750,
  sidePocket: 350,
  massageFeature: 9_000,
} as const;

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

function readOptionsRecord(value: unknown) {
  if (value === undefined) return {} as Record<string, unknown>;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid Dandle configuration options");
  }
  return value as Record<string, unknown>;
}

function readBooleanOption(raw: Record<string, unknown>, key: string) {
  if (!(key in raw)) return false;
  if (typeof raw[key] !== "boolean") throw new Error(`Invalid ${key} option`);
  return raw[key] === true;
}

const DEFAULT_OPTIONS: ResolvedCheckoutOptions = {
  baseType: "fixed",
  giftWrap: false,
  engraving: false,
  cupHolder: false,
  usbPort: false,
  sidePocket: false,
  massageFeature: false,
  specialNotes: "",
};

export function resolveCheckoutOptions(input: CheckoutLineInput, product: ProductDefinition): ResolvedCheckoutOptions {
  const raw = readOptionsRecord(input.options);
  const rawBase = raw.baseType === undefined ? "fixed" : clean(raw.baseType, 20).toLowerCase();
  if (rawBase !== "fixed" && rawBase !== "swivel" && rawBase !== "swivel360") {
    throw new Error("Invalid baseType option");
  }
  if (raw.specialNotes !== undefined && typeof raw.specialNotes !== "string") {
    throw new Error("Invalid specialNotes option");
  }
  const massageFeature = input.options === undefined
    ? input.massageFeature === true
    : readBooleanOption(raw, "massageFeature");
  if (input.options === undefined && input.massageFeature !== undefined && typeof input.massageFeature !== "boolean") {
    throw new Error("Invalid massageFeature option");
  }
  if (massageFeature && !product.massageEligible) {
    throw new Error("Massage add-on is not available for selected Dandle model");
  }
  return {
    baseType: rawBase,
    giftWrap: readBooleanOption(raw, "giftWrap"),
    engraving: readBooleanOption(raw, "engraving"),
    cupHolder: readBooleanOption(raw, "cupHolder"),
    usbPort: readBooleanOption(raw, "usbPort"),
    sidePocket: readBooleanOption(raw, "sidePocket"),
    massageFeature,
    specialNotes: clean(raw.specialNotes, 800),
  };
}

export function optionSurcharge(options: ResolvedCheckoutOptions) {
  let total = 0;
  if (options.baseType === "swivel") total += OPTION_PRICES_EGP.swivel;
  if (options.baseType === "swivel360") total += OPTION_PRICES_EGP.swivel360;
  if (options.giftWrap) total += OPTION_PRICES_EGP.giftWrap;
  if (options.engraving) total += OPTION_PRICES_EGP.engraving;
  if (options.cupHolder) total += OPTION_PRICES_EGP.cupHolder;
  if (options.usbPort) total += OPTION_PRICES_EGP.usbPort;
  if (options.sidePocket) total += OPTION_PRICES_EGP.sidePocket;
  if (options.massageFeature) total += OPTION_PRICES_EGP.massageFeature;
  return roundMoney(total);
}

function optionSkuSuffix(options: ResolvedCheckoutOptions) {
  const suffixes: string[] = [];
  if (options.baseType === "swivel") suffixes.push("SWV");
  if (options.baseType === "swivel360") suffixes.push("SWV360");
  if (options.giftWrap) suffixes.push("GW");
  if (options.engraving) suffixes.push("ENG");
  if (options.cupHolder) suffixes.push("CUP");
  if (options.usbPort) suffixes.push("USB");
  if (options.sidePocket) suffixes.push("PKT");
  if (options.massageFeature) suffixes.push("MSG");
  return suffixes.length ? `-${suffixes.join("-")}` : "";
}

export function buildAuthoritativeSku(
  productId: string,
  color: string,
  mechanism: Mechanism,
  optionsOrMassage: ResolvedCheckoutOptions | boolean = false,
) {
  const colorName = color.includes(" (") ? color.slice(0, color.indexOf(" (")) : color;
  const options = typeof optionsOrMassage === "boolean"
    ? { ...DEFAULT_OPTIONS, massageFeature: optionsOrMassage }
    : optionsOrMassage;
  return `DND-${slug(productId)}-${slug(colorName)}-${mechanism.toUpperCase()}${optionSkuSuffix(options)}`;
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
  return roundMoney(product.prices[mechanism] + (massageFeature ? OPTION_PRICES_EGP.massageFeature : 0));
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

  const color = resolveColor(product, input.color);
  const options = resolveCheckoutOptions(input, product);
  const baseUnitPrice = roundMoney(product.prices[mechanism]);
  const optionTotal = optionSurcharge(options);
  const unitPrice = roundMoney(baseUnitPrice + optionTotal);
  const sku = buildAuthoritativeSku(productId, color, mechanism, options);
  const suppliedSku = clean(input.sku, 160).toUpperCase();
  if (suppliedSku && suppliedSku !== sku) {
    throw new Error("SKU does not match authoritative Dandle configuration");
  }

  return {
    sku,
    productId,
    model: product.title,
    color,
    imageUrl: product.imageUrl,
    mechanism: mechanism as Mechanism,
    quantity: quantityNumber,
    options,
    baseUnitPrice,
    optionSurcharge: optionTotal,
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
  const shipping = 0;
  const discount = 0;
  const total = roundMoney(subtotal + shipping - discount);
  if (total <= 0) throw new Error("Invalid order total");
  return { lines, subtotal, shipping, discount, total, currency: "EGP" as const };
}
