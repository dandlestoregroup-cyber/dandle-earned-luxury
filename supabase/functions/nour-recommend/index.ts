// nour-recommend
// Server-side recommendation endpoint for the Nour chat flow.
//
// Input:  { roomImage?: string (data URL or https URL), roomDescription?: string,
//           lockedProductId?: string, language?: "en"|"ar" }
// Output: validated recommendation envelope (see RecResult).
//
// Behaviour:
//   - If LOVABLE_API_KEY is configured, calls the Lovable AI gateway with a strict
//     JSON-only system prompt scoped to the approved candidate set.
//   - Otherwise (or if AI output is malformed / off-catalogue), falls back to a
//     deterministic ranking over the approved catalogue using simple signals
//     from the room description / image hints.
//   - Every product_id is validated against the approved set; invented prices,
//     materials, stock, discounts, and delivery claims are stripped.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- Approved catalogue (mirrors src/lib/nourCatalog.ts) ---
type Mechanism = "manual" | "power";

interface ApprovedProduct {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  priceManual?: number;
  pricePower?: number;
  massageAddOnEligible: boolean;
  builtInMassage: boolean;
  tags: string[];
}

const MASSAGE_ADDON_PRICE = 9000;

const CATALOG: ApprovedProduct[] = [
  { id: "relaxmax", name: "Dandle RelaxMax", nameAr: "دانديل ريلاكس ماكس",
    image: "/images/relaxmax-hero-offwhite.jpg",
    priceManual: 21900, pricePower: 28900,
    massageAddOnEligible: false, builtInMassage: false,
    tags: ["everyday", "neutral", "calm", "modern"] },
  { id: "diva", name: "Dandle Diva", nameAr: "دانديل ديڤا",
    image: "/images/diva-red-front.jpg",
    priceManual: 23900, pricePower: 30900,
    massageAddOnEligible: true, builtInMassage: false,
    tags: ["statement", "bold", "design", "expressive"] },
  { id: "comfortplus", name: "Dandle ComfortPlus", nameAr: "دانديل كومفورت بلس",
    image: "/images/comfortplus-tan-front.webp",
    priceManual: 29900, pricePower: 36900,
    massageAddOnEligible: false, builtInMassage: true,
    tags: ["wellness", "warm", "premium"] },
  { id: "cozycompanion", name: "Dandle CozyCompanion", nameAr: "دانديل كوزي كومبانيون",
    image: "/images/cozycompanion-beige-front.jpg",
    priceManual: 42000, pricePower: 54000,
    massageAddOnEligible: true, builtInMassage: false,
    tags: ["family", "loveseat", "shared", "large"] },
  { id: "easyup", name: "Dandle EasyUp Standard", nameAr: "دانديل إيزي أب ستاندرد",
    image: "/images/easyup-standard-grey-front.webp",
    pricePower: 42900,
    massageAddOnEligible: true, builtInMassage: false,
    tags: ["lift", "mobility", "support"] },
  { id: "easyup-compact", name: "Dandle EasyUp Compact", nameAr: "دانديل إيزي أب كومباكت",
    image: "/images/easyup-compact-grey-front.webp",
    pricePower: 46900,
    massageAddOnEligible: false, builtInMassage: false,
    tags: ["lift", "compact", "small-space", "mobility"] },
  { id: "worknest", name: "Dandle WorkNest", nameAr: "دانديل وورك نيست",
    image: "/images/worknest-blue-front.webp",
    priceManual: 26900, pricePower: 33900,
    massageAddOnEligible: false, builtInMassage: false,
    tags: ["work", "desk", "office", "productivity"] },
  { id: "spacesaver", name: "Dandle SpaceSaver", nameAr: "دانديل سبيس سيڤر",
    image: "/images/spacesaver-red-front.webp",
    priceManual: 24900, pricePower: 29900,
    massageAddOnEligible: false, builtInMassage: false,
    tags: ["small-space", "wall-hugger", "compact", "urban"] },
  { id: "complete-set", name: "Dandle Complete Set", nameAr: "دانديل كومبليت سيت",
    image: "/images/complete-set-classic.jpg",
    priceManual: 62900, pricePower: 90900,
    massageAddOnEligible: false, builtInMassage: false,
    tags: ["whole-room", "family", "matched", "premium"] },
];

