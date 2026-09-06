import { readPayTabsConfig } from "./_lib/paytabs.js";

export function GET() {
  const payTabsReady = Boolean(readPayTabsConfig());
  const orderStoreReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const publicAppUrlReady = process.env.PUBLIC_APP_URL?.trim() === "https://dandle-vie.com";
  const ready = payTabsReady && orderStoreReady && publicAppUrlReady;

  return Response.json(
    {
      ready,
      paymentProvider: "PayTabs",
      paymentFallback: null,
      environment: "Egypt",
      reconciliation: "github-oidc",
      checks: {
        payTabs: payTabsReady,
        orderStore: orderStoreReady,
        publicAppUrl: publicAppUrlReady,
      },
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
