import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsArabic } from "@/hooks/useIsArabic";
import { withCampaignParams } from "@/lib/campaign";

const HeroNorthCoast = () => {
  const isArabic = useIsArabic();

  return (
    <section className="relative overflow-hidden bg-background" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-2 md:items-center md:py-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="mb-4 text-[11px] tracking-[0.22em] text-muted-foreground">
            {isArabic ? "دانديل الساحل الشمالي · صيف ٢٠٢٦" : "DANDLE NORTH COAST · SUMMER 2026"}
          </p>
          <h1 className="mb-4 font-headline text-4xl leading-tight text-foreground md:text-6xl">
            {isArabic ? "راحة الصيف، مصممة للحياة على الساحل" : "Summer comfort, made for coastal living"}
          </h1>
          <p className="mb-8 max-w-xl text-base text-muted-foreground">
            {isArabic
              ? "قماش صيفي مقاوم للماء لكراسي دانديل، مع اتجاهات ألوان تناسب بيوت الساحل."
              : "Waterproof summer fabric for DANDLE recliners, with colour directions made for coastal homes."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={withCampaignParams("/north-coast#find")}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-center text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              {isArabic ? "اكتشف القماش" : "Explore the fabric"}
            </Link>
            <Link
              to={withCampaignParams("/north-coast#recliners")}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-foreground/25 bg-background px-6 py-3 text-center text-sm text-foreground transition-colors hover:border-foreground/40 hover:bg-muted"
            >
              {isArabic ? "لاقي الكرسي المناسب" : "Find my recliner"}
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <img
            src="/images/complete-set-coastal-modern.jpg"
            alt={isArabic ? "دانديل في أجواء ساحلية" : "Dandle seating in a coastal living room"}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroNorthCoast;
