import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MessageCircle, ArrowLeft, Clock, CheckCircle2, Truck, RefreshCw } from "lucide-react";

interface OrderData {
  reference: string;
  status: string;
  createdAt?: string;
  totalPrice?: string | number;
  currencyCode?: string;
  paymentStatus?: string;
  customer?: { name?: string; email?: string; phone?: string };
  lineItems?: Array<{ title?: string; variantTitle?: string; quantity?: number; price?: string | number }>;
  shippingAddress?: { city?: string; province?: string; address1?: string };
}

const OrderStatus = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderStatus = useCallback(async () => {
    if (!reference) {
      setError("No order reference was provided.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/order-status?reference=${encodeURIComponent(reference)}`, { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Live order status is unavailable.");
      const nextOrder = data?.order && typeof data.order === "object" ? data.order : data;
      if (!nextOrder?.reference && reference) nextOrder.reference = reference;
      if (!nextOrder?.status) throw new Error("The order service returned no verified status.");
      setOrder(nextOrder as OrderData);
    } catch (err) {
      console.error("Error fetching order status", err);
      setOrder(null);
      setError(err instanceof Error ? err.message : "Live order status is unavailable.");
    } finally {
      setIsLoading(false);
    }
  }, [reference]);

  useEffect(() => {
    fetchOrderStatus();
  }, [fetchOrderStatus]);

  const status = (order?.status || "").toUpperCase();
  const paymentStatus = (order?.paymentStatus || "").toUpperCase();

  const statusMeta = useMemo(() => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode; message: string }> = {
      SUBMITTED: { label: "Submitted", variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" />, message: "Your order is recorded and awaiting Dandle review." },
      UNDER_REVIEW: { label: "Under Review", variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" />, message: "Dandle is reviewing this legacy order reference." },
      ACCEPTED: { label: "Accepted", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "This legacy order is recorded as accepted." },
      AMENDED: { label: "Amended", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "This legacy order has a recorded amendment." },
      INVOICE_READY: { label: "Invoice Ready", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "An invoice-ready state is recorded for this legacy order." },
      AWAITING_PAYMENT: { label: "Awaiting Payment", variant: "outline", icon: <Clock className="w-3 h-3 mr-1" />, message: "This is the latest verified status for this legacy order. Payment is not initiated from this page." },
      PREPARATION: { label: "In Preparation", variant: "outline", icon: <Package className="w-3 h-3 mr-1" />, message: "Your order is recorded as being prepared." },
      DELIVERY_SCHEDULED: { label: "Delivery Scheduled", variant: "outline", icon: <Truck className="w-3 h-3 mr-1" />, message: "Delivery scheduling has been recorded for this order." },
      OUT_FOR_DELIVERY: { label: "Out for Delivery", variant: "default", icon: <Truck className="w-3 h-3 mr-1" />, message: "Your Dandle order is recorded as out for delivery." },
      DELIVERED: { label: "Delivered", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "Your Dandle order is recorded as delivered." },
      REJECTED: { label: "Not Accepted", variant: "destructive", icon: null, message: "Dandle could not accept this order." },
      CANCELLED: { label: "Cancelled", variant: "destructive", icon: null, message: "This order is recorded as cancelled." },
    };
    return map[status] || { label: status || "Unknown", variant: "outline" as const, icon: null, message: "This is the latest verified status returned by the legacy order system." };
  }, [status]);

  const formatPrice = (amount?: string | number, currency = "EGP") => {
    const value = Number(amount);
    return Number.isFinite(value) ? `${currency} ${value.toLocaleString("en-US")}` : "—";
  };

  const handleWhatsAppHelp = () => {
    const message = `Hi Dandle! I need help with my order ${reference || ""}`;
    window.open(`https://wa.me/201222804255?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return <div className="min-h-screen flex flex-col"><Navigation /><main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main><Footer /></div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-32">
          <div className="max-w-lg mx-auto text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-headline mb-2">Order status unavailable</h1>
            <p className="text-muted-foreground mb-2">Reference: {reference}</p>
            <p className="text-sm text-muted-foreground mb-6">{error}. No replacement status has been invented.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={fetchOrderStatus}><RefreshCw className="w-4 h-4 mr-2" />Retry</Button>
              <Button variant="outline" onClick={handleWhatsAppHelp}><MessageCircle className="w-4 h-4 mr-2" />Ask about this order</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currency = order.currencyCode || "EGP";
  const lineItems = Array.isArray(order.lineItems) ? order.lineItems : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Continue Shopping</Button>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="font-headline text-2xl">Order {order.reference || reference}</CardTitle>
                  {order.createdAt && <CardDescription className="mt-1">Submitted {new Date(order.createdAt).toLocaleDateString("en-EG", { year: "numeric", month: "long", day: "numeric" })}</CardDescription>}
                </div>
                <Badge variant={statusMeta.variant} className="flex items-center">{statusMeta.icon}{statusMeta.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="bg-secondary/30 rounded-lg p-4"><p className="font-body text-sm">{statusMeta.message}</p></div>

              {paymentStatus && (
                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Recorded payment state</p>
                  <p className="font-medium">{paymentStatus.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground mt-2">This legacy page is status-only. New Dandle checkout uses secure card payment via PayTabs.</p>
                </div>
              )}

              {lineItems.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Items</h3>
                  <div className="space-y-3">
                    {lineItems.map((item, index) => (
                      <div key={`${item.title || "item"}-${index}`} className="flex justify-between gap-4 border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{item.title || "Dandle item"}</p>
                          {item.variantTitle && <p className="text-sm text-muted-foreground">{item.variantTitle}</p>}
                          <p className="text-xs text-muted-foreground">Qty {item.quantity || 1}</p>
                        </div>
                        {item.price !== undefined && <p className="font-medium whitespace-nowrap">{formatPrice(item.price, currency)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center border-t pt-4">
                <span className="font-semibold">Recorded total</span>
                <span className="text-xl font-bold text-accent">{formatPrice(order.totalPrice, currency)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchOrderStatus} variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Refresh status</Button>
            <Button onClick={handleWhatsAppHelp}><MessageCircle className="w-4 h-4 mr-2" />Contact Dandle</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderStatus;
