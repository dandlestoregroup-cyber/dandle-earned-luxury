const CANONICAL_NOUR_API = "https://otjucmwadqqkvpgefafm.supabase.co/functions/v1/nour-api";

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
  if (origin && isAllowedOrigin(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

function json(request: Request, body: unknown, status = 200, extra?: HeadersInit) {
  const headers = responseHeaders(request);
  if (extra) new Headers(extra).forEach((value, key) => headers.set(key, value));
  return Response.json(body, { status, headers });
}

function canonicalHeaders(request: Request) {
  const headers = new Headers({
    "Content-Type": "application/json",
    // The compatibility endpoint is already origin-gated. The canonical API
    // accepts the authoritative DANDLE browser origin and performs its own
    // rate limiting, persistence and idempotency checks.
    Origin: "https://dandle-vie.com",
  });
  const apiKey = request.headers.get("x-api-key");
  const authorization = request.headers.get("authorization");
  if (apiKey) headers.set("x-api-key", apiKey);
  if (authorization) headers.set("authorization", authorization);
  return headers;
}

async function relay(request: Request, upstream: Response) {
  const raw = await upstream.text();
  let payload: unknown;
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = { error: "Canonical NOUR returned an invalid response" };
  }
  const replay = upstream.headers.get("x-nour-idempotent-replay");
  return json(
    request,
    payload,
    upstream.status,
    replay ? { "x-nour-idempotent-replay": replay } : undefined,
  );
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return json(request, { error: "Origin not allowed" }, 403);
  const headers = responseHeaders(request);
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
  headers.set("Access-Control-Max-Age", "600");
  return new Response(null, { status: 204, headers });
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return json(request, { error: "Origin not allowed" }, 403);
  try {
    const upstream = await fetch(CANONICAL_NOUR_API, { cache: "no-store" });
    return relay(request, upstream);
  } catch {
    return json(request, { error: "Canonical NOUR is temporarily unavailable" }, 503);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return json(request, { error: "Origin not allowed" }, 403);
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    const body = await request.json();
    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return json(request, { error: "A message is required" }, 400);
    }

    const upstream = await fetch(CANONICAL_NOUR_API, {
      method: "POST",
      headers: canonicalHeaders(request),
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return relay(request, upstream);
  } catch {
    return json(request, { error: "Invalid request" }, 400);
  }
}
