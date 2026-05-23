import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, RefreshCcw, ListPlus, Loader2 } from "lucide-react";

interface Props {
  roomImage: string;
  productImage: string;
  productName: string;
  language: "en" | "ar";
  isRendering: boolean;
  renderedImage?: string;
  onAddToCart: () => void;
  onPayNow: () => void;
  onChangeProduct: () => void;
  onContinueBrowsing: () => void;
}

const T = {
  en: {
    label: "Placement preview",
    sub: "Approximate room-fit preview — not a final render.",
    rendering: "Nour is sketching a placement preview…",
    addToCart: "Add to Cart",
    payNow: "Pay Securely",
    change: "Change Product",
    continue: "Continue Browsing",
  },
  ar: {
    label: "معاينة مكان الكرسي",
    sub: "معاينة تقريبية للمكان — مش رندر نهائي.",
    rendering: "نور بترسم معاينة المكان…",
    addToCart: "أضف إلى السلة",
    payNow: "ادفع بأمان",
    change: "غير المنتج",
    continue: "كمل تصفح",
  },
};

const RoomPreview = ({
  roomImage, productImage, productName, language, isRendering, renderedImage,
  onAddToCart, onPayNow, onChangeProduct, onContinueBrowsing,
}: Props) => {
  const t = T[language];
  const display = renderedImage ?? roomImage;

  return (
    <div className="bg-warm-white rounded-2xl shadow-luxury border border-bronze/20 overflow-hidden max-w-md">
      <div className="relative aspect-[4/3] bg-warm-beige">
        <img src={display} alt={productName} className="w-full h-full object-cover" />
        {!renderedImage && (
          <img
            src={productImage}
            alt={productName}
            className="absolute bottom-4 end-4 w-1/3 max-w-[160px] rounded-md shadow-luxury border-2 border-warm-white opacity-90"
          />
        )}
        {isRendering && (
          <div className="absolute inset-0 bg-warm-white/70 flex items-center justify-center">
            <div className="flex items-center gap-2 text-charcoal">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{t.rendering}</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 start-3 bg-warm-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-charcoal">
          {t.label}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs text-charcoal/60">{t.sub}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onAddToCart} variant="outline" size="sm" className="border-bronze/30">
            <ShoppingCart className="w-4 h-4 me-2" />
            {t.addToCart}
          </Button>
          <Button onClick={onPayNow} size="sm" className="bg-dandle-orange hover:bg-dandle-orange/90 text-white">
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
      </div>
    </div>
  );
};

export default RoomPreview;
