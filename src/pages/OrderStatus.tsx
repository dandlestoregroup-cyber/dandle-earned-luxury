import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MessageCircle, ArrowLeft, Clock, CheckCircle2, Truck, CreditCard, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface OrderData {
  reference: string;
  status: string;
  createdAt?: string;
  totalPrice?: string | number;
  currencyCode?: string;
  paymentStatus?: string;
  depositAmount?: string | number;
  balanceOnDelivery?: string | number;
  customer?: { name?: string; email?: string; phone?: string };
  lineItems?: Array<{ title?: string; variantTitle?: string; quantity?: number; price?: string | number }>;
  shippingAddress?: { city?: string; province?: string; address1?: string };
}

const payableStatuses = new Set(["ACCEPTED", "AMENDED", "INVOICE_READY", "AWAITING_PAYMENT"]);
const paidStatuses = new Set(["PAID", "DEPOSIT_PAID", "CAPTURED"]);

const OrderStatus = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
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
      if (!response.ok) {
        throw new Error(data?.error || "Live order status is unavailable.");
      }
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
  const canPayDeposit = payableStatuses.has(status) && !paidStatuses.has(paymentStatus);

  const statusMeta = useMemo(() => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode; message: string }> = {
      SUBMITTED: { label: "Submitted", variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" />, message: "Your order was submitted successfully and is waiting for Dandle review. No card has been charged." },
      UNDER_REVIEW: { label: "Under Review", variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" />, message: "Dandle is reviewing the order details before acceptance or amendment." },
      ACCEPTED: { label: "Accepted", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "Your order is accepted. The verified 40% PayTabs deposit can now be started below." },
      AMENDED: { label: "Amended", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "Dandle amended the order. Review the confirmed total before starting the 40% deposit." },
      INVOICE_READY: { label: "Invoice Ready", variant: "default", icon: <CreditCard className="w-3 h-3 mr-1" />, message: "Your confirmed order is ready for its 40% deposit." },
      AWAITING_PAYMENT: { label: "Awaiting Payment", variant: "outline", icon: <CreditCard className="w-3 h-3 mr-1" />, message: "Your order is confirmed and waiting for the verified 40% deposit." },
      PAYMENT_PENDING: { label: "Payment Pending", variant: "outline", icon: <Clock className="w-3 h-3 mr-1" />, message: "A payment transaction is still pending verification. The page does not treat a redirect as proof of payment." },
      DEPOSIT_PAID: { label: "Deposit Paid", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "The 40% deposit is verified. The remaining 60% is due on delivery." },
      PAID: { label: "Payment Verified", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "Payment is verified on the order record." },
      PREPARATION: { label: "In Preparation", variant: "outline", icon: <Package className="w-3 h-3 mr-1" />, message: "Your accepted order is being prepared." },
      DELIVERY_SCHEDULED: { label: "Delivery Scheduled", variant: "outline", icon: <Truck className="w-3 h-3 mr-1" />, message: "Delivery scheduling has been recorded for this order." },
      OUT_FOR_DELIVERY: { label: "Out for Delivery", variant: "default", icon: <Truck className="w-3 h-3 mr-1" />, message: "Your Dandle order is out for delivery." },
      DELIVERED: { label: "Delivered", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "Your Dandle order is recorded as delivered." },
      REJECTED: { label: "Not Accepted", variant: "destructive", icon: null, message: "Dandle could not accept this order. No payment should be made against this reference." },
      CANCELLED: { label: "Cancelled", variant: "destructive", icon: null, message: "This order is cancelled. No payment should be made against this reference." },
    };
    return map[status] || { label: status || "Unknown", variant: "outline" as const, icon: null, message: "This is the latest verified status returned by the order system." };
  }, [status]);

  const startPayment = async () => {
    if (!reference || !canPayDeposit) return;
    setIsStartingPayment(true);
    try {
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.paymentUrl) throw new Error(data?.error || "Online payment is not available for this order yet.");
      window.location.assign(data.paymentUrl);
    } catch (err) {
      toast.error("Payment not started", { description: err instanceof Error ? err.message : "Please try again after the order is ready." });
      setIsStartingPayment(false);
    }
  };

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

              {canPayDeposit && (
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">40% deposit</h3>
                      <p className="mt-1 text-sm text-muted-foreground">PayTabs opens only after the server re-checks that this real order is accepted or amended.</p>
                    </div>
                    <Button onClick={startPayment} disabled={isStartingPayment}>
                      {isStartingPayment ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      Pay Deposit
                    </Button>
                  </div>
                </div>
              )}

              {lineItems.length > 0 && (
                <div>
                  <h3 className="font-headline text-lg mb-3">Items</h3>
                  <div className="space-y-3">
                    {lineItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <div><p className="font-medium">{item.title || "Dandle item"}</p>{item.variantTitle && <p className="text-sm text-muted-foreground">{item.variantTitle}</p>}<p className="text-sm text-muted-foreground">Qty: {item.quantity || 1}</p></div>
                        <p className="font-semibold">{formatPrice(item.price, currency)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Number(order.totalPrice) > 0 && <div className="flex justify-between items-center pt-4 border-t border-border"><span className="font-headline text-lg">Confirmed total</span><span className="text-xl font-bold text-accent">{formatPrice(order.totalPrice, currency)}</span></div>}
              {Number(order.depositAmount) > 0 && <div className="flex justify-between text-sm"><span>40% deposit</span><span>{formatPrice(order.depositAmount, currency)}</span></div>}
              {Number(order.balanceOnDelivery) > 0 && <div className="flex justify-between text-sm"><span>Balance on delivery</span><span>{formatPrice(order.balanceOnDelivery, currency)}</span></div>}
            </CardContent>
          </Card>

          <Card><CardContent className="py-6 text-center"><h3 className="font-headline text-lg mb-2">Need Help?</h3><p className="text-muted-foreground font-body text-sm mb-4">WhatsApp is available for post-order support using this order reference.</p><Button onClick={handleWhatsAppHelp} className="bg-[#25D366] hover:bg-[#128C7E]"><MessageCircle className="w-4 h-4 mr-2" />Chat with Us on WhatsApp</Button></CardContent></Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderStatus;
