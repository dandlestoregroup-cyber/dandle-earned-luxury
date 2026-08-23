import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/hooks/useBilingualText";
import { withCampaignParams } from "@/lib/campaign";

const HeroNorthCoast = () => {
  const { isArabic } = useLang();
  return (
    <section className="relative overflow-hidden bg-background" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-2 md:items-center md:py-20">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45}}>
          <p className="mb-4 text-[11px] tracking-[0.22em] text-muted-foreground">
            {isArabic ? "دانديل الساحل الشمالي · صيف ٢٠٢٦" : "DANDLE NORTH COAST · SUMMER 2026"}
          </p>
          <h1 className="mb-4 font-headline text-4xl leading-tight text-foreground md:text-6xl">
            {isArabic ? "راحة الصيف، مصممة للحياة على الساحل" : "Summer comfort, made for coastal living"}
          </h1>
          <p className="mb-8 max-w-xl text-base text-muted-foreground">
            {isArabic ? "أقمشة صيفية مقاومة للماء لكراسي دانديل، مع لوحة ألوان ساحلية مختارة." : "Waterproof summer fabrics for DANDLE recliners, with a curated coastal palette."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={withCampaignParams("/north-coast")} className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">{isArabic ? "اكتشف الأقمشة" : "Explore the fabrics"}</Link>
            <Link to={withCampaignParams("/north-coast#find")} className="rounded-full border border-border px-6 py-3 text-sm">{isArabic ? "لاقي الكرسي المناسب" : "Find my recliner"}</Link>
          </div>
        </motion.div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <img src="/images/complete-set-coastal-modern.jpg" alt={isArabic ? "دانديل في أجواء ساحلية" : "Dandle coastal living room"} className="h-full w-full object-cover" loading="eager" />
        </div>
      </div>
    </section>
  );
};
export default HeroNorthCoast;
