import OpenAI from "openai";
import type {
  ChatCompletionContentPart,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

type ProductMatch = {
  id: string;
  name: string;
  reason: string;
  image: string;
  href: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const PRODUCT_FACTS = [
  { id: "relaxmax", name: "Dandle RelaxMax", use: "balanced everyday comfort", start: 21900 },
  { id: "spacesaver", name: "Dandle SpaceSaver", use: "small rooms and wall-hugger reclining", start: 24000 },
  { id: "easyup-compact", name: "Dandle EasyUp Compact", use: "compact mobility assistance", start: 28000 },
  { id: "worknest", name: "Dandle WorkNest", use: "working, reading and long focused sitting", start: 32000 },
  { id: "easyup", name: "Dandle EasyUp Power", use: "powered assistance when sitting or standing", start: 35000 },
  { id: "comfortplus", name: "Dandle ComfortPlus Power", use: "massage-led relaxation", start: 32000 },
  { id: "cozycompanion", name: "Dandle CozyCompanion", use: "shared comfort for two", start: 42000 },
  { id: "diva", name: "Dandle Diva", use: "statement comfort and expressive rooms", start: 48000 },
  { id: "complete-set", name: "Dandle Complete Sets", use: "coordinated whole-room seating", start: 65000 },
] as const;

const imageById: Record<string, string> = {
  relaxmax: "/images/relaxmax-hero-offwhite.jpg",
  spacesaver: "/images/spacesaver-offwhite-reclined.jpg",
  "easyup-compact": "/images/easyup-compact-charcoal-front.jpg",
  worknest: "/images/worknest-blue-front.webp",
  easyup: "/images/easyup-beige-front.jpg",
  comfortplus: "/images/comfortplus-tan-front.webp",
  cozycompanion: "/images/cozycompanion-beige-front.jpg",
  diva: "/images/diva-red-front.jpg",
  "complete-set": "/images/complete-set-classic.jpg",
};

const arabicPattern = /[\u0600-\u06ff]/;

function selectMatches(text: string): ProductMatch[] {
  const normalized = text.toLowerCase();
  const scored = PRODUCT_FACTS.map((product) => {
    let score = product.id === "relaxmax" ? 1 : 0;
    if (/mobility|stand|senior|lift|حرك|قيام|كبار/.test(normalized) && product.id.startsWith("easyup")) score += 8;
    if (/small|compact|tight|apartment|صغير|مساحة/.test(normalized) && ["spacesaver", "easyup-compact"].includes(product.id)) score += 8;
    if (/work|laptop|read|office|شغل|قراءة|مكتب/.test(normalized) && product.id === "worknest") score += 8;
    if (/massage|wellness|relax|مساج|استرخاء/.test(normalized) && product.id === "comfortplus") score += 8;
    if (/couple|two|family|اتنين|زوج|عيلة/.test(normalized) && product.id === "cozycompanion") score += 8;
    if (/statement|style|bold|design|ستايل|ديكور/.test(normalized) && product.id === "diva") score += 7;
    if (/whole room|set|living room|طقم|غرفة كاملة/.test(normalized) && product.id === "complete-set") score += 8;
    const budget = Number(normalized.match(/(?:egp|budget|ميزانية|ج\.?م)?\s*(\d{4,6})/)?.[1] || 0);
    if (budget && product.start <= budget) score += 2;
    if (budget && product.start > budget) score -= 5;
    return { product, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const isAr = arabicPattern.test(text);
  return scored.map(({ product }) => ({
    id: product.id,
    name: product.name,
    reason: isAr ? `مناسب لـ ${product.use}` : `Strong for ${product.use}.`,
    image: imageById[product.id],
    href: product.id === "complete-set" ? "/complete-set" : `/products/${product.id}`,
  }));
}

function fallbackReply(text: string, matches: ProductMatch[]) {
  const isAr = arabicPattern.test(text);
  const lead = matches[0]?.name || "Dandle RelaxMax";
  if (isAr) {
    return `أنا معاكي/معاك هنا. أقرب اختيار مبدئي هو ${lead}، لكن قبل ما أقول إنه مناسب نهائيًا محتاجة أتأكد من عمق المكان، عرض الباب والميزانية. ابعتلي المقاسات أو صورة واضحة وأنا أكمل معاك خطوة بخطوة.`;
  }
  return `I’m staying with you here. My strongest preliminary match is ${lead}, but I will not call it a final fit until we confirm room depth, door width and budget. Send the measurements or a clear room photo and I’ll continue step by step.`;
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((message: ChatMessage) => message?.role && typeof message.content === "string")
      .slice(-12)
      .map((message: ChatMessage) => ({
        role: message.role,
        content: message.content.slice(0, 2400),
      }));
    const lastText = messages.at(-1)?.content || "";
    const image = typeof body.image === "string" && body.image.startsWith("data:image/")
      ? body.image.slice(0, 5_500_000)
      : null;
    const fit = body.fit && typeof body.fit === "object" ? body.fit : {};
    const combined = `${lastText} ${JSON.stringify(fit)}`;
    const recommendations = selectMatches(combined);

    const token = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
    if (!token) {
      return Response.json({
        reply: fallbackReply(lastText, recommendations),
        recommendations,
        source: "deterministic",
      });
    }

    const openai = new OpenAI({
      apiKey: token,
      baseURL: "https://ai-gateway.vercel.sh/v1",
    });

    const system = `You are Nour, Dandle's Egyptian comfort, recliner and room-placement adviser.
You are warm, concise, consultative and never pushy. Reply in the customer's language; use natural Egyptian Arabic when they use Arabic.
Stay in the conversation and answer fully. Do not dump the customer into WhatsApp.
You may recommend only these verified Dandle model names and starting-price facts:
${PRODUCT_FACTS.map((p) => `- ${p.name}: ${p.use}; current website starting price EGP ${p.start}`).join("\n")}
Safety and accuracy:
- Never invent stock, delivery dates, dimensions, weight capacity, medical benefit, discounts or payment availability.
- Treat recommendations as preliminary until door width, room depth, load requirement and budget are verified.
- Paymob is not live yet. Do not claim online card payment is available.
- When an image is provided, describe visible layout, access and placement concerns. Do not infer measurements from pixels.
- Offer a concrete next step inside Nour. WhatsApp is optional only after you have answered.
Fit data supplied by the customer: ${JSON.stringify(fit)}.
Keep the answer under 170 words.`;

    const latestContent: ChatCompletionContentPart[] = [
      { type: "text", text: lastText || "Help me choose a Dandle recliner." },
    ];
    if (image) {
      latestContent.push({ type: "image_url", image_url: { url: image, detail: "auto" } });
    }

    const aiMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      ...messages.slice(0, -1).map(
        (message): ChatCompletionMessageParam => ({
          role: message.role,
          content: message.content,
        }),
      ),
      { role: "user", content: latestContent },
    ];

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-5.5",
      messages: aiMessages,
      stream: false,
      max_completion_tokens: 650,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    return Response.json({
      reply: reply || fallbackReply(lastText, recommendations),
      recommendations,
      source: reply ? "vercel-ai-gateway" : "deterministic",
    });
  } catch (error) {
    console.error("Nour endpoint failed", error);
    const recommendations = selectMatches("");
    return Response.json({
      reply: fallbackReply("", recommendations),
      recommendations,
      source: "deterministic",
    });
  }
}