const PRODUCT_IDS = new Set(CATALOG.map((p) => p.id));

// --- Output envelope ---
interface RecScore { style_match: number; size_match: number; color_match: number; functional_match: number; budget_fit: number }
interface PlacementZone { label: string; x: number; y: number; w: number }
interface Recommendation {
  rank: number;
  product_id: string;
  product_name: string;
  product_image: string;
  fit_score: number;
  confidence: "high" | "medium" | "low";
  reason_short: string;
  reason_detailed: string;
  placement_intent: string;
  scores: RecScore;
  risk_flags: string[];
  default_mechanism: Mechanism;
  default_price: number;
  massage_addon_eligible: boolean;
  built_in_massage: boolean;
}
interface RoomSummary {
  room_type: string;
  style_observed: string;
  colors_observed: string[];
  light_observed: string;
  space_constraints: string;
  placement_zone: PlacementZone;
  uncertainties: string[];
}
interface RecResult {
  room_summary: RoomSummary;
  recommendations: Recommendation[];
  top_recommendation_summary: string;
  what_would_change_the_pick: string;
  honest_note: string;
  next_best_action:
    | "show_top_product"
    | "show_alternatives"
    | "ask_one_clarifying_question"
    | "browse_catalogue_manually";
  source: "ai" | "fallback";
  language: "en" | "ar";
}

// --- Helpers ---
function clean(s: unknown, max = 240): string {
  if (typeof s !== "string") return "";
  // Strip ASCII control characters (0x00-0x1F, 0x7F) without using a regex
  // class containing literal control bytes (which trips no-control-regex).
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) out += " ";
    else out += s[i];
  }
  out = out.trim();
  return out.length > max ? out.slice(0, max) : out;
}

function clampInt(n: unknown, lo: number, hi: number, dflt: number): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return dflt;
  return Math.max(lo, Math.min(hi, Math.round(v)));
}

function clampFloat(n: unknown, lo: number, hi: number, dflt: number): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return dflt;
  return Math.max(lo, Math.min(hi, v));
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try { return JSON.parse(match[0]); } catch { return null; }
  }
}

function resolveMechanism(p: ApprovedProduct, requested?: Mechanism): Mechanism {
  if (requested === "power" && p.pricePower != null) return "power";
  if (requested === "manual" && p.priceManual != null) return "manual";
  return p.priceManual != null ? "manual" : "power";
}

function priceFor(p: ApprovedProduct, m: Mechanism): number {
  return (m === "power" ? p.pricePower : p.priceManual) as number;
}

function isMassageAllowed(p: ApprovedProduct): boolean {
  return p.massageAddOnEligible && !p.builtInMassage;
}

