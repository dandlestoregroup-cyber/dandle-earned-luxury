import { createHmac } from "node:crypto";
import { VisualizationError } from "./nourVisualization.js";

// Redis EVAL is atomic across concurrent serverless instances. No room images,
// names, contact details, raw IP addresses or prompts are stored in this ledger.
export const RESERVE_RENDER_LUA = `
local previous = redis.call('GET', KEYS[1])
if previous then
  if previous == ARGV[1] then return 2 else return 3 end
end
if tonumber(redis.call('GET', KEYS[2]) or '0') >= tonumber(ARGV[2]) then return 0 end
if tonumber(redis.call('GET', KEYS[3]) or '0') >= tonumber(ARGV[3]) then return 0 end
redis.call('SET', KEYS[1], ARGV[1], 'EX', 86400)
redis.call('INCR', KEYS[2])
redis.call('EXPIRE', KEYS[2], 172800)
redis.call('INCR', KEYS[3])
redis.call('EXPIRE', KEYS[3], 172800)
return 1`;

export function renderConfigured() {
  return process.env.NOUR_I2I_ENABLED === "true" && Boolean(process.env.OPENAI_API_KEY
    && process.env.NOUR_I2I_REDIS_URL?.startsWith("https://") && process.env.NOUR_I2I_REDIS_TOKEN);
}

export async function reserveRender(request: Request, requestId: string, body: string) {
  const token = process.env.NOUR_I2I_REDIS_TOKEN!;
  const digest = (value: string) => createHmac("sha256", token).update(value).digest("hex");
  // Vercel overwrites this header at the trusted edge. Non-Vercel hosts fall
  // into one shared visitor bucket rather than trusting client-supplied IPs.
  const visitor = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for") || "unknown" : "local";
  const day = new Date().toISOString().slice(0, 10);
  const limit = Number(process.env.NOUR_I2I_DAILY_LIMIT || 30);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new VisualizationError(503, "NOT_READY", "Room previews are temporarily unavailable.");
  const response = await fetch(process.env.NOUR_I2I_REDIS_URL!, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", RESERVE_RENDER_LUA, "3", `nour:i2i:job:${digest(requestId)}`,
      `nour:i2i:visitor:${day}:${digest(visitor)}`, `nour:i2i:daily:${day}`, digest(body), "3", String(limit)]),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new VisualizationError(503, "LIMITER_UNAVAILABLE", "Room previews are temporarily unavailable.");
  const data = await response.json();
  if (data.result === 0) throw new VisualizationError(429, "PREVIEW_LIMIT", "Today's preview limit has been reached. Continue with Dandle or come back tomorrow.");
  if (data.result === 2 || data.result === 3) throw new VisualizationError(409, "DUPLICATE_REQUEST", "This preview was already requested. Keep the existing result; a new request creates another preview.");
  if (data.error || data.result !== 1) throw new VisualizationError(503, "LIMITER_UNAVAILABLE", "Room previews are temporarily unavailable.");
}
