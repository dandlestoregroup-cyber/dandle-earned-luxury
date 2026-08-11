type ProductPrice = { manual?: number; power?: number; fixed?: number };

export const SERVER_PRICES: Record<string, ProductPrice> = {
  relaxmax: { manual: 21900, power: 28900 },
  spacesaver: { manual: 24000, power: 29000 },
  "easyup-compact": { fixed: 28000 },
  worknest: { manual: 32000, power: 38000 },
  easyup: { fixed: 35000 },
  comfortplus: { manual: 32000, power: 38000 },
  cozycompanion: { manual: 42000, power: 48000 },
  diva: { manual: 48000, power: 54000 },
  "complete-set": { manual: 65000, power: 95000 },
};

const MASSAGE_ADDON_EGP = 9000;
const MASSAGE_ELIGIBLE = new Set(["relaxmax", "worknest", "spacesaver"]);

export function getVerifiedUnitPrice(productId: string, mechanism: string, massageFeature: boolean) {
  const price = SERVER_PRICES[productId];
  if (!price) throw new Error(`Unknown product ${productId}`);
  const base = price.fixed ?? (mechanism === "power" ? price.power : price.manual);
  if (!base) throw new Error(`Unsupported mechanism for ${productId}`);
  if (massageFeature && !MASSAGE_ELIGIBLE.has(productId)) {
    throw new Error(`Massage add-on is not available for ${productId}`);
  }
  return base + (massageFeature ? MASSAGE_ADDON_EGP : 0);
}
