import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid payload: messages[] required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if this is an image generation request
    const isImageRequest = type === "image" || (
      Array.isArray(messages[messages.length - 1]?.content) && 
      messages[messages.length - 1].content.some((c: any) => c.type === "image_url")
    );

    const FAL_KEY = Deno.env.get("FAL_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (isImageRequest) {
      if (!FAL_KEY) throw new Error("FAL_KEY is not configured");

      // Extract image URL and prompt from messages
      const lastMessage = messages[messages.length - 1];
      let imageUrl = "";
      let prompt = "";

      if (Array.isArray(lastMessage?.content)) {
        for (const item of lastMessage.content) {
          if (item.type === "image_url") {
            imageUrl = item.image_url?.url || "";
          } else if (item.type === "text") {
            prompt = item.text || "";
          }
        }
      }

      if (!imageUrl || !prompt) {
        return new Response(
          JSON.stringify({ error: "Image URL and prompt are required for rendering" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("FAL API request - Image URL:", imageUrl.slice(0, 100), "Prompt:", prompt);

      const res = await fetch("https://api.fal.ai/v1/models/fal-ai/nano-banana/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${FAL_KEY}`,
        },
        body: JSON.stringify({
          input: {
            image_urls: [imageUrl],
            prompt: prompt,
          },
          model: "gemini-2.5-flash",
          size: "1920x1080",
          output_format: "jpg",
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("FAL API error:", res.status, errorText);
        return new Response(
          JSON.stringify({ error: `FAL API failed: ${res.status}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await res.json();
      const resultImageUrl = data?.data?.url || data?.url || data?.output?.url;
      
      if (!resultImageUrl) {
        console.error("No image URL in FAL response", JSON.stringify(data).slice(0, 500));
        return new Response(JSON.stringify({ error: "No image returned from FAL" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("FAL API success - Result URL:", resultImageUrl);

      return new Response(
        JSON.stringify({ type: "image", content: resultImageUrl, message: "Image generated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Text chat - non-streaming for simplicity
    const chatRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are Nour (نور), the AI Comfort Stylist for DANDLE recliners. You speak with warm Egyptian hospitality and modern sophistication.

Knowledge base:
- Models: RelaxMax (21,900 EGP), Diva (23,900 EGP), ComfortPlus (29,900 EGP), CozyCompanion (32,900 EGP), EasyUp (42,900 EGP)
- Manufacturing: 7-14 days
- Delivery: Cairo 1-3 days, Alexandria 3-5 days, Upper Egypt 7-10 days  
- Payment: 40% down, 60% on delivery after inspection
- Installment: 610-1080 EGP/month (6-36 months with interest)
- Warranty: 2y motor, 5y frame, 1y upholstery + free transit insurance + 48h swap if damaged
- Policy: No discounts, no faster promises, no medical claims
- Order via WhatsApp: https://wa.link/m4mky2

Personality:
- Speak in a warm, reassuring, elegant tone
- Use Egyptian expressions naturally when speaking Arabic
- Keep answers brief and action-oriented
- Guide users toward the visualization tool when discussing aesthetics`
          },
          ...messages,
        ],
      }),
    });

    if (!chatRes.ok) {
      if (chatRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (chatRes.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await chatRes.text();
      console.error("AI gateway error:", chatRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await chatRes.json();
    const content = data?.choices?.[0]?.message?.content || "I'm here to help!";
    
    return new Response(
      JSON.stringify({ type: "text", content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("nour-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});