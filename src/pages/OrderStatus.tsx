import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  MessageCircle,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  CreditCard,
  RefreshCw,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface OrderData {
  reference: string;
  status: string;
  createdAt?: string;
  totalPrice?: string | number;
  currencyCode?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  safeFailureReason?: string;
  depositAmount?: string | number;
  balanceOnDelivery?: string | number;
  customer?: { name?: string; email?: string; phone?: string };
  lineItems?: Array<{ title?: string; variantTitle?: string; quantity?: number; price?: string | number }>;
  shippingAddress?: { city?: string; province?: string; address1?: string };
}

interface InstapayIntent {
  provider: "InstaPay";
  reference: string;
  amount: number;
  currency: "EGP";
  recipient: { name: string; id: string };
  paymentStatus: string;
  instructions: { en: string; ar: string };
}

const payableStatuses = new Set(["ACCEPTED", "AMENDED", "INVOICE_READY", "AWAITING_PAYMENT"]);
const settledStatuses = new Set(["PAID", "DEPOSIT_PAID", "CAPTURED"]);
const uncertainStatuses = new Set([
  "PAYMENT_PENDING",
  "PENDING",
  "PROCESSING",
  "HOLD",
  "AUTH_PENDING",
  "INSTAPAY_PENDING",
  "INSTAPAY_VERIFICATION_REQUIRED",
]);
const conclusiveFailureStatuses = new Set([
  "NOT_PAID",
  "FAILED",
  "PAYMENT_FAILED",
  "DECLINED",
  "CARD_DECLINED",
  "BANK_REJECTED",
  "GATEWAY_ERROR",
  "CANCELLED",
  "EXPIRED",
]);

