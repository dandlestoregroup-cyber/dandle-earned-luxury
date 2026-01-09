import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Check, Gift, MapPin, Phone, User, 
  Zap, Hand, RotateCcw, Circle, Palette, Package, CreditCard, 
  FileText, Send, Save, Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { lovableCatalog } from "@/catalog/lovableCatalog";
import { PALETTE_MAP, PALETTE_14 } from "@/data/palette";
import { productSwatches } from "@/data/productSwatches";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "201222804255";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface Selection {
  model: string;
  mechanism: "manual" | "power" | "";
  movement: "rocking" | "stable" | "";
  rotation: "360" | "fixed" | "";
  fabric: string;
  color: string;
  colorName: string;
  giftWrap: boolean;
  giftNote: string;
  recipientName: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  pinLocation: string;
  paymentMethod: "cash" | "installments" | "";
  notes: string;
}

const initialSelection: Selection = {
  model: "",
  mechanism: "",
  movement: "",
  rotation: "",
  fabric: "",
  color: "",
  colorName: "",
  giftWrap: false,
  giftNote: "",
  recipientName: "",
  customerName: "",
  phone: "",
  city: "",
  address: "",
  pinLocation: "",
  paymentMethod: "",
  notes: "",
};

// Product data with Arabic names
const models = [
  { handle: "relaxmax", nameEn: "RelaxMax", nameAr: "ريلاكس ماكس", price: 21900, priceWithPower: 28900, hasMechanism: true, hasMovement: true, hasRotation: true },
  { handle: "diva", nameEn: "Diva", nameAr: "ديفا", price: 23900, priceWithPower: 30900, hasMechanism: true, hasMovement: true, hasRotation: true },
  { handle: "comfortplus", nameEn: "ComfortPlus", nameAr: "كمفورت بلس", price: 29900, priceWithPower: 36900, hasMechanism: true, hasMovement: true, hasRotation: true },
  { handle: "worknest", nameEn: "WorkNest", nameAr: "ورك نست", price: 26900, priceWithPower: 33900, hasMechanism: true, hasMovement: false, hasRotation: true },
  { handle: "spacesaver", nameEn: "SpaceSaver", nameAr: "سبيس سيفر", price: 24900, priceWithPower: 29900, hasMechanism: true, hasMovement: false, hasRotation: false },
  { handle: "cozycompanion", nameEn: "CozyCompanion", nameAr: "كوزي كومبانيون", price: 42000, priceWithPower: 54000, hasMechanism: true, hasMovement: false, hasRotation: false },
  { handle: "easyup", nameEn: "EasyUp Standard", nameAr: "إيزي أب ستاندرد", price: 32000, priceWithPower: 32000, hasMechanism: false, hasMovement: false, hasRotation: false },
  { handle: "easyup-compact", nameEn: "EasyUp Compact", nameAr: "إيزي أب كومباكت", price: 42900, priceWithPower: 42900, hasMechanism: false, hasMovement: false, hasRotation: false, limitedColors: true },
  { handle: "complete-set", nameEn: "Complete Set", nameAr: "الطقم الكامل", price: 62900, priceWithPower: 90900, hasMechanism: true, hasMovement: true, hasRotation: true },
];

const cities = [
  "القاهرة", "الجيزة", "الإسكندرية", "المنصورة", "طنطا", "الزقازيق", 
  "أسيوط", "سوهاج", "المنيا", "بني سويف", "الفيوم", "قنا", "أسوان"
];

// EasyUp Compact limited colors
const easyupCompactColors = [
  { key: "navy-blue", nameEn: "Navy Blue", nameAr: "أزرق داكن", hex: "#1E3A5F", material: "OMASH Textured Leather" },
  { key: "stone-grey", nameEn: "Stone Grey", nameAr: "رمادي حجري", hex: "#6B6B6B", material: "OMASH Textured Leather" },
  { key: "espresso-brown", nameEn: "Espresso Brown", nameAr: "بني إسبريسو", hex: "#3C2415", material: "OMASH Textured Leather" },
];

