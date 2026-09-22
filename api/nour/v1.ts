const ALLOWED_ORIGINS = new Set([
  "https://dandle-vie.com",
  "https://www.dandle-vie.com",
  "https://dandle-earned-luxury.lovable.app",
  "https://dandle-earned-luxury.vercel.app",
]);

function isAllowedOrigin(origin: string | null) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return /^https:\/\/dandle-earned-luxury(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin);
}

function responseHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  });
  if (origin && isAllowedOrigin(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  return headers;
}

function json(request: Request, body: unknown, status = 200) {
  return Response.json(body, { status, headers: responseHeaders(request) });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) {
    return json(request, { error: "Origin not allowed" }, 403);
  }
  const headers = responseHeaders(request);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "600");
  return new Response(null, { status: 204, headers });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) {
    return json(request, { error: "Origin not allowed" }, 403);
  }
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);
  try {
    // Vercel emits this TypeScript function as CommonJS. Keep the ESM catalogue
    // behind a native dynamic import so Node does not try to require() it.
    const { createNourReply } = await import("../_lib/nourJourney.mjs");
    const body = await request.json();
    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return json(request, { error: "A message is required" }, 400);
    }
    return json(request, createNourReply({
      message: body.message,
      journey: typeof body.journey === "object" && body.journey ? body.journey : {},
      source: typeof body.source === "object" && body.source ? body.source : {},
    }));
  } catch {
    return json(request, { error: "Invalid request" }, 400);
  }
}
