import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS (Allows access from manus.ai or any browser)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // 2. The JSON Payload (Exact match to dandle_images.json)
  const payload = {
    "system_instruction": "You are an image processing agent. For every image in the 'inventory' list below, you must: 1. Download the source URL. 2. Create a new white canvas with dimensions 2752x1536. 3. Resize the product image so it fits within an 80% centered bounding box (Safe Zone) of that canvas. 4. Ensure the product is fully visible and not cropped. 5. Save the result.",
    "global_specs": {
      "canvas_width": 2752,
      "canvas_height": 1536,
      "aspect_ratio": "1.79:1",
      "safe_zone_fill": "80%",
      "background_color": "#FFFFFF"
    },
    "inventory": [
      {
        "id": "diva-hero",
        "product": "Diva",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/diva-red-front.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "relaxmax-hero",
        "product": "RelaxMax",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/relaxmax-hero-offwhite.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "relaxmax-day",
        "product": "RelaxMax",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/relaxmax-lifestyle-day.png",
        "target_resolution": "2752x1536"
      },
      {
        "id": "relaxmax-night",
        "product": "RelaxMax",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/relaxmax-lifestyle-night.png",
        "target_resolution": "2752x1536"
      },
      {
        "id": "relaxmax-brown",
        "product": "RelaxMax",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/relaxmax-brown-lifestyle.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "cozy-hero",
        "product": "CozyCompanion",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/cozycompanion-beige-front.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "cozy-yellow",
        "product": "CozyCompanion",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/cozycompanion-yellow-front.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "cozy-lifestyle",
        "product": "CozyCompanion",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/cozycompanion-couple-lifestyle.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "worknest-hero",
        "product": "WorkNest",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/worknest-blue-front.webp",
        "target_resolution": "2752x1536"
      },
      {
        "id": "spacesaver-hero",
        "product": "SpaceSaver",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/spacesaver-red-front.webp",
        "target_resolution": "2752x1536"
      },
      {
        "id": "spacesaver-reclined",
        "product": "SpaceSaver",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/spacesaver-offwhite-reclined.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "spacesaver-side",
        "product": "SpaceSaver",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/spacesaver-offwhite-side.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "comfortplus-hero",
        "product": "ComfortPlus",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/comfortplus-tan-front.webp",
        "target_resolution": "2752x1536"
      },
      {
        "id": "easyup-hero",
        "product": "EasyUp Standard",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/easyup-standard-grey-front.webp",
        "target_resolution": "2752x1536"
      },
      {
        "id": "easyup-beige",
        "product": "EasyUp Standard",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/easyup-beige-front.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "easyup-lifted",
        "product": "EasyUp Standard",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/easyup-beige-lifted.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "easyup-compact-hero",
        "product": "EasyUp Compact",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/easyup-compact-grey-front.webp",
        "target_resolution": "2752x1536"
      },
      {
        "id": "easyup-compact-front",
        "product": "EasyUp Compact",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/easyup-compact-charcoal-front.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "easyup-compact-reclined",
        "product": "EasyUp Compact",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/easyup-compact-charcoal-reclined.png",
        "target_resolution": "2752x1536"
      },
      {
        "id": "easyup-compact-side",
        "product": "EasyUp Compact",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/easyup-compact-charcoal-side.png",
        "target_resolution": "2752x1536"
      },
      {
        "id": "complete-set-hero",
        "product": "Complete Set",
        "placement": "hero",
        "source_url": "https://dandle-comfort.vercel.app/images/complete-set-classic.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "complete-set-coastal",
        "product": "Complete Set",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/complete-set-coastal-modern.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "complete-set-family",
        "product": "Complete Set",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/complete-set-family-modern.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "complete-set-fireplace",
        "product": "Complete Set",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/complete-set-modern-fireplace.jpg",
        "target_resolution": "2752x1536"
      },
      {
        "id": "complete-set-sunset",
        "product": "Complete Set",
        "placement": "gallery",
        "source_url": "https://dandle-comfort.vercel.app/images/complete-set-sunset-fireplace.jpg",
        "target_resolution": "2752x1536"
      }
    ]
  };

  return new Response(
    JSON.stringify(payload),
    { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  )
})