const ChairFinder = () => {
  const [step, setStep] = useState<Step>(1);
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [resumeLink, setResumeLink] = useState<string | null>(null);

  const selectedModel = models.find(m => m.handle === selection.model);
  const swatches = selection.model ? productSwatches[selection.model] || [] : [];
  const isEasyUpCompact = selection.model === "easyup-compact";

  // Calculate price
  const calculatePrice = () => {
    if (!selectedModel) return 0;
    if (selection.mechanism === "power") {
      return selectedModel.priceWithPower;
    }
    return selectedModel.price;
  };

  // Get product image
  const getProductImage = (handle: string) => {
    const product = lovableCatalog.find(p => p.productHandle === handle);
    return product?.heroImage.src || "/images/relaxmax-hero.png";
  };

  // Step validation
  const canProceed = () => {
    switch (step) {
      case 1: return !!selection.model;
      case 2: return !selectedModel?.hasMechanism || !!selection.mechanism;
      case 3: return !selectedModel?.hasMovement || !!selection.movement;
      case 4: return !selectedModel?.hasRotation || !!selection.rotation;
      case 5: return !!selection.color;
      case 6: return true; // EasyUp Compact special - already handled in step 5
      case 7: return true; // Gift options are optional
      case 8: return !!selection.customerName && !!selection.phone && !!selection.city && !!selection.address;
      case 9: return !!selection.paymentMethod;
      case 10: return true;
      default: return true;
    }
  };

  // Skip irrelevant steps
  const getNextStep = (current: Step): Step => {
    let next = (current + 1) as Step;
    
    // Skip mechanism step if not applicable
    if (next === 2 && !selectedModel?.hasMechanism) next = 3 as Step;
    // Skip movement step if not applicable
    if (next === 3 && !selectedModel?.hasMovement) next = 4 as Step;
    // Skip rotation step if not applicable
    if (next === 4 && !selectedModel?.hasRotation) next = 5 as Step;
    // Skip step 6 (EasyUp Compact special) if not EasyUp Compact
    if (next === 6 && !isEasyUpCompact) next = 7 as Step;
    
    return Math.min(next, 10) as Step;
  };

  const getPrevStep = (current: Step): Step => {
    let prev = (current - 1) as Step;
    
    // Skip step 6 if not EasyUp Compact
    if (prev === 6 && !isEasyUpCompact) prev = 5 as Step;
    // Skip rotation if not applicable
    if (prev === 4 && !selectedModel?.hasRotation) prev = 3 as Step;
    // Skip movement if not applicable
    if (prev === 3 && !selectedModel?.hasMovement) prev = 2 as Step;
    // Skip mechanism if not applicable
    if (prev === 2 && !selectedModel?.hasMechanism) prev = 1 as Step;
    
    return Math.max(prev, 1) as Step;
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const model = selectedModel;
    const price = calculatePrice();
    
    return `ملخص طلب Dandle

الموديل: ${model?.nameAr} (${model?.nameEn})
${selection.mechanism ? `الآلية: ${selection.mechanism === "power" ? "كهربائي" : "يدوي"}` : ""}
${selection.movement ? `الحركة: ${selection.movement === "rocking" ? "هزاز" : "ثابت"}` : ""}
${selection.rotation ? `الدوران: ${selection.rotation === "360" ? "360°" : "ثابت"}` : ""}
اللون: ${selection.colorName}

${selection.giftWrap ? `🎁 تغليف هدية: نعم` : ""}
${selection.recipientName ? `اسم المُهدى إليه: ${selection.recipientName}` : ""}
${selection.giftNote ? `رسالة الهدية: ${selection.giftNote}` : ""}

📍 التوصيل
الاسم: ${selection.customerName}
الهاتف: ${selection.phone}
المدينة: ${selection.city}
العنوان: ${selection.address}
${selection.pinLocation ? `📌 الموقع: ${selection.pinLocation}` : ""}

💳 الدفع: ${selection.paymentMethod === "installments" ? "تقسيط" : "كاش"}

السعر: ${price.toLocaleString()} جنيه

${selection.notes ? `ملاحظات: ${selection.notes}` : ""}

---
سياسة الاسترجاع: يمكن الاسترجاع خلال 14 يوم من الاستلام بشرط عدم الاستخدام والاحتفاظ بالتغليف الأصلي.`;
  };

  const handleWhatsAppSend = () => {
    const message = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const handleSaveForLater = () => {
    // Generate a unique ID and save to localStorage
    const id = `dandle-${Date.now()}`;
    const data = { selection, step, savedAt: new Date().toISOString() };
    localStorage.setItem(id, JSON.stringify(data));
    
    const link = `${window.location.origin}/chair-finder?resume=${id}`;
    setResumeLink(link);
    
    // Copy to clipboard
    navigator.clipboard.writeText(link).then(() => {
      toast.success("تم نسخ الرابط! يمكنك متابعة الطلب لاحقاً");
    });
  };

  // Resume from saved state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resumeId = params.get("resume");
    if (resumeId) {
      const saved = localStorage.getItem(resumeId);
      if (saved) {
        const data = JSON.parse(saved);
        setSelection(data.selection);
        setStep(data.step);
        toast.success("تم استعادة طلبك المحفوظ");
      }
    }
  }, []);

  // Progress calculation
  const totalSteps = 10;
  const progress = (step / totalSteps) * 100;

  return (
    <>
      <Helmet>
        <title>دليل اختيار الكرسي | Dandle</title>
        <meta name="description" content="اختر كرسيك المثالي خطوة بخطوة مع دليل Dandle الذكي" />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-off-white pt-28 pb-20" dir="rtl">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-cairo text-3xl md:text-4xl text-deep-brown mb-2">
              دليل اختيار الكرسي
            </h1>
            <p className="text-deep-brown/60">
              {step === 10 ? "راجع طلبك وأرسله" : `الخطوة ${step} من ${totalSteps}`}
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="h-2 bg-deep-brown/10 rounded-full mb-10 overflow-hidden">
            <motion.div
              className="h-full bg-dandle-orange rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Model Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  اختر الموديل
                </h2>
                <div className="grid gap-4">
                  {models.map((model) => (
                    <button
                      key={model.handle}
                      onClick={() => setSelection(s => ({ ...s, model: model.handle }))}
                      className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        selection.model === model.handle
                          ? "border-dandle-orange bg-dandle-orange/5"
                          : "border-deep-brown/10 hover:border-deep-brown/30"
                      }`}
                    >
                      <img 
                        src={getProductImage(model.handle)} 
                        alt={model.nameAr}
                        className="w-16 h-16 object-contain rounded-lg bg-white"
                      />
                      <div className="flex-1 text-right">
                        <span className="block text-lg text-deep-brown font-medium">
                          {model.nameAr}
                        </span>
                        <span className="text-sm text-deep-brown/60">
                          من {model.price.toLocaleString()} جنيه
                        </span>
                        {model.limitedColors && (
                          <span className="text-xs text-dandle-orange block mt-1">
                            ألوان محدودة
                          </span>
                        )}
                      </div>
                      {selection.model === model.handle && (
                        <Check className="w-5 h-5 text-dandle-orange" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Mechanism */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  اختر الآلية
                </h2>
                <div className="grid gap-4">
                  <button
                    onClick={() => setSelection(s => ({ ...s, mechanism: "manual" }))}
                    className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.mechanism === "manual"
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <Hand className={`w-8 h-8 ${selection.mechanism === "manual" ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">يدوي</span>
                      <span className="text-sm text-deep-brown/60">تحكم بسيط ومباشر</span>
                    </div>
                    {selection.mechanism === "manual" && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>
                  <button
                    onClick={() => setSelection(s => ({ ...s, mechanism: "power" }))}
                    className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.mechanism === "power"
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <Zap className={`w-8 h-8 ${selection.mechanism === "power" ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">كهربائي</span>
                      <span className="text-sm text-deep-brown/60">تحكم بالريموت</span>
                      <span className="text-xs text-dandle-orange">
                        +{(selectedModel?.priceWithPower || 0) - (selectedModel?.price || 0)} جنيه
                      </span>
                    </div>
                    {selection.mechanism === "power" && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Movement */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  نوع الحركة
                </h2>
                <div className="grid gap-4">
                  <button
                    onClick={() => setSelection(s => ({ ...s, movement: "rocking" }))}
                    className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.movement === "rocking"
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <RotateCcw className={`w-8 h-8 ${selection.movement === "rocking" ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">هزاز</span>
                      <span className="text-sm text-deep-brown/60">حركة مريحة للاسترخاء</span>
                    </div>
                    {selection.movement === "rocking" && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>
                  <button
                    onClick={() => setSelection(s => ({ ...s, movement: "stable" }))}
                    className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.movement === "stable"
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <Circle className={`w-8 h-8 ${selection.movement === "stable" ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">ثابت</span>
                      <span className="text-sm text-deep-brown/60">ثبات تام على الأرض</span>
                    </div>
                    {selection.movement === "stable" && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Rotation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  الدوران
                </h2>
                <div className="grid gap-4">
                  <button
                    onClick={() => setSelection(s => ({ ...s, rotation: "360" }))}
                    className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.rotation === "360"
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <RotateCcw className={`w-8 h-8 ${selection.rotation === "360" ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">دوار 360°</span>
                      <span className="text-sm text-deep-brown/60">حرية الحركة في كل الاتجاهات</span>
                    </div>
                    {selection.rotation === "360" && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>
                  <button
                    onClick={() => setSelection(s => ({ ...s, rotation: "fixed" }))}
                    className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.rotation === "fixed"
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <Circle className={`w-8 h-8 ${selection.rotation === "fixed" ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">ثابت</span>
                      <span className="text-sm text-deep-brown/60">ثبات في مكانه</span>
                    </div>
                    {selection.rotation === "fixed" && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Color Swatches */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  اختر اللون
                </h2>
                
                {isEasyUpCompact ? (
                  // EasyUp Compact - Limited Colors from OMASH
                  <div className="space-y-4">
                    <p className="text-center text-deep-brown/60 text-sm">
                      جلد OMASH Damsuk الفاخر - ألوان محدودة
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {easyupCompactColors.map((color) => (
                        <button
                          key={color.key}
                          onClick={() => setSelection(s => ({ 
                            ...s, 
                            color: color.key, 
                            colorName: color.nameAr,
                            fabric: color.material 
                          }))}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            selection.color === color.key
                              ? "border-dandle-orange bg-dandle-orange/5"
                              : "border-deep-brown/10 hover:border-deep-brown/30"
                          }`}
                        >
                          <div 
                            className="w-16 h-16 rounded-full border-2 border-deep-brown/10 shadow-inner"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-sm text-deep-brown font-medium text-center">
                            {color.nameAr}
                          </span>
                          {selection.color === color.key && (
                            <Check className="w-4 h-4 text-dandle-orange" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Regular products - Full palette
                  <div className="grid grid-cols-4 gap-3">
                    {swatches.map((swatchKey) => {
                      const color = PALETTE_MAP.get(swatchKey);
                      if (!color) return null;
                      return (
                        <button
                          key={swatchKey}
                          onClick={() => setSelection(s => ({ 
                            ...s, 
                            color: swatchKey, 
                            colorName: color.nameAr,
                            fabric: color.material 
                          }))}
                          className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            selection.color === swatchKey
                              ? "border-dandle-orange bg-dandle-orange/5"
                              : "border-deep-brown/10 hover:border-deep-brown/30"
                          }`}
                        >
                          <div 
                            className="w-12 h-12 rounded-full border border-deep-brown/10 shadow-inner"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs text-deep-brown text-center leading-tight">
                            {color.nameAr}
                          </span>
                          {selection.color === swatchKey && (
                            <Check className="w-3 h-3 text-dandle-orange" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {selection.color && (
                  <div className="bg-white p-4 rounded-xl border border-deep-brown/10 text-center">
                    <p className="text-deep-brown font-medium">{selection.colorName}</p>
                    <p className="text-sm text-deep-brown/60">{selection.fabric}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 6: EasyUp Compact Special (auto-skipped for other products) */}
            {step === 6 && isEasyUpCompact && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  معلومات EasyUp Compact
                </h2>
                <div className="bg-white p-6 rounded-xl border border-deep-brown/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-dandle-orange" />
                    <div>
                      <p className="text-deep-brown font-medium">جلد OMASH Damsuk الفاخر</p>
                      <p className="text-sm text-deep-brown/60">جودة عالية من شريكنا الموثوق</p>
                    </div>
                  </div>
                  <div className="text-sm text-deep-brown/70 space-y-2">
                    <p>• تصميم مدمج يناسب المساحات الصغيرة</p>
                    <p>• نظام رفع كهربائي سلس</p>
                    <p>• ثلاثة ألوان متاحة: أزرق داكن، رمادي حجري، بني إسبريسو</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 7: Gift Options */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  خيارات الهدية
                </h2>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setSelection(s => ({ ...s, giftWrap: !s.giftWrap }))}
                    className={`w-full p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.giftWrap
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <Gift className={`w-8 h-8 ${selection.giftWrap ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">تغليف هدية</span>
                      <span className="text-sm text-deep-brown/60">تغليف فاخر مع شريط</span>
                    </div>
                    {selection.giftWrap && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>

                  {selection.giftWrap && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm text-deep-brown/70 mb-2">اسم المُهدى إليه</label>
                        <Input
                          value={selection.recipientName}
                          onChange={(e) => setSelection(s => ({ ...s, recipientName: e.target.value }))}
                          placeholder="مثال: أحمد"
                          className="text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-deep-brown/70 mb-2">رسالة الهدية (اختياري)</label>
                        <Textarea
                          value={selection.giftNote}
                          onChange={(e) => setSelection(s => ({ ...s, giftNote: e.target.value }))}
                          placeholder="اكتب رسالتك هنا..."
                          className="text-right min-h-[80px]"
                          dir="rtl"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 8: Delivery Info */}
            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  معلومات التوصيل
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-deep-brown/70 mb-2">
                      <User className="w-4 h-4 inline ml-1" />
                      الاسم الكامل *
                    </label>
                    <Input
                      value={selection.customerName}
                      onChange={(e) => setSelection(s => ({ ...s, customerName: e.target.value }))}
                      placeholder="الاسم الكامل"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-deep-brown/70 mb-2">
                      <Phone className="w-4 h-4 inline ml-1" />
                      رقم الهاتف *
                    </label>
                    <Input
                      value={selection.phone}
                      onChange={(e) => setSelection(s => ({ ...s, phone: e.target.value }))}
                      placeholder="01xxxxxxxxx"
                      className="text-right"
                      dir="ltr"
                      type="tel"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-deep-brown/70 mb-2">
                      <MapPin className="w-4 h-4 inline ml-1" />
                      المدينة *
                    </label>
                    <select
                      value={selection.city}
                      onChange={(e) => setSelection(s => ({ ...s, city: e.target.value }))}
                      className="w-full p-3 rounded-lg border border-deep-brown/20 bg-white text-right"
                      dir="rtl"
                    >
                      <option value="">اختر المدينة</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-deep-brown/70 mb-2">العنوان التفصيلي *</label>
                    <Textarea
                      value={selection.address}
                      onChange={(e) => setSelection(s => ({ ...s, address: e.target.value }))}
                      placeholder="الشارع، المبنى، الشقة..."
                      className="text-right min-h-[80px]"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-deep-brown/70 mb-2">
                      رابط الموقع على الخريطة (اختياري)
                    </label>
                    <Input
                      value={selection.pinLocation}
                      onChange={(e) => setSelection(s => ({ ...s, pinLocation: e.target.value }))}
                      placeholder="https://maps.google.com/..."
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 9: Payment */}
            {step === 9 && (
              <motion.div
                key="step9"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  طريقة الدفع
                </h2>
                
                <div className="grid gap-4">
                  <button
                    onClick={() => setSelection(s => ({ ...s, paymentMethod: "cash" }))}
                    className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.paymentMethod === "cash"
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 ${selection.paymentMethod === "cash" ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">كاش عند الاستلام</span>
                      <span className="text-sm text-deep-brown/60">ادفع عند التوصيل</span>
                    </div>
                    {selection.paymentMethod === "cash" && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>
                  
                  <button
                    onClick={() => setSelection(s => ({ ...s, paymentMethod: "installments" }))}
                    className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selection.paymentMethod === "installments"
                        ? "border-dandle-orange bg-dandle-orange/5"
                        : "border-deep-brown/10 hover:border-deep-brown/30"
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 ${selection.paymentMethod === "installments" ? "text-dandle-orange" : "text-deep-brown/40"}`} />
                    <div className="flex-1 text-right">
                      <span className="block text-lg text-deep-brown font-medium">تقسيط</span>
                      <span className="text-sm text-deep-brown/60">سيتم التواصل لتأكيد خيارات التقسيط</span>
                    </div>
                    {selection.paymentMethod === "installments" && <Check className="w-5 h-5 text-dandle-orange" />}
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm text-deep-brown/70 mb-2">ملاحظات إضافية (اختياري)</label>
                  <Textarea
                    value={selection.notes}
                    onChange={(e) => setSelection(s => ({ ...s, notes: e.target.value }))}
                    placeholder="أي ملاحظات خاصة بالطلب..."
                    className="text-right min-h-[80px]"
                    dir="rtl"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 10: Review & Send */}
            {step === 10 && (
              <motion.div
                key="step10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-cairo text-2xl text-deep-brown text-center">
                  مراجعة الطلب
                </h2>
                
                {/* Order Summary */}
                <div className="bg-white rounded-xl border border-deep-brown/10 overflow-hidden">
                  {/* Product */}
                  <div className="p-4 border-b border-deep-brown/10 flex items-center gap-4">
                    <img 
                      src={getProductImage(selection.model)} 
                      alt={selectedModel?.nameAr}
                      className="w-20 h-20 object-contain rounded-lg bg-off-white"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-deep-brown">{selectedModel?.nameAr}</h3>
                      <p className="text-sm text-deep-brown/60">{selectedModel?.nameEn}</p>
                      <p className="text-dandle-orange font-bold mt-1">
                        {calculatePrice().toLocaleString()} جنيه
                      </p>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="p-4 space-y-3 text-sm">
                    {selection.mechanism && (
                      <div className="flex justify-between">
                        <span className="text-deep-brown/60">الآلية</span>
                        <span className="text-deep-brown">{selection.mechanism === "power" ? "كهربائي" : "يدوي"}</span>
                      </div>
                    )}
                    {selection.movement && (
                      <div className="flex justify-between">
                        <span className="text-deep-brown/60">الحركة</span>
                        <span className="text-deep-brown">{selection.movement === "rocking" ? "هزاز" : "ثابت"}</span>
                      </div>
                    )}
                    {selection.rotation && (
                      <div className="flex justify-between">
                        <span className="text-deep-brown/60">الدوران</span>
                        <span className="text-deep-brown">{selection.rotation === "360" ? "360°" : "ثابت"}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-deep-brown/60">اللون</span>
                      <span className="text-deep-brown">{selection.colorName}</span>
                    </div>
                    {selection.giftWrap && (
                      <div className="flex justify-between">
                        <span className="text-deep-brown/60">تغليف هدية</span>
                        <span className="text-dandle-orange">نعم 🎁</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Delivery */}
                  <div className="p-4 border-t border-deep-brown/10 space-y-2 text-sm">
                    <h4 className="font-medium text-deep-brown flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> التوصيل
                    </h4>
                    <p className="text-deep-brown/70">{selection.customerName}</p>
                    <p className="text-deep-brown/70">{selection.phone}</p>
                    <p className="text-deep-brown/70">{selection.city} - {selection.address}</p>
                  </div>
                  
                  {/* Payment */}
                  <div className="p-4 border-t border-deep-brown/10 flex justify-between text-sm">
                    <span className="text-deep-brown/60">طريقة الدفع</span>
                    <span className="text-deep-brown">{selection.paymentMethod === "installments" ? "تقسيط" : "كاش"}</span>
                  </div>
                </div>
                
                {/* Return Policy */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" /> سياسة الاسترجاع
                  </h4>
                  <p className="text-sm text-amber-700">
                    يمكن الاسترجاع خلال 14 يوم من الاستلام بشرط عدم الاستخدام والاحتفاظ بالتغليف الأصلي.
                  </p>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsAppSend}
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white py-6 text-lg"
                  >
                    <Send className="w-5 h-5 ml-2" />
                    إرسال عبر واتساب
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSaveForLater}
                    className="w-full border-deep-brown/20 text-deep-brown"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ والمتابعة لاحقاً
                  </Button>
                  
                  {resumeLink && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                      <Link2 className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm text-green-700">تم نسخ رابط المتابعة!</p>
                        <p className="text-xs text-green-600 truncate">{resumeLink}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 10 && (
            <div className="flex gap-4 mt-10">
              <Button
                onClick={() => setStep(getNextStep(step))}
                disabled={!canProceed()}
                className="flex-1 bg-dandle-orange hover:bg-dandle-orange/90 text-white"
              >
                <span>التالي</span>
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(getPrevStep(step))}
                  className="border-deep-brown/20 text-deep-brown"
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  <span>رجوع</span>
                </Button>
              )}
            </div>
          )}

          {step === 10 && (
            <Button
              variant="ghost"
              onClick={() => {
                setStep(1);
                setSelection(initialSelection);
                setResumeLink(null);
              }}
              className="w-full mt-6 text-deep-brown"
            >
              البدء من جديد
            </Button>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ChairFinder;