// --- Deterministic fallback ranker ---
function deterministicRecommend(
  roomDescription: string,
  lockedProductId: string | undefined,
  language: "en" | "ar",
): RecResult {
  const text = (roomDescription || "").toLowerCase();
  const signals = {
    small: /small|compact|tight|cramped|wall|narrow|صغير|ضيق/.test(text),
    couple: /couple|two|loveseat|family|sofa|اتنين|عيلة/.test(text),
    work: /work|desk|office|laptop|study|مكتب|شغل/.test(text),
    mobility: /lift|senior|elder|stand|knee|كبير في السن|قيام/.test(text),
    bold: /bold|statement|design|color|red|terracotta|expressive|جريء|لون/.test(text),
    wellness: /massage|wellness|spa|sore|back|مساج|راحة/.test(text),
    everyday: /everyday|daily|tv|relax|يومي|تليفزيون/.test(text),
  };

  const scored = CATALOG.map((p) => {
    let s = 30; // baseline
    if (signals.small && p.tags.includes("small-space")) s += 30;
    if (signals.small && p.tags.includes("compact")) s += 15;
    if (signals.couple && p.tags.includes("loveseat")) s += 35;
    if (signals.work && p.tags.includes("work")) s += 40;
    if (signals.mobility && p.tags.includes("lift")) s += 40;
    if (signals.bold && p.tags.includes("statement")) s += 25;
    if (signals.wellness && p.tags.includes("wellness")) s += 30;
    if (signals.everyday && p.tags.includes("everyday")) s += 20;
    if (p.id === lockedProductId) s += 50;
    return { p, score: Math.min(99, s) };
  }).sort((a, b) => b.score - a.score);

  const picks = lockedProductId
    ? [
        scored.find((s) => s.p.id === lockedProductId)!,
        ...scored.filter((s) => s.p.id !== lockedProductId).slice(0, 2),
      ].filter(Boolean)
    : scored.slice(0, 3);

  const recs: Recommendation[] = picks.map(({ p, score }, idx) => {
    const mech: Mechanism = resolveMechanism(p);
    const reasonEn = idx === 0
      ? "This looks like the safest fit for your room based on what you described."
      : idx === 1
        ? "A solid alternative if you prefer a different feel."
        : "Worth considering if the top picks don't feel right.";
    const reasonAr = idx === 0
      ? "ده أنسب اختيار آمن لأوضتك حسب اللي قلتيه/قلته."
      : idx === 1
        ? "اختيار بديل كويس لو حابب/حابة إحساس مختلف."
        : "يستاهل تفكير لو الاختيارين الأولين مش مناسبين.";

    return {
      rank: idx + 1,
      product_id: p.id,
      product_name: language === "ar" ? p.nameAr : p.name,
      product_image: p.image,
      fit_score: score,
      confidence: score >= 70 ? "high" : score >= 50 ? "medium" : "low",
      reason_short: language === "ar" ? reasonAr : reasonEn,
      reason_detailed: language === "ar" ? reasonAr : reasonEn,
      placement_intent: language === "ar"
        ? "اقتراح مكان مناسب، نقدر نأكده في معاينة الأوضة."
        : "Suggested placement; we can confirm it in the room preview.",
      scores: {
        style_match: clampInt(score - 5, 0, 100, 50),
        size_match: signals.small ? (p.tags.includes("small-space") ? 90 : 50) : 70,
        color_match: 60,
        functional_match: score,
        budget_fit: 70,
      },
      risk_flags: [],
      default_mechanism: mech,
      default_price: priceFor(p, mech),
      massage_addon_eligible: isMassageAllowed(p),
      built_in_massage: p.builtInMassage,
    };
  });

  return {
    room_summary: {
      room_type: "",
      style_observed: "",
      colors_observed: [],
      light_observed: "",
      space_constraints: signals.small ? "tight" : "",
      placement_zone: { label: "", x: 0, y: 0, w: 0 },
      uncertainties: ["Inferred from text only — picture would refine this."],
    },
    recommendations: recs,
    top_recommendation_summary: recs[0]?.reason_short ?? "",
    what_would_change_the_pick: language === "ar"
      ? "صورة أوضح للأوضة وتفاصيل عن المساحة هتساعدنا نأكد الاختيار."
      : "A clearer room photo and more on the available space would help confirm the pick.",
    honest_note: language === "ar"
      ? "ده أحسن اقتراح بناءً على المعطيات الحالية. تقدر/تقدري تتصفح باقي الكتالوج بحرية."
      : "This is my best recommendation given what I have. You can still browse the full catalogue freely.",
    next_best_action: "show_top_product",
    source: "fallback",
    language,
  };
}

