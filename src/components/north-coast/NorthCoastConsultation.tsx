import { useState } from "react";
import { Link } from "react-router-dom";
import { useIsArabic } from "@/hooks/useIsArabic";
import { WATERPROOF_SUMMER_RECLINER_FABRIC } from "@/data/showroomKnowledge";
import { allFabricColors } from "@/data/fabricColors";
import { trackCampaign, withCampaignParams } from "@/lib/campaign";

const whatsappUrl = (message: string) =>
  `https://wa.me/201222804255?text=${encodeURIComponent(message)}`;

const NorthCoastConsultation = ({ surface = "module" }: { surface?: "module" | "page" }) => {
  const isArabic = useIsArabic();
  const [selected, setSelected] = useState<string | null>(null);
  const palette = allFabricColors.slice(0, 8);
  const shopHref = `${withCampaignParams("/")}#products`;

  return (
    <section id="find" className="bg-background py-14 md:py-20" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-3 text-[11px] tracking-[0.22em] text-muted-foreground">
          {isArabic ? "الساحل الشمالي · اختيارات صيف ٢٠٢٦" : "NORTH COAST · SUMMER 2026"}
        </p>
        <h2 className="mb-3 font-headline text-3xl text-foreground md:text-4xl">
          {isArabic ? "قماش صيفي مقاوم للماء" : "Waterproof summer fabric"}
        </h2>
        <p className="mb-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          {isArabic
            ? "خيار تنجيد مؤكد من دانديل، مخصص للاستخدام الصيفي على كراسي الريكلاينر."
            : WATERPROOF_SUMMER_RECLINER_FABRIC.customerCopy}
        </p>
        <p className="mb-9 max-w-2xl text-xs text-muted-foreground">
          {isArabic
            ? "صفة مقاومة الماء تخص هذا القماش فقط. تفاصيل المورد والتركيب والتنظيف غير معروضة كحقائق حتى يتم توثيقها."
            : "The waterproof claim applies to this fabric option only. Supplier, composition and care details are not presented as facts until documented."}
        </p>

        <div
          className="mb-10 overflow-hidden rounded-2xl border border-border bg-muted/20"
          onMouseEnter={() => trackCampaign("north_coast_fabric_engaged", { surface, interaction: "texture_story" })}
          onFocus={() => trackCampaign("north_coast_fabric_engaged", { surface, interaction: "texture_story" })}
          tabIndex={0}
        >
          <div className="grid md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src="/images/complete-set-coastal-modern.jpg"
                alt={isArabic ? "دانديل في بيت ساحلي" : "Dandle seating in a coastal home"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="mb-2 font-headline text-2xl text-foreground">
                {isArabic ? "الخامة الحقيقية هي المرجع" : "The real fabric stays the reference"}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isArabic
                  ? "نستخدم الصورة الحقيقية للعينة عند عرض الملمس واللون. الصور الديكورية تساعدك تتخيل الجو فقط، وليست إثباتًا للخامة."
                  : "The photographed swatch is the reference for texture and colour. Lifestyle imagery helps with the room direction only; it is not proof of the fabric surface."}
              </p>
            </div>
          </div>
        </div>

        <h3 className="mb-2 font-headline text-xl text-foreground">
          {isArabic ? "اختار اتجاه لون تحب تشوفه" : "Choose a colour direction worth seeing"}
        </h3>
        <p className="mb-5 max-w-3xl text-xs text-muted-foreground">
          {isArabic
            ? "الألوان بالأسفل من لوحة دانديل الحالية لتوجيه الاختيار؛ لا تعني تلقائيًا أن كل لون متاح في القماش المقاوم للماء."
            : "These are existing Dandle colour directions for exploration; they do not imply every colour is automatically available in the waterproof fabric."}
        </p>
        <div className="mb-10 grid grid-cols-4 gap-3 md:grid-cols-8">
          {palette.map((colour) => (
            <button
              key={colour.id}
              type="button"
              onClick={() => {
                setSelected(colour.id);
                trackCampaign("north_coast_colour_selected", { colour: colour.id, surface });
              }}
              className={`rounded-xl border p-2 text-center transition ${
                selected === colour.id ? "border-primary ring-1 ring-primary" : "border-border"
              }`}
              aria-pressed={selected === colour.id}
            >
              <span
                className="mx-auto block aspect-square w-full rounded-lg border border-black/5"
                style={{ backgroundColor: colour.hexColor }}
                aria-hidden="true"
              />
              <span className="mt-2 block truncate text-[10px] text-muted-foreground">{colour.name}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-6">
            <h3 className="mb-2 font-headline text-xl text-foreground">
              {isArabic ? "اختار الكرسي" : "Find the recliner"}
            </h3>
            <p className="mb-5 text-sm text-muted-foreground">
              {isArabic ? "شوف الموديلات واختار الكرسي اللي يستحق نجرب عليه الاتجاه ده." : "Browse the models and choose the recliner worth trying in this direction."}
            </p>
            <a
              href={shopHref}
              onClick={() => trackCampaign("north_coast_fabric_engaged", { surface, action: "browse_recliners", selectedColour: selected })}
              className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              {isArabic ? "شوف الكراسي" : "Browse recliners"}
            </a>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="mb-2 font-headline text-xl text-foreground">
              {isArabic ? "شوفه في أوضتك مع نور" : "See it in your room with Nour"}
            </h3>
            <p className="mb-5 text-sm text-muted-foreground">
              {isArabic ? "نور تساعدك في الاختيار وقراءة الغرفة والتصور — من غير ما تكون خطوة إجبارية للشراء." : "Nour can help with selection, Room Read and visualization — never a required step to buy."}
            </p>
            <Link
              to={withCampaignParams("/nour-chat")}
              onClick={() => trackCampaign("north_coast_nour_started", { surface, selectedColour: selected })}
              className="inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm text-background transition-opacity hover:opacity-90"
            >
              {isArabic ? "ابدأ مع نور" : "Start with Nour"}
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={shopHref}
            onClick={() => trackCampaign("north_coast_fabric_engaged", { surface, action: "start_choosing", selectedColour: selected })}
            className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
          >
            {isArabic ? "ابدأ الاختيار" : "Start choosing"}
          </a>
          <Link
            to={withCampaignParams("/contact")}
            onClick={() => trackCampaign("north_coast_lead", { channel: "experience_room", surface })}
            className="rounded-full border border-border px-6 py-3 text-sm text-foreground"
          >
            {isArabic ? "زور غرفة التجربة" : "Visit Experience Room"}
          </Link>
          <a
            href={whatsappUrl(
              isArabic
                ? "مرحبًا دانديل، مهتم بالقماش الصيفي المقاوم للماء للساحل الشمالي."
                : "Hello Dandle, I'm interested in the waterproof summer fabric for the North Coast."
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCampaign("north_coast_lead", { channel: "whatsapp", surface })}
            className="rounded-full border border-border px-6 py-3 text-sm text-foreground"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default NorthCoastConsultation;
