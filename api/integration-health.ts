import { readPayTabsConfig } from "./_lib/paytabs.js";

export function GET() {
  const payTabsReady = Boolean(readPayTabsConfig());
  const orderStoreReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const reconciliationReady = Boolean(process.env.CRON_SECRET?.trim());
  const ready = payTabsReady && orderStoreReady && reconciliationReady;

  return Response.json(
    {
      ready,
      paymentProvider: "PayTabs",
      paymentFallback: null,
      environment: "Egypt",
      checks: {
        payTabs: payTabsReady,
        orderStore: orderStoreReady,
        reconciliation: reconciliationReady,
        publicAppUrl: process.env.PUBLIC_APP_URL?.trim() === "https://dandle-vie.com",
      },
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
