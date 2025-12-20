import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MessageCircle, ArrowLeft, Clock, CheckCircle2, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrderData {
  reference: string;
  status: string;
  createdAt: string;
  totalPrice: string;
  currencyCode: string;
  customer?: {
    name: string;
    email?: string;
    phone?: string;
  };
  lineItems: Array<{
    title: string;
    variantTitle: string;
    quantity: number;
    price: string;
  }>;
  shippingAddress?: {
    city: string;
    province: string;
    address1: string;
  };
}

const OrderStatus = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setError("No order reference provided");
      setIsLoading(false);
      return;
    }

    // For DN- references, we show a pending status with the reference
    // In a full implementation, this would query Shopify for the order
    const fetchOrderStatus = async () => {
      try {
        // Try to get order from edge function
        const { data, error: fetchError } = await supabase.functions.invoke('get-order-status', {
          body: { reference }
        });

        if (fetchError || !data?.success) {
          // Fallback to showing basic order info from reference
          setOrder({
            reference: reference,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            totalPrice: '0',
            currencyCode: 'EGP',
            lineItems: []
          });
        } else {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        // Show basic pending status
        setOrder({
          reference: reference,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          totalPrice: '0',
          currencyCode: 'EGP',
          lineItems: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStatus();
  }, [reference]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode }> = {
      'PENDING': { label: 'Pending', variant: 'secondary', icon: <Clock className="w-3 h-3 mr-1" /> },
      'CONFIRMED': { label: 'Confirmed', variant: 'default', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
      'IN_PROGRESS': { label: 'In Production', variant: 'outline', icon: <Package className="w-3 h-3 mr-1" /> },
      'SHIPPED': { label: 'Shipped', variant: 'default', icon: <Truck className="w-3 h-3 mr-1" /> },
      'DELIVERED': { label: 'Delivered', variant: 'default', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
      'CANCELLED': { label: 'Cancelled', variant: 'destructive', icon: null },
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    
    return (
      <Badge variant={config.variant} className="flex items-center">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (amount: string, currency: string = 'EGP') => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  const handleWhatsAppHelp = () => {
    const message = `Hi Dandle! I need help with my order ${reference}`;
    window.open(`https://wa.me/201222804255?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-headline mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find an order with reference: {reference}
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>

          {/* Order header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-2xl">Order {order.reference}</CardTitle>
                  <CardDescription className="mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Status message */}
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="font-body text-sm">
                    {order.status === 'PENDING' ? (
                      "Your order has been received and is awaiting confirmation. Our team will contact you shortly via WhatsApp."
                    ) : order.status === 'CONFIRMED' ? (
                      "Your order is confirmed and will enter production soon. Delivery takes up to 14 days."
                    ) : order.status === 'IN_PROGRESS' ? (
                      "Your recliner is being crafted with care by our artisans. Delivery takes up to 14 days."
                    ) : order.status === 'SHIPPED' ? (
                      "Your order is on its way! We confirm your delivery appointment via WhatsApp/phone."
                    ) : order.status === 'DELIVERED' ? (
                      "Your order has been delivered. Enjoy your new Dandle recliner!"
                    ) : (
                      "Contact us for more information about your order."
                    )}
                  </p>
                </div>

                {/* Order items */}
                {order.lineItems.length > 0 && (
                  <div>
                    <h3 className="font-headline text-lg mb-3">Items</h3>
                    <div className="space-y-3">
                      {order.lineItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            {item.variantTitle && item.variantTitle !== 'Default Title' && (
                              <p className="text-sm text-muted-foreground">{item.variantTitle}</p>
                            )}
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">{formatPrice(item.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                {parseFloat(order.totalPrice) > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-headline text-lg">Total</span>
                    <span className="text-xl font-bold text-accent">
                      {formatPrice(order.totalPrice, order.currencyCode)}
                    </span>
                  </div>
                )}

                {/* Delivery address */}
                {order.shippingAddress && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-headline text-lg mb-2">Delivery Address</h3>
                    <p className="text-muted-foreground font-body">
                      {order.shippingAddress.address1}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.province}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Help section */}
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <h3 className="font-headline text-lg mb-2">Need Help?</h3>
                <p className="text-muted-foreground font-body text-sm mb-4">
                  Our team is available to assist you with any questions about your order.
                </p>
                <Button onClick={handleWhatsAppHelp} className="bg-[#25D366] hover:bg-[#128C7E]">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Us on WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderStatus;
