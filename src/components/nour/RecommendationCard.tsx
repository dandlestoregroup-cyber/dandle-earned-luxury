import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, ArrowRightLeft, ListPlus } from "lucide-react";
import { TRUST_LINES } from "@/lib/nourCatalog";

export type Mechanism = "manual" | "power";

export interface RecommendationRec {
  rank: number;
  product_id: string;
  product_name: string;
  product_image: string;
  fit_score: number;
  confidence: "high" | "medium" | "low";
  reason_short: string;
  reason_detailed: string;
  placement_intent: string;
  default_mechanism: Mechanism;
  default_price: number;
  massage_addon_eligible: boolean;
  built_in_massage: boolean;
}

interface Props {
  rec: RecommendationRec;
  alternatives: RecommendationRec[];
  language: "en" | "ar";
  onViewProduct: (rec: RecommendationRec) => void;
  onSeeInRoom: (rec: RecommendationRec) => void;
  onShowOthers: () => void;
  onContinueBrowsing: () => void;
  onSelectAlternative: (rec: RecommendationRec) => void;
}

function formatPrice(n: number, lang: "en" | "ar") {
  return lang === "ar"
    ? `${n.toLocaleString("ar-EG")} ج.م`
    : `${n.toLocaleString("en-US")} EGP`;
}

const T = {
  en: {
    bestPick: "Best pick for your room",
    confidence: "Confidence",
    high: "High",
    medium: "Medium",
    low: "Low",
    viewProduct: "View Product",
    seeInRoom: "See It in My Room",
    showOthers: "Show Other Options",
    continueBrowsing: "Continue Browsing",
    whyShort: "Why this fits",
    altsTitle: "Other options",
    builtInMassage: "Built-in massage included",
    massageEligible: "Massage add-on available",
  },
  ar: {
    bestPick: "أنسب اختيار لأوضتك",
    confidence: "الثقة",
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
    viewProduct: "عرض المنتج",
    seeInRoom: "شوفه في أوضتك",
    showOthers: "شوف اختيارات تانية",
    continueBrowsing: "كمل تصفح",
    whyShort: "ليه ده يناسبك",
    altsTitle: "اختيارات تانية",
    builtInMassage: "مساج مدمج داخل المنتج",
    massageEligible: "إمكانية إضافة المساج",
  },
};

const RecommendationCard = ({
  rec, alternatives, language,
  onViewProduct, onSeeInRoom, onShowOthers, onContinueBrowsing, onSelectAlternative,
}: Props) => {
  const t = T[language];
  const confidenceLabel = t[rec.confidence];

  return (
    <div className="bg-warm-white rounded-2xl shadow-luxury border border-bronze/20 overflow-hidden max-w-md">
      <div className="aspect-[16/9] bg-warm-beige relative">
        <img src={rec.product_image} alt={rec.product_name} className="w-full h-full object-cover" />
        <div className="absolute top-3 start-3 bg-warm-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-charcoal">
          {t.bestPick}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-headline text-xl text-charcoal">{rec.product_name}</h3>
          <p className="text-charcoal/70 text-sm mt-1">{rec.reason_short}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-charcoal">
            {formatPrice(rec.default_price, language)}
            <span className="text-charcoal/50 font-normal ms-1">
              ({rec.default_mechanism === "power" ? (language === "ar" ? "كهرباء" : "Power") : (language === "ar" ? "يدوي" : "Manual")})
            </span>
          </span>
          <span className="text-xs text-charcoal/60">
            {t.confidence}: {confidenceLabel}
          </span>
        </div>

        {(rec.built_in_massage || rec.massage_addon_eligible) && (
          <div className="text-xs text-charcoal/70">
            {rec.built_in_massage ? `✓ ${t.builtInMassage}` : `+ ${t.massageEligible}`}
          </div>
        )}

        {rec.reason_detailed && rec.reason_detailed !== rec.reason_short && (
          <details className="text-sm">
            <summary className="cursor-pointer text-dandle-orange font-medium">{t.whyShort}</summary>
            <p className="mt-2 text-charcoal/70 leading-relaxed">{rec.reason_detailed}</p>
          </details>
        )}

        <div className="text-xs text-charcoal/60 border-t border-bronze/10 pt-3 space-y-1">
          <div>{language === "ar" ? TRUST_LINES.delivery_ar : TRUST_LINES.delivery_en}</div>
          <div>{language === "ar" ? TRUST_LINES.warranty_ar : TRUST_LINES.warranty_en}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            onClick={() => onViewProduct(rec)}
            variant="outline"
            size="sm"
            className="border-bronze/30"
          >
            <Eye className="w-4 h-4 me-2" />
            {t.viewProduct}
          </Button>
          <Button
            onClick={() => onSeeInRoom(rec)}
            size="sm"
            className="bg-dandle-orange hover:bg-dandle-orange/90 text-white"
          >
            <ShoppingCart className="w-4 h-4 me-2" />
            {t.seeInRoom}
          </Button>
          {alternatives.length > 0 && (
            <Button onClick={onShowOthers} variant="ghost" size="sm">
              <ArrowRightLeft className="w-4 h-4 me-2" />
              {t.showOthers}
            </Button>
          )}
          <Button onClick={onContinueBrowsing} variant="ghost" size="sm">
            <ListPlus className="w-4 h-4 me-2" />
            {t.continueBrowsing}
          </Button>
        </div>

        {alternatives.length > 0 && (
          <details className="border-t border-bronze/10 pt-3">
            <summary className="cursor-pointer text-sm font-medium text-charcoal">
              {t.altsTitle}
            </summary>
            <div className="mt-3 space-y-2">
              {alternatives.map((alt) => (
                <button
                  type="button"
                  key={alt.product_id}
                  onClick={() => onSelectAlternative(alt)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-warm-beige text-start transition"
                >
                  <img src={alt.product_image} alt={alt.product_name} className="w-14 h-14 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-charcoal truncate">{alt.product_name}</div>
                    <div className="text-xs text-charcoal/60 truncate">{alt.reason_short}</div>
                  </div>
                  <div className="text-sm font-semibold text-charcoal whitespace-nowrap">
                    {formatPrice(alt.default_price, language)}
                  </div>
                </button>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
