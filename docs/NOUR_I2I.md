# NOUR: See it in your room

This change extends the existing `/nour-chat` studio in DANDLE. The API is
`GET /api/nour/v1/visualizations` (catalogue/readiness) and
`POST /api/nour/v1/visualizations` (one room edit). Vercel rewrites both to the
existing `/api/nour-render` function, keeping the function count unchanged.

Customers upload a room, choose an approved product reference, describe a visible
placement and consent to photo processing. Sunburst produces one edit; a separate
AI visual check must pass before the result is displayed. Customers can compare
with the original, retain up to three previews on the open page, download a JPEG
and continue on WhatsApp with the exact preview's product, finish and reference.
Photos are not placed in WhatsApp URLs, browser storage, public storage or logs.
OpenAI receives the photo after consent; its retention policies still apply.
The QA request sets `store: false`.

Only the six previously approved product references are offered. Each currently
has one photographed finish. There is no approved swatch-photo mapping in this
repository: arbitrary recolouring is intentionally unavailable. Additional
finishes require real reviewed photos, model mapping and an update to
`src/nour/visualizationCatalog.ts`. Appearance labels are not swatch IDs or stock
claims. Starting prices come from the existing server catalogue, not the AI.
Final configuration, availability and fit still require confirmation.

## Runtime configuration

All values are server-only. Do not put secrets in VITE variables or the browser.

| Variable | Purpose |
| --- | --- |
| `NOUR_I2I_ENABLED` | Set exactly `true` only after spend approval; absent means off. |
| `OPENAI_API_KEY` | Existing OpenAI project key with Sunburst and `gpt-5-mini` access. |
| `NOUR_I2I_REDIS_URL` | HTTPS URL of a durable Redis REST service supporting EVAL (e.g. Upstash). |
| `NOUR_I2I_REDIS_TOKEN` | Server-only Redis token. |
| `NOUR_I2I_DAILY_LIMIT` | Global UTC daily request limit, default 30, allowed 1–100. |
| `NOUR_I2I_PUBLIC_ORIGIN` | Optional canonical DANDLE origin; otherwise the request origin is used. Set only for that deployment's own origin. |

The guard atomically reserves each request before any model call. It allows at
most three requests per trusted Vercel client IP per UTC day and the configured
global limit. The limit is a request cap, not a dollar budget: each accepted
request can incur one `gpt-image-2.5-sunburst` high-quality edit plus one
`gpt-5-mini` visual check. There are no automatic paid retries or fallbacks.
Failed attempts consume their reservation. Set an appropriate OpenAI project
budget as well. Missing or failed guard configuration blocks generation.
Outside Vercel, visitors share a single conservative daily visitor bucket.

Redis stores HMAC hashes, request reservations and counters only. Request entries
expire after 24 hours; daily counters expire after 48 hours. Do not configure an
evicting or temporary Redis database for production because early eviction would
invalidate the caps. Independent preview environments should use independent
Redis credentials/databases so test traffic does not consume production limits.

## API request

Send `Content-Type: application/json` and a unique `Idempotency-Key` (UUID).
Reuse that key only when retrying the same request. A duplicate is rejected,
not regenerated or replayed. If a response was lost, the API does not retain the
private image for recovery; another deliberate request incurs a new attempt.

```json
{
  "modelId": "easyup",
  "finishId": "reference",
  "roomImage": "data:image/jpeg;base64,...",
  "roomAspect": 1.5,
  "placement": "Empty corner beside the window",
  "photoConsent": true
}
```

Success includes `visualQaPassed`, `fitVerified: false`,
`commercialApproval: false`, request ID, product/finish identity, source reference,
provider model, timestamp, placement and the JPEG. The legacy `approved` field
means only that the AI visual check passed. It is not human or commercial approval.
The API accepts no arbitrary reference URL or model/finish description.

## Verification and activation

- Production frontend build and TypeScript checks cover UI and server handler.
- `npm test` includes mocked end-to-end API tests. All outbound image/QA calls
  are intercepted; these tests spend no OpenAI, Base44 or Lovable credits.
- Browser verification was attempted but blocked: Chromium was not installed and
  its download timed out. No visual or mobile browser pass is claimed.
- Real image fidelity, live Redis atomic behavior, deployment routing and account
  model access still require a live verification after configuration and spending
  approval. Do not claim this feature is live or its image quality is verified
  merely because mocked tests pass.
- Activate on a preview deployment first with global daily limit 1. Perform one
  explicitly approved generation, inspect room/product fidelity, test replay
  rejection, then approve production activation. Rollback: set
  `NOUR_I2I_ENABLED=false`.

Sources: [OpenAI image generation](https://developers.openai.com/api/docs/guides/image-generation),
[Redis REST API](https://upstash.com/docs/redis/features/restapi).
