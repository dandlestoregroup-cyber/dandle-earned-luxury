import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TopBanner from "@/components/TopBanner";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle, CheckCircle, Clock, MessageCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

const Returns = () => {
  const [lang, setLang] = useState<LangKey>('en');
  
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

  useEffect(() => {
    document.title = isArabic ? "الاسترجاع والاستبدال - DANDLE" : "Returns & Exchanges - DANDLE";
  }, [isArabic]);

  const returnPolicy = [
    {
      icon: Clock,
      titleEn: "48-Hour Window",
      titleAr: "مهلة 48 ساعة",
      descEn: "Contact us within 48 hours of delivery if you discover any manufacturing defects or damage.",
      descAr: "تواصل معنا خلال 48 ساعة من التوصيل إذا اكتشفت أي عيوب تصنيع أو تلف."
    },
    {
      icon: Shield,
      titleEn: "Inspection Required",
      titleAr: "الفحص مطلوب",
      descEn: "Thoroughly inspect your recliner upon delivery with our team present. Document any concerns immediately.",
      descAr: "افحص كرسيك بدقة عند التوصيل بوجود فريقنا. وثق أي مخاوف فوراً."
    },
    {
      icon: MessageCircle,
      titleEn: "Direct Communication",
      titleAr: "تواصل مباشر",
      descEn: "Reach out via WhatsApp at 01222804255 or email Tell.me@DandleStoreGroup.com with photos and description.",
      descAr: "تواصل عبر واتساب على 01222804255 أو البريد Tell.me@DandleStoreGroup.com مع صور ووصف."
    }
  ];

  const acceptableReasons = [
    { en: "Manufacturing defects (structural, mechanical, or upholstery flaws)", ar: "عيوب التصنيع (هيكلية أو ميكانيكية أو في التنجيد)" },
    { en: "Damage during shipping or delivery", ar: "تلف أثناء الشحن أو التوصيل" },
    { en: "Incorrect product delivered (wrong model or color)", ar: "منتج خاطئ تم توصيله (موديل أو لون خطأ)" },
    { en: "Missing components or accessories", ar: "مكونات أو إكسسوارات ناقصة" },
    { en: "Reclining mechanism failure upon delivery", ar: "فشل آلية الإمالة عند التوصيل" }
  ];

  const notAcceptable = [
    { en: "Change of mind or buyer's remorse", ar: "تغيير الرأي أو ندم المشتري" },
    { en: "Fabric color looks different from online images (due to screen variations)", ar: "لون القماش يبدو مختلفاً عن الصور (بسبب اختلاف الشاشات)" },
    { en: "Room measurements were incorrect", ar: "قياسات الغرفة كانت خاطئة" },
    { en: "Normal wear and tear after use", ar: "التآكل الطبيعي بعد الاستخدام" },
    { en: "Damage caused after delivery (pet damage, stains, misuse)", ar: "أضرار حدثت بعد التوصيل (أضرار الحيوانات، البقع، سوء الاستخدام)" }
  ];

  const returnProcess = [
    {
      step: 1,
      titleEn: "Contact Us Immediately",
      titleAr: "تواصل معنا فوراً",
      descEn: "Within 48 hours of delivery, contact us via WhatsApp or email with your order reference number.",
      descAr: "خلال 48 ساعة من التوصيل، تواصل معنا عبر واتساب أو البريد مع رقم مرجع الطلب."
    },
    {
      step: 2,
      titleEn: "Provide Documentation",
      titleAr: "قدم التوثيق",
      descEn: "Send clear photos of the issue from multiple angles and a detailed description of the problem.",
      descAr: "أرسل صور واضحة للمشكلة من زوايا متعددة ووصف مفصل للمشكلة."
    },
    {
      step: 3,
      titleEn: "Assessment",
      titleAr: "التقييم",
      descEn: "Our team reviews your case. We may arrange an in-person inspection if needed to assess the issue.",
      descAr: "فريقنا يراجع حالتك. قد نرتب فحص شخصي إذا لزم الأمر لتقييم المشكلة."
    },
    {
      step: 4,
      titleEn: "Resolution",
      titleAr: "الحل",
      descEn: "Based on assessment, we'll offer repair, replacement, or in rare cases, a full refund.",
      descAr: "بناءً على التقييم، سنعرض الإصلاح أو الاستبدال أو في حالات نادرة استرداد كامل."
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      <TopBanner />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-nile-blue/10 via-background to-dandle-orange/5 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <RefreshCw className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 
                className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent"
                data-en="Returns & Exchanges"
                data-ar="الاسترجاع والاستبدال"
              >
                {isArabic ? "الاسترجاع والاستبدال" : "Returns & Exchanges"}
              </h1>
              <p 
                className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed"
                data-en="Fair policies focused on customer satisfaction"
                data-ar="سياسات عادلة تركز على رضا العميل"
              >
                {isArabic ? "سياسات عادلة تركز على رضا العميل" : "Fair policies focused on customer satisfaction"}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Return Policy Overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 md:p-12 border border-bronze/20 shadow-elegant"
              >
                <h2 className="font-headline text-3xl font-bold mb-6 text-center text-foreground">
                  {isArabic ? "سياسة الاسترجاع" : "Our Return Policy"}
                </h2>
                <p className="font-body text-lg text-foreground/80 leading-relaxed text-center mb-6">
                  {isArabic 
                    ? "بسبب الطبيعة المخصصة لأثاثنا، لدينا سياسة استرجاع محدودة تركز على عيوب التصنيع وأضرار التوصيل. رضاك أولويتنا، ونحن ملتزمون بحل أي مخاوف مشروعة بسرعة وعدل."
                    : "Due to the custom nature of our furniture, we have a limited return policy focused on manufacturing defects and delivery damage. Your satisfaction is our priority, and we're committed to resolving any legitimate concerns promptly and fairly."}
                </p>
                <div className="text-center bg-background rounded-lg p-6 border border-bronze/10">
                  <p className="font-body font-semibold text-dandle-orange text-xl mb-2">
                    {isArabic ? "تواصل خلال 48 ساعة من التوصيل" : "Contact within 48 hours of delivery"}
                  </p>
                  <p className="font-body text-foreground/70">
                    {isArabic ? "لعيوب التصنيع أو أضرار التوصيل" : "for manufacturing defects or delivery damage"}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {returnPolicy.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-bronze/20 shadow-elegant hover:shadow-glow transition-all">
                      <CardHeader>
                        <item.icon className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                        <CardTitle className="font-headline text-xl text-center">
                          {isArabic ? item.titleAr : item.titleEn}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-foreground/70 text-center leading-relaxed">
                          {isArabic ? item.descAr : item.descEn}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                {isArabic ? "عملية الاسترجاع" : "Return Process"}
              </motion.h2>

              <div className="space-y-6">
                {returnProcess.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 bg-background rounded-lg p-6 shadow-elegant border border-bronze/10"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-dandle-orange text-white flex items-center justify-center font-headline text-xl font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-semibold mb-2 text-foreground">
                        {isArabic ? step.titleAr : step.titleEn}
                      </h3>
                      <p className="font-body text-foreground/70 leading-relaxed">
                        {isArabic ? step.descAr : step.descEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Acceptable vs Not Acceptable */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                {isArabic ? "ما يؤهل للاسترجاع" : "What Qualifies for Return"}
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Acceptable */}
                <motion.div
                  initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <h3 className="font-headline text-2xl font-semibold text-foreground">
                      {isArabic ? "أسباب مقبولة" : "Acceptable Reasons"}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {acceptableReasons.map((reason, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 font-body text-foreground/80"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{isArabic ? reason.ar : reason.en}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Not Acceptable */}
                <motion.div
                  initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    <h3 className="font-headline text-2xl font-semibold text-foreground">
                      {isArabic ? "غير مقبول" : "Not Acceptable"}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {notAcceptable.map((reason, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 font-body text-foreground/80"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{isArabic ? reason.ar : reason.en}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 border border-bronze/20"
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                <h2 className="font-headline text-2xl font-bold mb-4 text-foreground">
                  {isArabic ? "تحتاج لبدء استرجاع؟" : "Need to Initiate a Return?"}
                </h2>
                <p className="font-body text-foreground/70 mb-6">
                  {isArabic ? "تواصل معنا فوراً إذا كان لديك مخاوف بشأن توصيلك." : "Contact us immediately if you have concerns about your delivery."}
                </p>
                <div className="space-y-2 font-body text-foreground/80">
                  <p><strong>{isArabic ? "واتساب:" : "WhatsApp:"}</strong> 01222804255</p>
                  <p><strong>{isArabic ? "البريد:" : "Email:"}</strong> Tell.me@DandleStoreGroup.com</p>
                  <p><strong>{isArabic ? "الأوقات:" : "Hours:"}</strong> {isArabic ? "يومياً 10ص-3م & 7م-9م" : "Daily 10AM-3PM & 7PM-9PM"}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Returns;