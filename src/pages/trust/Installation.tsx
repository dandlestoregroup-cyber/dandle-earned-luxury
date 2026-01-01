import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TopBanner from "@/components/TopBanner";
import { motion } from "framer-motion";
import { Wrench, Package, CheckCircle, Clock, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

const Installation = () => {
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
    document.title = isArabic ? "التركيب - DANDLE" : "Installation Service - DANDLE";
  }, [isArabic]);

  const installationIncludes = [
    {
      icon: Package,
      titleEn: "Unpacking",
      titleAr: "فتح العبوة",
      descEn: "Careful removal of all packaging materials with attention to your home's cleanliness",
      descAr: "إزالة جميع مواد التغليف بعناية مع الاهتمام بنظافة منزلك"
    },
    {
      icon: Wrench,
      titleEn: "Assembly",
      titleAr: "التجميع",
      descEn: "Professional assembly of your recliner using proper tools and techniques",
      descAr: "تجميع احترافي للكرسي باستخدام الأدوات والتقنيات المناسبة"
    },
    {
      icon: CheckCircle,
      titleEn: "Quality Check",
      titleAr: "فحص الجودة",
      descEn: "Thorough inspection to ensure all components are functioning perfectly",
      descAr: "فحص شامل للتأكد من أن جميع المكونات تعمل بشكل مثالي"
    },
    {
      icon: Award,
      titleEn: "Demonstration",
      titleAr: "العرض التوضيحي",
      descEn: "Complete walkthrough of all features and functions of your new recliner",
      descAr: "شرح كامل لجميع مميزات ووظائف كرسيك الجديد"
    }
  ];

  const installationProcess = [
    {
      step: 1,
      titleEn: "Delivery & Placement",
      titleAr: "التوصيل والوضع",
      descEn: "Our team brings your recliner to your preferred room and position. We'll work with you to find the perfect spot.",
      descAr: "فريقنا يحضر الكرسي للغرفة والمكان المفضل لديك. سنعمل معك لإيجاد المكان المثالي."
    },
    {
      step: 2,
      titleEn: "Professional Assembly",
      titleAr: "التجميع الاحترافي",
      descEn: "If required, we assemble your recliner using professional tools and expertise. Most installations take 15-30 minutes.",
      descAr: "إذا كان مطلوباً، نجمع الكرسي باستخدام أدوات وخبرة احترافية. معظم التركيبات تستغرق 15-30 دقيقة."
    },
    {
      step: 3,
      titleEn: "Function Testing",
      titleAr: "اختبار الوظائف",
      descEn: "We test all reclining mechanisms, motors, and features to ensure everything works smoothly and correctly.",
      descAr: "نختبر جميع آليات الإمالة والمحركات والمميزات للتأكد من أن كل شيء يعمل بسلاسة وبشكل صحيح."
    },
    {
      step: 4,
      titleEn: "Feature Demonstration",
      titleAr: "عرض المميزات",
      descEn: "Our team shows you how to use all features, adjust settings, and maintain your recliner for optimal performance.",
      descAr: "فريقنا يريك كيفية استخدام جميع المميزات وضبط الإعدادات وصيانة الكرسي للأداء الأمثل."
    },
    {
      step: 5,
      titleEn: "Final Inspection",
      titleAr: "الفحص النهائي",
      descEn: "You inspect the recliner with us present. We address any concerns before completing the installation.",
      descAr: "تفحص الكرسي بوجودنا. نعالج أي مخاوف قبل إتمام التركيب."
    },
    {
      step: 6,
      titleEn: "Cleanup & Documentation",
      titleAr: "التنظيف والتوثيق",
      descEn: "We remove all packaging, clean the area, and provide care instructions before leaving your home.",
      descAr: "نزيل كل التغليف وننظف المكان ونقدم تعليمات العناية قبل مغادرة منزلك."
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
              <Wrench className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 
                className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent"
                data-en="Installation Service"
                data-ar="خدمة التركيب"
              >
                {isArabic ? "خدمة التركيب" : "Installation Service"}
              </h1>
              <p 
                className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed"
                data-en="Professional setup included with every delivery"
                data-ar="إعداد احترافي مشمول مع كل توصيل"
              >
                {isArabic ? "إعداد احترافي مشمول مع كل توصيل" : "Professional setup included with every delivery"}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Installation Included */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 md:p-12 border border-bronze/20 shadow-elegant text-center"
              >
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h2 className="font-headline text-3xl font-bold mb-4 text-foreground">
                  {isArabic ? "التركيب مشمول" : "Installation is Included"}
                </h2>
                <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6">
                  {isArabic 
                    ? "التجميع والإعداد الاحترافي مشمول مع شرائك بدون تكلفة إضافية. فريقنا الخبير يضمن أن كرسيك مركب بشكل مثالي وجاهز للاستمتاع."
                    : "Professional assembly and setup are included with your purchase at no additional cost. Our expert team ensures your recliner is perfectly installed and ready to enjoy."}
                </p>
                <div className="flex items-center justify-center gap-2 text-foreground/70">
                  <Clock className="w-5 h-5" />
                  <p className="font-body">
                    {isArabic ? "معظم التركيبات تتم في 15-30 دقيقة" : "Most installations completed in 15-30 minutes"}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                {isArabic ? "ما المشمول" : "What's Included"}
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {installationIncludes.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-bronze/20 shadow-elegant hover:shadow-glow transition-all text-center">
                      <CardHeader>
                        <item.icon className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                        <CardTitle className="font-headline text-lg">
                          {isArabic ? item.titleAr : item.titleEn}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-sm text-foreground/70 leading-relaxed">
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

        {/* Installation Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                {isArabic ? "عملية التركيب" : "Installation Process"}
              </motion.h2>

              <div className="space-y-6">
                {installationProcess.map((step, index) => (
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

        {/* Timing Note */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 border border-bronze/20 text-center"
              >
                <Clock className="w-10 h-10 mx-auto mb-4 text-dandle-orange" />
                <h2 className="font-headline text-2xl font-bold mb-4 text-foreground">
                  {isArabic ? "توقيت التركيب" : "Installation Timing"}
                </h2>
                <p className="font-body text-foreground/80 leading-relaxed mb-4">
                  {isArabic 
                    ? "يتم التركيب كجزء من خدمة التوصيل. التوصيل يستغرق حتى 14 يوم، والتركيب يتم فوراً عند التوصيل."
                    : "Installation is completed as part of your delivery service. Delivery takes up to 14 days, and installation is performed immediately upon delivery."}
                </p>
                <p className="font-body text-sm text-foreground/70">
                  {isArabic ? "نؤكد موعد التوصيل عبر واتساب/الهاتف" : "We confirm your delivery appointment via WhatsApp/phone"}
                </p>
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

export default Installation;