import { createPublicKey, verify as verifySignature } from "node:crypto";
import {
  mapPayTabsSettlementStatus,
  queryPayTabsTransaction,
  readPayTabsConfig,
  safePayTabsMetadata,
  validateVerifiedPayTabsTransaction,
} from "../_lib/paytabs.js";
import { listPendingPayTabsOrders, settleOrderPaid, updateOrder } from "../_lib/supabase-orders.js";

const GITHUB_OIDC_ISSUER = "https://token.actions.githubusercontent.com";
const GITHUB_OIDC_AUDIENCE = "dandle-paytabs-reconcile";
const GITHUB_REPOSITORY = "dandlestoregroup-cyber/dandle-earned-luxury";
const GITHUB_WORKFLOW_REF = `${GITHUB_REPOSITORY}/.github/workflows/paytabs-reconcile.yml@refs/heads/main`;
const GITHUB_JWKS_URL = "https://token.actions.githubusercontent.com/.well-known/jwks";

type JwtHeader = { alg?: unknown; kid?: unknown };
type GithubOidcClaims = {
  iss?: unknown;
  aud?: unknown;
  exp?: unknown;
  nbf?: unknown;
  repository?: unknown;
  workflow_ref?: unknown;
  ref?: unknown;
  event_name?: unknown;
};

type Jwk = JsonWebKey & { kid?: string };

function decodeJsonPart<T>(part: string): T | null {
  try {
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function audienceMatches(value: unknown) {
  if (typeof value === "string") return value === GITHUB_OIDC_AUDIENCE;
  return Array.isArray(value) && value.some((item) => item === GITHUB_OIDC_AUDIENCE);
}

async function authorizedByGithubOidc(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() || "";
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const header = decodeJsonPart<JwtHeader>(parts[0]);
  if (!header || header.alg !== "RS256" || typeof header.kid !== "string" || !header.kid) return false;

  let jwks: { keys?: Jwk[] };
  try {
    const response = await fetch(GITHUB_JWKS_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return false;
    jwks = (await response.json()) as { keys?: Jwk[] };
  } catch {
    return false;
  }

  const jwk = Array.isArray(jwks.keys) ? jwks.keys.find((key) => key.kid === header.kid) : undefined;
  if (!jwk) return false;

  try {
    const publicKey = createPublicKey({ key: jwk, format: "jwk" });
    const signingInput = Buffer.from(`${parts[0]}.${parts[1]}`, "utf8");
    const signature = Buffer.from(parts[2], "base64url");
    if (!verifySignature("RSA-SHA256", signingInput, publicKey, signature)) return false;
  } catch {
    return false;
  }

  const claims = decodeJsonPart<GithubOidcClaims>(parts[1]);
  if (!claims) return false;

  const now = Math.floor(Date.now() / 1000);
  const exp = Number(claims.exp);
  const nbf = claims.nbf === undefined ? null : Number(claims.nbf);
  if (!Number.isFinite(exp) || exp <= now) return false;
  if (nbf !== null && (!Number.isFinite(nbf) || nbf > now + 30)) return false;

  return (
    claims.iss === GITHUB_OIDC_ISSUER &&
    audienceMatches(claims.aud) &&
    claims.repository === GITHUB_REPOSITORY &&
    claims.workflow_ref === GITHUB_WORKFLOW_REF &&
    claims.ref === "refs/heads/main" &&
    (claims.event_name === "schedule" || claims.event_name === "workflow_dispatch")
  );
}

export async function GET(request: Request) {
  if (!(await authorizedByGithubOidc(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const payTabs = readPayTabsConfig();
  if (!payTabs) return Response.json({ error: "PayTabs is not configured" }, { status: 503 });

  const orders = await listPendingPayTabsOrders(50);
  const result = { checked: 0, settled: 0, failed: 0, pending: 0, rejected: 0, errors: 0 };

  for (const order of orders) {
    result.checked += 1;
    try {
      if (!order.paytabs_tran_ref) {
        result.pending += 1;
        continue;
      }

      const verified = await queryPayTabsTransaction(payTabs, order.paytabs_tran_ref);
      const validation = validateVerifiedPayTabsTransaction(verified, {
        orderId: order.id,
        amount: Number(order.total_egp),
        currency: "EGP",
        profileId: payTabs.profileId,
        tranRef: order.paytabs_tran_ref,
      });
      if (!validation.ok) {
        result.rejected += 1;
        console.error("Reconciliation rejected mismatched PayTabs transaction", { orderId: order.id, reason: validation.reason });
        continue;
      }

      const status = mapPayTabsSettlementStatus(validation.responseStatus);
      const metadata = { provider: "PayTabs", source: "reconciliation", ...safePayTabsMetadata(verified) };
      if (status === "paid") {
        const settled = await settleOrderPaid(order.id, validation.tranRef, metadata);
        if (settled.settled) result.settled += 1;
        else result.pending += 1;
      } else if (status === "payment_failed") {
        const updated = await updateOrder(
          order.id,
          {
            status: "payment_failed",
            payment_status: "payment_failed",
            payment_metadata: metadata,
            last_reconciled_at: new Date().toISOString(),
          },
          "pending_payment",
        );
        if (updated) result.failed += 1;
        else result.pending += 1;
      } else {
        await updateOrder(
          order.id,
          {
            payment_status: "payment_pending",
            payment_metadata: metadata,
            last_reconciled_at: new Date().toISOString(),
          },
          "pending_payment",
        );
        result.pending += 1;
      }
    } catch (error) {
      result.errors += 1;
      console.error("PayTabs reconciliation item failed", {
        orderId: order.id,
        reason: error instanceof Error ? error.message : "reconciliation_error",
      });
    }
  }

  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
