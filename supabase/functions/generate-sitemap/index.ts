import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Static routes from the React app
const ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/cart", priority: "0.8", changefreq: "daily" },
  { path: "/nour-chat", priority: "0.7", changefreq: "weekly" },
  { path: "/complete-set", priority: "0.9", changefreq: "weekly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/warranty", priority: "0.5", changefreq: "monthly" },
  { path: "/delivery", priority: "0.5", changefreq: "monthly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/payment", priority: "0.5", changefreq: "monthly" },
  { path: "/installation", priority: "0.5", changefreq: "monthly" },
  { path: "/returns", priority: "0.4", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
];

// Product handles (known models)
const PRODUCT_HANDLES = [
  "relaxmax",
  "spacesaver",
  "diva",
  "worknest",
  "comfortplus",
  "cozycompanion",
  "easyup",
  "easyup-compact",
];

function generateSitemap(baseUrl: string): string {
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static routes
  for (const route of ROUTES) {
    xml += `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  }

  // Add product pages
  for (const handle of PRODUCT_HANDLES) {
    xml += `  <url>
    <loc>${baseUrl}/products/${handle}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return xml;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    // Get base URL from env or use default
    const siteUrl = Deno.env.get("SITE_URL") || "https://dandle.com";

    const sitemap = generateSitemap(siteUrl);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
