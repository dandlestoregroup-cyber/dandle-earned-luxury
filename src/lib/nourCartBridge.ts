import type { Product } from "@/types/product";
import { getNourProduct, type Mechanism } from "@/lib/nourCatalog";

// Build a Product-shaped object from the approved Nour catalogue, using the
// S005 prices as truth. The default colour is "As Shown" because Nour does not
// invent colours; the customer can adjust on the product page.
export function buildNourProductForCart(productId: string): Product | null {
  const p = getNourProduct(productId);
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    tagline: "",
    threeWordTruth: "",
    tier: "core",
    priceManual: p.priceManual,
    pricePower: p.pricePower,
    price: p.priceManual ?? p.pricePower,
    maxDiscount: 0,
    colors: ["As Shown"],
    features: [],
    targetAudience: "",
    imageUrl: p.image,
  };
}

export interface NourCartSelection {
  productId: string;
  mechanism: Mechanism;
  massage: boolean;
}
