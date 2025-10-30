import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid payload: messages[] required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if this is an image generation request (has image_url in content)
    const lastMsg = messages[messages.length - 1];
    const hasImage = Array.isArray(lastMsg?.content) && 
      lastMsg.content.some((c: any) => c.type === "image_url");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (hasImage) {
      // Use Lovable AI image model (Nano banana)
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages,
          modalities: ["image", "text"],
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (res.status === 402) {
          return new Response(
            JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const t = await res.text();
        console.error("Image model error:", res.status, t);
        return new Response(JSON.stringify({ error: "AI image generation failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await res.json();
      const imageUrl: string | undefined = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (!imageUrl) {
        console.error("No image URL in response", JSON.stringify(data).slice(0, 500));
        return new Response(JSON.stringify({ error: "No image returned" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ type: "image", content: imageUrl, message: "Image generated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Text chat with streaming
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
              content: `You are Nour, the AI Comfort Stylist for DANDLE recliners. Speak in a warm, elegant, reassuring tone.
              
Knowledge base:
- Models: RelaxMax (21,900 EGP), Diva (23,900 EGP), ComfortPlus (29,900 EGP), CozyCompanion (32,900 EGP), EasyUp (42,900 EGP)
- Manufacturing: 7-14 days
- Delivery: Cairo 1-3 days, Alexandria 3-5 days, Upper Egypt 7-10 days
- Payment: 40% down, 60% on delivery after inspection
- Installment: 610-1080 EGP/month (6-36 months with interest)
- Warranty: 2y motor, 5y frame, 1y upholstery + free transit insurance + 48h swap if damaged
- Policy: No discounts, no faster promises, no medical claims
- Order: https://wa.link/m4mky2

Image guidance:
- You CAN work with images when the user uses the "Visualize in Your Room" flow (upload image + render).
- Never claim you cannot view images or videos. If a user asks to visualize a recliner, guide them to the Visualize button and upload step.

Style:
- Keep answers brief, helpful, and action-oriented.`
            },
            ...messages,
          ],
          stream: true,
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

    return new Response(chatRes.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("nour-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});