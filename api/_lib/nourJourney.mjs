const PRODUCTS = [
  { id: "relaxmax", name: "Dandle RelaxMax", price: 21900, outcome: "everyday relaxation", audience: ["relax", "daily", "راحة", "استرخاء"], facts: ["170° zero-gravity recline", "storage compartments", "USB charging"] },
  { id: "spacesaver", name: "Dandle SpaceSaver", price: 24000, outcome: "full comfort in a compact room", audience: ["small", "compact", "apartment", "مساحة", "صغير"], facts: ["compact footprint", "wall-hugger mechanism", "space-efficient recline"] },
  { id: "easyup-compact", name: "Dandle EasyUp Compact", price: 28000, outcome: "easier standing in a smaller space", audience: ["stand", "standing", "mobility", "senior", "elderly", "mother", "father", "parent", "والد", "والدة", "كبير", "حركة", "وقوف"], facts: ["power lift", "compact format", "zero-gravity positioning"] },
  { id: "worknest", name: "Dandle WorkNest", price: 32000, outcome: "comfortable focused work", audience: ["work", "laptop", "office", "شغل", "مكتب"], facts: ["integrated work table", "wireless charging", "laptop storage"] },
  { id: "easyup", name: "Dandle EasyUp Power", price: 35000, outcome: "a dignified, easier rise", audience: ["stand", "standing", "mobility", "senior", "elderly", "mother", "father", "parent", "والد", "والدة", "كبير", "حركة", "وقوف"], facts: ["power lift", "zero-gravity positioning", "easy-clean fabric"] },
  { id: "comfortplus", name: "Dandle ComfortPlus Power", price: 32000, outcome: "deep daily relaxation", audience: ["massage", "heat", "wellness", "مساج", "تدفئة", "استرخاء"], facts: ["8-point rolling massage", "back and leg heating", "memory-foam cushioning"] },
  { id: "cozycompanion", name: "Dandle CozyCompanion", price: 42000, outcome: "shared comfort for two", audience: ["couple", "two", "زوج", "اتنين", "شخصين", "عائلة"], facts: ["two seats", "independent recline controls", "centre storage console"] },
  { id: "diva", name: "Dandle Diva", price: 48000, outcome: "expressive statement comfort", audience: ["style", "design", "statement", "ستايل", "ديكور"], facts: ["360° swivel base", "zero-gravity recline", "bold colour options"] },
  { id: "complete-set", name: "Dandle Complete Sets", price: 65000, outcome: "coordinated whole-room comfort", audience: ["family", "set", "room", "عائلة", "طقم", "غرفة"], facts: ["three-piece living-room set", "coordinated design", "manual and power options"] },
];

const money = (value) => new Intl.NumberFormat("en-EG").format(value);
const isArabic = (text) => /[\u0600-\u06ff]/.test(text);
const MOBILITY_TERMS = ["stand", "standing", "rise", "getting up", "mobility", "senior", "elderly", "mother", "father", "parent", "وقوف", "يقوم", "الحركة", "حركة", "والد", "والدة", "كبير السن"];
const COMPACT_TERMS = ["small", "compact", "apartment", "tight", "limited space", "مساحة", "صغير", "شقة صغيرة"];

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function score(product, text) {
  const normalized = text.toLowerCase();
  let total = product.audience.reduce((sum, word) => sum + (normalized.includes(word) ? 3 : 0), 0)
    + (normalized.includes(product.id) || normalized.includes(product.name.toLowerCase().replace("dandle ", "")) ? 6 : 0);

  const mobilityNeed = includesAny(normalized, MOBILITY_TERMS);
  const compactNeed = includesAny(normalized, COMPACT_TERMS);

  // Functional need outranks a generic room-size signal. When both are present,
  // EasyUp Compact should beat a compact-only chair because it addresses both jobs.
  if (mobilityNeed && product.id === "easyup") total += 14;
  if (mobilityNeed && product.id === "easyup-compact") total += 12;
  if (compactNeed && product.id === "spacesaver") total += 7;
  if (compactNeed && product.id === "easyup-compact") total += 8;

  return total;
}

