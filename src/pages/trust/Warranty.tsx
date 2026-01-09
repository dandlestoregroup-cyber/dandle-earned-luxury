import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TopBanner from "@/components/TopBanner";
import { motion } from "framer-motion";
import { Shield, Clock, AlertCircle, CheckCircle, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

const Warranty = () => {
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
    document.title = isArabic ? "الضمان - DANDLE" : "Warranty Information - DANDLE";
  }, [isArabic]);

  const warranties = [
    {
      icon: Shield,
      titleEn: "2-Year Frame Warranty",
      titleAr: "ضمان الهيكل سنتين",
      descEn: "Comprehensive coverage on all structural components and frame integrity",
      descAr: "تغطية شاملة لجميع المكونات الهيكلية وسلامة الإطار",
      color: "text-nile-blue"
    },
    {
      icon: Clock,
      titleEn: "2-Year Motor Warranty",
      titleAr: "ضمان المحرك سنتين",
      descEn: "Full protection for reclining mechanisms, motors, and electrical components",
      descAr: "حماية كاملة لآليات الإمالة والمحركات والمكونات الكهربائية",
      color: "text-dandle-orange"
    },
    {
      icon: Shield,
      titleEn: "1-Year Upholstery Warranty",
      titleAr: "ضمان التنجيد سنة",
      descEn: "Coverage against manufacturing defects in fabric and upholstery materials",
      descAr: "تغطية ضد عيوب التصنيع في القماش ومواد التنجيد",
      color: "text-bronze"
    }
  ];

  const claimSteps = [
    {
      step: 1,
      titleEn: "Contact Us",
      titleAr: "تواصل معنا",
      descEn: "Reach out via WhatsApp at 01222804255 or email Tell.me@DandleStoreGroup.com",
      descAr: "تواصل عبر واتساب على 01222804255 أو البريد الإلكتروني Tell.me@DandleStoreGroup.com"
    },
    {
      step: 2,
      titleEn: "Provide Details",
      titleAr: "قدم التفاصيل",
      descEn: "Share your order reference, photos of the issue, and a brief description",
      descAr: "شارك رقم الطلب وصور المشكلة ووصف مختصر"
    },
    {
      step: 3,
      titleEn: "Assessment",
      titleAr: "التقييم",
      descEn: "Our team will review your claim and may arrange an inspection if needed",
      descAr: "سيراجع فريقنا مطالبتك وقد يرتب فحص إذا لزم الأمر"
    },
    {
      step: 4,
      titleEn: "Resolution",
      titleAr: "الحل",
      descEn: "We'll repair, replace, or provide appropriate remedy based on warranty terms",
      descAr: "سنقوم بالإصلاح أو الاستبدال أو توفير العلاج المناسب حسب شروط الضمان"
    }
  ];

  const exclusions = [
    { en: "Normal wear and tear from regular use", ar: "التآكل الطبيعي من الاستخدام العادي" },
    { en: "Damage from misuse, abuse, or accidents", ar: "الأضرار الناتجة عن سوء الاستخدام أو الحوادث" },
    { en: "Commercial or institutional use (warranty applies to residential use only)", ar: "الاستخدام التجاري أو المؤسسي (الضمان للاستخدام المنزلي فقط)" },
    { en: "Unauthorized repairs or modifications", ar: "الإصلاحات أو التعديلات غير المصرح بها" },
    { en: "Damage from improper cleaning or maintenance", ar: "الأضرار الناتجة عن التنظيف أو الصيانة غير الصحيحة" },
    { en: "Fading or discoloration from sun exposure", ar: "البهتان أو تغير اللون من التعرض للشمس" },
    { en: "Pet damage or stains not covered under upholstery warranty", ar: "أضرار الحيوانات الأليفة أو البقع غير المشمولة بضمان التنجيد" }
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
              <Shield className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 
                className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent"
                data-en="Warranty Information"
                data-ar="معلومات الضمان"
              >
                {isArabic ? "معلومات الضمان" : "Warranty Information"}
              </h1>
              <p 
                className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed"
                data-en="Comprehensive coverage for your investment"
                data-ar="تغطية شاملة لاستثمارك"
              >
                {isArabic ? "تغطية شاملة لاستثمارك" : "Comprehensive coverage for your investment"}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Warranty Coverage */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
                data-en="Our Warranty Coverage"
                data-ar="تغطية الضمان"
              >
                {isArabic ? "تغطية الضمان" : "Our Warranty Coverage"}
              </motion.h2>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {warranties.map((warranty, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-bronze/20 shadow-elegant hover:shadow-glow transition-all">
                      <CardHeader>
                        <warranty.icon className={`w-12 h-12 ${warranty.color} mb-4`} />
                        <CardTitle className="font-headline text-2xl">
                          {isArabic ? warranty.titleAr : warranty.titleEn}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {isArabic ? warranty.descAr : warranty.descEn}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Claim */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
                data-en="How to Make a Warranty Claim"
                data-ar="كيفية تقديم مطالبة الضمان"
              >
                {isArabic ? "كيفية تقديم مطالبة الضمان" : "How to Make a Warranty Claim"}
              </motion.h2>

              <div className="space-y-6">
                {claimSteps.map((step, index) => (
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
                      <p className="font-body text-foreground/70">
                        {isArabic ? step.descAr : step.descEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-12 bg-nile-blue/10 rounded-lg p-8 border border-nile-blue/20"
              >
                <div className="flex items-start gap-4">
                  <MessageCircle className="w-8 h-8 text-nile-blue flex-shrink-0 mt-1" />
                  <div>
                    <h3 
                      className="font-headline text-xl font-semibold mb-3 text-foreground"
                      data-en="Contact for Warranty Claims"
                      data-ar="تواصل لمطالبات الضمان"
                    >
                      {isArabic ? "تواصل لمطالبات الضمان" : "Contact for Warranty Claims"}
                    </h3>
                    <div className="space-y-2 font-body text-foreground/80">
                      <p><strong>{isArabic ? "واتساب:" : "WhatsApp:"}</strong> 01222804255</p>
                      <p><strong>{isArabic ? "البريد:" : "Email:"}</strong> Tell.me@DandleStoreGroup.com</p>
                      <p><strong>{isArabic ? "الأوقات:" : "Hours:"}</strong> {isArabic ? "يومياً 10ص-3م & 7م-9م" : "Daily 10AM-3PM & 7PM-9PM"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Exclusions */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center text-foreground"
                data-en="Warranty Exclusions"
                data-ar="استثناءات الضمان"
              >
                {isArabic ? "استثناءات الضمان" : "Warranty Exclusions"}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-muted/30 rounded-lg p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <AlertCircle className="w-6 h-6 text-dandle-orange flex-shrink-0 mt-1" />
                  <p className="font-body text-foreground/80">
                    {isArabic ? "الحالات التالية غير مشمولة بالضمان:" : "The following are not covered under our warranty:"}
                  </p>
                </div>

                <ul className="space-y-3">
                  {exclusions.map((exclusion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 font-body text-foreground/70"
                    >
                      <span className="text-dandle-orange mt-1">•</span>
                      <span>{isArabic ? exclusion.ar : exclusion.en}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <p className="font-body text-foreground/80">
                    <strong>{isArabic ? "مهم:" : "Important:"}</strong> {isArabic ? "للحفاظ على تغطية الضمان، يرجى اتباع تعليمات العناية المرفقة مع الكرسي وإجراء الصيانة الدورية الموصى بها." : "To maintain your warranty coverage, please follow the care instructions provided with your recliner and perform regular maintenance as recommended."}
                  </p>
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

export default Warranty;