const OrderStatus = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [isStartingInstapay, setIsStartingInstapay] = useState(false);
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);
  const [paytabsFallbackAvailable, setPaytabsFallbackAvailable] = useState(false);
  const [instapayIntent, setInstapayIntent] = useState<InstapayIntent | null>(null);
  const [transferReference, setTransferReference] = useState("");
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
  const paymentIsSettled = settledStatuses.has(paymentStatus);
  const paymentIsUncertain = uncertainStatuses.has(paymentStatus);
  const canStartPayTabs = payableStatuses.has(status) && !paymentIsSettled && !paymentIsUncertain;
  const canOfferInstapay =
    payableStatuses.has(status) &&
    !paymentIsSettled &&
    !paymentIsUncertain &&
    (paytabsFallbackAvailable || conclusiveFailureStatuses.has(paymentStatus));

  const statusMeta = useMemo(() => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode; message: string }> = {
      SUBMITTED: { label: "Submitted", variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" />, message: "Your order was submitted successfully and is waiting for Dandle review. No payment has been charged." },
      UNDER_REVIEW: { label: "Under Review", variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" />, message: "Dandle is reviewing the order details before acceptance or amendment." },
      ACCEPTED: { label: "Accepted", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "Your order is accepted. The verified 40% deposit can now be paid." },
      AMENDED: { label: "Amended", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "Dandle amended the order. Review the confirmed total before paying the 40% deposit." },
      INVOICE_READY: { label: "Invoice Ready", variant: "default", icon: <CreditCard className="w-3 h-3 mr-1" />, message: "Your confirmed order is ready for its 40% deposit." },
      AWAITING_PAYMENT: { label: "Awaiting Payment", variant: "outline", icon: <CreditCard className="w-3 h-3 mr-1" />, message: "Your order is confirmed and waiting for the verified 40% deposit." },
      PREPARATION: { label: "In Preparation", variant: "outline", icon: <Package className="w-3 h-3 mr-1" />, message: "Your accepted order is being prepared." },
      DELIVERY_SCHEDULED: { label: "Delivery Scheduled", variant: "outline", icon: <Truck className="w-3 h-3 mr-1" />, message: "Delivery scheduling has been recorded for this order." },
      OUT_FOR_DELIVERY: { label: "Out for Delivery", variant: "default", icon: <Truck className="w-3 h-3 mr-1" />, message: "Your Dandle order is out for delivery." },
      DELIVERED: { label: "Delivered", variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, message: "Your Dandle order is recorded as delivered." },
      REJECTED: { label: "Not Accepted", variant: "destructive", icon: null, message: "Dandle could not accept this order. No payment should be made against this reference." },
      CANCELLED: { label: "Cancelled", variant: "destructive", icon: null, message: "This order is cancelled. No payment should be made against this reference." },
    };
    return map[status] || { label: status || "Unknown", variant: "outline" as const, icon: null, message: "This is the latest verified status returned by the order system." };
  }, [status]);

  const paymentMessage = useMemo(() => {
    if (settledStatuses.has(paymentStatus)) {
      return { tone: "success", en: "Payment has been verified on the order record.", ar: "تم التحقق من الدفع وتسجيله على الطلب." };
    }
    if (paymentStatus === "INSTAPAY_PENDING") {
      return { tone: "warning", en: "InstaPay transfer selected. The order is not paid yet.", ar: "تم اختيار InstaPay. الطلب غير مدفوع حتى الآن." };
    }
    if (paymentStatus === "INSTAPAY_VERIFICATION_REQUIRED") {
      return { tone: "warning", en: "Transfer evidence received. Dandle is verifying receipt before marking this order paid.", ar: "تم استلام بيانات التحويل، ويجري داندل التحقق من وصول المبلغ قبل اعتبار الطلب مدفوعًا." };
    }
    if (paymentIsUncertain) {
      return { tone: "warning", en: "Payment confirmation is still pending. Do not pay again yet. Check the status first.", ar: "تأكيد الدفع ما زال معلقًا. لا تدفع مرة أخرى الآن، وتحقق من الحالة أولًا." };
    }
    if (conclusiveFailureStatuses.has(paymentStatus)) {
      return { tone: "error", en: "The last payment attempt did not complete. Your order is still saved.", ar: "لم تكتمل محاولة الدفع السابقة، وما زال طلبك محفوظًا." };
    }
    return null;
  }, [paymentIsUncertain, paymentStatus]);

  const startPayment = async () => {
    if (!reference || !canStartPayTabs) return;
    setIsStartingPayment(true);
    setPaytabsFallbackAvailable(false);
    try {
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.paymentUrl) {
        setPaytabsFallbackAvailable(Boolean(data?.fallbackAvailable));
        throw new Error(data?.error || "Online card payment is not available for this order yet.");
      }
      window.location.assign(data.paymentUrl);
    } catch (err) {
      toast.error("PayTabs payment not started", {
        description: err instanceof Error ? err.message : "Your order is still saved. You can try again.",
      });
      setIsStartingPayment(false);
      await fetchOrderStatus();
    }
  };

  const startInstapay = async () => {
    if (!reference || !canOfferInstapay) return;
    setIsStartingInstapay(true);
    try {
      const response = await fetch("/api/instapay-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.recipient?.id) {
        throw new Error(data?.error || "InstaPay fallback is not available for this order.");
      }
      setInstapayIntent(data as InstapayIntent);
      setPaytabsFallbackAvailable(false);
      await fetchOrderStatus();
    } catch (err) {
      toast.error("InstaPay not started", {
        description: err instanceof Error ? err.message : "Please try again later.",
      });
    } finally {
      setIsStartingInstapay(false);
    }
  };

  const submitInstapayEvidence = async () => {
    if (!reference || !instapayIntent) return;
    setIsSubmittingTransfer(true);
    try {
      const response = await fetch("/api/instapay-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, transactionReference: transferReference }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Transfer evidence could not be submitted.");
      toast.success("Transfer sent for verification", {
        description: "Dandle will verify receipt before the order is marked paid.",
      });
      await fetchOrderStatus();
    } catch (err) {
      toast.error("Could not submit transfer", {
        description: err instanceof Error ? err.message : "Please contact Dandle with your order reference.",
      });
    } finally {
      setIsSubmittingTransfer(false);
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

              {paymentMessage && (
                <div className="rounded-lg border border-border p-4 space-y-1">
                  <p className="text-sm font-medium">{paymentMessage.en}</p>
                  <p className="text-sm text-muted-foreground" dir="rtl" lang="ar">{paymentMessage.ar}</p>
                </div>
              )}

              {paymentIsUncertain && (
                <Button variant="outline" onClick={fetchOrderStatus} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />Check payment status again
                </Button>
              )}

              {canStartPayTabs && (
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">40% deposit</h3>
                      <p className="mt-1 text-sm text-muted-foreground">PayTabs is the primary payment method. The server re-checks this order and the payable amount before creating a hosted payment page.</p>
                    </div>
                    <Button onClick={startPayment} disabled={isStartingPayment}>
                      {isStartingPayment ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      Pay via PayTabs
                    </Button>
                  </div>
                </div>
              )}

              {canOfferInstapay && !instapayIntent && (
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Pay with InstaPay instead</h3>
                      <p className="text-sm text-muted-foreground mt-1">Your order is still saved. InstaPay will use the same order reference and the same server-verified 40% deposit amount.</p>
                      <p className="text-sm text-muted-foreground mt-1" dir="rtl" lang="ar">طلبك ما زال محفوظًا. سيستخدم InstaPay نفس مرجع الطلب ونفس قيمة العربون التي تحقق منها السيرفر.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Button onClick={startInstapay} disabled={isStartingInstapay}>
                      {isStartingInstapay ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Smartphone className="w-4 h-4 mr-2" />}
                      Pay with InstaPay
                    </Button>
                    <Button variant="outline" onClick={startPayment} disabled={isStartingPayment}>Try PayTabs again</Button>
                  </div>
                </div>
              )}

              {instapayIntent && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-semibold">InstaPay transfer</h3>
                      <p className="text-sm text-muted-foreground">This is not marked paid until Dandle verifies receipt.</p>
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Order reference</span><strong className="font-mono">{instapayIntent.reference}</strong></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Exact amount</span><strong>{formatPrice(instapayIntent.amount, instapayIntent.currency)}</strong></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">Recipient</span><strong className="text-right">{instapayIntent.recipient.name}</strong></div>
                    <div className="flex justify-between gap-4"><span className="text-muted-foreground">InstaPay recipient ID</span><strong className="font-mono break-all text-right">{instapayIntent.recipient.id}</strong></div>
                  </div>
                  <div className="rounded-md bg-background p-3 space-y-2">
                    <p className="text-sm">{instapayIntent.instructions.en}</p>
                    <p className="text-sm text-muted-foreground" dir="rtl" lang="ar">{instapayIntent.instructions.ar}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="instapay-transaction-ref">InstaPay transaction reference (optional)</label>
                    <Input
                      id="instapay-transaction-ref"
                      value={transferReference}
                      onChange={(event) => setTransferReference(event.target.value)}
                      maxLength={120}
                      placeholder="Enter the transfer reference if available"
                    />
                  </div>
                  <Button onClick={submitInstapayEvidence} disabled={isSubmittingTransfer} className="w-full">
                    {isSubmittingTransfer ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    I sent the InstaPay transfer
                  </Button>
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