function comparisonReply(recommendations, ar) {
  const [first, second] = recommendations;
  if (!first || !second) return null;
  if (ar) {
    return `مقارنة سريعة: ${first.name} يبدأ من EGP ${money(first.price)} — ${first.outcome}، وأبرز نقطة ${first.facts[0]}. ${second.name} يبدأ من EGP ${money(second.price)} — ${second.outcome}، وأبرز نقطة ${second.facts[0]}. بناءً على احتياجك الحالي، ${first.name} ما زال الاختيار الأول في القائمة.`;
  }
  return `Quick comparison: ${first.name} starts at EGP ${money(first.price)} — ${first.outcome}, with ${first.facts[0]}. ${second.name} starts at EGP ${money(second.price)} — ${second.outcome}, with ${second.facts[0]}. Based on the need you gave me, ${first.name} remains first on your shortlist.`;
}

export function createNourReply({ message = "", journey = {}, source = {} } = {}) {
  const text = String(message).slice(0, 1600);
  const normalized = text.toLowerCase();
  const ar = isArabic(text);
  const ranked = PRODUCTS.map((product) => ({ ...product, score: score(product, text) }))
    .sort((a, b) => b.score - a.score || a.price - b.price);
  const hasSignal = ranked[0].score > 0;
  const priorIds = Array.isArray(journey.recommendations)
    ? journey.recommendations.map((item) => item?.id).filter(Boolean)
    : [];
  const priorProducts = priorIds.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean);
  const isFollowUp = /price|cost|compare|alternative|versus|\bvs\b|difference|those|them|whatsapp|human|sales|كام|سعر|قارن|مقارنة|الفرق|بديل|دول|واتساب|حد يكلمني|مندوب/.test(normalized);
  const keepPriorContext = !hasSignal && isFollowUp && priorProducts.length > 0;
  const selected = hasSignal ? ranked.slice(0, 2) : keepPriorContext ? priorProducts.slice(0, 2) : PRODUCTS.slice(0, 3);
  const recommendations = selected.map(({ score: _score, ...product }) => ({
    ...product,
    priceLabel: `From EGP ${money(product.price)}`,
    productUrl: `/products/${product.id}`,
  }));

  const asksPrice = /price|cost|كام|سعر/.test(normalized);
  const asksCompare = /compare|alternative|versus|\bvs\b|difference|قارن|مقارنة|الفرق|بديل/.test(normalized);
  const asksHuman = /whatsapp|human|sales|واتساب|حد يكلمني|مندوب/.test(normalized);
  const comparison = asksCompare ? comparisonReply(recommendations, ar) : null;
  const reply = asksHuman
    ? (ar ? "تمام. جهزت لك ملخص واضح تكمل به مع فريق داندل على واتساب بدون ما تعيد الكلام." : "Done. I prepared a concise handoff so you can continue with Dandle on WhatsApp without repeating yourself.")
    : comparison
      ? comparison
      : (hasSignal || keepPriorContext)
        ? (ar
          ? `أقرب اختيار لاحتياجك هو ${recommendations[0].name}. ${asksPrice ? `السعر المعروض يبدأ من ${recommendations[0].priceLabel.replace("From ", "")}. ` : ""}البديل الأقرب هو ${recommendations[1]?.name || "غير متاح حالياً"}.`
          : `${recommendations[0].name} is the closest match to what you described. ${asksPrice ? `The displayed price starts at ${recommendations[0].priceLabel.replace("From ", "")}. ` : ""}${recommendations[1] ? `${recommendations[1].name} is the closest alternative.` : ""}`)
        : (ar
          ? "أقدر أرشح لك الاختيار الصح بسرعة. قل لي الاستخدام الأساسي: راحة يومية، مساحة صغيرة، شغل، مساعدة في الوقوف، أو كرسي لشخصين؟"
          : "I can narrow this quickly. What matters most: everyday relaxation, a small room, working, easier standing, or seating for two?");

  const event = {
    id: `evt_${Date.now()}`,
    type: "CAPTURE",
    channel: "web",
    message: text,
    occurredAt: new Date().toISOString(),
  };
  return {
    version: "nour-v1",
    journeyId: journey.id || `journey_${Date.now()}`,
    reply,
    recommendations,
    nextBestAction: asksHuman ? "CLOSE" : (hasSignal || keepPriorContext) ? "SHOW" : "ASK",
    memoryPatch: { appendActions: [event], lastNeed: text, source },
    verifiedAt: new Date().toISOString(),
    commercialSource: "DANDLE server catalogue",
  };
}

export { PRODUCTS };
