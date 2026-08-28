/**
 * Nour is an appearance and placement adviser, not a source of commercial truth.
 * Verified Dandle commercial facts live outside the model's runtime context.
 * Any suspected commercial claim therefore fails closed to a neutral handoff.
 */

const ARABIC_DIGITS = /[٠-٩۰-۹]/g;

function normalize(text: string): string {
  return String(text)
    .replace(ARABIC_DIGITS, (digit) => String(digit.charCodeAt(0) & 0xf))
    .replace(/٫|٬|،/g, ",");
}

const COMMERCIAL_PATTERNS: RegExp[] = [
  /\d[\d,.\s]*\s*(?:egp|le\b|l\.e\b|pounds?|جنيه|ج\.?م)/i,
  /(?:egp|le\b|l\.e\b|جنيه|ج\.?م)\s*\d/i,
  /\b\d{1,3},\d{3}\b/,
  /\b\d{5,}\b/,
  /\d\s*(?:cm|mm|centimet|millimet|inch|inches|سم|مم|متر)/i,
  /\d\s*(?:days?|weeks?|months?)\b/i,
  /\d\s*(?:يوم|أيام|اسبوع|أسبوع|أسابيع|شهر|شهور)/,
  /(?:\d\s*%|%\s*\d)/,
  /(?:instal?ment|deposit|down payment|قسط|أقساط|مقدم)/i,
  /(?:discount|%\s*off|\bsale\b|special offer|خصم|تخفيض|عرض خاص)/i,
  /(?:in stock|out of stock|available now|last (?:one|piece)|متوفر|مخزون|آخر قطعة)/i,
  /(?:warrant|ضمان)/i,
];

export function containsCommercialClaim(text: string): boolean {
  if (!text) return false;
  const normalized = normalize(text);
  return COMMERCIAL_PATTERNS.some((pattern) => pattern.test(normalized));
}

export const COMMERCIAL_DEFLECTION_EN =
  "I can help you picture how a Dandle looks and sits in your room, but I don't give prices, measurements, delivery times or commercial terms — those come from the Dandle team so you get the confirmed answer rather than my guess. Tell me the model and where you'd like it, and I'll carry on from there.";

export const COMMERCIAL_DEFLECTION_AR =
  "أقدر أساعدك تتخيل شكل كرسي داندل ومكانه في أوضتك، لكن مش بأقول أسعار ولا مقاسات ولا مواعيد تسليم ولا شروط بيع — دي بتيجي من فريق داندل عشان توصلك الإجابة المؤكدة مش تقديري. قولي الموديل والمكان اللي تحبه وأنا أكمل معاك.";

const ARABIC_SCRIPT = /[؀-ۿ]/;

export function enforceAdviserOnly(
  reply: unknown,
  customerText = "",
): { reply: string; deflected: boolean } {
  const text = typeof reply === "string" ? reply.trim() : "";
  if (!text) return { reply: "", deflected: false };
  if (!containsCommercialClaim(text)) return { reply: text, deflected: false };

  const arabic = ARABIC_SCRIPT.test(customerText) || ARABIC_SCRIPT.test(text);
  return {
    reply: arabic ? COMMERCIAL_DEFLECTION_AR : COMMERCIAL_DEFLECTION_EN,
    deflected: true,
  };
}
