import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, CreditCard, RefreshCw, ShieldCheck, ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type IntegrationHealth = {
  ready?: boolean;
  paymentProvider?: string;
  paymentFallback?: string | null;
  environment?: string;
  reconciliation?: string;
  checks?: {
    payTabs?: boolean;
    orderStore?: boolean;
    publicAppUrl?: boolean;
  };
};

const HEALTH_URL = "/api/integration-health";

export default function BackOfficeHub() {
  const [health, setHealth] = useState<IntegrationHealth | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadHealth = async () => {
    setRefreshing(true);
    setHealthError(false);
    try {
      const response = await fetch(HEALTH_URL, { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as IntegrationHealth;
      setHealth(payload);
      if (!response.ok) setHealthError(true);
    } catch {
      setHealthError(true);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadHealth();
  }, []);

  const orderStoreReady = Boolean(health?.checks?.orderStore);
  const payTabsReady = Boolean(health?.checks?.payTabs);
  const publicUrlReady = Boolean(health?.checks?.publicAppUrl);
  const reconciliationReady = health?.reconciliation === "github-oidc";
  const fullyReady = Boolean(health?.ready);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 pb-20 pt-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">DANDLE payment operations</p>
              <h1 className="mt-3 text-4xl md:text-6xl">One verified order. One verified payment.</h1>
              <p className="mt-4 max-w-3xl text-muted-foreground">
                DANDLE creates the order in its server-side order ledger before PayTabs checkout. The full EGP total is verified from the exact model, color, mechanism, options and SKU, then payment is settled only after PayTabs server verification.
              </p>
            </div>
            <button onClick={() => void loadHealth()} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted" disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh readiness
            </button>
          </div>

          <section className="mt-10 grid gap-4 md:grid-cols-4">
            <StatusCard title="DANDLE order ledger" value={orderStoreReady ? "Ready" : "Pending"} description="Server-side order storage and settlement access." ok={orderStoreReady} />
            <StatusCard title="PayTabs" value={payTabsReady ? "Configured" : "Pending"} description="Egypt PayTabs profile and server key are available server-side." ok={payTabsReady} />
            <StatusCard title="Production URL" value={publicUrlReady ? "Correct" : "Pending"} description="Checkout callbacks and returns are anchored to dandle-vie.com." ok={publicUrlReady} />
            <StatusCard title="Reconciliation" value={reconciliationReady ? "OIDC ready" : "Pending"} description="GitHub Actions can reconcile pending PayTabs orders without a static cron secret." ok={reconciliationReady} />
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-2xl border bg-card p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Release gate</p>
                  <h2 className="mt-2 text-3xl">No false green lights.</h2>
                </div>
                {fullyReady ? <CheckCircle2 className="h-7 w-7 text-emerald-600" /> : <AlertTriangle className="h-7 w-7 text-amber-600" />}
              </div>
              <div className="mt-6 space-y-3">
                <ReadinessRow label="DANDLE order store service access" ok={orderStoreReady} />
                <ReadinessRow label="PayTabs production configuration" ok={payTabsReady} />
                <ReadinessRow label="PUBLIC_APP_URL = https://dandle-vie.com" ok={publicUrlReady} />
                <ReadinessRow label="Secretless 10-minute reconciliation" ok={reconciliationReady} />
              </div>
              {healthError && <p className="mt-4 text-sm text-amber-700">Readiness could not be fully verified. No payment integration is being assumed live.</p>}
            </div>

            <div className="rounded-2xl border bg-card p-6 md:p-8">
              <CreditCard className="h-7 w-7 text-accent" />
              <h2 className="mt-4 text-3xl">Payment rule</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Order created → full EGP total verified → PayTabs hosted checkout → signed callback + independent PayTabs query → atomic paid settlement. A redirect is never proof of payment.
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-xl border bg-muted/30 p-4 text-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p>No InstaPay fallback, no 40% deposit path, and no browser-controlled payment amount for new checkout.</p>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border bg-card p-6 md:p-8">
            <div className="flex items-start gap-4">
              <ShoppingBag className="mt-1 h-6 w-6 text-accent" />
              <div>
                <h2 className="text-2xl">Order integrity</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The order snapshot preserves the exact product configuration and total used for PayTabs. The protected result page reads only DANDLE's verified order state, and reconciliation uses the same settlement rules as the webhook.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatusCard({ title, value, description, ok }: { title: string; value: string; description: string; ok: boolean }) {
  return (
    <article className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
        {ok ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-amber-600" />}
      </div>
      <p className="mt-5 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}

function ReadinessRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-background px-4 py-3">
      <span className="text-sm">{label}</span>
      <span className={`text-xs font-semibold ${ok ? "text-emerald-700" : "text-amber-700"}`}>{ok ? "Ready" : "Pending"}</span>
    </div>
  );
}
