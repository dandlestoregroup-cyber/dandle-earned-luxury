import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import RoleApplicationModal from "@/components/careers/RoleApplicationModal";
import GeneralApplicationModal from "@/components/careers/GeneralApplicationModal";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

// Bilingual content
const careersTranslations = {
  en: {
    pageTitle: "Careers at DANDLE — Join the Achievers",
    pageDesc: "Join DANDLE, Egypt's premium recliner brand. We hire people who chase precision, not noise.",
    heroTitle: "Build What People Feel",
    heroDesc: "DANDLE is the Swiss Knife of Comfort. We hire people who treat craft like a signature and operations like a science.",
    viewRoles: "View Open Roles",
    generalApp: "General Application",
    whatWeOffer: "What We Offer",
    openPosition: "Open Position",
    execAssistant: "Executive Assistant",
    cairo: "Cairo",
    fullTime: "Full-time",
    execDesc: "You're the Executive Manager's force multiplier. Convert priorities into structured actions, keep operational truth clean.",
    keyResponsibilities: "Key Responsibilities:",
    responsibilities: [
      "Calendar control & meeting readiness",
      "Action items tracked until closed",
      "Notion/Sheets accuracy",
      "Weekly planning & KPI reporting"
    ],
    applyNow: "Apply Now",
    dontSeeRole: "Don't See Your Role?",
    exceptionalText: "If you're exceptional, we want to meet you. Send us your CV.",
    benefits: [
      "Health insurance after probation",
      "Fair compensation based on impact",
      "Structured training & skill development",
      "Work-life balance (no burnout culture)",
      "Real team moments, not forced events"
    ]
  },
  ar: {
    pageTitle: "وظائف في داندل — انضم للمتميزين",
    pageDesc: "انضم لداندل، علامة مصر الفاخرة للريكلاينر. نحن نوظف من يسعون للدقة، لا الضجيج.",
    heroTitle: "ابنِ ما يشعر به الناس",
    heroDesc: "داندل هي السكين السويسرية للراحة. نحن نوظف من يتعاملون مع الحرفة كتوقيع ومع العمليات كعلم.",
    viewRoles: "عرض الوظائف المتاحة",
    generalApp: "تقديم عام",
    whatWeOffer: "ما نقدمه",
    openPosition: "وظيفة متاحة",
    execAssistant: "مساعد تنفيذي",
    cairo: "القاهرة",
    fullTime: "دوام كامل",
    execDesc: "أنت مضاعف قوة المدير التنفيذي. حوّل الأولويات لإجراءات منظمة، حافظ على الحقيقة التشغيلية نظيفة.",
    keyResponsibilities: "المسؤوليات الرئيسية:",
    responsibilities: [
      "التحكم في التقويم وجاهزية الاجتماعات",
      "تتبع المهام حتى الإغلاق",
      "دقة Notion/Sheets",
      "التخطيط الأسبوعي وتقارير KPI"
    ],
    applyNow: "قدّم الآن",
    dontSeeRole: "لا ترى وظيفتك؟",
    exceptionalText: "إذا كنت استثنائياً، نريد مقابلتك. أرسل لنا سيرتك الذاتية.",
    benefits: [
      "تأمين صحي بعد فترة الاختبار",
      "تعويض عادل بناءً على التأثير",
      "تدريب منظم وتطوير مهارات",
      "توازن بين العمل والحياة (لا ثقافة إرهاق)",
      "لحظات فريق حقيقية، ليست أحداث إجبارية"
    ]
  }
};

const Careers = () => {
  const [lang, setLang] = useState<LangKey>('en');
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [generalModalOpen, setGeneralModalOpen] = useState(false);
  
  useEffect(() => {
    setLang(getLangFromStorage());
    const interval = setInterval(() => {
      const currentLang = getLangFromStorage();
      setLang(prev => prev !== currentLang ? currentLang : prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  const t = careersTranslations[lang];
  const isArabic = lang === 'ar';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDesc} />
      </Helmet>

      <TopBanner />
      <Navigation />

      <main className="bg-warm-white min-h-screen pt-20">
        {/* HERO */}
        <section className="w-full px-6 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-charcoal mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {t.heroDesc}
            </p>
            <div className="flex flex-row gap-4 justify-center flex-wrap">
              <Button
                onClick={() => setRoleModalOpen(true)}
                className="h-12 px-6 bg-charcoal text-warm-white hover:bg-charcoal/90 rounded-sm font-body gap-2"
              >
                {t.viewRoles} <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
              </Button>
              <Button
                variant="outline"
                onClick={() => setGeneralModalOpen(true)}
                className="h-12 px-6 border-charcoal text-charcoal hover:bg-charcoal/5 rounded-sm font-body"
              >
                {t.generalApp}
              </Button>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="w-full px-6 py-12 bg-warm-beige/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline text-2xl font-bold text-charcoal text-center mb-8">
              {t.whatWeOffer}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-bronze flex-shrink-0" />
                  <p className="text-charcoal">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CURRENT OPENING */}
        <section className="w-full px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline text-2xl font-bold text-charcoal mb-6">
              {t.openPosition}
            </h2>

            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h3 className="font-headline text-xl md:text-2xl font-bold text-charcoal mb-2">
                {t.execAssistant}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <span className="bg-warm-beige/50 px-2 py-1 rounded">{t.cairo}</span>
                <span className="bg-warm-beige/50 px-2 py-1 rounded">{t.fullTime}</span>
              </div>

              <p className="text-muted-foreground mb-6">{t.execDesc}</p>

              <div className="mb-6">
                <p className="font-bold text-charcoal mb-2">{t.keyResponsibilities}</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {t.responsibilities.map((r, i) => <li key={i}>• {r}</li>)}
                </ul>
              </div>

              <Button
                onClick={() => setRoleModalOpen(true)}
                className="h-11 px-6 bg-charcoal text-warm-white hover:bg-charcoal/90 rounded-sm font-body"
              >
                {t.applyNow}
              </Button>
            </div>
          </div>
        </section>

        {/* GENERAL APPLICATION CTA */}
        <section className="w-full px-6 py-12 bg-charcoal">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-headline text-2xl font-bold text-warm-white mb-3">
              {t.dontSeeRole}
            </h2>
            <p className="text-warm-white/70 mb-6">{t.exceptionalText}</p>
            <Button
              variant="outline"
              onClick={() => setGeneralModalOpen(true)}
              className="h-11 px-6 border-warm-white text-warm-white hover:bg-warm-white/10 rounded-sm font-body"
            >
              {t.generalApp}
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      <RoleApplicationModal open={roleModalOpen} onOpenChange={setRoleModalOpen} />
      <GeneralApplicationModal open={generalModalOpen} onOpenChange={setGeneralModalOpen} />
    </div>
  );
};

export default Careers;
