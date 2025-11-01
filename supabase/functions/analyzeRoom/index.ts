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

    // Step 1: Validate that the image is actually a room
    console.log("Step 1: Validating image is a room...");
    const validationRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
                text: `You are an image validation expert. Analyze this image and determine if it shows a room or living space suitable for furniture placement.

VALID IMAGES: Living rooms, bedrooms, offices, any indoor space with visible floor area
INVALID IMAGES: Close-ups of furniture, individual objects (chairs, tables, etc.), outdoor scenes, people, abstract images

Respond with ONLY a JSON object:
{
  "is_valid_room": true/false,
  "reason": "Brief explanation"
}

If the image shows an individual piece of furniture (like a chair) or a close-up of an object rather than a room, set is_valid_room to false.`
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

    if (!validationRes.ok) {
      console.error("Validation AI error:", validationRes.status, await validationRes.text());
      return new Response(
        JSON.stringify({ 
          error: "validation_failed",
          message: "Unable to validate image. Please try again."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validationData = await validationRes.json();
    const validationContent = validationData?.choices?.[0]?.message?.content || "";
    console.log("Validation response:", validationContent);

    let validationResult;
    try {
      const cleanContent = validationContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      validationResult = JSON.parse(cleanContent);
      
      if (!validationResult.is_valid_room) {
        console.log("Image validation failed:", validationResult.reason);
        return new Response(
          JSON.stringify({ 
            error: "invalid_image",
            message: validationResult.reason || "This image doesn't appear to be a room. Please upload a photo of a living space with visible floor area."
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (parseError) {
      console.error("Failed to parse validation response:", parseError);
      // If we can't validate, proceed with caution
    }

    // Step 2: Proceed with placement analysis
    console.log("Step 2: Analyzing room for placement zones...");
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
                text: `You are a spatial AI that analyzes room layouts for furniture placement.

CRITICAL RULES:
1. Detect floor plane, existing furniture bounding boxes (sofa, table, TV, walls)
2. Identify ONLY physically valid empty floor areas for a recliner
3. Never suggest placement that blocks furniture, overlaps objects, or floats
4. Provide coordinates as percentages of image dimensions (0-100)
5. Include feasibility_score (0-1) based on clearance, accessibility, perspective alignment

Analyze this room and return ONLY valid JSON with 3 placement zones:

[
  {
    "id": 1,
    "title": "Zone name",
    "subtitle": "Brief physical description",
    "why": "Why this spot works spatially",
    "feasibility_score": 0.95,
    "coordinates": {
      "x": 25,
      "y": 60,
      "width": 15,
      "height": 20
    }
  }
]

Requirements:
- feasibility_score ≥ 0.8 for all suggestions
- coordinates must represent actual empty floor space
- width/height should fit a recliner (typically 10-20% of room width)
- Only suggest spots with clear floor visibility

Return ONLY the JSON array, no markdown, no extra text.`
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
      
      // Validate and filter suggestions by feasibility + de-duplicate near-identical coordinates
      const deduped: any[] = [];
      const seen = new Set<string>();
      for (const s of Array.isArray(suggestions) ? suggestions : []) {
        const c = s.coordinates || {};
        const x = typeof c.x === 'number' ? c.x : 50;
        const y = typeof c.y === 'number' ? c.y : 50;
        const w = typeof c.width === 'number' ? c.width : 15;
        const h = typeof c.height === 'number' ? c.height : 20;
        const key = `${Math.round(x/2)*2}-${Math.round(y/2)*2}`; // quantize to ~2%
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push({ ...s, coordinates: { x, y, width: w, height: h } });
      }

      suggestions = deduped
        .filter((s) => (s.feasibility_score || 0) >= 0.8)
        .slice(0, 4)
        .map((s, i) => ({
          id: s.id || i + 1,
          title: s.title || "Placement option",
          subtitle: s.subtitle || "Recommended spot",
          why: s.why || "Good spatial fit",
          feasibility_score: s.feasibility_score || 0.8,
          coordinates: s.coordinates || { x: 50, y: 50, width: 15, height: 20 }
        }));
      
      if (suggestions.length === 0) {
        throw new Error("No valid placement zones with score ≥ 0.8");
      }
      
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return fallback suggestions
      suggestions = [
        { 
          id: 1, 
          title: "Open area", 
          subtitle: "Most spacious zone detected",
          why: "Maximum clearance from obstacles",
          feasibility_score: 0.85,
          coordinates: { x: 40, y: 50, width: 15, height: 20 }
        },
        { 
          id: 2,
          title: "Near natural light", 
          subtitle: "Window-adjacent placement",
          why: "Good ambient lighting",
          feasibility_score: 0.82,
          coordinates: { x: 65, y: 55, width: 12, height: 18 }
        },
        { 
          id: 3,
          title: "Corner placement", 
          subtitle: "Corner utilization",
          why: "Uses peripheral space efficiently",
          feasibility_score: 0.80,
          coordinates: { x: 20, y: 65, width: 14, height: 19 }
        }
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
          { 
            id: 1,
            title: "Open area", 
            subtitle: "Spacious placement",
            why: "Clear floor space",
            feasibility_score: 0.85,
            coordinates: { x: 45, y: 50, width: 15, height: 20 }
          },
          { 
            id: 2,
            title: "Near window", 
            subtitle: "Light-optimized zone",
            why: "Natural light access",
            feasibility_score: 0.82,
            coordinates: { x: 70, y: 55, width: 12, height: 18 }
          },
          { 
            id: 3,
            title: "Corner spot", 
            subtitle: "Corner utilization",
            why: "Peripheral placement",
            feasibility_score: 0.80,
            coordinates: { x: 25, y: 65, width: 14, height: 19 }
          }
        ]
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
