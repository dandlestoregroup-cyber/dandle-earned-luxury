import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { referenceImage, prompt, filename, dimensions, category, productHandle } = await req.json();

    if (!referenceImage || !prompt || !filename) {
      throw new Error('Missing required fields: referenceImage, prompt, filename');
    }

    console.log(`Generating image: ${filename}`);
    console.log(`Category: ${category}, Product: ${productHandle}`);
    console.log(`Dimensions: ${dimensions.width}x${dimensions.height}`);

    // Build enhanced prompt with Dandle brand identity
    const enhancedPrompt = `
IMAGE-TO-IMAGE GENERATION:
Transform the reference image into the following scene while PRESERVING 100% of the chair design, colors, materials, and proportions.

TARGET SCENE:
${prompt}

CRITICAL PRESERVATION RULES:
- The chair must occupy exactly 55-65% of the frame
- Chair design, color, fabric texture must remain IDENTICAL to reference
- Do NOT add, remove, or modify any chair components
- Chair must be magnetic center of composition
- 45° LEFT camera angle to hide controls on right armrest

BRAND IDENTITY (DANDLE):
- Apply L-brackets: Dandle Orange #E67E22, 8px stroke, 55px length, 40px inset, all 4 corners
- Color palette: Deep Brown #3E2723 (text), Dandle Orange #E67E22 (accents), Off White #FAF7F2 (backgrounds), Warm Cream #F5E6D3 (warmth)
- 40-50% negative space
- ONE prop maximum (coffee, book, or lamp)
- Warm natural light (golden hour or soft morning)
- Real photography aesthetic - no AI sheen, visible fabric texture

OUTPUT REQUIREMENTS:
- Aspect ratio: ${dimensions.width}:${dimensions.height}
- Ultra high resolution, sharp focus on chair
- Natural depth of field
- Professional product photography quality
`.trim();

    // Call Lovable AI Gateway for image-to-image generation
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: enhancedPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: referenceImage,
                },
              },
            ],
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a few moments.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    console.log('AI response received');

    // Extract generated image
    const generatedImage = aiResult.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!generatedImage) {
      console.error('No image in response:', JSON.stringify(aiResult));
      throw new Error('No image generated in response');
    }

    // Upload to Supabase Storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Convert base64 to blob
    const base64Data = generatedImage.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Determine storage path based on category
    const storagePath = `site-images/${category}/${filename}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(storagePath, binaryData, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(storagePath);

    console.log(`Image uploaded successfully: ${urlData.publicUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: urlData.publicUrl,
        filename,
        storagePath,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Generate site image error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
