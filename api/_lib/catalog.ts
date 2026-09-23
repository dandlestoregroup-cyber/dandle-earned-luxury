type ProductPrice = { manual?: number; power?: number; fixed?: number };

// Compatibility pricing for the legacy /api/order-intent path.
// Keep this mirror aligned with the canonical NOUR catalogue and the
// server-controlled commerce offer prices; never trust browser-supplied prices.
export const SERVER_PRICES: Record<string, ProductPrice> = {
  "grand-relaxmax": { fixed: 32100 },
  relaxmax: { manual: 21900, power: 28900 },
  spacesaver: { manual: 24900, power: 29900 },
  "easyup-compact": { fixed: 46900 },
  worknest: { manual: 26900, power: 33900 },
  easyup: { fixed: 42900 },
  comfortplus: { manual: 29900, power: 36900 },
  cozycompanion: { manual: 42000, power: 54000 },
  diva: { manual: 23900, power: 30900 },
  "complete-set": { manual: 62900, power: 90900 },
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
