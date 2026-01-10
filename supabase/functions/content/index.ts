import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Complete website content for extraction by crawlers and AI agents
const websiteContent = {
  "system_instruction": "You are a content extraction agent. This endpoint serves all structured website content for the DANDLE luxury recliner e-commerce platform. Use this data for indexing, SEO, AI processing, or content aggregation.",
  "site_metadata": {
    "name": "DANDLE",
    "tagline": "Because You've Earned It",
    "description": "Egyptian craftsmen creating earned luxury recliners since 2010. Quiet sophistication and lasting comfort.",
    "brand_values": ["Earned Luxury", "Quiet Sophistication", "Egyptian Craftsmanship", "Lasting Comfort"],
    "founded": 2010,
    "country": "Egypt",
    "base_url": "https://dandle-earned-luxury.lovable.app",
    "contact": {
      "whatsapp": "01222804255",
      "email": "Tell.me@DandleStoreGroup.com",
      "hours": "Daily 10AM-3PM & 7PM-9PM"
    }
  },
  "products": [
    {
      "id": "relaxmax",
      "handle": "relaxmax",
      "name": "Dandle RelaxMax",
      "tagline": "Your Daily Sanctuary",
      "three_word_truth": "EASY EVERYDAY COMFORT",
      "tier": "gateway",
      "pricing": { "manual": 21900, "power": 28900, "currency": "EGP" },
      "max_discount_percent": 15,
      "colors": ["Nile Sapphire Blue", "Alexandria Linen", "Desert Grey", "Coastal Fog Grey", "Amber Sand"],
      "features": ["170° Zero-Gravity Recline", "Smart Storage Compartments", "Integrated USB Charging Port", "Premium Leather Upholstery"],
      "target_audience": "High-performing professionals",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/relaxmax-hero-offwhite.jpg",
        "gallery": [
          "https://dandle-earned-luxury.lovable.app/images/relaxmax-lifestyle-day.png",
          "https://dandle-earned-luxury.lovable.app/images/relaxmax-lifestyle-night.png",
          "https://dandle-earned-luxury.lovable.app/images/relaxmax-brown-lifestyle.jpg"
        ]
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/relaxmax"
    },
    {
      "id": "spacesaver",
      "handle": "spacesaver",
      "name": "Dandle SpaceSaver",
      "tagline": "Big Comfort, Small Footprint",
      "three_word_truth": "SMART SPACE COMFORT",
      "tier": "gateway",
      "pricing": { "manual": 24000, "power": 29000, "currency": "EGP" },
      "max_discount_percent": 15,
      "colors": ["Desert Grey", "Blue Nile Denim", "Oasis Green", "Alexandria Linen"],
      "features": ["Compact Design", "Wall-Hugger Technology", "Space-Efficient Recline", "Modern Aesthetics"],
      "target_audience": "Urban dwellers with small spaces",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/spacesaver-red-front.webp",
        "gallery": [
          "https://dandle-earned-luxury.lovable.app/images/spacesaver-offwhite-reclined.jpg",
          "https://dandle-earned-luxury.lovable.app/images/spacesaver-offwhite-side.jpg"
        ]
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/spacesaver"
    },
    {
      "id": "easyup-compact",
      "handle": "easyup-compact",
      "name": "Dandle EasyUp Compact",
      "tagline": "Gentle Lift, Compact Design",
      "three_word_truth": "DIGNITY IN SMALL SPACES",
      "tier": "gateway",
      "pricing": { "base": 28000, "currency": "EGP" },
      "max_discount_percent": 15,
      "colors": ["Desert Grey", "Coastal Fog Grey", "Mocha Taupe"],
      "features": ["Power Lift Mechanism", "Compact Design for Small Spaces", "Zero-Gravity Positioning", "Enhanced Safety Features"],
      "target_audience": "Seniors and mobility assistance in smaller spaces",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/easyup-compact-grey-front.webp",
        "gallery": [
          "https://dandle-earned-luxury.lovable.app/images/easyup-compact-charcoal-front.jpg",
          "https://dandle-earned-luxury.lovable.app/images/easyup-compact-charcoal-reclined.png",
          "https://dandle-earned-luxury.lovable.app/images/easyup-compact-charcoal-side.png"
        ]
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/easyup-compact"
    },
    {
      "id": "worknest",
      "handle": "worknest",
      "name": "Dandle WorkNest",
      "tagline": "Work Better, Feel Better",
      "three_word_truth": "PRACTICAL DAILY COMFORT",
      "tier": "core",
      "pricing": { "manual": 32000, "power": 38000, "currency": "EGP" },
      "max_discount_percent": 10,
      "colors": ["Coastal Fog Grey", "Mocha Taupe", "Desert Sage", "Blue Nile Denim"],
      "features": ["Integrated Work Table", "Wireless Charging Pad", "Zero-Gravity Recline", "Laptop Storage"],
      "target_audience": "Remote workers and executives",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/worknest-blue-front.webp",
        "gallery": []
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/worknest"
    },
    {
      "id": "easyup",
      "handle": "easyup",
      "name": "Dandle EasyUp Power",
      "tagline": "Sit Easy, Stand Easier",
      "three_word_truth": "DIGNIFIED EFFORTLESS RISE",
      "tier": "core",
      "pricing": { "base": 35000, "currency": "EGP" },
      "max_discount_percent": 10,
      "colors": ["Alexandria Linen", "Desert Grey", "Sandstorm Ochre", "Amber Sand"],
      "features": ["Power Lift Mechanism", "Zero-Gravity Positioning", "Enhanced Safety Features", "Easy-Clean Fabric"],
      "target_audience": "Seniors and mobility assistance",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/easyup-standard-grey-front.webp",
        "gallery": [
          "https://dandle-earned-luxury.lovable.app/images/easyup-beige-front.jpg",
          "https://dandle-earned-luxury.lovable.app/images/easyup-beige-lifted.jpg"
        ]
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/easyup"
    },
    {
      "id": "comfortplus",
      "handle": "comfortplus",
      "name": "Dandle ComfortPlus Power",
      "tagline": "Feel Better Every Day",
      "three_word_truth": "INDULGENT DEEP RELAXATION",
      "tier": "core",
      "pricing": { "manual": 32000, "power": 38000, "currency": "EGP" },
      "max_discount_percent": 10,
      "colors": ["Nile Mist Terracotta", "Amber Sand", "Mocha Taupe", "Clay Pottery"],
      "features": ["8-Point Rolling Massage System", "Heating Elements (Back & Legs)", "Zero-Gravity Positioning", "Memory Foam Cushioning"],
      "target_audience": "Wellness enthusiasts seeking therapy",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/comfortplus-tan-front.webp",
        "gallery": []
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/comfortplus"
    },
    {
      "id": "cozycompanion",
      "handle": "cozycompanion",
      "name": "Dandle CozyCompanion",
      "tagline": "Comfort for Two",
      "three_word_truth": "GRAVITATIONAL HOME ANCHOR",
      "tier": "prestige",
      "pricing": { "manual": 42000, "power": 48000, "currency": "EGP" },
      "max_discount_percent": 0,
      "colors": ["Nile Sapphire Blue", "Mocha Taupe", "Blue Nile Denim", "Coastal Fog Grey"],
      "features": ["Duo Seating Design", "Independent Reclining Controls", "Dual Storage Consoles", "Center Console with Storage"],
      "target_audience": "Couples and families",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/cozycompanion-beige-front.jpg",
        "gallery": [
          "https://dandle-earned-luxury.lovable.app/images/cozycompanion-yellow-front.jpg",
          "https://dandle-earned-luxury.lovable.app/images/cozycompanion-couple-lifestyle.jpg"
        ]
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/cozycompanion"
    },
    {
      "id": "diva",
      "handle": "diva",
      "name": "Dandle Diva",
      "tagline": "Where Style Meets Comfort",
      "three_word_truth": "EXPRESSIVE HIGH-TOUCH COMFORT",
      "tier": "prestige",
      "pricing": { "manual": 48000, "power": 54000, "currency": "EGP" },
      "max_discount_percent": 0,
      "colors": ["Nile Mist Terracotta", "Papyrus Stripe", "Giza Gold Weave", "Oasis Green", "Clay Pottery"],
      "features": ["360° Swivel Base", "Zero-Gravity Recline", "Integrated Cupholder", "Bold Color Options"],
      "target_audience": "Design-conscious taste makers",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/diva-red-front.jpg",
        "gallery": []
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/diva"
    },
    {
      "id": "complete-set",
      "handle": "complete-set",
      "name": "Dandle Complete Sets",
      "tagline": "Comfort for the Whole Family",
      "three_word_truth": "WHOLE-ROOM COMFORT SYSTEM",
      "tier": "prestige",
      "pricing": { "manual": 65000, "power": 95000, "currency": "EGP" },
      "max_discount_percent": 0,
      "colors": ["Coordinated Styles"],
      "features": ["3-Piece Living Room Set", "Matching Design Language", "Premium Package Deal", "Full Home Comfort Solution"],
      "target_audience": "Families seeking complete home solutions",
      "images": {
        "hero": "https://dandle-earned-luxury.lovable.app/images/complete-set-classic.jpg",
        "gallery": [
          "https://dandle-earned-luxury.lovable.app/images/complete-set-coastal-modern.jpg",
          "https://dandle-earned-luxury.lovable.app/images/complete-set-family-modern.jpg",
          "https://dandle-earned-luxury.lovable.app/images/complete-set-modern-fireplace.jpg",
          "https://dandle-earned-luxury.lovable.app/images/complete-set-sunset-fireplace.jpg"
        ]
      },
      "url": "https://dandle-earned-luxury.lovable.app/product/complete-set"
    }
  ],
  "fabric_collections": [
    {
      "id": "core",
      "name": "Core Collection",
      "tagline": "Timeless Sophistication",
      "colors": [
        { "id": "nile-sapphire-blue", "name": "Nile Sapphire Blue", "fabric": "Velvet", "hex_color": "#1e4a6e", "pattern": "solid", "premium": true },
        { "id": "alexandria-linen", "name": "Alexandria Linen", "fabric": "Belgian Linen", "hex_color": "#d4c5a9", "pattern": "textured", "premium": false },
        { "id": "desert-sage", "name": "Desert Sage", "fabric": "Microsuede", "hex_color": "#8b9a6b", "pattern": "solid", "premium": false },
        { "id": "desert-grey", "name": "Desert Grey", "fabric": "Leather", "hex_color": "#6b6b6b", "pattern": "solid", "premium": true },
        { "id": "amber-sand", "name": "Amber Sand", "fabric": "Nubuck Leather", "hex_color": "#c4a574", "pattern": "textured", "premium": true },
        { "id": "mocha-taupe", "name": "Mocha Taupe", "fabric": "Chenille", "hex_color": "#8b7355", "pattern": "textured", "premium": false },
        { "id": "coastal-fog-grey", "name": "Coastal Fog Grey", "fabric": "Chenille", "hex_color": "#9a9a8a", "pattern": "textured", "premium": false }
      ]
    },
    {
      "id": "cairo",
      "name": "Cairo Trends",
      "tagline": "Modern Elegance",
      "colors": [
        { "id": "nile-mist-terracotta", "name": "Nile Mist Terracotta", "fabric": "Cotton Velvet", "hex_color": "#c45a3a", "pattern": "solid", "premium": true },
        { "id": "giza-gold-weave", "name": "Giza Gold Weave", "fabric": "Woven Fabric", "hex_color": "#c9a84e", "pattern": "woven", "premium": false },
        { "id": "oasis-green", "name": "Oasis Green", "fabric": "Performance Fabric", "hex_color": "#5a7a5a", "pattern": "solid", "premium": false },
        { "id": "blue-nile-denim", "name": "Blue Nile Denim", "fabric": "Recycled Denim", "hex_color": "#4a6a8a", "pattern": "textured", "premium": false },
        { "id": "sandstorm-ochre", "name": "Sandstorm Ochre", "fabric": "Cotton Blend", "hex_color": "#b8956a", "pattern": "striped", "premium": false },
        { "id": "papyrus-stripe", "name": "Papyrus Stripe", "fabric": "Linen Blend", "hex_color": "#d8c8a8", "pattern": "striped", "premium": false },
        { "id": "clay-pottery", "name": "Clay Pottery", "fabric": "Textured Woven", "hex_color": "#b87a5a", "pattern": "woven", "premium": true }
      ]
    }
  ],
  "pages": [
    { "slug": "about", "title": "About Us", "url": "https://dandle-earned-luxury.lovable.app/about", "meta_description": "Learn about DANDLE's journey: Egyptian craftsmen creating earned luxury recliners since 2010." },
    { "slug": "faq", "title": "Frequently Asked Questions", "url": "https://dandle-earned-luxury.lovable.app/faq", "meta_description": "Find answers to common questions about DANDLE recliners." },
    { "slug": "warranty", "title": "Warranty Information", "url": "https://dandle-earned-luxury.lovable.app/warranty", "meta_description": "DANDLE warranty coverage: 5-year frame, 2-year motor, 1-year upholstery." },
    { "slug": "delivery", "title": "Delivery Information", "url": "https://dandle-earned-luxury.lovable.app/delivery", "meta_description": "White-glove delivery across Egypt within 14 days." },
    { "slug": "payment", "title": "Payment Options", "url": "https://dandle-earned-luxury.lovable.app/payment", "meta_description": "Payment methods: Bank transfers, Vodafone Cash, InstaPay." },
    { "slug": "returns", "title": "Returns & Exchanges", "url": "https://dandle-earned-luxury.lovable.app/returns", "meta_description": "Limited return policy for custom furniture." },
    { "slug": "installation", "title": "Installation", "url": "https://dandle-earned-luxury.lovable.app/installation", "meta_description": "Free professional installation with delivery." },
    { "slug": "contact", "title": "Contact Us", "url": "https://dandle-earned-luxury.lovable.app/contact", "meta_description": "Contact DANDLE via WhatsApp, email, or visit us." }
  ],
  "faq": [
    {
      "category": "Ordering",
      "questions": [
        { "question": "How do I place an order?", "answer": "Browse our collection, add items to cart, and complete checkout. Or contact us via WhatsApp at 01222804255." },
        { "question": "Can I customize my recliner?", "answer": "Many recliners are available in different colors and fabrics. Contact us for customization options." },
        { "question": "What happens after I place an order?", "answer": "You'll receive confirmation via WhatsApp. We'll contact you within 1-2 days to schedule delivery." }
      ]
    },
    {
      "category": "Payment",
      "questions": [
        { "question": "What payment methods do you accept?", "answer": "Bank transfers, Vodafone Cash, and InstaPay. 40% deposit, 60% on delivery." },
        { "question": "When do I need to pay?", "answer": "40% deposit to confirm order, remaining 60% due upon delivery." }
      ]
    },
    {
      "category": "Delivery",
      "questions": [
        { "question": "How long does delivery take?", "answer": "Up to 14 days. We confirm appointment via WhatsApp/phone." },
        { "question": "Do you deliver across all of Egypt?", "answer": "Yes, white-glove delivery service across Egypt." },
        { "question": "What is white-glove delivery?", "answer": "Professional team delivers, unpacks, sets up, and removes packaging." }
      ]
    },
    {
      "category": "Warranty",
      "questions": [
        { "question": "What warranty do you offer?", "answer": "5-year frame, 2-year motor, 1-year upholstery warranty." },
        { "question": "How do I make a warranty claim?", "answer": "Contact us via WhatsApp or email with order reference and photos." }
      ]
    }
  ],
  "product_tiers": {
    "gateway": { "name": "Gateway Tier", "description": "Entry point to earned luxury", "max_discount": 15 },
    "core": { "name": "Core Tier", "description": "Premium comfort with advanced features", "max_discount": 10 },
    "prestige": { "name": "Prestige Tier", "description": "Ultimate luxury experience - no discounts", "max_discount": 0 }
  },
  "api_endpoints": {
    "content": "/functions/v1/content",
    "images": "/functions/v1/images",
    "static_content_manifest": "/content-manifest.json",
    "static_images_manifest": "/images-manifest.json"
  }
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Parse URL for query parameters
  const url = new URL(req.url);
  const section = url.searchParams.get('section');

  let responseData = websiteContent;

  // Allow filtering by section
  if (section) {
    switch (section) {
      case 'products':
        responseData = { products: websiteContent.products };
        break;
      case 'fabrics':
        responseData = { fabric_collections: websiteContent.fabric_collections };
        break;
      case 'pages':
        responseData = { pages: websiteContent.pages };
        break;
      case 'faq':
        responseData = { faq: websiteContent.faq };
        break;
      case 'metadata':
        responseData = { site_metadata: websiteContent.site_metadata };
        break;
      default:
        // Return full content if section not recognized
        break;
    }
  }

  return new Response(
    JSON.stringify(responseData),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    }
  )
})
