const PRODUCTS = [
  { id: "relaxmax", name: "Dandle RelaxMax", price: 21900, outcome: "everyday relaxation", audience: ["relax", "daily", "راحة", "استرخاء"], facts: ["170° zero-gravity recline", "storage compartments", "USB charging"] },
  { id: "spacesaver", name: "Dandle SpaceSaver", price: 24000, outcome: "full comfort in a compact room", audience: ["small", "compact", "apartment", "مساحة", "صغير"], facts: ["compact footprint", "wall-hugger mechanism", "space-efficient recline"] },
  { id: "easyup-compact", name: "Dandle EasyUp Compact", price: 28000, outcome: "easier standing in a smaller space", audience: ["stand", "mobility", "senior", "والد", "والدة", "كبير", "حركة"], facts: ["power lift", "compact format", "zero-gravity positioning"] },
  { id: "worknest", name: "Dandle WorkNest", price: 32000, outcome: "comfortable focused work", audience: ["work", "laptop", "office", "شغل", "مكتب"], facts: ["integrated work table", "wireless charging", "laptop storage"] },
  { id: "easyup", name: "Dandle EasyUp Power", price: 35000, outcome: "a dignified, easier rise", audience: ["stand", "mobility", "senior", "والد", "والدة", "كبير", "حركة"], facts: ["power lift", "zero-gravity positioning", "easy-clean fabric"] },
  { id: "comfortplus", name: "Dandle ComfortPlus Power", price: 32000, outcome: "deep daily relaxation", audience: ["massage", "heat", "wellness", "مساج", "تدفئة", "استرخاء"], facts: ["8-point rolling massage", "back and leg heating", "memory-foam cushioning"] },
  { id: "cozycompanion", name: "Dandle CozyCompanion", price: 42000, outcome: "shared comfort for two", audience: ["couple", "two", "زوج", "اتنين", "عائلة"], facts: ["two seats", "independent recline controls", "centre storage console"] },
  { id: "diva", name: "Dandle Diva", price: 48000, outcome: "expressive statement comfort", audience: ["style", "design", "statement", "ستايل", "ديكور"], facts: ["360° swivel base", "zero-gravity recline", "bold colour options"] },
  { id: "complete-set", name: "Dandle Complete Sets", price: 65000, outcome: "coordinated whole-room comfort", audience: ["family", "set", "room", "عائلة", "طقم", "غرفة"], facts: ["three-piece living-room set", "coordinated design", "manual and power options"] },
];

const money = (value) => new Intl.NumberFormat("en-EG").format(value);
const isArabic = (text) => /[\u0600-\u06ff]/.test(text);

function score(product, text) {
  const normalized = text.toLowerCase();
  return product.audience.reduce((total, word) => total + (normalized.includes(word) ? 3 : 0), 0)
    + (normalized.includes(product.id) || normalized.includes(product.name.toLowerCase().replace("dandle ", "")) ? 6 : 0);
}

export function createNourReply({ message = "", journey = {}, source = {} } = {}) {
  const text = String(message).slice(0, 1600);
  const ar = isArabic(text);
  const ranked = PRODUCTS.map((product) => ({ ...product, score: score(product, text) }))
    .sort((a, b) => b.score - a.score || a.price - b.price);
  const hasSignal = ranked[0].score > 0;
  const recommendations = (hasSignal ? ranked.slice(0, 2) : PRODUCTS.slice(0, 3)).map(({ score: _score, ...product }) => ({
    ...product,
    priceLabel: `From EGP ${money(product.price)}`,
    productUrl: `/products/${product.id}`,
  }));

  const asksPrice = /price|cost|كام|سعر/.test(text.toLowerCase());
  const asksHuman = /whatsapp|human|sales|واتساب|حد يكلمني|مندوب/.test(text.toLowerCase());
  const reply = asksHuman
    ? (ar ? "تمام. جهزت لك ملخص واضح تكمل به مع فريق داندل على واتساب بدون ما تعيد الكلام." : "Done. I prepared a concise handoff so you can continue with Dandle on WhatsApp without repeating yourself.")
    : hasSignal
      ? (ar
        ? `أقرب اختيار لاحتياجك هو ${recommendations[0].name}. ${asksPrice ? `السعر المعروض يبدأ من ${recommendations[0].priceLabel.replace("From ", "")}. ` : ""}شوفه أولاً، ولو الاختيار بينه وبين البديل مهم أقارنهم لك ببساطة.`
        : `${recommendations[0].name} is the closest match to what you described. ${asksPrice ? `The displayed price starts at ${recommendations[0].priceLabel.replace("From ", "")}. ` : ""}Open it first; I can then compare it with the alternative if that distinction matters.`)
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
    nextBestAction: asksHuman ? "CLOSE" : hasSignal ? "SHOW" : "ASK",
    memoryPatch: { appendActions: [event], lastNeed: text, source },
    verifiedAt: new Date().toISOString(),
    commercialSource: "DANDLE server catalogue",
  };
}

export { PRODUCTS };
