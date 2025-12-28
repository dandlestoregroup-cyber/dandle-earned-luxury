import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Require authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header provided for nour-chat');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user token
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed for nour-chat:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Authenticated user: ${user.id} using nour-chat`);

    const { type, messages, image, prompt, placementData } = await req.json();
    
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
      // Validate placement data if provided
      let renderPrompt = messages[messages.length - 1]?.content;
      
      if (placementData) {
        console.log("Placement data received:", JSON.stringify(placementData));
        const { coordinates, feasibility_score, reclinerModel, reclinerColor } = placementData;
        
        // Enforce spatial validation
        if (!coordinates || feasibility_score < 0.8) {
          console.log("Validation failed - coordinates:", coordinates, "feasibility:", feasibility_score);
          return new Response(
            JSON.stringify({ 
              error: "No space detected for this layout. Try another angle or zone.",
              type: "validation_error" 
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Enhance prompt with spatial constraints
        const spatialPrompt = `PLACEMENT INSTRUCTIONS (Always return an edited image, never text):
1) Place the ${reclinerModel} recliner strictly within the rectangle at (${coordinates.x}%, ${coordinates.y}%) with size ${coordinates.width}% x ${coordinates.height}% of the room image.
2) Color: ${reclinerColor}. Sit ON THE FLOOR, correct scale and perspective.
3) Match lighting/shadows. Do not remove/replace existing objects. Avoid overlapping; if tight, scale down or nudge within ±5% but stay inside the box.
4) Output must be an IMAGE ONLY. Do not include any textual responses or error markers.

${renderPrompt}`;
        
        renderPrompt = spatialPrompt;
      }
      
      // Use Lovable AI image model (Nano banana)
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: placementData ? [
            ...messages.slice(0, -1),
            { ...messages[messages.length - 1], content: renderPrompt }
          ] : messages,
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
      console.log("Image generation response:", JSON.stringify(data).slice(0, 200));
      
      const textResponse = data?.choices?.[0]?.message?.content || "";
      let imageUrl: string | undefined = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      // Retry once if no image or model hinted at spatial concerns
      if ((!imageUrl) || textResponse.includes("SPATIAL_ERROR")) {
        console.log("First attempt returned no image or spatial warning. Retrying with softened prompt.");
        let fallbackPrompt = renderPrompt;
        if (placementData?.coordinates) {
          const c = placementData.coordinates;
          const model = placementData.reclinerModel;
          const color = placementData.reclinerColor;
          fallbackPrompt = `Return an EDITED IMAGE ONLY (no text): Place the ${model} recliner (${color}) approximately within the rectangle at (${c.x}%, ${c.y}%), size ${c.width}% x ${c.height}% of the room. If overlap risk, scale down and nudge inward up to 10%. Always keep floor contact, correct perspective, and matching lighting/shadows. Never refuse.`;
        }

        const retryRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: placementData ? [
              ...messages.slice(0, -1),
              { ...messages[messages.length - 1], content: fallbackPrompt }
            ] : messages,
            modalities: ["image", "text"],
          }),
        });

        if (retryRes.ok) {
          const retryData = await retryRes.json();
          imageUrl = retryData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        } else {
          console.warn("Retry image request failed with status:", retryRes.status);
        }
      }

      if (!imageUrl) {
        console.error("No image URL after attempts");
        return new Response(
          JSON.stringify({ error: "Could not generate image for this placement.", type: "generation_error" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Image generated successfully, URL length:", imageUrl.length);
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
- Delivery: up to 14 days across Egypt
- We confirm delivery appointment via WhatsApp/phone
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