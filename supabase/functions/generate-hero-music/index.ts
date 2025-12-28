import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication - require valid JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create authenticated Supabase client to verify user
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    console.log(`Admin user authorized: ${user.id} (${user.email}) accessing generate-hero-music`);

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if music already exists in storage
    const { data: existingFile } = await supabase.storage
      .from('product-images')
      .list('hero', { search: 'festive-music.mp3' });

    if (existingFile && existingFile.length > 0) {
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl('hero/festive-music.mp3');
      
      console.log('Music already exists, returning existing URL');
      return new Response(
        JSON.stringify({ 
          success: true, 
          publicUrl: urlData.publicUrl,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating 60-second festive music via ElevenLabs...');

    // Generate music using ElevenLabs Music API
    const musicPrompt = `Create 60-second elegant festive shopping music. 
Warm piano melody with gentle strings and subtle bell chimes. 
Luxury furniture showroom in Cairo during holiday season. 
Universal celebration warmth, not overtly Christmas. 
Sophisticated ambiance like Four Seasons hotel lobby. 
Gradual build with satisfying resolution for seamless loop.
Tempo: moderate, relaxing. 
Mood: warm, inviting, celebratory but refined.`;

    const response = await fetch('https://api.elevenlabs.io/v1/music', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: musicPrompt,
        duration_seconds: 60,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', response.status, errorText);
      throw new Error(`ElevenLabs music generation failed: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioData = new Uint8Array(audioBuffer);

    console.log(`Generated ${audioData.length} bytes of audio`);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload('hero/festive-music.mp3', audioData, {
        contentType: 'audio/mpeg',
        upsert: true,
        cacheControl: '31536000'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload music: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl('hero/festive-music.mp3');

    console.log('Successfully generated and uploaded festive music');

    return new Response(
      JSON.stringify({
        success: true,
        publicUrl: urlData.publicUrl,
        cached: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-hero-music:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
