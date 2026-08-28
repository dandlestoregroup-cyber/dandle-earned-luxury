import OpenAI from "openai";
import type { ChatCompletionContentPart, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { WATERPROOF_SUMMER_RECLINER_FABRIC } from "../src/data/showroomKnowledge";
import { enforceAdviserOnly } from "./_lib/commercialTruth";

type ChatMessage = { role: "user" | "assistant"; content: string };

const VERIFIED_MODELS = [
  "RelaxMax",
  "ComfortPlus",
  "EasyUp Standard",
  "EasyUp Compact",
  "SpaceSaver",
  "WorkNest",
  "Diva",
  "CozyCompanion",
  "Dandle Complete Set",
];

const MATERIALS = ["Leather", "Textured Leather", "Linen", "Velvet", "Waterproof Summer Fabric"];

function fallbackReply(hasImage: boolean) {
  return hasImage
    ? "I can use this room photo for appearance and placement guidance. Pick a Dandle model and material, then describe the visible spot you want to try, such as the open corner beside the sofa. I won't claim measurements or physical fit from a photo."
    : "Send one clear room photo from the viewpoint where you want to see the recliner. Then choose a Dandle model and material, and I can help you describe 2–3 visually natural placement options before you create the room visualization.";
}

export default async function handler(request: Request) {
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  try {
    const body = await request.json();
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((message: ChatMessage) => message?.role && typeof message.content === "string")
      .slice(-10)
      .map((message: ChatMessage) => ({ role: message.role, content: message.content.slice(0, 2200) }));
    const lastText = messages.at(-1)?.content || "";
    const image = typeof body.image === "string" && body.image.startsWith("data:image/") ? body.image.slice(0, 7_000_000) : null;

    const token = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
    if (!token) return Response.json({ reply: fallbackReply(Boolean(image)), source: "deterministic" });

    const openai = new OpenAI({ apiKey: token, baseURL: "https://ai-gateway.vercel.sh/v1" });
    const system = `You are Nour by Dandle. Your core promise is: I help customers avoid the expensive mistake of choosing furniture that looks right but feels wrong in their home.

You are an image-aware room visualization adviser, not a measurement tool. Your job is to help the customer choose a real Dandle product and describe visually natural placements in the room photo before the separate visualization engine renders it.

Verified Dandle model names only: ${VERIFIED_MODELS.join(", ")}.
Verified material families only: ${MATERIALS.join(", ")}.
Verified showroom fabric fact: ${WATERPROOF_SUMMER_RECLINER_FABRIC.claim}
Diva named colour directions only when relevant: Olive Beige, Dusty Rose, Burnt Orange, Midnight Green, Blue Grey, Ivory Cream. Never invent hex values.

Rules:
- Never estimate dimensions, millimetres, clearance, door width, room depth or physical fit from pixels.
- Never present this as AR, scanning, measurement or guaranteed fit.
- When a room photo is present, read visible landmarks and suggest 2–3 short placement options grounded only in what is visibly present, e.g. "Open corner beside the sofa".
- Do not redesign the room or suggest moving major furniture unless the customer explicitly asks.
- Never state prices, instalments, deposits, discounts, stock, production time, delivery time, warranty terms, dimensions or other commercial facts. Those must come from Dandle's verified commercial source.
- Never invent specifications or product facts.
- The Waterproof Summer Fabric is a normal DANDLE recliner upholstery option. Present it naturally when relevant. Do not introduce an extra verification step, confirmation gate, or checkout block because the customer selects or asks for it.
- Do not generalize the waterproof claim to unrelated DANDLE fabrics.
- Keep replies concise and conversational. Reply in the customer's language; use natural Egyptian Arabic when the customer uses Arabic.
- When the user asks for placement suggestions, make each suggestion one line and under 12 words so it can be copied directly into the placement box.`;

    const latestContent: ChatCompletionContentPart[] = [{ type: "text", text: lastText || "Suggest placements from this room photo." }];
    if (image) latestContent.push({ type: "image_url", image_url: { url: image, detail: "high" } });

    const aiMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      ...messages.slice(0, -1).map((message): ChatCompletionMessageParam => ({ role: message.role, content: message.content })),
      { role: "user", content: latestContent },
    ];

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-5.5",
      messages: aiMessages,
      stream: false,
      max_completion_tokens: 450,
    });
    const generated = completion.choices[0]?.message?.content?.trim();
    if (!generated) return Response.json({ reply: fallbackReply(Boolean(image)), source: "deterministic" });

    const { reply, deflected } = enforceAdviserOnly(generated, lastText);
    return Response.json({ reply, source: deflected ? "adviser-guard" : "vercel-ai-gateway" });
  } catch (error) {
    console.error("Nour endpoint failed", error);
    return Response.json({ reply: fallbackReply(false), source: "deterministic" });
  }
}
