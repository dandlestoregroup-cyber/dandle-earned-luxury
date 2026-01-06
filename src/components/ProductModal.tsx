import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
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
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";
import { generateProductSchema } from "@/utils/structuredData";

// Arabic translations for modal
const modalTranslations = {
  mechanismType: { en: "Mechanism Type", ar: "نوع الآلية" },
  manual: { en: "Manual", ar: "يدوي" },
  power: { en: "Power", ar: "كهربائي" },
  chooseColor: { en: "Choose Your Color", ar: "اختر لونك" },
  baseType: { en: "Base Type", ar: "نوع القاعدة" },
  fixedBase: { en: "Fixed Base", ar: "قاعدة ثابتة" },
  swivelBase: { en: "Swivel Base", ar: "قاعدة دوّارة" },
  free: { en: "Free", ar: "مجاناً" },
  rockingBase: { en: "Rocking Base", ar: "قاعدة هزازة" },
  stableBase: { en: "Stable Base", ar: "قاعدة ثابتة" },
  soothingMovement: { en: "Soothing movement", ar: "حركة مريحة" },
  groundedLuxury: { en: "Grounded stability", ar: "ثبات متين" },
  lastTouch: { en: "The Last Touch", ar: "اللمسة الأخيرة" },
  giftWrap: { en: "Premium Gift Wrapping", ar: "تغليف هدايا فاخر" },
  giftWrapDesc: { en: "Ribbon with personal message", ar: "شريط مع رسالة شخصية" },
  legacyPlaque: { en: "Legacy Plaque", ar: "لوحة تذكارية" },
  legacyPlaqueDesc: { en: "Custom engraving for memory", ar: "نقش مخصص للذكرى" },
  premiumTherapy: { en: "Premium Therapy", ar: "علاج فاخر" },
  optionalAddOn: { en: "Optional Add-On", ar: "إضافة اختيارية" },
  massageSystem: { en: "Integrated Massage System", ar: "نظام مساج متكامل" },
  massageDesc: { en: "Professional-grade relaxation therapy", ar: "علاج استرخاء احترافي" },
  specialAdditions: { en: "Special Additions", ar: "إضافات خاصة" },
  cupHolders: { en: "Cup Holders", ar: "حاملات الأكواب" },
  usbPorts: { en: "USB Charging Ports", ar: "منافذ شحن USB" },
  sidePocket: { en: "Side Pocket", ar: "جيب جانبي" },
  specialInstructions: { en: "Special Instructions", ar: "تعليمات خاصة" },
  specialNotesPlaceholder: { en: "Any special requests or notes...", ar: "أي طلبات أو ملاحظات خاصة..." },
  total: { en: "Total", ar: "الإجمالي" },
  sellingCharge: { en: "Selling Charge", ar: "عمولة البيع" },
  completeOrder: { en: "Complete Order", ar: "إتمام الطلب" },
  configureCozy: { en: "Configure Your CozyCompanion", ar: "تخصيص كوزي كومبانيون" },
  chooseBaseExperience: { en: "Choose your preferred base experience", ar: "اختر تجربة القاعدة المفضلة لديك" },
  target: { en: "Target: High-performing professionals", ar: "الفئة المستهدفة: المحترفون المتميزون" },
};

