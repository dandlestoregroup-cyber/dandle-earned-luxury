import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

type PaymentState = "processing" | "paid" | "failed";
type OrderStatus = {
  order?: string;
  status?: string;
  total?: number;
  currency?: string;
};

const PaymentResult = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order") || "";
  const { clearCart } = useCart();
  const [state, setState] = useState<PaymentState>("processing");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const cleared = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    let attempts = 0;

    const poll = async () => {
      if (!orderId) {
        if (!cancelled) setState("failed");
        return;
      }
      try {
        const response = await fetch(`/api/public/paytabs/status?order=${encodeURIComponent(orderId)}`, {
          credentials: "same-origin",
          cache: "no-store",
        });
        const data = (await response.json().catch(() => ({}))) as OrderStatus;
        if (cancelled) return;
        if (!response.ok) {
          if (response.status === 404) setState("failed");
          else if (attempts < 15) timer = window.setTimeout(poll, 1500);
          return;
        }

        setOrder(data);
        if (data.status === "paid") {
          setState("paid");
          if (!cleared.current) {
            cleared.current = true;
            clearCart();
          }
          return;
        }
        if (["payment_failed", "cancelled"].includes(data.status || "")) {
          setState("failed");
          return;
        }

        attempts += 1;
        if (attempts < 15) timer = window.setTimeout(poll, 1500);
      } catch {
        attempts += 1;
        if (!cancelled && attempts < 15) timer = window.setTimeout(poll, 1500);
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [orderId, clearCart]);

  const formattedTotal = order?.total
    ? `${Number(order.total).toLocaleString("en-US")} ${order.currency || "EGP"}`
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-32">
        <div className="max-w-xl mx-auto bg-card rounded-lg p-8 shadow-lg text-center">
          {state === "processing" && (
            <>
              <Loader2 className="w-14 h-14 mx-auto mb-5 text-accent animate-spin" />
              <h1 className="text-3xl font-bold mb-3">Processing payment</h1>
              <p className="text-muted-foreground">
                Dandle is confirming your PayTabs payment securely. You can refresh this page safely.
              </p>
            </>
          )}

          {state === "paid" && (
            <>
              <CheckCircle2 className="w-14 h-14 mx-auto mb-5 text-accent" />
              <h1 className="text-3xl font-bold mb-3">Payment confirmed</h1>
              <p className="text-muted-foreground mb-5">Your Dandle order is confirmed and paid.</p>
              {formattedTotal && <p className="text-xl font-semibold">{formattedTotal}</p>}
            </>
          )}

          {state === "failed" && (
            <>
              <XCircle className="w-14 h-14 mx-auto mb-5 text-destructive" />
              <h1 className="text-3xl font-bold mb-3">Payment failed</h1>
              <p className="text-muted-foreground">
                Dandle has not confirmed payment for this order. Your cart has not been cleared.
              </p>
            </>
          )}

          {orderId && <p className="text-xs text-muted-foreground mt-8 break-all">Order: {orderId}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentResult;
