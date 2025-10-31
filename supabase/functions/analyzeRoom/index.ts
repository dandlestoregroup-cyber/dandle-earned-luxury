import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { roomImageBase64 } = await req.json();
    
    if (!roomImageBase64) {
      return new Response(JSON.stringify({ error: "roomImageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Call Gemini 2.5 Flash with vision
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
              {
                type: "text",
                text: `Analyze this room photo and suggest 3 specific placement locations for a recliner chair. Consider lighting, traffic flow, and comfort. Return ONLY valid JSON in this exact format:
[
  {"label": "Near window", "text": "Place recliner near the window to enjoy natural light"},
  {"label": "Corner spot", "text": "Position in the corner for a cozy reading nook"},
  {"label": "Center focus", "text": "Place as a centerpiece for maximum impact"}
]

Do not include any markdown formatting or additional text. Return only the JSON array.`
              },
              {
                type: "image_url",
                image_url: { url: roomImageBase64 }
              }
            ]
          }
        ],
      }),
    });

    if (!res.ok) {
      console.error("AI gateway error:", res.status, await res.text());
      // Return fallback suggestions
      return new Response(
        JSON.stringify({
          suggestions: [
            { label: "Open area", text: "Place recliner in the most spacious area of the room" },
            { label: "Near natural light", text: "Position near windows for better ambiance" },
            { label: "Corner placement", text: "Utilize corner space for a cozy setup" }
          ]
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "";
    
    console.log("Raw AI response:", content);

    // Try to parse JSON from response
    let suggestions;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(cleanContent);
      
      // Validate structure
      if (!Array.isArray(suggestions) || suggestions.length === 0) {
        throw new Error("Invalid suggestions format");
      }
      
      // Ensure each suggestion has required fields
      suggestions = suggestions.slice(0, 3).map(s => ({
        label: s.label || "Placement option",
        text: s.text || "Position recliner here"
      }));
      
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return fallback suggestions
      suggestions = [
        { label: "Open area", text: "Place recliner in the most spacious area of the room" },
        { label: "Near natural light", text: "Position near windows for better ambiance" },
        { label: "Corner placement", text: "Utilize corner space for a cozy setup" }
      ];
    }

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("analyzeRoom error:", e);
    return new Response(
      JSON.stringify({ 
        error: e instanceof Error ? e.message : "Unknown error",
        suggestions: [
          { label: "Open area", text: "Place recliner in the most spacious area" },
          { label: "Near window", text: "Position near natural light source" },
          { label: "Corner spot", text: "Utilize corner for cozy placement" }
        ]
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
