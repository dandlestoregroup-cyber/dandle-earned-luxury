import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TopBanner from "@/components/TopBanner";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

const FAQ = () => {
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
    document.title = isArabic ? "الأسئلة الشائعة - DANDLE" : "Frequently Asked Questions - DANDLE";
  }, [isArabic]);

  const faqSections = [
    {
      titleEn: "Ordering",
      titleAr: "الطلب",
      questions: [
        {
          qEn: "How do I place an order?",
          qAr: "كيف أقدم طلب؟",
          aEn: "You can browse our collection on the website, add items to your cart, and complete checkout. You can also contact us directly via WhatsApp at 01222804255 or email Tell.me@DandleStoreGroup.com for personalized assistance.",
          aAr: "يمكنك تصفح مجموعتنا على الموقع وإضافة المنتجات للسلة وإتمام الطلب. يمكنك أيضاً التواصل معنا مباشرة عبر واتساب على 01222804255 أو البريد Tell.me@DandleStoreGroup.com للمساعدة الشخصية."
        },
        {
          qEn: "Can I customize my recliner?",
          qAr: "هل يمكنني تخصيص الكرسي؟",
          aEn: "Many of our recliners are available in different colors and fabric options. Contact us to discuss customization options for your specific model.",
          aAr: "كثير من كراسينا متوفرة بألوان وخامات مختلفة. تواصل معنا لمناقشة خيارات التخصيص للموديل المحدد."
        },
        {
          qEn: "What happens after I place an order?",
          qAr: "ماذا يحدث بعد تقديم الطلب؟",
          aEn: "You'll receive an order confirmation via WhatsApp with your reference number. We'll then contact you within 1-2 business days to schedule delivery and collect the deposit payment.",
          aAr: "ستتلقى تأكيد الطلب عبر واتساب مع رقم المرجع. ثم سنتواصل معك خلال 1-2 أيام عمل لتحديد موعد التوصيل وتحصيل العربون."
        }
      ]
    },
    {
      titleEn: "Payment",
      titleAr: "الدفع",
      questions: [
        {
          qEn: "What payment methods do you accept?",
          qAr: "ما طرق الدفع المتاحة؟",
          aEn: "We accept bank transfers, Vodafone Cash, and InstaPay. Payment is split into two parts: 40% deposit to confirm your order, and 60% on delivery.",
          aAr: "نقبل التحويل البنكي وفودافون كاش وانستاباي. الدفع مقسم: 40% عربون لتأكيد الطلب و60% عند التوصيل."
        },
        {
          qEn: "When do I need to pay?",
          qAr: "متى يجب الدفع؟",
          aEn: "A 40% deposit is required to confirm your order and begin production/preparation. The remaining 60% is due upon delivery before our team completes the setup.",
          aAr: "عربون 40% مطلوب لتأكيد الطلب وبدء التحضير. الباقي 60% عند التوصيل قبل أن يكمل فريقنا التركيب."
        },
        {
          qEn: "Will I receive an invoice?",
          qAr: "هل سأستلم فاتورة؟",
          aEn: "Yes, we send an invoice/receipt via WhatsApp after each payment is received.",
          aAr: "نعم، نرسل فاتورة/إيصال عبر واتساب بعد استلام كل دفعة."
        }
      ]
    },
    {
      titleEn: "Delivery",
      titleAr: "التوصيل",
      questions: [
        {
          qEn: "How long does delivery take?",
          qAr: "كم يستغرق التوصيل؟",
          aEn: "Delivery takes up to 14 days. We confirm the delivery appointment via WhatsApp/phone.",
          aAr: "يستغرق التوصيل حتى 14 يوم. نؤكد موعد التوصيل عبر واتساب/الهاتف."
        },
        {
          qEn: "Do you deliver across all of Egypt?",
          qAr: "هل توصلون لكل مصر؟",
          aEn: "Yes, we provide white-glove delivery service across Egypt. Contact us if you have questions about delivery to your specific location.",
          aAr: "نعم، نقدم خدمة توصيل فاخرة في جميع أنحاء مصر. تواصل معنا إذا كان لديك أسئلة عن التوصيل لمنطقتك."
        },
        {
          qEn: "What is white-glove delivery?",
          qAr: "ما هو التوصيل الفاخر؟",
          aEn: "Our professional team delivers your recliner, unpacks it, sets it up (if assembly is required), removes all packaging, and ensures everything is perfect before leaving.",
          aAr: "فريقنا المحترف يوصل الكرسي ويفتح العبوة ويركبه (إذا كان التجميع مطلوباً) ويزيل كل التغليف ويتأكد أن كل شيء مثالي قبل المغادرة."
        },
        {
          qEn: "Can I reschedule my delivery?",
          qAr: "هل يمكنني تغيير موعد التوصيل؟",
          aEn: "Yes, contact us via WhatsApp or phone to reschedule your delivery appointment. We'll do our best to accommodate your preferred time.",
          aAr: "نعم، تواصل معنا عبر واتساب أو الهاتف لإعادة جدولة موعد التوصيل. سنبذل قصارى جهدنا لتلبية وقتك المفضل."
        }
      ]
    },
    {
      titleEn: "Warranty",
      titleAr: "الضمان",
      questions: [
        {
          qEn: "What warranty do you offer?",
          qAr: "ما الضمان الذي تقدمونه؟",
          aEn: "We offer a comprehensive 2-year warranty covering the frame, motor, and upholstery. Visit our Warranty page for complete details.",
          aAr: "نقدم ضمان شامل لمدة سنتين يغطي الهيكل والمحرك والتنجيد. زر صفحة الضمان للتفاصيل الكاملة."
        },
        {
          qEn: "How do I make a warranty claim?",
          qAr: "كيف أقدم مطالبة ضمان؟",
          aEn: "Contact us via WhatsApp at 01222804255 or email Tell.me@DandleStoreGroup.com with your order reference, photos of the issue, and a description. Our team will guide you through the process.",
          aAr: "تواصل معنا عبر واتساب على 01222804255 أو البريد Tell.me@DandleStoreGroup.com مع رقم الطلب وصور المشكلة ووصف. سيرشدك فريقنا خلال العملية."
        }
      ]
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
              <HelpCircle className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 
                className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent"
                data-en="Frequently Asked Questions"
                data-ar="الأسئلة الشائعة"
              >
                {isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h1>
              <p 
                className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed"
                data-en="Everything you need to know about DANDLE"
                data-ar="كل ما تحتاج معرفته عن DANDLE"
              >
                {isArabic ? "كل ما تحتاج معرفته عن DANDLE" : "Everything you need to know about DANDLE"}
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {faqSections.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  <h2 className="font-headline text-3xl font-bold mb-6 text-foreground">
                    {isArabic ? section.titleAr : section.titleEn}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {section.questions.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`${sectionIndex}-${index}`}
                        className="border border-bronze/20 rounded-lg px-6 bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <AccordionTrigger className="font-body text-lg font-semibold text-left hover:text-dandle-orange transition-colors">
                          {isArabic ? item.qAr : item.qEn}
                        </AccordionTrigger>
                        <AccordionContent className="font-body text-foreground/70 leading-relaxed pt-2">
                          {isArabic ? item.aAr : item.aEn}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 md:p-12 border border-bronze/20 shadow-elegant"
              >
                <h2 className="font-headline text-3xl font-bold mb-4 text-foreground">
                  {isArabic ? "لا زال لديك أسئلة؟" : "Still Have Questions?"}
                </h2>
                <p className="font-body text-foreground/70 mb-6 leading-relaxed">
                  {isArabic ? "فريقنا هنا للمساعدة. تواصل معنا عبر واتساب أو الهاتف أو البريد." : "Our team is here to help. Contact us via WhatsApp, phone, or email."}
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

export default FAQ;