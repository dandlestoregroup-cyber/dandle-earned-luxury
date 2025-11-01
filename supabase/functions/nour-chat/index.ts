import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, messages, image, prompt } = await req.json();
    
    // Handle placement suggestions request
    if (type === "placement" && image && prompt) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: image } }
              ]
            }
          ],
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        console.error("Placement AI error:", res.status, t);
        return new Response(JSON.stringify({ error: "Failed to generate placement suggestions" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || "[]";
      
      return new Response(
        JSON.stringify({ type: "placement", content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (isImageRequest) {
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