import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, RefreshCcw, ListPlus, MessageCircle } from "lucide-react";
import {
  getNourProduct,
  priceFor,
  isMassageAddOnAllowed,
  MASSAGE_ADDON_PRICE,
  TRUST_LINES,
  type Mechanism,
} from "@/lib/nourCatalog";

interface Props {
  productId: string;
  initialMechanism: Mechanism;
  language: "en" | "ar";
  onAddToCart: (sel: { productId: string; mechanism: Mechanism; massage: boolean; price: number }) => void;
  onCheckout: (sel: { productId: string; mechanism: Mechanism; massage: boolean; price: number }) => void;
  onChangeProduct: () => void;
  onContinueBrowsing: () => void;
  onAskWhatsapp: () => void;
}

const T = {
  en: {
    title: "Confirm your selection",
    mechanism: "Type",
    manual: "Manual",
    power: "Power",
    addons: "Add-ons",
    massage: "Massage add-on",
    massagePrice: "+9,000 EGP",
    builtIn: "Built-in massage included",
    notAvailableHere: "Not available for this model",
    total: "Total",
    addToCart: "Add to Cart",
    payNow: "Pay Securely",
    change: "Change Product",
    continue: "Continue Browsing",
    askWa: "Ask on WhatsApp",
    notConfigured: "This product version isn't available right now — please choose another version.",
  },
  ar: {
    title: "أكد اختيارك",
    mechanism: "النوع",
    manual: "يدوي",
    power: "كهرباء",
    addons: "إضافات",
    massage: "إضافة مساج",
    massagePrice: "+٩٬٠٠٠ ج.م",
    builtIn: "مساج مدمج داخل المنتج",
    notAvailableHere: "غير متاح لهذا الموديل",
    total: "الإجمالي",
    addToCart: "أضف إلى السلة",
    payNow: "ادفع بأمان",
    change: "غير المنتج",
    continue: "كمل تصفح",
    askWa: "اسأل على واتساب",
    notConfigured: "النسخة دي غير متاحة حالياً — اختر/اختاري نسخة تانية.",
  },
};

function formatPrice(n: number, lang: "en" | "ar") {
  return lang === "ar"
    ? `${n.toLocaleString("ar-EG")} ج.م`
    : `${n.toLocaleString("en-US")} EGP`;
}

const ConfirmSheet = ({
  productId, initialMechanism, language,
  onAddToCart, onCheckout, onChangeProduct, onContinueBrowsing, onAskWhatsapp,
}: Props) => {
  const t = T[language];
  const product = getNourProduct(productId);
  const [mechanism, setMechanism] = useState<Mechanism>(initialMechanism);
  const [massage, setMassage] = useState(false);

  if (!product) {
    return (
      <div className="bg-warm-white rounded-2xl shadow-luxury border border-bronze/20 p-5 max-w-md">
        <p className="text-charcoal">{t.notConfigured}</p>
        <Button onClick={onChangeProduct} variant="outline" size="sm" className="mt-3">
          {t.change}
        </Button>
      </div>
    );
  }

  const mechAvailable = {
    manual: product.priceManual != null,
    power: product.pricePower != null,
  };
  const activeMech: Mechanism = mechAvailable[mechanism] ? mechanism : (mechAvailable.manual ? "manual" : "power");
  const base = priceFor(product, activeMech) ?? 0;
  const massageAllowed = isMassageAddOnAllowed(product);
  const effectiveMassage = massageAllowed && massage;
  const total = base + (effectiveMassage ? MASSAGE_ADDON_PRICE : 0);

  const selection = { productId: product.id, mechanism: activeMech, massage: effectiveMassage, price: total };

  return (
    <div className="bg-warm-white rounded-2xl shadow-luxury border border-bronze/20 overflow-hidden max-w-md">
      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-headline text-lg text-charcoal">
              {language === "ar" ? product.nameAr : product.name}
            </h3>
            <p className="text-sm text-charcoal/60">{t.title}</p>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-charcoal/70 mb-2">{t.mechanism}</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant={activeMech === "manual" ? "default" : "outline"}
              disabled={!mechAvailable.manual}
              onClick={() => setMechanism("manual")}
              className={activeMech === "manual" ? "bg-dandle-orange hover:bg-dandle-orange/90 text-white" : ""}
            >
              {t.manual}
              {mechAvailable.manual && (
                <span className="ms-2 text-xs opacity-80">{formatPrice(product.priceManual!, language)}</span>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeMech === "power" ? "default" : "outline"}
              disabled={!mechAvailable.power}
              onClick={() => setMechanism("power")}
              className={activeMech === "power" ? "bg-dandle-orange hover:bg-dandle-orange/90 text-white" : ""}
            >
              {t.power}
              {mechAvailable.power && (
                <span className="ms-2 text-xs opacity-80">{formatPrice(product.pricePower!, language)}</span>
              )}
            </Button>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-charcoal/70 mb-2">{t.addons}</div>
          {product.builtInMassage ? (
            <div className="text-sm text-charcoal/70 bg-warm-beige rounded-lg p-3">✓ {t.builtIn}</div>
          ) : massageAllowed ? (
            <label className="flex items-center justify-between p-3 bg-warm-beige rounded-lg cursor-pointer">
              <span className="text-sm text-charcoal">{t.massage}</span>
              <span className="flex items-center gap-2">
                <span className="text-sm text-charcoal/70">{t.massagePrice}</span>
                <input
                  type="checkbox"
                  checked={massage}
                  onChange={(e) => setMassage(e.target.checked)}
                  className="w-4 h-4 accent-dandle-orange"
                />
              </span>
            </label>
          ) : (
            <div className="text-sm text-charcoal/50 italic">{t.notAvailableHere}</div>
          )}
        </div>

        <div className="text-xs text-charcoal/60 border-t border-bronze/10 pt-3 space-y-1">
          <div>{language === "ar" ? TRUST_LINES.delivery_ar : TRUST_LINES.delivery_en}</div>
          <div>{language === "ar" ? TRUST_LINES.warranty_ar : TRUST_LINES.warranty_en}</div>
        </div>

        <div className="flex items-center justify-between border-t border-bronze/10 pt-3">
          <span className="text-sm font-medium text-charcoal/70">{t.total}</span>
          <span className="text-xl font-bold text-dandle-orange">{formatPrice(total, language)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onAddToCart(selection)}
            variant="outline"
            size="sm"
            className="border-bronze/30"
          >
            <ShoppingCart className="w-4 h-4 me-2" />
            {t.addToCart}
          </Button>
          <Button
            onClick={() => onCheckout(selection)}
            size="sm"
            className="bg-dandle-orange hover:bg-dandle-orange/90 text-white"
          >
            <CreditCard className="w-4 h-4 me-2" />
            {t.payNow}
          </Button>
          <Button onClick={onChangeProduct} variant="ghost" size="sm">
            <RefreshCcw className="w-4 h-4 me-2" />
            {t.change}
          </Button>
          <Button onClick={onContinueBrowsing} variant="ghost" size="sm">
            <ListPlus className="w-4 h-4 me-2" />
            {t.continue}
          </Button>
        </div>

        <button
          type="button"
          onClick={onAskWhatsapp}
          className="w-full text-center text-xs text-charcoal/60 hover:text-dandle-orange flex items-center justify-center gap-1 pt-2"
        >
          <MessageCircle className="w-3 h-3" />
          {t.askWa}
        </button>
      </div>
    </div>
  );
};

export default ConfirmSheet;
