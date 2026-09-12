/**
 * Ad-hoc in-memory rate limiter for public edge functions.
 *
 * Honest limitation: this is per-instance and resets on cold start. It blunts
 * bulk scraping and abuse bursts; it is NOT a substitute for an edge WAF.
 */

export interface RateLimitOptions {
  /** Requests allowed per window. */
  max: number;
  /** Window length in milliseconds. Defaults to 60s. */
  windowMs?: number;
  /** Optional namespace so functions don't share counters. */
  key?: string;
}

const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** Returns true when the caller has exceeded the limit. */
export function isRateLimited(req: Request, opts: RateLimitOptions): boolean {
  const windowMs = opts.windowMs ?? 60_000;
  const id = `${opts.key ?? "default"}:${clientIp(req)}`;
  const now = Date.now();
  const entry = buckets.get(id);

  if (!entry || entry.resetAt < now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > opts.max;
}

/**
 * Returns a 429 Response when the caller is over the limit, otherwise null.
 * Callers must spread their own CORS headers in.
 */
export function rateLimitResponse(
  req: Request,
  opts: RateLimitOptions,
  corsHeaders: Record<string, string>,
): Response | null {
  if (!isRateLimited(req, opts)) return null;
  const retryAfter = Math.ceil((opts.windowMs ?? 60_000) / 1000);
  return new Response(
    JSON.stringify({ error: "rate_limited", retry_after_seconds: retryAfter }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
      },
    },
  );
}
