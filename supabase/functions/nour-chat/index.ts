import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const FAL_KEY = Deno.env.get("FAL_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!FAL_KEY) {
      throw new Error("FAL_KEY is not configured");
    }

    console.log("Processing chat request with", messages.length, "messages");

    // Check if the latest message is requesting image generation
    const lastMessage = messages[messages.length - 1];
    const imageKeywords = ['generate image', 'create image', 'make image', 'draw', 'picture of', 'image of'];
    const isImageRequest = imageKeywords.some(keyword => 
      lastMessage.content.toLowerCase().includes(keyword)
    );

    if (isImageRequest) {
      console.log("Image generation requested");
      
      // Extract the image prompt from the user message
      let imagePrompt = lastMessage.content;
      for (const keyword of imageKeywords) {
        imagePrompt = imagePrompt.toLowerCase().replace(keyword, '').trim();
      }

      console.log("Generating image with prompt:", imagePrompt);

      // Generate image using FAL
      const falResponse = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
          "Authorization": `Key ${FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          image_size: "landscape_16_9",
          num_images: 1,
        }),
      });

      if (!falResponse.ok) {
        const errorText = await falResponse.text();
        console.error("FAL API error:", falResponse.status, errorText);
        throw new Error(`FAL API error: ${falResponse.status}`);
      }

      const falData = await falResponse.json();
      console.log("Image generated successfully");

      const imageUrl = falData.images[0].url;

      return new Response(
        JSON.stringify({ 
          type: 'image',
          content: imageUrl,
          message: "I've generated an image for you!"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Regular text chat using Lovable AI
    console.log("Processing text chat");
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: "You are Nour, a friendly and helpful AI assistant. You can chat about anything and help generate images when asked. When users want images, guide them to ask explicitly with phrases like 'generate image of...' or 'create image of...'" 
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
