/** Product identity references inherited from the approved render allowlist.
 * Appearance is not proof of stock or a swatch SKU. Additional finishes require
 * a reviewed real photograph mapped to the exact product.
 */
export const visualizationProducts = [
  { id: "relaxmax", name: "RelaxMax", finishes: [{ id: "reference", label: "Brown · as photographed", image: "/images/relaxmax-brown-lifestyle.jpg" }] },
  { id: "easyup", name: "EasyUp Standard", finishes: [{ id: "reference", label: "Beige · as photographed", image: "/images/easyup-beige-front.jpg" }] },
  { id: "easyup-compact", name: "EasyUp Compact", finishes: [{ id: "reference", label: "Charcoal · as photographed", image: "/images/easyup-compact-charcoal-front.jpg" }] },
  { id: "spacesaver", name: "SpaceSaver", finishes: [{ id: "reference", label: "Off-white · as photographed", image: "/images/spacesaver-offwhite-reclined.jpg" }] },
  { id: "diva", name: "Diva", finishes: [{ id: "reference", label: "Red · as photographed", image: "/images/diva-red-front.jpg" }] },
  { id: "cozycompanion", name: "CozyCompanion", finishes: [{ id: "reference", label: "Beige · as photographed", image: "/images/cozycompanion-beige-front.jpg" }] },
] as const;

export function findVisualizationProduct(id: unknown) {
  return visualizationProducts.find((product) => product.id === id);
}

export const visualizationNotice = "AI appearance preview. Confirm the finish, dimensions, recline clearance, price and availability with Dandle before ordering.";
