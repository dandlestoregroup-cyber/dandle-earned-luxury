import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CheckoutForm, { CustomerData } from '@/components/CheckoutForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (num: number) => `${num.toLocaleString('en-US')} EGP`;

  const handleCheckoutClick = () => {
    setShowCheckoutForm(true);
  };

  const handleFormSubmit = async (customerData: CustomerData) => {
    setIsProcessing(true);

    try {
      // Prepare cart items for the edge function
      const cartItems = items.map(item => {
        let price = item.mechanism === 'power' 
          ? (item.product.pricePower || item.product.price || 0)
          : (item.product.priceManual || item.product.price || 0);
        
        if (item.massageFeature) {
          price += 9000;
        }

        return {
          productId: item.product.id,
          productName: item.product.name,
          variantTitle: `${item.selectedColor}, ${item.mechanism}`,
          color: item.selectedColor,
          mechanism: item.mechanism,
          quantity: item.quantity,
          price,
          massageFeature: item.massageFeature,
          handle: item.product.id.toLowerCase().replace(/\s+/g, '-'),
        };
      });

      // Call edge function to create Shopify order
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          customer: customerData,
          items: cartItems,
          totalPrice: getTotalPrice(),
        },
      });

      let orderReference = '';
      let trackingUrl = '';
      let productLinks: Array<{ name: string; url: string }> = [];

      if (error) {
        console.error('Error creating order:', error);
        // Generate fallback reference
        orderReference = `DN-${Date.now().toString(36).toUpperCase()}`;
        toast.error('Order sync pending', {
          description: 'Your order will be processed via WhatsApp.',
        });
      } else if (data?.success) {
        orderReference = data.order.reference;
        trackingUrl = data.order.trackingUrl;
        productLinks = data.productLinks || [];
        toast.success('Order created!', {
          description: `Reference: ${orderReference}`,
        });
      } else {
        // Use fallback reference from edge function
        orderReference = data?.fallback?.reference || `DN-${Date.now().toString(36).toUpperCase()}`;
      }

      // Build WhatsApp message with order details and links
      const orderDetails = items.map(item => {
        let price = item.mechanism === 'power' 
          ? (item.product.pricePower || item.product.price || 0)
          : (item.product.priceManual || item.product.price || 0);
        
        if (item.massageFeature) {
          price += 9000;
        }
        
        const massageText = item.massageFeature ? ' + Massage' : '';
        const handle = item.product.id.toLowerCase().replace(/\s+/g, '-');
        return `• ${item.quantity}x ${item.product.name} (${item.selectedColor}, ${item.mechanism}${massageText})%0A  ${formatPrice(price * item.quantity)}%0A  🔗 dandle.eg/product/${handle}`;
      }).join('%0A%0A');

      const total = formatPrice(getTotalPrice());
      
      // Build enhanced WhatsApp message
      const message = `🛍️ *New Order ${orderReference}*%0A%0A` +
        `👤 *Customer:* ${customerData.name}%0A` +
        `📱 ${customerData.phone}%0A` +
        `${customerData.email ? `📧 ${customerData.email}%0A` : ''}%0A` +
        `📍 *Delivery Address:*%0A` +
        `${customerData.address}%0A` +
        `${customerData.city}, ${customerData.governorate}%0A%0A` +
        `${customerData.notes ? `📝 *Notes:* ${customerData.notes}%0A%0A` : ''}` +
        `📦 *Order Items:*%0A${orderDetails}%0A%0A` +
        `💰 *Total: ${total}*%0A%0A` +
        `${trackingUrl ? `🔗 Track Order: ${trackingUrl}` : ''}`;
      
      window.open(`https://wa.me/201222804255?text=${message}`, '_blank');
      clearCart();
      navigate('/');
      
    } catch (err) {
      console.error('Checkout error:', err);
      
      // Fallback to original WhatsApp flow
      const orderDetails = items.map(item => {
        let price = item.mechanism === 'power' 
          ? (item.product.pricePower || item.product.price || 0)
          : (item.product.priceManual || item.product.price || 0);
        
        if (item.massageFeature) {
          price += 9000;
        }
        
        const massageText = item.massageFeature ? ' + Massage Feature' : '';
        return `${item.quantity}x ${item.product.name} (${item.selectedColor}, ${item.mechanism}${massageText}) - ${formatPrice(price * item.quantity)}`;
      }).join('%0A');

      const total = formatPrice(getTotalPrice());
      
      const customerInfo = `
*Customer Details:*
Name: ${customerData.name}
Phone: ${customerData.phone}
${customerData.email ? `Email: ${customerData.email}` : ''}

*Delivery Address:*
${customerData.address}
${customerData.city}, ${customerData.governorate}

${customerData.notes ? `*Notes:* ${customerData.notes}%0A%0A` : ''}`;

      const message = `Hello! I'd like to place an order:%0A%0A${customerInfo}%0A*Order Details:*%0A${orderDetails}%0A%0A*Total: ${total}*`;
      
      window.open(`https://wa.me/201222804255?text=${message}`, '_blank');
      clearCart();
      navigate('/');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-32">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Start adding luxury recliners to your collection
            </p>
            <Button onClick={() => navigate('/')} variant="luxury" size="lg">
              Explore Collection
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-32">
        {showCheckoutForm ? (
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setShowCheckoutForm(false)}
              className="mb-6"
              disabled={isProcessing}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <CheckoutForm
              onSubmit={handleFormSubmit}
              onCancel={() => setShowCheckoutForm(false)}
              isProcessing={isProcessing}
            />
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-bold mb-12">Your Cart</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const price = item.mechanism === 'power' 
                ? (item.product.pricePower || item.product.price || 0)
                : (item.product.priceManual || item.product.price || 0);
              
              return (
                <div key={`${item.product.id}-${item.selectedColor}-${item.mechanism}-${index}`} 
                     className="bg-card p-6 rounded-lg flex gap-6">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Color: {item.selectedColor}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mechanism: {item.mechanism}
                    </p>
                    {item.massageFeature && (
                      <p className="text-sm text-accent font-semibold mb-2">
                        ✨ Massage Feature Included
                      </p>
                    )}
                    <p className="text-lg font-semibold text-accent">
                      {formatPrice(item.massageFeature ? price + 9000 : price)}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id, item.selectedColor, item.mechanism)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.selectedColor, item.mechanism, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.selectedColor, item.mechanism, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleCheckoutClick} 
                variant="luxury" 
                size="lg" 
                className="w-full mb-3"
              >
                Proceed to Checkout
              </Button>
              <Button 
                onClick={clearCart} 
                variant="outline" 
                size="lg" 
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
