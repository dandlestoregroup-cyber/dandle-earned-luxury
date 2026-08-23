import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/hooks/useBilingualText";
import { WATERPROOF_SUMMER_FABRIC } from "@/data/fabricKnowledge";
import { PALETTE_14 } from "@/data/palette";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackCampaign, withCampaignParams } from "@/lib/campaign";

const NorthCoastConsultation = ({ surface = "module" }: { surface?: "module" | "page" }) => {
  const { isArabic } = useLang();
  const [selected, setSelected] = useState<string | null>(null);
  const palette = PALETTE_14.slice(0, 8);

  return (
    <section id="find" className="bg-background py-14 md:py-20" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-3 text-[11px] tracking-[0.22em] text-muted-foreground">{isArabic ? "استشارة قصيرة" : "A SHORT CONSULTATION"}</p>
        <h2 className="mb-3 font-headline text-3xl text-foreground md:text-4xl">{isArabic ? WATERPROOF_SUMMER_FABRIC.nameAr : WATERPROOF_SUMMER_FABRIC.nameEn}</h2>
        <p className="mb-8 max-w-2xl text-sm text-muted-foreground md:text-base">{isArabic ? WATERPROOF_SUMMER_FABRIC.highlightAr : WATERPROOF_SUMMER_FABRIC.highlightEn}</p>

        <div className="mb-10 rounded-2xl border border-border bg-muted/30 p-5 md:p-7" onMouseEnter={() => trackCampaign("north_coast_fabric_engaged", { surface })}>
          <p className="mb-3 text-sm font-medium text-foreground">{isArabic ? "القماش الحقيقي هو المرجع" : "The real fabric is the reference"}</p>
          <p className="text-sm text-muted-foreground">{isArabic ? "نستخدم فقط مواصفات القماش المؤكدة. لا نعرض خامة مصطنعة كدليل على الملمس أو اللون." : "Only verified fabric facts are used. Generated imagery is never presented as proof of texture or colour."}</p>
        </div>

        <h3 className="mb-4 font-headline text-xl">{isArabic ? "اختار اتجاه اللون" : "Choose a colour direction"}</h3>
        <div className="mb-10 grid grid-cols-4 gap-3 md:grid-cols-8">
          {palette.map((c) => (
            <button key={c.key} type="button" onClick={() => { setSelected(c.key); trackCampaign("north_coast_colour_selected", { colour: c.key, surface }); }} className={`rounded-xl border p-2 text-center transition ${selected === c.key ? "border-primary ring-1 ring-primary" : "border-border"}`} aria-pressed={selected === c.key}>
              <span className="mx-auto block aspect-square w-full rounded-lg border border-black/5" style={{ backgroundColor: c.hex }} />
              <span className="mt-2 block truncate text-[10px] text-muted-foreground">{isArabic ? c.nameAr : c.nameEn}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-6">
            <h3 className="mb-2 font-headline text-xl">{isArabic ? "اختار الكرسي" : "Find the recliner"}</h3>
            <p className="mb-5 text-sm text-muted-foreground">{isArabic ? "شوف المجموعة واختار الموديل اللي يناسبك." : "Browse the collection and choose the model that suits you."}</p>
            <Link to={withCampaignParams("/collection")} onClick={() => trackCampaign("north_coast_product_selected", { surface })} className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">{isArabic ? "شوف المجموعة" : "Browse recliners"}</Link>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <h3 className="mb-2 font-headline text-xl">{isArabic ? "شوفه في أوضتك مع نور" : "See it in your room with Nour"}</h3>
            <p className="mb-5 text-sm text-muted-foreground">{isArabic ? "نور تساعدك في اللون والاختيار والـ Room Read — اختياري تمامًا." : "Nour can help with colour, selection and Room Read — completely optional."}</p>
            <Link to={withCampaignParams("/nour-chat")} onClick={() => trackCampaign("north_coast_nour_started", { surface })} className="inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm text-background">{isArabic ? "ابدأ مع نور" : "Start with Nour"}</Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={withCampaignParams("/collection")} onClick={() => trackCampaign("north_coast_checkout_started", { surface })} className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">{isArabic ? "تسوّق الآن" : "Shop now"}</Link>
          <Link to={withCampaignParams("/contact")} onClick={() => trackCampaign("north_coast_lead", { channel: "experience_room", surface })} className="rounded-full border border-border px-6 py-3 text-sm">{isArabic ? "زور غرفة التجربة" : "Visit Experience Room"}</Link>
          <a href={buildWhatsAppUrl(isArabic ? "مرحبًا دانديل، مهتم بالقماش الصيفي المقاوم للماء للساحل الشمالي." : "Hello Dandle, I'm interested in the waterproof summer fabric for the North Coast.")} target="_blank" rel="noopener noreferrer" onClick={() => trackCampaign("north_coast_lead", { channel: "whatsapp", surface })} className="rounded-full border border-border px-6 py-3 text-sm">WhatsApp</a>
        </div>
      </div>
    </section>
  );
};
export default NorthCoastConsultation;
