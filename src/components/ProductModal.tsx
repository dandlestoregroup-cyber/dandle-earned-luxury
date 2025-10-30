import { useState } from "react";
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
  const [specialNotes, setSpecialNotes] = useState("");
  
  const { addItem } = useCart();
  const navigate = useNavigate();

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
    
    return total;
  };

  const calculateCommission = () => {
    return Math.round(calculateTotal() * 0.035);
  };

  const handleCompleteOrder = () => {
    if (!product) return;
    
    addItem(product, selectedColor, mechanism);
    navigate('/cart');
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
            {/* Last Touch Section */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-100">
              <h3 className="text-2xl font-bold text-center mb-6">اللمسة الأخيرة</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={giftWrap}
                      onCheckedChange={(checked) => setGiftWrap(checked as boolean)}
                    />
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold">تغليف الهدايا التذويجي</p>
                        <p className="text-sm text-muted-foreground">شريط مع رسالة شخصية</p>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+1,500 جنيه</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={engraving}
                      onCheckedChange={(checked) => setEngraving(checked as boolean)}
                    />
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold">لوحة الإرث</p>
                        <p className="text-sm text-muted-foreground">نقش مخصص للذكرى</p>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+3,000 جنيه</span>
                </label>
              </div>
            </div>

            {/* Special Additions */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-200">
              <h3 className="text-2xl font-bold text-center mb-6">الإضافات المميزة</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={cupHolder}
                      onCheckedChange={(checked) => setCupHolder(checked as boolean)}
                    />
                    <span className="font-semibold">حاملت الأكواب</span>
                  </div>
                  <span className="font-bold text-accent">+450 جنيه</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={usbPort}
                      onCheckedChange={(checked) => setUsbPort(checked as boolean)}
                    />
                    <span className="font-semibold">منافذ شحن USB</span>
                  </div>
                  <span className="font-bold text-accent">+750 جنيه</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={sidePocket}
                      onCheckedChange={(checked) => setSidePocket(checked as boolean)}
                    />
                    <span className="font-semibold">جيب جانبي</span>
                  </div>
                  <span className="font-bold text-accent">+350 جنيه</span>
                </label>

                <div className="pt-4">
                  <Label className="text-base font-semibold mb-2 block">تعليمات خاصة</Label>
                  <Textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="أي طلبات أو ملاحظات خاصة..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">اختر لونك المفضل</h3>
                <p className="text-muted-foreground">سيتم تحديث الصورة حسب اختيارك</p>
              </div>
              
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="grid grid-cols-2 gap-3">
                {product.colors?.map((color) => (
                  <label
                    key={color}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedColor === color 
                        ? 'border-accent bg-accent/10 scale-105' 
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

            {/* Control Type */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-400">
              <h3 className="text-2xl font-bold text-center mb-6">نوع التحكم</h3>
              
              <RadioGroup value={mechanism} onValueChange={(value: string) => setMechanism(value as "manual" | "power")} className="grid grid-cols-2 gap-4">
                <label
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center ${
                    mechanism === "manual"
                      ? 'border-accent bg-accent/10 scale-105'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <RadioGroupItem value="manual" id="manual" className="sr-only" />
                  <div className="space-y-2">
                    <p className="text-xl font-bold">يدوي</p>
                    <p className="text-2xl font-bold text-accent">{formatPrice(product.priceManual || product.price || 0)} جنيه</p>
                  </div>
                </label>

                <label
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center ${
                    mechanism === "power"
                      ? 'border-accent bg-accent/10 scale-105'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <RadioGroupItem value="power" id="power" className="sr-only" />
                  <div className="space-y-2">
                    <p className="text-xl font-bold">كهربائي</p>
                    <p className="text-2xl font-bold text-accent">{formatPrice(product.pricePower || product.price || 0)} جنيه</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Base Type */}
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-500">
              <h3 className="text-2xl font-bold text-center mb-6">نوع القاعدة</h3>
              
              <RadioGroup value={baseType} onValueChange={(value: string) => setBaseType(value as any)} className="space-y-3">
                <label
                  className={`flex items-center justify-between p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    baseType === "fixed"
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <div>
                      <p className="font-bold text-lg">قاعدة ثابتة</p>
                      <p className="text-sm text-muted-foreground">مجانًا</p>
                    </div>
                  </div>
                  {baseType === "fixed" && (
                    <Zap className="w-5 h-5 text-accent animate-in zoom-in-50 duration-300" />
                  )}
                </label>

                <label
                  className={`flex items-center justify-between p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    baseType === "swivel"
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="swivel" id="swivel" />
                    <div>
                      <p className="font-bold text-lg">قاعدة متأرجحة</p>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+1,200 جنيه</span>
                </label>

                <label
                  className={`flex items-center justify-between p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    baseType === "swivel360"
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="swivel360" id="swivel360" />
                    <div>
                      <p className="font-bold text-lg">متأرجحة + دوارة 360°</p>
                    </div>
                  </div>
                  <span className="font-bold text-accent">+2,500 جنيه</span>
                </label>
              </RadioGroup>
            </div>

            {/* Bottom padding for sticky bar */}
            <div className="h-24"></div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-0 left-0 right-0 bg-background border-t-2 border-accent/20 p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">الإجمالي</p>
                <p className="text-2xl font-bold">{formatPrice(calculateTotal())} جنيه</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">عمولتك (3.5%)</p>
                <p className="text-2xl font-bold text-accent">{formatPrice(calculateCommission())} جنيه</p>
              </div>
            </div>
            
            <Button 
              onClick={handleCompleteOrder}
              size="lg"
              className="w-full text-lg font-bold bg-accent hover:bg-accent/90 transition-all duration-300 hover:scale-105"
            >
              إنهاء الطلب ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