// Arabic product names for modal
const productNamesAr: Record<string, string> = {
  relaxmax: "ريلاكس ماكس",
  comfortplus: "كومفورت بلس",
  diva: "ديفا",
  cozycompanion: "كوزي كومبانيون",
  easyup: "إيزي أب",
  "easyup-compact": "إيزي أب كومباكت",
  worknest: "وورك نست",
  spacesaver: "سبيس سيفر",
  "complete-set": "طقم العائلة",
};

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [mechanism, setMechanism] = useState<"manual" | "power">("manual");
  const [baseType, setBaseType] = useState<"fixed" | "swivel">("fixed");
  const [cozyBaseType, setCozyBaseType] = useState<"rocking" | "stable">("stable");
  
  // Language state
  const [lang, setLang] = useState<LangKey>('en');
  
  useEffect(() => {
    const storedLang = getLangFromStorage();
    setLang(storedLang);
    const interval = setInterval(() => {
      const currentLang = getLangFromStorage();
      setLang(prev => prev !== currentLang ? currentLang : prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  const isArabic = lang === 'ar';
  const t = (key: keyof typeof modalTranslations) => 
    isArabic ? modalTranslations[key].ar : modalTranslations[key].en;
  
  // Add-ons state
  const [giftWrap, setGiftWrap] = useState(false);
  const [engraving, setEngraving] = useState(false);
  const [cupHolder, setCupHolder] = useState(false);
  const [usbPort, setUsbPort] = useState(false);
  const [sidePocket, setSidePocket] = useState(false);
  const [massageFeature, setMassageFeature] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");
  
  const isCozyCompanion = product?.id === "cozycompanion";
  
  const { addItem } = useCart();
  const navigate = useNavigate();

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
    return Math.round(calculateTotal() * 0.07); // 7% for registered resellers
  };

  const handleCompleteOrder = () => {
    if (!product) return;
    
    addItem(product, selectedColor, mechanism, massageFeature);
    navigate('/cart');
    onClose();
  };

  if (!product) return null;

  // Load gallery from Lovable catalog if available
  const lovableProduct = getLovableProduct(product.id);
  const gallery = lovableProduct?.gallery.length
    ? lovableProduct.gallery
    : lovableProduct?.heroImage
    ? [lovableProduct.heroImage]
    : [];
  const hasGallery = gallery.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(generateProductSchema(product))}
        </script>
      </Helmet>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-500" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex flex-col">
          {/* Product Header with Image */}
          <div className="bg-gradient-to-b from-accent/5 to-background p-6 border-b animate-in fade-in-0 slide-in-from-top-2 duration-700">
            <div className={`flex items-center gap-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-accent/20 flex-shrink-0 transition-transform duration-300 hover:scale-105">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={isArabic ? 'text-right' : ''}>
                <h2 className="text-xl md:text-2xl font-bold mb-1">
                  {isArabic && productNamesAr[product.id] ? productNamesAr[product.id] : product.name}
                </h2>
                <p className="text-sm text-muted-foreground">{product.tagline}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Price, Target, and Trust Signals */}
            <div className="text-center space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-700">
              <p className="text-xl md:text-2xl font-bold text-accent">{formatPrice(product.priceManual || product.price || 0)} EGP</p>
              <p className="text-xs md:text-sm text-muted-foreground">{t('target')}</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="text-green-600">✓</span> 
                  <span data-en="14-Day Delivery" data-ar="توصيل خلال 14 يوم">14-Day Delivery</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-600">✓</span> 
                  <span data-en="5-Year Warranty" data-ar="ضمان 5 سنوات">5-Year Warranty</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-600">✓</span> 
                  <span data-en="Free Installation" data-ar="تركيب مجاني">Free Installation</span>
                </span>
              </div>
            </div>

            {/* Mechanism Type - First */}
            <div className="space-y-2 md:space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-100">
              <h3 className="text-base md:text-lg font-bold">{t('mechanismType')}</h3>
              
              <RadioGroup value={mechanism} onValueChange={(value: string) => {
                playClickSound();
                setMechanism(value as "manual" | "power");
              }} className="grid grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center active:scale-95 ${
                    mechanism === "manual"
                      ? 'border-accent bg-accent/10 scale-105 shadow-lg'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <RadioGroupItem value="manual" id="manual" className="sr-only" />
                  <div className="space-y-1">
                    <p className="text-sm md:text-base font-bold">{t('manual')}</p>
                    <p className="text-base md:text-lg font-bold text-accent">{formatPrice(product.priceManual || product.price || 0)} EGP</p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center active:scale-95 ${
                    mechanism === "power"
                      ? 'border-accent bg-accent/10 scale-105 shadow-lg'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <RadioGroupItem value="power" id="power" className="sr-only" />
                  <div className="space-y-1">
                    <p className="text-sm md:text-base font-bold">{t('power')}</p>
                    <p className="text-base md:text-lg font-bold text-accent">{formatPrice(product.pricePower || product.price || 0)} EGP</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Color Selection - Second */}
            <div className="space-y-2 md:space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-200">
              <h3 className="text-base md:text-lg font-bold">{t('chooseColor')}</h3>
              
              <RadioGroup value={selectedColor} onValueChange={(value) => {
                playClickSound();
                setSelectedColor(value);
              }} className="grid grid-cols-2 gap-3">
                {product.colors?.map((color) => (
                  <label
                    key={color}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                      selectedColor === color 
                        ? 'border-accent bg-accent/10 scale-105 shadow-lg' 
                        : 'border-border hover:border-accent/50 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={color} id={color} />
                      <span className="text-sm font-semibold">{color}</span>
                    </div>
                    {selectedColor === color && (
                      <Zap className="w-5 h-5 text-accent animate-in zoom-in-50 duration-300" />
                    )}
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Base Type - Third (Standard Products) */}
            {!isCozyCompanion && (
              <div className="space-y-2 md:space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-300">
                <h3 className="text-base md:text-lg font-bold">{t('baseType')}</h3>
                
                <RadioGroup value={baseType} onValueChange={(value: string) => {
                  playClickSound();
                  setBaseType(value as any);
                }} className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                      baseType === "fixed"
                        ? 'border-accent bg-accent/10 shadow-lg'
                        : 'border-border hover:border-accent/50 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <div>
                        <p className="font-bold text-sm md:text-base">{t('fixedBase')}</p>
                        <p className="text-xs text-muted-foreground">{t('free')}</p>
                      </div>
                    </div>
                    {baseType === "fixed" && (
                      <Zap className="w-4 h-4 text-accent animate-in zoom-in-50 duration-300" />
                    )}
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                      baseType === "swivel"
                        ? 'border-accent bg-accent/10 shadow-lg'
                        : 'border-border hover:border-accent/50 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="swivel" id="swivel" />
                      <div>
                        <p className="font-bold text-sm md:text-base">{t('swivelBase')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-accent">+1,200 EGP</span>
                  </label>

                </RadioGroup>
              </div>
            )}

            {/* CozyCompanion Base Type - Rocking or Stable */}
            {isCozyCompanion && (
              <div className="space-y-2 md:space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-300">
                <h3 className="text-base md:text-lg font-bold">{t('configureCozy')}</h3>
                <p className="text-muted-foreground text-xs">{t('chooseBaseExperience')}</p>
                
                <RadioGroup value={cozyBaseType} onValueChange={(value: string) => {
                  playClickSound();
                  setCozyBaseType(value as "rocking" | "stable");
                }} className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                      cozyBaseType === "rocking"
                        ? 'border-accent bg-accent/10 shadow-lg'
                        : 'border-border hover:border-accent/50 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="rocking" id="rocking" />
                      <div>
                        <p className="font-bold text-sm md:text-base">{t('rockingBase')}</p>
                        <p className="text-xs text-muted-foreground">{t('soothingMovement')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-accent">{t('free')}</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 active:scale-95 ${
                      cozyBaseType === "stable"
                        ? 'border-accent bg-accent/10 shadow-lg'
                        : 'border-border hover:border-accent/50 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="stable" id="stable" />
                      <div>
                        <p className="font-bold text-sm md:text-base">{t('stableBase')}</p>
                        <p className="text-xs text-muted-foreground">{t('groundedLuxury')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-accent">{t('free')}</span>
                  </label>
                </RadioGroup>
              </div>
            )}

            {/* Last Touch Section */}
            <div className="space-y-2 md:space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-400">
              <h3 className="text-base md:text-lg font-bold">{t('lastTouch')}</h3>
              
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={giftWrap}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setGiftWrap(checked as boolean);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-sm font-semibold">{t('giftWrap')}</p>
                        <p className="text-xs text-muted-foreground">{t('giftWrapDesc')}</p>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-accent">+1,500 EGP</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={engraving}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setEngraving(checked as boolean);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-sm font-semibold">{t('legacyPlaque')}</p>
                        <p className="text-xs text-muted-foreground">{t('legacyPlaqueDesc')}</p>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-accent">+3,000 EGP</span>
                </label>
              </div>
            </div>

            {/* Massage Feature - For eligible products including CozyCompanion */}
            {(product.id === "relaxmax" || product.id === "worknest" || product.id === "spacesaver" || product.id === "cozycompanion") && (
              <div className="space-y-2 md:space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-475">
                <h3 className="text-base md:text-lg font-bold">{isCozyCompanion ? t('optionalAddOn') : t('premiumTherapy')}</h3>
                
                <label className="flex items-center justify-between p-3 rounded-lg border-2 border-accent/30 hover:border-accent transition-all duration-300 cursor-pointer bg-accent/5 hover:bg-accent/10 active:scale-95">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={massageFeature}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setMassageFeature(checked as boolean);
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{t('massageSystem')}</p>
                      <p className="text-xs text-muted-foreground">{t('massageDesc')}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-accent">+9,000 EGP</span>
                </label>
              </div>
            )}

            {/* Special Additions */}
            <div className="space-y-2 md:space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-500">
              <h3 className="text-base md:text-lg font-bold">{t('specialAdditions')}</h3>
              
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={cupHolder}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setCupHolder(checked as boolean);
                      }}
                    />
                    <span className="text-sm font-semibold">{t('cupHolders')}</span>
                  </div>
                  <span className="font-bold text-sm text-accent">+450 EGP</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={usbPort}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setUsbPort(checked as boolean);
                      }}
                    />
                    <span className="text-sm font-semibold">{t('usbPorts')}</span>
                  </div>
                  <span className="font-bold text-sm text-accent">+750 EGP</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border-2 border-border hover:border-accent transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5 active:scale-95">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={sidePocket}
                      onCheckedChange={(checked) => {
                        playClickSound();
                        setSidePocket(checked as boolean);
                      }}
                    />
                    <span className="text-sm font-semibold">{t('sidePocket')}</span>
                  </div>
                  <span className="font-bold text-sm text-accent">+350 EGP</span>
                </label>

                <div className="pt-3">
                  <Label className="text-sm font-semibold mb-1 block">{t('specialInstructions')}</Label>
                  <Textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder={t('specialNotesPlaceholder')}
                    className="min-h-[70px] resize-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Bottom padding for sticky bar */}
            <div className="h-24"></div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-0 left-0 right-0 bg-background border-t-2 border-accent/20 p-4 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
            <div className={`flex items-center justify-between mb-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className={isArabic ? 'text-left' : 'text-right'}>
                <p className="text-sm text-muted-foreground">{t('total')}</p>
                <p className="text-2xl font-bold">{formatPrice(calculateTotal())} EGP</p>
              </div>
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <p className="text-xs text-muted-foreground">{t('sellingCharge')}</p>
                <p className="text-sm font-medium text-accent">{formatPrice(calculateCommission())} EGP</p>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                playClickSound();
                handleCompleteOrder();
              }}
              size="lg"
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white py-4 text-lg font-medium transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span data-en="Order via WhatsApp" data-ar="اطلب عبر واتساب">Order via WhatsApp</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
