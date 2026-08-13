type RenderRequest = {
  roomImage?: string;
  modelId?: string;
  modelName?: string;
  material?: string;
  colour?: string;
  placement?: string;
};

const PRODUCT_REFERENCES: Record<string, string> = {
  relaxmax: "/images/relaxmax-brown-lifestyle.jpg",
  comfortplus: "/images/comfortplus-tan-front.webp",
  easyup: "/images/easyup-beige-front.jpg",
  "easyup-compact": "/images/easyup-compact-charcoal-front.jpg",
  spacesaver: "/images/spacesaver-offwhite-reclined.jpg",
  worknest: "/images/worknest-blue-front.webp",
  diva: "/images/diva-red-front.jpg",
  cozycompanion: "/images/cozycompanion-beige-front.jpg",
  "complete-set": "/images/complete-set-classic.jpg",
};

const MATERIALS = new Set(["Leather", "Textured Leather", "Linen", "Velvet"]);

function dataUrlToBlob(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);
  if (!match) throw new Error("Invalid room image");
  const bytes = Buffer.from(match[2], "base64");
  return new Blob([bytes], { type: match[1] === "image/jpg" ? "image/jpeg" : match[1] });
}

async function fetchReference(origin: string, path: string) {
  const response = await fetch(new URL(path, origin));
  if (!response.ok) throw new Error("Product reference unavailable");
  return new Blob([await response.arrayBuffer()], {
    type: response.headers.get("content-type") || "image/jpeg",
  });
}

function renderPrompt({ modelName, material, colour, placement }: RenderRequest) {
  const colourLine = colour ? `Selected colour direction: ${colour}.` : "Preserve the product reference colour unless the customer specified a colour.";
  return `Edit IMAGE 1 only. IMAGE 1 is the customer's original room and is authoritative for the room. IMAGE 2 is the Dandle product identity reference and is authoritative for the chair/set design.

Place the ${modelName || "selected Dandle model"} naturally into the customer's room at this requested location: ${placement || "the most visually natural open placement visible in the room"}.
Material: ${material || "use the product reference material"}.
${colourLine}

Hard requirements:
- Preserve the room architecture, camera viewpoint, perspective, walls, floor, windows, doors, lighting direction and all existing furniture exactly as much as possible.
- Add only the selected Dandle product. Do not redesign, declutter, move, remove or invent other room objects.
- Preserve the selected Dandle model's silhouette, proportions, cushions, arms, seams, base and recognizable identity from IMAGE 2.
- Make scale, perspective, contact shadow and lighting visually plausible, but do not imply or claim measured physical fit.
- Do not add measurements, clearance lines, labels, text, logos or watermarks.
- This is an appearance visualization, not an AR or measurement result.
- Photorealistic commercial interior composite. No stylization.`;
}

async function validateRender(apiKey: string, roomImage: string, productDataUrl: string, renderDataUrl: string) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text: `You are the strict visual QA gate for Dandle Nour. Compare IMAGE 1 original room, IMAGE 2 product reference, IMAGE 3 generated visualization. Return JSON only with keys pass:boolean, reason:string, retry_instruction:string. PASS only if: room geometry/camera/layout remain materially unchanged; no existing furniture or architectural feature was removed or invented; the inserted product clearly preserves the reference model identity; there is exactly one intended inserted Dandle product/set; perspective, scale, floor contact, shadows and lighting look plausible; no text/watermark/measurement overlays appear; the result looks like a credible room visualization. FAIL on model identity drift, room redesign, duplicate chair, distorted furniture, obvious floating/intersection, major geometry change, or fabricated scene elements. Do not judge millimetre fit or clearance.`
          },
          { type: "input_image", image_url: roomImage, detail: "high" },
          { type: "input_image", image_url: productDataUrl, detail: "high" },
          { type: "input_image", image_url: renderDataUrl, detail: "high" }
        ]
      }],
      text: { format: { type: "json_object" } }
    }),
  });
  if (!response.ok) throw new Error(`Validation failed: ${response.status}`);
  const data = await response.json();
  const raw = data.output_text || data.output?.flatMap((item: any) => item.content || []).map((part: any) => part.text || "").join("") || "";
  try {
    const parsed = JSON.parse(raw);
    return {
      pass: parsed.pass === true,
      reason: String(parsed.reason || "Visual QA failed"),
      retryInstruction: String(parsed.retry_instruction || "Preserve room and product identity more strictly."),
    };
  } catch {
    return { pass: false, reason: "Visual QA returned an unreadable result", retryInstruction: "Preserve room and product identity more strictly." };
  }
}

async function renderOnce(apiKey: string, roomBlob: Blob, productBlob: Blob, prompt: string) {
  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", prompt);
  form.append("image[]", roomBlob, "room.jpg");
  form.append("image[]", productBlob, "product.jpg");
  form.append("input_fidelity", "high");
  form.append("quality", "high");
  form.append("size", "1024x1024");
  form.append("output_format", "jpeg");
  form.append("output_compression", "90");

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI image edit failed: ${response.status} ${detail.slice(0, 300)}`);
  }
  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image");
  return `data:image/jpeg;base64,${b64}`;
}

export default async function handler(request: Request) {
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return Response.json({ error: "Nour visualization is not configured yet", code: "OPENAI_KEY_MISSING" }, { status: 503 });

    const body = await request.json() as RenderRequest;
    if (!body.roomImage?.startsWith("data:image/")) return Response.json({ error: "A room photo is required" }, { status: 400 });
    if (!body.modelId || !PRODUCT_REFERENCES[body.modelId]) return Response.json({ error: "Choose a Dandle model" }, { status: 400 });
    if (!body.material || !MATERIALS.has(body.material)) return Response.json({ error: "Choose one of the four verified materials" }, { status: 400 });

    const origin = new URL(request.url).origin;
    const roomBlob = dataUrlToBlob(body.roomImage);
    const productBlob = await fetchReference(origin, PRODUCT_REFERENCES[body.modelId]);
    const productBuffer = Buffer.from(await productBlob.arrayBuffer());
    const productDataUrl = `data:${productBlob.type};base64,${productBuffer.toString("base64")}`;

    let correction = "";
    let lastReason = "";
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const prompt = `${renderPrompt(body)}${correction ? `\n\nPrevious QA failure to correct: ${correction}` : ""}`;
      const render = await renderOnce(apiKey, roomBlob, productBlob, prompt);
      const validation = await validateRender(apiKey, body.roomImage, productDataUrl, render);
      if (validation.pass) {
        return Response.json({
          image: render,
          approved: true,
          attempts: attempt,
          modelId: body.modelId,
          material: body.material,
          colour: body.colour || "Reference colour",
          placement: body.placement || "Natural open placement",
          source: "openai-gpt-image-1",
        });
      }
      lastReason = validation.reason;
      correction = validation.retryInstruction;
    }

    return Response.json({
      approved: false,
      error: "That visual did not pass Nour's quality check, so I did not show it. Try another placement or a clearer room photo and I can remake it.",
      reason: lastReason,
    }, { status: 422 });
  } catch (error) {
    console.error("Nour render failed", error);
    return Response.json({
      error: "Nour could not create a verified visualization from this photo. Please try a clearer room photo or another placement.",
    }, { status: 500 });
  }
}
