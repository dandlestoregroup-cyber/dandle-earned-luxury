export type BaseType = "fixed" | "swivel" | "swivel360";

export interface CartOptions {
  baseType: BaseType;
  giftWrap: boolean;
  engraving: boolean;
  cupHolder: boolean;
  usbPort: boolean;
  sidePocket: boolean;
  massageFeature: boolean;
  specialNotes: string;
}

export const DEFAULT_CART_OPTIONS: CartOptions = {
  baseType: "fixed",
  giftWrap: false,
  engraving: false,
  cupHolder: false,
  usbPort: false,
  sidePocket: false,
  massageFeature: false,
  specialNotes: "",
};

export const CART_OPTION_PRICES_EGP = {
  swivel: 1_200,
  swivel360: 2_500,
  giftWrap: 1_500,
  engraving: 3_000,
  cupHolder: 450,
  usbPort: 750,
  sidePocket: 350,
  massageFeature: 9_000,
} as const;

export function normalizeCartOptions(value?: Partial<CartOptions> | null): CartOptions {
  const baseType: BaseType =
    value?.baseType === "swivel" || value?.baseType === "swivel360" ? value.baseType : "fixed";
  return {
    baseType,
    giftWrap: value?.giftWrap === true,
    engraving: value?.engraving === true,
    cupHolder: value?.cupHolder === true,
    usbPort: value?.usbPort === true,
    sidePocket: value?.sidePocket === true,
    massageFeature: value?.massageFeature === true,
    specialNotes: typeof value?.specialNotes === "string" ? value.specialNotes.trim().slice(0, 800) : "",
  };
}

export function getCartOptionSurcharge(optionsInput?: Partial<CartOptions> | null) {
  const options = normalizeCartOptions(optionsInput);
  let total = 0;
  if (options.baseType === "swivel") total += CART_OPTION_PRICES_EGP.swivel;
  if (options.baseType === "swivel360") total += CART_OPTION_PRICES_EGP.swivel360;
  if (options.giftWrap) total += CART_OPTION_PRICES_EGP.giftWrap;
  if (options.engraving) total += CART_OPTION_PRICES_EGP.engraving;
  if (options.cupHolder) total += CART_OPTION_PRICES_EGP.cupHolder;
  if (options.usbPort) total += CART_OPTION_PRICES_EGP.usbPort;
  if (options.sidePocket) total += CART_OPTION_PRICES_EGP.sidePocket;
  if (options.massageFeature) total += CART_OPTION_PRICES_EGP.massageFeature;
  return total;
}

export function cartConfigurationKey(
  productId: string,
  color: string,
  mechanism: "power" | "manual",
  optionsInput?: Partial<CartOptions> | null,
) {
  const options = normalizeCartOptions(optionsInput);
  return [
    productId,
    color,
    mechanism,
    options.baseType,
    options.giftWrap ? "gw" : "",
    options.engraving ? "eng" : "",
    options.cupHolder ? "cup" : "",
    options.usbPort ? "usb" : "",
    options.sidePocket ? "pkt" : "",
    options.massageFeature ? "msg" : "",
    options.specialNotes,
  ].join("|");
}

export function selectedOptionLabels(optionsInput?: Partial<CartOptions> | null) {
  const options = normalizeCartOptions(optionsInput);
  const labels: string[] = [];
  if (options.baseType === "swivel") labels.push("Swivel Base (+1,200 EGP)");
  if (options.baseType === "swivel360") labels.push("Swivel + 360° Rotation (+2,500 EGP)");
  if (options.giftWrap) labels.push("Premium Gift Wrapping (+1,500 EGP)");
  if (options.engraving) labels.push("Legacy Plaque (+3,000 EGP)");
  if (options.cupHolder) labels.push("Cup Holders (+450 EGP)");
  if (options.usbPort) labels.push("USB Charging Ports (+750 EGP)");
  if (options.sidePocket) labels.push("Side Pocket (+350 EGP)");
  if (options.massageFeature) labels.push("Massage Feature (+9,000 EGP)");
  return labels;
}
