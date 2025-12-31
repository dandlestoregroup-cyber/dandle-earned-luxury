import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, MessageCircle, Tag, Check, X } from "lucide-react";
import { useShopifyCartStore } from "@/stores/shopifyCartStore";
import { toast } from "sonner";

const VALID_PROMO_CODE = "FESTIVE10";
const PROMO_DISCOUNT = 0.10; // 10%

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const { 
    items, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    createCheckout,
    getTotalItems,
    getTotalPrice,
    clearCart
  } = useShopifyCartStore();
  
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const discount = promoApplied ? subtotal * PROMO_DISCOUNT : 0;
  const totalPrice = subtotal - discount;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === VALID_PROMO_CODE) {
      setPromoApplied(true);
      setPromoError("");
      toast.success("Promo code applied!", { description: "10% discount added to your order" });
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code");
      toast.error("Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoCode("");
    setPromoError("");
  };

  const handleCheckout = async () => {
    const checkoutUrl = await createCheckout();
    if (checkoutUrl) {
      // Add discount code to checkout URL if promo applied
      const finalUrl = promoApplied 
        ? `${checkoutUrl}&discount=${VALID_PROMO_CODE}`
        : checkoutUrl;
      window.open(finalUrl, '_blank');
      clearCart();
      setPromoApplied(false);
      setPromoCode("");
      setIsOpen(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    const itemsText = items.map(item => 
      `• ${item.quantity}x ${item.product.title} (${item.variantTitle}) - ${item.price.currencyCode} ${parseFloat(item.price.amount).toLocaleString()}`
    ).join('%0A');
    
    const promoText = promoApplied ? `%0A%0APromo Code: ${VALID_PROMO_CODE} (10% off)` : '';
    const message = `Hi Dandle! I'd like to order:%0A%0A${itemsText}${promoText}%0A%0ATotal: EGP ${totalPrice.toLocaleString()}`;
    window.open(`https://wa.me/201222804255?text=${message}`, '_blank');
    setIsOpen(false);
  };

  const formatPrice = (amount: string, currency: string = 'EGP') => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-headline text-2xl">Shopping Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-body">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Start browsing our collection</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable items area */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 bg-secondary/20 rounded-lg">
                      <div className="w-20 h-20 bg-secondary/40 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline font-semibold truncate">{item.product.title}</h4>
                        <p className="text-sm text-muted-foreground font-body">
                          {item.variantTitle !== 'Default Title' && item.variantTitle}
                        </p>
                        <p className="font-semibold text-accent mt-1">
                          {formatPrice(item.price.amount, item.price.currencyCode)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fixed checkout section */}
              <div className="flex-shrink-0 space-y-3 pt-4 border-t border-border bg-background">
                {/* Promo Code Input */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError("");
                        }}
                        disabled={promoApplied}
                        className={`pl-9 ${promoApplied ? 'bg-green-50 border-green-500' : promoError ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {promoApplied ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRemovePromo}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={!promoCode.trim()}
                        className="shrink-0"
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                  {promoApplied && (
                    <div className="flex items-center gap-1.5 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>FESTIVE10 applied - 10% off!</span>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-sm text-destructive">{promoError}</p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>EGP {subtotal.toLocaleString()}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-EGP {discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-lg font-headline">Total</span>
                  <span className="text-xl font-bold text-accent">
                    EGP {totalPrice.toLocaleString()}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90" 
                  size="lg"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Checkout...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Checkout with Shopify
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleWhatsAppCheckout}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={items.length === 0}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Order via WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