// --- AI prompt builder ---
function buildSystemPrompt(language: "en" | "ar"): string {
  const ids = CATALOG.map((p) => p.id).join(", ");
  return [
    "You are an interior-styling assistant for Dandle recliners.",
    "Reply ONLY with a single valid JSON object. No prose, no markdown, no commentary.",
    `Allowed product_id values: ${ids}. Do NOT invent product ids.`,
    "Do NOT invent prices, materials, colors, stock, discounts, delivery times, showrooms, or capabilities.",
    "Do NOT claim photoreal rendering, exact fit, or guarantees.",
    `Language: ${language === "ar" ? "polished Egyptian Arabic" : "warm, premium English"}.`,
    "JSON shape:",
    `{
  "room_summary": {"room_type":"","style_observed":"","colors_observed":[],"light_observed":"","space_constraints":"","placement_zone":{"label":"","x":0,"y":0,"w":0},"uncertainties":[]},
  "recommendations": [{"rank":1,"product_id":"","fit_score":0,"confidence":"high|medium|low","reason_short":"","reason_detailed":"","placement_intent":"","scores":{"style_match":0,"size_match":0,"color_match":0,"functional_match":0,"budget_fit":0},"risk_flags":[]}],
  "top_recommendation_summary":"",
  "what_would_change_the_pick":"",
  "honest_note":"",
  "next_best_action":"show_top_product | show_alternatives | ask_one_clarifying_question | browse_catalogue_manually"
}`,
    "Up to 3 recommendations, sorted best-first.",
  ].join("\n");
}

