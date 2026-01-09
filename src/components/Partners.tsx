import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

const partners = [
  {
    nameEn: "OMASH Damsuk",
    nameAr: "أوماش دمسوق",
    taglineEn: "Premium Materials",
    taglineAr: "خامات فاخرة",
    valueEn: "Textured leather and fabric excellence. Micro-detail craftsmanship for durability and refined feel.",
    valueAr: "جلد محبب وأقمشة فاخرة. حرفية في التفاصيل الدقيقة للمتانة والملمس الراقي.",
    meaningEn: "Formerly known as Raytex — decades of trusted quality.",
    meaningAr: "المعروفة سابقاً باسم ريتكس — عقود من الجودة الموثوقة.",
    highlight: "EasyUp Compact uses OMASH textured leather",
    highlightAr: "إيزي أب كومباكت يستخدم جلد أوماش المحبب",
  },
  {
    nameEn: "Istikbal",
    nameAr: "إستيكبال",
    taglineEn: "Showroom Network",
    taglineAr: "شبكة المعارض",
    valueEn: "Try before you decide. See the build quality up close, in person.",
    valueAr: "جرّب قبل ما تقرر. شوف الجودة بنفسك في المعرض.",
    meaningEn: "4 Citystars branches across Cairo.",
    meaningAr: "4 فروع في سيتي ستارز بالقاهرة.",
    highlight: null,
    highlightAr: null,
  },
  {
    nameEn: "Vivian",
    nameAr: "فيفيان",
    taglineEn: "Interior Styling",
    taglineAr: "التصميم الداخلي",
    valueEn: "Helps the chair fit the room. Layout guidance so it looks intentional.",
    valueAr: "بتساعد الكرسي يناسب الغرفة. توجيه التصميم عشان يبان متناسق.",
    meaningEn: "Free consultation for Dandle customers.",
    meaningAr: "استشارة مجانية لعملاء Dandle.",
    highlight: null,
    highlightAr: null,
  },
  {
    nameEn: "Aqua Offers",
    nameAr: "أكوا أوفرز",
    taglineEn: "Community Partner",
    taglineAr: "شريك المجتمع",
    valueEn: "Curated collaborations and shared visibility. Local partnerships that matter.",
    valueAr: "تعاونات مختارة ورؤية مشتركة. شراكات محلية مهمة.",
    meaningEn: "Exclusive member benefits and offers.",
    meaningAr: "مميزات وعروض حصرية للأعضاء.",
    highlight: null,
    highlightAr: null,
  },
];

const Partners = () => {
  const [lang, setLang] = useState<LangKey>('ar');

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

  return (
    <section className="py-20 md:py-28 bg-cream" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span 
            className={`text-xs text-bronze tracking-wide font-light ${isArabic ? 'font-body-ar' : 'font-body'}`}
          >
            {isArabic ? "شراكاتنا" : "Collaborations"}
          </span>
          <h2 
            className={`text-3xl md:text-4xl text-charcoal mt-4 font-light ${isArabic ? 'font-body-ar' : 'font-headline'}`}
          >
            {isArabic ? "الشركاء وراء الجودة" : "The Partners Behind the Finish"}
          </h2>
          <p className={`text-charcoal/60 mt-3 max-w-xl mx-auto ${isArabic ? 'font-body-ar' : 'font-body'}`}>
            {isArabic 
              ? "كل تفصيلة تحسها مدعومة بخبراء نثق فيهم."
              : "Every detail you feel is backed by specialists we trust."
            }
          </p>
        </motion.div>

        {/* Partnership Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="relative overflow-hidden shadow-elegant">
            <motion.img
              src="/images/dandle-partnerships-room.png"
              alt="DANDLE partnerships"
              className="w-full h-auto object-cover"
              loading="lazy"
              whileInView={{ scale: [1.05, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>

        {/* Partner Cards - Grid with enriched descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div 
              key={partner.nameEn} 
              className="bg-off-white p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow border border-champagne/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <h3 className={`text-xl text-charcoal font-medium mb-1 ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
                {isArabic ? partner.nameAr : partner.nameEn}
              </h3>
              <p className={`text-xs text-dandle-orange tracking-wide mb-3 font-medium ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                {isArabic ? partner.taglineAr : partner.taglineEn}
              </p>
              <p className={`text-charcoal/80 text-sm mb-2 leading-relaxed ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                {isArabic ? partner.valueAr : partner.valueEn}
              </p>
              <p className={`text-charcoal/50 text-xs ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                {isArabic ? partner.meaningAr : partner.meaningEn}
              </p>
              
              {/* Special highlight for OMASH */}
              {partner.highlight && (
                <div className="mt-3 pt-3 border-t border-champagne/20">
                  <p className={`text-dandle-orange text-xs font-medium ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                    {isArabic ? partner.highlightAr : partner.highlight}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;