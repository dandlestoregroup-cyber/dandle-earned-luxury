const DEFAULT_SUPABASE_URL = "https://rbvbrxjnhmgrtxvwusxr.supabase.co";

export type DandleOrderRow = {
  id: string;
  user_id: string | null;
  status: "pending_payment" | "paid" | "payment_failed" | "cancelled" | "refunded";
  currency: "EGP";
  customer: Record<string, unknown>;
  order_lines: Array<Record<string, unknown>>;
  subtotal_egp: number | string;
  shipping_egp: number | string;
  discount_egp: number | string;
  total_egp: number | string;
  paytabs_cart_id: string;
  paytabs_tran_ref: string | null;
  paytabs_redirect_url: string | null;
  payment_status: string;
  payment_metadata: Record<string, unknown> | null;
  access_token_hash: string;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  last_reconciled_at: string | null;
};

type SupabaseConfig = { url: string; serviceRoleKey: string };

function readConfig(env: NodeJS.ProcessEnv = process.env): SupabaseConfig | null {
  const url = (env.SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (!serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const config = readConfig();
  if (!config) throw new Error("Dandle order store is not configured");
  const headers = new Headers(init.headers);
  headers.set("apikey", config.serviceRoleKey);
  headers.set("Authorization", `Bearer ${config.serviceRoleKey}`);
  headers.set("Content-Type", "application/json");
  const response = await fetch(`${config.url}${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    const error = await response.text().catch(() => "");
    throw new Error(`Dandle order store returned HTTP ${response.status}${error ? `: ${error.slice(0, 160)}` : ""}`);
  }
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

export async function createOrder(row: Record<string, unknown>) {
  const payload = await supabaseRequest("/rest/v1/dandle_orders", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  const created = Array.isArray(payload) ? payload[0] : null;
  if (!created) throw new Error("Order was not persisted");
  return created as DandleOrderRow;
}

export async function getOrderById(id: string) {
  const params = new URLSearchParams({ id: `eq.${id}`, select: "*", limit: "1" });
  const payload = await supabaseRequest(`/rest/v1/dandle_orders?${params.toString()}`, { method: "GET" });
  return Array.isArray(payload) && payload[0] ? (payload[0] as DandleOrderRow) : null;
}

export async function updateOrder(
  id: string,
  patch: Record<string, unknown>,
  expectedStatus?: DandleOrderRow["status"],
) {
  const params = new URLSearchParams({ id: `eq.${id}` });
  if (expectedStatus) params.set("status", `eq.${expectedStatus}`);
  const payload = await supabaseRequest(`/rest/v1/dandle_orders?${params.toString()}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  return Array.isArray(payload) && payload[0] ? (payload[0] as DandleOrderRow) : null;
}

export async function settleOrderPaid(orderId: string, tranRef: string, metadata: Record<string, unknown>) {
  const payload = await supabaseRequest("/rest/v1/rpc/settle_dandle_paytabs_order", {
    method: "POST",
    body: JSON.stringify({ p_order_id: orderId, p_tran_ref: tranRef, p_metadata: metadata }),
  });
  if (!payload || typeof payload !== "object") throw new Error("Settlement returned no result");
  return payload as { settled?: boolean; duplicate?: boolean; status?: string };
}

export async function listPendingPayTabsOrders(limit = 50) {
  const params = new URLSearchParams({
    status: "eq.pending_payment",
    paytabs_tran_ref: "not.is.null",
    select: "*",
    order: "created_at.asc",
    limit: String(Math.max(1, Math.min(limit, 100))),
  });
  const payload = await supabaseRequest(`/rest/v1/dandle_orders?${params.toString()}`, { method: "GET" });
  return Array.isArray(payload) ? (payload as DandleOrderRow[]) : [];
}
