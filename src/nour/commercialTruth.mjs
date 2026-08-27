/**
 * Nour is an appearance and placement adviser, not a source of commercial truth.
 *
 * Dandle's verified figures — price, dimensions, wall clearance, production and
 * delivery time, stock, massage pricing — live in the Base44 production
 * catalogue. Nour has no runtime access to it, so she must not state any of
 * them: a remembered number is indistinguishable from a verified one to the
 * customer, and the numbers previously hard-coded around this codebase were
 * wrong by as much as forty percent.
 *
 * A system prompt is guidance, not a control. This module is the deterministic
 * backstop applied to what the model actually produced. It fails closed: any
 * suspected commercial claim replaces the whole reply rather than being edited
 * out, because a half-scrubbed answer reads as authoritative too.
 */

const ARABIC_DIGITS = /[٠-٩۰-۹]/g;

/** Normalizes Arabic-Indic digits and separators so one set of patterns covers both scripts. */
function normalize(text) {
  return String(text)
    .replace(ARABIC_DIGITS, (digit) => String(digit.charCodeAt(0) & 0xf))
    .replace(/٫|٬|،/g, ",");
}

const COMMERCIAL_PATTERNS = [
  // Currency, either order: "28,500 EGP", "EGP 28500", "جنيه ٢٨٥٠٠".
  /\d[\d,.\s]*\s*(?:egp|le\b|l\.e\b|pounds?|جنيه|ج\.?م)/i,
  /(?:egp|le\b|l\.e\b|جنيه|ج\.?م)\s*\d/i,
  // Bare figures in Dandle's price range, and any thousands-separated number.
  /\b\d{1,3},\d{3}\b/,
  /\b\d{5,}\b/,
  // Physical measurements Nour must never read off a photo.
  /\d\s*(?:cm|mm|centimet|millimet|inch|inches|سم|مم|متر)/i,
  // Production and delivery promises. Split by script: JS word boundaries are
  // ASCII-based, so \b never matches at the end of an Arabic word.
  /\d\s*(?:days?|weeks?|months?)\b/i,
  /\d\s*(?:يوم|أيام|اسبوع|أسبوع|أسابيع|شهر|شهور)/,
  // Discounts and scarcity.
  /(?:discount|%\s*off|\bsale\b|special offer|خصم|تخفيض|عرض خاص)/i,
  // Availability and stock claims.
  /(?:in stock|out of stock|available now|last (?:one|piece)|متوفر|مخزون|آخر قطعة)/i,
];

/**
 * True when the text appears to state a commercial fact Nour is not allowed to own.
 * @param {string} text
 * @returns {boolean}
 */
export function containsCommercialClaim(text) {
  if (!text) return false;
  const normalized = normalize(text);
  return COMMERCIAL_PATTERNS.some((pattern) => pattern.test(normalized));
}

export const COMMERCIAL_DEFLECTION_EN =
  "I can help you picture how a Dandle looks and sits in your room, but I don't give prices, measurements or delivery times — those come from the Dandle team so you get the confirmed figure rather than my guess. Tell me the model and where you'd like it, and I'll carry on from there.";

export const COMMERCIAL_DEFLECTION_AR =
  "أقدر أساعدك تتخيل شكل كرسي دانديل ومكانه في أوضتك، لكن مش بأقول أسعار ولا مقاسات ولا مواعيد تسليم — دي بتيجي من فريق دانديل عشان توصلك الأرقام المؤكدة مش تقديري. قولي الموديل والمكان اللي تحبه وأنا أكمل معاك.";

const ARABIC_SCRIPT = /[؀-ۿ]/;

/**
 * Returns the reply when it is safe, or the deflection when it is not.
 * @param {string} reply the model's generated text
 * @param {string} [customerText] used only to answer in the customer's language
 * @returns {{ reply: string, deflected: boolean }}
 */
export function enforceAdviserOnly(reply, customerText = "") {
  const text = typeof reply === "string" ? reply.trim() : "";
  if (!text) return { reply: "", deflected: false };
  if (!containsCommercialClaim(text)) return { reply: text, deflected: false };

  const arabic = ARABIC_SCRIPT.test(customerText) || ARABIC_SCRIPT.test(text);
  return { reply: arabic ? COMMERCIAL_DEFLECTION_AR : COMMERCIAL_DEFLECTION_EN, deflected: true };
}
