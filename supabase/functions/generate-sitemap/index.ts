import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
};

// Product catalog - matches lovableCatalog.ts
const products = [
  { handle: "diva", title: "Diva Recliner", image: "/images/dandle-diva.jpg" },
  { handle: "relaxmax", title: "RelaxMax Recliner", image: "/images/dandle-relaxmax-flagship.webp" },
  { handle: "cozycompanion", title: "CozyCompanion Loveseat", image: "/images/dandle-cozycompanion-hero.webp" },
  { handle: "worknest", title: "WorkNest Recliner", image: "/images/dandle-worknest.jpg" },
  { handle: "spacesaver", title: "SpaceSaver Recliner", image: "/images/dandle-spacesaver.jpg" },
  { handle: "comfortplus", title: "ComfortPlus Recliner", image: "/images/dandle-comfortplus.jpg" },
  { handle: "easyup", title: "EasyUp Lift Recliner", image: "/images/dandle-easyup-standard.jpg" },
  { handle: "easyup-compact", title: "EasyUp Compact", image: "/images/dandle-easyup-compact.jpg" },
  { handle: "complete-set", title: "Complete Living Room Set", image: "/images/dandle-heritage-set.jpg" },
];

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/our-story", priority: "0.8", changefreq: "monthly" },
  { loc: "/careers", priority: "0.6", changefreq: "weekly" },
  { loc: "/complete-set", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/faq", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/delivery", priority: "0.6", changefreq: "monthly" },
  { loc: "/warranty", priority: "0.6", changefreq: "monthly" },
  { loc: "/returns", priority: "0.6", changefreq: "monthly" },
  { loc: "/payment", priority: "0.6", changefreq: "monthly" },
  { loc: "/installation", priority: "0.6", changefreq: "monthly" },
  { loc: "/llm.html", priority: "0.5", changefreq: "weekly" },
];

const BASE_URL = "https://dandle-earned-luxury.lovable.app";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add product pages with images
    for (const product of products) {
      xml += `  <url>
    <loc>${BASE_URL}/product/${product.handle}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${BASE_URL}${product.image}</image:loc>
      <image:title>${product.title} - DANDLE Refined Recliners Egypt</image:title>
    </image:image>
  </url>
`;
    }

    xml += `</urlset>`;

    console.log(`Sitemap generated with ${staticPages.length + products.length} URLs`);

    return new Response(xml, { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
</urlset>`,
      { 
        status: 200,
        headers: corsHeaders 
      }
    );
  }
});
