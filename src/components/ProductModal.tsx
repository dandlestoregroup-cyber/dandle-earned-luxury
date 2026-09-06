import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Gift, Trophy, Zap } from "lucide-react";
import { ColorFabricSelector } from "@/components/ColorFabricSelector";
import { colorNameToFabricId, getFabricColorById, allFabricColors } from "@/data/fabricColors";
import { getCartOptionSurcharge, type CartOptions } from "@/lib/cartOptions";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const getAvailableFabricIds = (productColors: string[] = []): string[] => {
  if (productColors.length === 0 || productColors[0] === "Coordinated Styles") {
    return allFabricColors.map((fabric) => fabric.id);
  }
  return productColors.map((colorName) => colorNameToFabricId[colorName] || "alexandria-linen");
};

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const availableFabricIds = useMemo(() => getAvailableFabricIds(product?.colors), [product?.colors]);
  const [selectedFabricId, setSelectedFabricId] = useState(availableFabricIds[0] || "alexandria-linen");
  const [mechanism, setMechanism] = useState<"manual" | "power">("manual");
  const [baseType, setBaseType] = useState<"fixed" | "swivel" | "swivel360">("fixed");
  const [giftWrap, setGiftWrap] = useState(false);
  const [engraving, setEngraving] = useState(false);
  const [cupHolder, setCupHolder] = useState(false);
  const [usbPort, setUsbPort] = useState(false);
  const [sidePocket, setSidePocket] = useState(false);
  const [massageFeature, setMassageFeature] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!product) return;
    const nextFabrics = getAvailableFabricIds(product.colors);
    setSelectedFabricId(nextFabrics[0] || "alexandria-linen");
    setMechanism("manual");
    setBaseType("fixed");
    setGiftWrap(false);
    setEngraving(false);
    setCupHolder(false);
    setUsbPort(false);
    setSidePocket(false);
    setMassageFeature(false);
    setSpecialNotes("");
  }, [product]);

  const playClickSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnYpBSuBzvLYiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyy3ksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQQxh9Hz04IzBh5uwO/jmUgND1as5++wXRgIPpbb8sZ2KQUrgu7w1Io2Bxppu+3ln00QDFCN4/C2YxwGOJLX8st5LAUkd8fw3ZBAC');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const options: CartOptions = {
    baseType,
    giftWrap,
    engraving,
    cupHolder,
    usbPort,
    sidePocket,
    massageFeature,
    specialNotes: specialNotes.trim().slice(0, 800),
  };

  const formatPrice = (price: number) => price.toLocaleString("en-US");

  const calculateTotal = () => {
    if (!product) return 0;
    const basePrice = mechanism === "power"
      ? product.pricePower || product.price || product.priceManual || 0
      : product.priceManual || product.price || product.pricePower || 0;
    return basePrice + getCartOptionSurcharge(options);
  };

  const handleCompleteOrder = () => {
    if (!product) return;
    const selectedFabric = getFabricColorById(selectedFabricId);
    if (!selectedFabric) return;
    const colorName = `${selectedFabric.name} (${selectedFabric.fabric})`;
    addItem(product, colorName, mechanism, options);
    navigate("/cart");
    onClose();
  };

  if (!product) return null;
  const massageEligible = product.id === "relaxmax" || product.id === "worknest" || product.id === "spacesaver";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col">
          <div className="bg-gradient-to-b from-accent/5 to-background p-6 border-b">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-accent/20 flex-shrink-0">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-1">{product.name}</h2>
                <p className="text-sm text-muted-foreground">{product.tagline}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div className="text-center space-y-1">
              <p className="text-2xl md:text-3xl font-bold text-accent">EGP {formatPrice(calculateTotal())}</p>
              <p className="text-sm text-muted-foreground">Your selected configuration</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-bold">Mechanism Type</h3>
              <RadioGroup value={mechanism} onValueChange={(value) => {
                playClickSound();
                if (value === "manual" || value === "power") setMechanism(value);
              }} className="grid grid-cols-2 gap-3">
                <label className={`p-4 rounded-lg border-2 cursor-pointer text-center ${mechanism === "manual" ? "border-accent bg-accent/10" : "border-border"}`}>
                  <RadioGroupItem value="manual" id="manual" className="sr-only" />
                  <p className="font-bold">Manual</p>
                  <p className="font-bold text-accent">{formatPrice(product.priceManual || product.price || 0)} EGP</p>
                </label>
                <label className={`p-4 rounded-lg border-2 cursor-pointer text-center ${mechanism === "power" ? "border-accent bg-accent/10" : "border-border"}`}>
                  <RadioGroupItem value="power" id="power" className="sr-only" />
                  <p className="font-bold">Power</p>
                  <p className="font-bold text-accent">{formatPrice(product.pricePower || product.price || 0)} EGP</p>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold">Select Your Fabric & Color</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
              </div>
              <ColorFabricSelector
                selectedColorId={selectedFabricId}
                onColorSelect={(colorId) => {
                  playClickSound();
                  setSelectedFabricId(colorId);
                }}
                availableColorIds={availableFabricIds}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-bold">Base Type</h3>
              <RadioGroup value={baseType} onValueChange={(value) => {
                playClickSound();
                if (value === "fixed" || value === "swivel" || value === "swivel360") setBaseType(value);
              }} className="space-y-2">
                <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${baseType === "fixed" ? "border-accent bg-accent/10" : "border-border"}`}>
                  <div className="flex items-center gap-2"><RadioGroupItem value="fixed" id="fixed" /><span className="font-bold">Fixed Base</span></div>
                  {baseType === "fixed" ? <Zap className="w-4 h-4 text-accent" /> : <span className="text-sm">Free</span>}
                </label>
                <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${baseType === "swivel" ? "border-accent bg-accent/10" : "border-border"}`}>
                  <div className="flex items-center gap-2"><RadioGroupItem value="swivel" id="swivel" /><span className="font-bold">Swivel Base</span></div>
                  <span className="font-bold text-accent">+1,200 EGP</span>
                </label>
                <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${baseType === "swivel360" ? "border-accent bg-accent/10" : "border-border"}`}>
                  <div className="flex items-center gap-2"><RadioGroupItem value="swivel360" id="swivel360" /><span className="font-bold">Swivel + 360° Rotation</span></div>
                  <span className="font-bold text-accent">+2,500 EGP</span>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-bold">The Last Touch</h3>
              <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border cursor-pointer">
                <div className="flex items-center gap-2">
                  <Checkbox checked={giftWrap} onCheckedChange={(checked) => setGiftWrap(checked === true)} />
                  <Gift className="w-4 h-4 text-accent" /><span className="font-semibold">Premium Gift Wrapping</span>
                </div>
                <span className="font-bold text-accent">+1,500 EGP</span>
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border cursor-pointer">
                <div className="flex items-center gap-2">
                  <Checkbox checked={engraving} onCheckedChange={(checked) => setEngraving(checked === true)} />
                  <Trophy className="w-4 h-4 text-accent" /><span className="font-semibold">Legacy Plaque</span>
                </div>
                <span className="font-bold text-accent">+3,000 EGP</span>
              </label>
            </div>

            {massageEligible && (
              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-bold">Premium Therapy</h3>
                <label className="flex items-center justify-between p-3 rounded-lg border-2 border-accent/30 cursor-pointer bg-accent/5">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={massageFeature} onCheckedChange={(checked) => setMassageFeature(checked === true)} />
                    <span className="font-semibold">Massage Feature</span>
                  </div>
                  <span className="font-bold text-accent">+9,000 EGP</span>
                </label>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-bold">Special Additions</h3>
              <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border cursor-pointer">
                <div className="flex items-center gap-2"><Checkbox checked={cupHolder} onCheckedChange={(checked) => setCupHolder(checked === true)} /><span className="font-semibold">Cup Holders</span></div>
                <span className="font-bold text-accent">+450 EGP</span>
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border cursor-pointer">
                <div className="flex items-center gap-2"><Checkbox checked={usbPort} onCheckedChange={(checked) => setUsbPort(checked === true)} /><span className="font-semibold">USB Charging Ports</span></div>
                <span className="font-bold text-accent">+750 EGP</span>
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border cursor-pointer">
                <div className="flex items-center gap-2"><Checkbox checked={sidePocket} onCheckedChange={(checked) => setSidePocket(checked === true)} /><span className="font-semibold">Side Pocket</span></div>
                <span className="font-bold text-accent">+350 EGP</span>
              </label>
              <div className="pt-3">
                <Label className="text-sm font-semibold mb-1 block">Special Instructions</Label>
                <Textarea
                  value={specialNotes}
                  onChange={(event) => setSpecialNotes(event.target.value.slice(0, 800))}
                  placeholder="Any special requests or notes..."
                  className="min-h-[60px] resize-none text-sm"
                />
              </div>
            </div>

            <div className="h-20" />
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-background border-t-2 border-accent/20 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Configuration total</p>
                <p className="text-xl font-bold">{formatPrice(calculateTotal())} EGP</p>
              </div>
              <p className="text-xs text-muted-foreground text-right">Final checkout total is recalculated by Dandle server-side.</p>
            </div>
            <Button
              onClick={() => {
                playClickSound();
                handleCompleteOrder();
              }}
              size="lg"
              className="w-full text-base font-bold bg-accent hover:bg-accent/90"
            >
              Add Exact Configuration to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
