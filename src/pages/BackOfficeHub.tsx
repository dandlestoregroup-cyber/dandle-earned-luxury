import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  HeartHandshake,
  MessagesSquare,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type GatewayHealth = {
  mode?: string;
  paymentProvider?: string;
  flags?: Record<string, boolean>;
};

const TAKE_ADMIN = "https://take.app/admin";
const TAKE_STORE = "https://dandlestoregroup.com";
const GATEWAY_HEALTH = "/api/integration-health";

const adminAreas = [
  { label: "Orders", detail: "Review, accept, amend, reject and fulfil orders", icon: ShoppingBag },
  { label: "Products", detail: "Commercial names, prices and availability", icon: Package },
  { label: "Customers", detail: "Customer profiles and order history", icon: Users },
  { label: "Chats", detail: "Post-order WhatsApp communication", icon: MessagesSquare },
  { label: "Analytics", detail: "Sales and channel performance", icon: BarChart3 },
];

export default function BackOfficeHub() {
  const [health, setHealth] = useState<GatewayHealth | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadHealth = async () => {
    setRefreshing(true);
    setHealthError(false);
    try {
      const response = await fetch(GATEWAY_HEALTH, { cache: "no-store" });
      if (!response.ok) throw new Error("Health endpoint unavailable");
      setHealth(await response.json());
    } catch {
      setHealthError(true);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const orderReady = Boolean(health?.flags?.takeapp_order_enabled);
  const statusReady = Boolean(health?.flags?.order_status_enabled);
  const payTabsReady = Boolean(health?.flags?.paytabs_enabled);
  const writesEnabled = Boolean(health?.flags?.commerce_os_write_enabled);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 pb-20 pt-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Dandle operations</p>
              <h1 className="mt-3 text-4xl md:text-6xl">One door to the back office.</h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Customers submit orders on the Dandle website. TakeApp owns commercial review,
                acceptance, amendment, fulfilment and customer records. PayTabs is used only when
                an accepted order is ready for its 40% deposit.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href={TAKE_STORE} target="_blank" rel="noreferrer">
                  <Store className="mr-2 h-4 w-4" /> Open live store
                </a>
              </Button>
              <Button asChild>
                <a href={TAKE_ADMIN} target="_blank" rel="noreferrer">
                  Enter TakeApp admin <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <StatusCard title="Website order intake" value={orderReady ? "Ready" : "Not connected"} description="Orders are created by the website and sent to TakeApp for review." ok={orderReady} />
            <StatusCard title="Live order tracking" value={statusReady ? "Ready" : "Not connected"} description="Tracking never invents a status when the TakeApp status bridge is unavailable." ok={statusReady} />
            <StatusCard title="Online deposit" value={payTabsReady ? "PayTabs ready" : "Not live"} description={payTabsReady ? "Accepted orders can open the verified PayTabs 40% deposit page." : "No card-payment claim is shown until PayTabs and payment recording are configured."} ok={payTabsReady} />
          </section>

          <section className="mt-10 rounded-2xl border bg-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl">TakeApp workspace</h2>
                <p className="mt-2 text-sm text-muted-foreground">Authentication and sensitive admin actions stay inside TakeApp.</p>
              </div>
              <Button asChild size="sm">
                <a href={TAKE_ADMIN} target="_blank" rel="noreferrer">Sign in <ExternalLink className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {adminAreas.map(({ label, detail, icon: Icon }) => (
                <a key={label} href={TAKE_ADMIN} target="_blank" rel="noreferrer" className="rounded-xl border bg-background p-4 transition hover:-translate-y-0.5 hover:border-accent/50">
                  <Icon className="h-5 w-5 text-accent" />
                  <p className="mt-4 font-semibold">{label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-2xl border bg-card p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Connection readiness</p>
                  <h2 className="mt-2 text-3xl">No false green lights.</h2>
                </div>
                <button onClick={loadHealth} className="rounded-full border p-2 text-muted-foreground hover:text-foreground" aria-label="Refresh integration status">
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
              <div className="mt-6 space-y-3">
                <ReadinessRow label="Customer interface on Vercel" ok />
                <ReadinessRow label="TakeApp order intake configured" ok={orderReady} />
                <ReadinessRow label="TakeApp order tracking configured" ok={statusReady} />
                <ReadinessRow label="PayTabs + payment recording configured" ok={payTabsReady} />
                <ReadinessRow label="Commerce OS protected writes" ok={writesEnabled} />
              </div>
              {healthError && <p className="mt-4 text-sm text-amber-700">Readiness could not be refreshed. No integration is being assumed live.</p>}
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-50 p-6 text-amber-950 md:p-8">
              <CreditCard className="h-6 w-6" />
              <h2 className="mt-4 text-3xl">Payment rule</h2>
              <p className="mt-3 text-sm leading-relaxed">
                Submit → admin review → accept or amend → invoice/payment stage → verified PayTabs
                40% deposit → remaining 60% on delivery. A redirect is never treated as proof of payment.
              </p>
            </div>
          </section>

          <div className="mt-8 flex items-start gap-3 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
            <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p>WhatsApp is a post-order communication channel, not the order-creation path. Customers keep one website order reference through review, payment, preparation and delivery.</p>
          </div>
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
