import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Gift, Trophy, Zap } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [mechanism, setMechanism] = useState<"manual" | "power">("manual");
  const [baseType, setBaseType] = useState<"fixed" | "swivel" | "swivel360">("fixed");
  
  // Add-ons state
  const [giftWrap, setGiftWrap] = useState(false);
  const [engraving, setEngraving] = useState(false);
  const [cupHolder, setCupHolder] = useState(false);
  const [usbPort, setUsbPort] = useState(false);
  const [sidePocket, setSidePocket] = useState(false);
  const [massageFeature, setMassageFeature] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");
  
  const addItem = useCartStore(state => state.addItem);

  // Click sound effect
  const playClickSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnYpBSuBzvLYiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyy3ksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQQxh9Hz04IzBh5uwO/jmUgND1as5++wXRgIPpbb8sZ2KQUrgu7w1Io2Bxppu+3ln00QDFCN4/C2YxwGOJLX8st5LAUkd8fw3ZBAC');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const formatPrice = (price: number) => `${price.toLocaleString('en-US')}`;

  const calculateTotal = () => {
    if (!product) return 0;
    let total = product.priceManual || product.price || 0;
    
    // Mechanism pricing
    if (mechanism === "power") {
      total = product.pricePower || total;
    }
    
    // Base type pricing
    if (baseType === "swivel") total += 1200;
    if (baseType === "swivel360") total += 2500;
    
    // Add-ons pricing
    if (giftWrap) total += 1500;
    if (engraving) total += 3000;
    if (cupHolder) total += 450;
    if (usbPort) total += 750;
    if (sidePocket) total += 350;
    if (massageFeature) total += 9000;
    
    return total;
  };

  const calculateCommission = () => {
    return Math.round(calculateTotal() * 0.035);
  };

  const handleCompleteOrder = () => {
    if (!product) return;

    // Get the first variant or selected variant
    const selectedVariant = product.variants?.edges?.[0]?.node;
    if (!selectedVariant) {
      toast.error("No variant available");
      return;
    }

    const cartItem = {
      variantId: selectedVariant.id,
      productId: product.shopifyId || product.id,
      productName: product.name,
      variantTitle: selectedVariant.title,
      price: parseFloat(selectedVariant.price.amount),
      quantity: 1,
      imageUrl: product.imageUrl,
      selectedOptions: selectedVariant.selectedOptions,
      massageFeature: massageFeature,
      massagePrice: massageFeature ? 9000 : undefined,
    };

    addItem(cartItem);
    toast.success("Added to cart!");
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col">
          {/* Product Header with Image */}
          <div className="bg-gradient-to-b from-accent/5 to-background p-6 border-b animate-in fade-in-0 slide-in-from-top-2 duration-700">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-accent/20 flex-shrink-0 transition-transform duration-300 hover:scale-105">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                <p className="text-muted-foreground">{product.tagline}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Price and Target */}
            <div className="text-center space-y-2 animate-in fade-in-0 slide-in-from-top-2 duration-700">
              <p className="text-4xl font-bold text-accent">EGP {formatPrice(product.priceManual || product.price || 0)}</p>
              <p className="text-muted-foreground">Target: High-performing professionals</p>
            </div>

            {/* Mechanism Type - First */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-100">
              <h3 className="text-xl font-bold">Mechanism Type</h3>
              
              <RadioGroup value={mechanism} onValueChange={(value: string) => {
                playClickSound();
                setMechanism(value as "manual" | "power");
              }} className="grid grid-cols-2 gap-4">
                <label
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center active:scale-95 ${
                    mechanism === "manual"
                      ? 'border-accent bg-accent/10 scale-105 shadow-lg'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <RadioGroupItem value="manual" id="manual" className="sr-only" />
                  <div className="space-y-2">
                    <p className="text-lg font-bold">Manual</p>
                    <p className="text-xl font-bold text-accent">{formatPrice(product.priceManual || product.price || 0)} EGP</p>
                  </div>
                </label>

                <label
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center active:scale-95 ${
                    mechanism === "power"
                      ? 'border-accent bg-accent/10 scale-105 shadow-lg'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <RadioGroupItem value="power" id="power" className="sr-only" />
                  <div className="space-y-2">
                    <p className="text-lg font-bold">Power</p>
                    <p className="text-xl font-bold text-accent">{formatPrice(product.pricePower || product.price || 0)} EGP</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Color Selection - Second */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-200">
              <h3 className="text-xl font-bold">Choose Your Color</h3>
              
              <RadioGroup value={selectedColor} onValueChange={(value) => {
                playClickSound();
                setSelectedColor(value);
              }} className="grid grid-cols-2 gap-3">
                {product.colors?.map((color) => (
                  <label
                    key={color}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                      selectedColor === color 
                        ? 'border-accent bg-accent/10 scale-105 shadow-lg' 
                        : 'border-border hover:border-accent/50 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={color} id={color} />
                      <span className="font-semibold">{color}</span>
                    </div>
                    {selectedColor === color && (
                      <Zap className="w-5 h-5 text-accent animate-in zoom-in-50 duration-300" />
                    )}
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Base Type - Third */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-300">
              <h3 className="text-xl font-bold">Base Type</h3>
              
              <RadioGroup value={baseType} onValueChange={(value: string) => {
                playClickSound();
                setBaseType(value as any);
              }} className="space-y-3">
                <label
                  className={`flex items-center justify-between p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                    baseType === "fixed"
                      ? 'border-accent bg-accent/10 shadow-lg'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <div>
                      <p className="font-bold text-lg">Fixed Base</p>
                      <p className="text-sm text-muted-foreground">Free</p>
                    </div>
                  </div>
                  {baseType === "fixed" && (
                    <Zap className="w-5 h-5 text-accent animate-in zoom-in-50 duration-300" />
                  )}
                </label>

                <label
                  className={`flex items-center justify-between p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                    baseType === "swivel"
                      ? 'border-accent bg-accent/10 shadow-lg'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="swivel" id="swivel" />
                    <div>
                      <p className="font-bold text-lg">Swivel Base</p>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+1,200 EGP</span>
                </label>

                <label
                  className={`flex items-center justify-between p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                    baseType === "swivel360"
                      ? 'border-accent bg-accent/10 shadow-lg'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="swivel360" id="swivel360" />
                    <div>
                      <p className="font-bold text-lg">Swivel + 360° Rotation</p>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+2,500 EGP</span>
                </label>
              </RadioGroup>
            </div>

            {/* Last Touch Section */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-400">
              <h3 className="text-xl font-bold">The Last Touch</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={giftWrap}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setGiftWrap(checked as boolean);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold">Premium Gift Wrapping</p>
                        <p className="text-sm text-muted-foreground">Ribbon with personal message</p>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+1,500 EGP</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={engraving}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setEngraving(checked as boolean);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold">Legacy Plaque</p>
                        <p className="text-sm text-muted-foreground">Custom engraving for memory</p>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+3,000 EGP</span>
                </label>
              </div>
            </div>

            {/* Massage Feature - Only for eligible products */}
            {(product.id === "relaxmax" || product.id === "worknest" || product.id === "spacesaver") && (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-475">
                <h3 className="text-xl font-bold">Premium Therapy</h3>
                
                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-accent/30 hover:border-accent transition-all duration-300 cursor-pointer bg-accent/5 hover:bg-accent/10 active:scale-95">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={massageFeature}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setMassageFeature(checked as boolean);
                      }}
                    />
                    <div>
                      <p className="font-semibold">Massage Feature</p>
                      <p className="text-sm text-muted-foreground">Professional-grade relaxation therapy</p>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+9,000 EGP</span>
                </label>
              </div>
            )}

            {/* Special Additions */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-500">
              <h3 className="text-xl font-bold">Special Additions</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={cupHolder}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setCupHolder(checked as boolean);
                      }}
                    />
                    <span className="font-semibold">Cup Holders</span>
                  </div>
                  <span className="font-bold text-accent">+450 EGP</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={usbPort}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setUsbPort(checked as boolean);
                      }}
                    />
                    <span className="font-semibold">USB Charging Ports</span>
                  </div>
                  <span className="font-bold text-accent">+750 EGP</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={sidePocket}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setSidePocket(checked as boolean);
                      }}
                    />
                    <span className="font-semibold">Side Pocket</span>
                  </div>
                  <span className="font-bold text-accent">+350 EGP</span>
                </label>

                <div className="pt-4">
                  <Label className="text-base font-semibold mb-2 block">Special Instructions</Label>
                  <Textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Any special requests or notes..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom padding for sticky bar */}
            <div className="h-24"></div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-0 left-0 right-0 bg-background border-t-2 border-accent/20 p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{formatPrice(calculateTotal())} EGP</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Service Charge (3.5%)</p>
                <p className="text-2xl font-bold text-accent">{formatPrice(calculateCommission())} EGP</p>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                playClickSound();
                handleCompleteOrder();
              }}
              size="lg"
              className="w-full text-lg font-bold bg-accent hover:bg-accent/90 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="text-xl font-bold">Add to Cart</span> ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
