import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Authentication helper
async function authenticateRequest(req: Request): Promise<{ user: any; error: Response | null }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.error('No authorization header provided');
    return {
      user: null,
      error: new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  const supabaseAuth = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) {
    console.error('Authentication failed:', authError?.message);
    return {
      user: null,
      error: new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  return { user, error: null };
}

// 9 Hero slides with their target colors
const heroSlides = [
  { source: 'relaxmax-hero-offwhite.jpg', color: 'Alexandria Linen', fabric: 'Belgian Linen', hex: '#C4B79F' },
  { source: 'relaxmax-lifestyle-night.png', color: 'Mocha Taupe', fabric: 'Chenille', hex: '#8B7E6A' },
  { source: 'cozycompanion-couple-lifestyle.jpg', color: 'Giza Gold Weave', fabric: 'Woven Fabric', hex: '#B5A06B' },
  { source: 'relaxmax-lifestyle-day.png', color: 'Desert Sage', fabric: 'Microsuede', hex: '#7A8B72' },
  { source: 'complete-set-classic.jpg', color: 'Alexandria Linen', fabric: 'Belgian Linen', hex: '#C4B79F' },
  { source: 'spacesaver-offwhite-reclined.jpg', color: 'Nile Mist Terracotta', fabric: 'Cotton Velvet', hex: '#B86B4C' },
  { source: 'easyup-beige-lifted.jpg', color: 'BACKGROUND_ONLY', fabric: 'Keep Original', hex: '' },
  { source: 'cozycompanion-beige-front.jpg', color: 'Desert Sage', fabric: 'Microsuede', hex: '#7A8B72' },
  { source: 'worknest-blue-front.webp', color: 'Mocha Taupe', fabric: 'Chenille', hex: '#8B7E6A' },
];

// Responsive image sizes
const responsiveSizes = [
  { name: 'mobile', width: 750, height: 938, aspectRatio: '4:5' },
  { name: 'tablet', width: 1536, height: 1152, aspectRatio: '4:3' },
  { name: 'desktop', width: 1920, height: 820, aspectRatio: '21:9' },
  { name: 'ultrawide', width: 2560, height: 1097, aspectRatio: '21:9' },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const { user, error: authResponse } = await authenticateRequest(req);
    if (authResponse) {
      return authResponse;
    }

    // Check admin role from user_metadata
    const isAdmin = user.user_metadata?.is_admin === true;
    if (!isAdmin) {
      console.error('Non-admin user attempted admin function:', user.id, user.email);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin user authorized: ${user.id} (${user.email}) accessing generate-hero-images`);

    const { slideIndex, sizeIndex, sourceImageBase64 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const slide = heroSlides[slideIndex];
    const size = responsiveSizes[sizeIndex];
    
    if (!slide || !size) {
      throw new Error(`Invalid slideIndex (${slideIndex}) or sizeIndex (${sizeIndex})`);
    }
    
    // Source image is provided as base64 data URL from the frontend
    const sourceImageUrl = sourceImageBase64;

    // Build the prompt based on whether it's EasyUp (background only) or color transform
    let prompt: string;
    
    if (slide.color === 'BACKGROUND_ONLY') {
      prompt = `KEEP THE EASYUP RECLINER EXACTLY AS IT IS - do not change the chair color or appearance.
Transform ONLY the background to a warm Egyptian living room:
- Soft golden hour window light streaming in
- Elegant holiday atmosphere (subtle and luxurious, not tacky)
- Warm wood flooring or luxurious carpet
- Subtle wrapped gift boxes in far background corners
- Family gathering ambiance with warm inviting lighting
Output dimensions: ${size.width}x${size.height} pixels (${size.aspectRatio} aspect ratio).
High-definition luxury furniture photography style.
The recliner chair must remain IDENTICAL to the source image.`;
    } else {
      prompt = `Transform this Dandle recliner to ${slide.color} (${slide.fabric}) color.
Output dimensions: ${size.width}x${size.height} pixels (${size.aspectRatio} aspect ratio).
Target color hex: ${slide.hex}

Requirements:
- Maintain exact product shape, proportions, and all design details
- Apply the ${slide.color} color naturally to upholstery only
- Preserve metal/wood accents unchanged
- Keep background, lighting, and shadows realistic
- High-definition studio quality
- DO NOT stretch or distort the product
- Gifting season atmosphere with warm, inviting lighting
- If cropping needed for aspect ratio, prioritize product visibility`;
    }

    console.log(`Generating hero image: slide ${slideIndex + 1}, size ${size.name}`);
    console.log(`Source: ${slide.source}, Target: ${slide.color}`);

    // Call Nano Banana (google/gemini-2.5-flash-image-preview) for image-to-image
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
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: sourceImageUrl } }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      throw new Error('No image generated from AI');
    }

    // Extract base64 data
    const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to Supabase Storage
    const fileName = `hero/slide-${slideIndex}-${size.name}.webp`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    console.log(`Successfully generated and uploaded: ${fileName}`);

    return new Response(
      JSON.stringify({
        success: true,
        slideIndex,
        sizeIndex,
        sizeName: size.name,
        color: slide.color,
        fileName,
        publicUrl: urlData.publicUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-hero-images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