// --- AI invocation ---
async function callAi(opts: {
  apiKey: string;
  language: "en" | "ar";
  roomImage?: string;
  roomDescription?: string;
  lockedProductId?: string;
}): Promise<unknown> {
  const userText = [
    opts.lockedProductId ? `Customer is currently looking at product_id="${opts.lockedProductId}". Evaluate fit and optionally suggest alternatives, but keep it primary.` : "",
    opts.roomDescription ? `Room description: ${opts.roomDescription}` : "",
    `Approved candidate set: ${CATALOG.map((p) => `${p.id} (${p.tags.join(",")})`).join(" | ")}`,
    "Return JSON ONLY.",
  ].filter(Boolean).join("\n");

  const userContent: unknown = opts.roomImage
    ? [
        { type: "text", text: userText },
        { type: "image_url", image_url: { url: opts.roomImage } },
      ]
    : userText;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${opts.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: buildSystemPrompt(opts.language) },
        { role: "user", content: userContent },
      ],
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`AI gateway ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? "";
  return safeJsonParse(typeof raw === "string" ? raw : "");
}

// --- Validation: AI output -> RecResult ---
function validateAiOutput(
  raw: unknown,
  language: "en" | "ar",
): RecResult | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const rawRecs = Array.isArray(obj.recommendations) ? obj.recommendations : [];
  if (rawRecs.length === 0) return null;

  const recs: Recommendation[] = [];
  for (const r of rawRecs) {
    if (!r || typeof r !== "object") continue;
    const ro = r as Record<string, unknown>;
    const pid = clean(ro.product_id, 64);
    if (!PRODUCT_IDS.has(pid)) continue; // strip off-catalogue ids
    const p = CATALOG.find((c) => c.id === pid)!;
    const mech = resolveMechanism(p);
    const rawScores = (ro.scores ?? {}) as Record<string, unknown>;
    recs.push({
      rank: clampInt(ro.rank, 1, 99, recs.length + 1),
      product_id: pid,
      product_name: language === "ar" ? p.nameAr : p.name,
      product_image: p.image,
      fit_score: clampInt(ro.fit_score, 0, 100, 60),
      confidence: ro.confidence === "high" || ro.confidence === "medium" || ro.confidence === "low"
        ? ro.confidence : "medium",
      reason_short: clean(ro.reason_short, 200),
      reason_detailed: clean(ro.reason_detailed, 400),
      placement_intent: clean(ro.placement_intent, 200),
      scores: {
        style_match: clampInt(rawScores.style_match, 0, 100, 50),
        size_match: clampInt(rawScores.size_match, 0, 100, 50),
        color_match: clampInt(rawScores.color_match, 0, 100, 50),
        functional_match: clampInt(rawScores.functional_match, 0, 100, 50),
        budget_fit: clampInt(rawScores.budget_fit, 0, 100, 50),
      },
      risk_flags: Array.isArray(ro.risk_flags) ? ro.risk_flags.map((x) => clean(x, 60)).filter(Boolean).slice(0, 5) : [],
      default_mechanism: mech,
      default_price: priceFor(p, mech),
      massage_addon_eligible: isMassageAllowed(p),
      built_in_massage: p.builtInMassage,
    });
    if (recs.length >= 3) break;
  }
  if (recs.length === 0) return null;
  recs.sort((a, b) => a.rank - b.rank);

  const rsRaw = (obj.room_summary ?? {}) as Record<string, unknown>;
  const placementRaw = (rsRaw.placement_zone ?? {}) as Record<string, unknown>;
  const roomSummary: RoomSummary = {
    room_type: clean(rsRaw.room_type, 80),
    style_observed: clean(rsRaw.style_observed, 120),
    colors_observed: Array.isArray(rsRaw.colors_observed)
      ? (rsRaw.colors_observed as unknown[]).map((x) => clean(x, 40)).filter(Boolean).slice(0, 8)
      : [],
    light_observed: clean(rsRaw.light_observed, 80),
    space_constraints: clean(rsRaw.space_constraints, 120),
    placement_zone: {
      label: clean(placementRaw.label, 60),
      x: clampFloat(placementRaw.x, 0, 100, 0),
      y: clampFloat(placementRaw.y, 0, 100, 0),
      w: clampFloat(placementRaw.w, 0, 100, 0),
    },
    uncertainties: Array.isArray(rsRaw.uncertainties)
      ? (rsRaw.uncertainties as unknown[]).map((x) => clean(x, 120)).filter(Boolean).slice(0, 5)
      : [],
  };

  const nbaRaw = clean(obj.next_best_action, 40);
  const nba: RecResult["next_best_action"] =
    nbaRaw === "show_top_product" || nbaRaw === "show_alternatives" ||
    nbaRaw === "ask_one_clarifying_question" || nbaRaw === "browse_catalogue_manually"
      ? nbaRaw : "show_top_product";

  return {
    room_summary: roomSummary,
    recommendations: recs,
    top_recommendation_summary: clean(obj.top_recommendation_summary, 240) || recs[0].reason_short,
    what_would_change_the_pick: clean(obj.what_would_change_the_pick, 240),
    honest_note: clean(obj.honest_note, 240),
    next_best_action: nba,
    source: "ai",
    language,
  };
}

// --- HTTP handler ---
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const language: "en" | "ar" = body.language === "ar" ? "ar" : "en";
    const roomImage = typeof body.roomImage === "string" ? body.roomImage : undefined;
    const roomDescription = typeof body.roomDescription === "string" ? body.roomDescription : undefined;
    const lockedRaw = typeof body.lockedProductId === "string" ? body.lockedProductId.trim() : "";
    const lockedProductId = PRODUCT_IDS.has(lockedRaw) ? lockedRaw : undefined;

    if (!roomImage && !roomDescription && !lockedProductId) {
      return new Response(
        JSON.stringify({ error: "Provide a room photo, room description, or lockedProductId." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    let result: RecResult | null = null;

    if (apiKey) {
      try {
        const raw = await callAi({ apiKey, language, roomImage, roomDescription, lockedProductId });
        result = validateAiOutput(raw, language);
        if (!result) {
          console.warn("nour-recommend: AI output rejected by validator, falling back.");
        }
      } catch (err) {
        console.error("nour-recommend AI error:", err instanceof Error ? err.message : err);
      }
    }

    if (!result) {
      result = deterministicRecommend(roomDescription || "", lockedProductId, language);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("nour-recommend fatal:", e);
    // Even on a fatal error, return a safe fallback so the chat never breaks.
    const fallback = deterministicRecommend("", undefined, "en");
    return new Response(JSON.stringify({ ...fallback, error_fallback: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
