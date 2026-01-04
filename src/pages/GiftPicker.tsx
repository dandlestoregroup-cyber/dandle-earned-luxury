import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart, Users, Tv, BookOpen, Moon, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const WHATSAPP_NUMBER = "201222804255";

type Step = 1 | 2 | 3 | 4;

interface Selection {
  recipient: string;
  usage: string;
  budget: string;
}

const recipientOptions = [
  { id: "parents", labelEn: "Parents", labelAr: "الوالدين", icon: Users },
  { id: "partner", labelEn: "Partner", labelAr: "الشريك", icon: Heart },
  { id: "self", labelEn: "Myself", labelAr: "لنفسي", icon: Gift },
];

const usageOptions = [
  { id: "reading", labelEn: "Reading & Relaxing", labelAr: "القراءة والاسترخاء", icon: BookOpen },
  { id: "tv", labelEn: "Watching TV", labelAr: "مشاهدة التلفزيون", icon: Tv },
  { id: "napping", labelEn: "Napping", labelAr: "القيلولة", icon: Moon },
];

const budgetOptions = [
  { id: "standard", labelEn: "Up to 30,000 EGP", labelAr: "حتى 30,000 جنيه", range: "21,900 - 29,900" },
  { id: "premium", labelEn: "30,000 - 45,000 EGP", labelAr: "30,000 - 45,000 جنيه", range: "30,900 - 42,900" },
  { id: "luxury", labelEn: "Above 45,000 EGP", labelAr: "أكثر من 45,000 جنيه", range: "46,900 - 90,900" },
];

const recommendations: Record<string, { product: string; handle: string }> = {
  "parents-reading-standard": { product: "RelaxMax", handle: "relaxmax" },
  "parents-reading-premium": { product: "ComfortPlus", handle: "comfortplus" },
  "parents-reading-luxury": { product: "CozyCompanion", handle: "cozycompanion" },
  "parents-tv-standard": { product: "SpaceSaver", handle: "spacesaver" },
  "parents-tv-premium": { product: "Diva", handle: "diva" },
  "parents-tv-luxury": { product: "CozyCompanion", handle: "cozycompanion" },
  "parents-napping-standard": { product: "RelaxMax", handle: "relaxmax" },
  "parents-napping-premium": { product: "EasyUp Standard", handle: "easyup-standard" },
  "parents-napping-luxury": { product: "EasyUp Compact", handle: "easyup-compact" },
  "partner-reading-standard": { product: "WorkNest", handle: "worknest" },
  "partner-reading-premium": { product: "ComfortPlus", handle: "comfortplus" },
  "partner-reading-luxury": { product: "CozyCompanion", handle: "cozycompanion" },
  "partner-tv-standard": { product: "SpaceSaver", handle: "spacesaver" },
  "partner-tv-premium": { product: "Diva", handle: "diva" },
  "partner-tv-luxury": { product: "Complete Set", handle: "complete-set" },
  "partner-napping-standard": { product: "RelaxMax", handle: "relaxmax" },
  "partner-napping-premium": { product: "ComfortPlus", handle: "comfortplus" },
  "partner-napping-luxury": { product: "Complete Set", handle: "complete-set" },
  "self-reading-standard": { product: "WorkNest", handle: "worknest" },
  "self-reading-premium": { product: "ComfortPlus", handle: "comfortplus" },
  "self-reading-luxury": { product: "CozyCompanion", handle: "cozycompanion" },
  "self-tv-standard": { product: "SpaceSaver", handle: "spacesaver" },
  "self-tv-premium": { product: "Diva", handle: "diva" },
  "self-tv-luxury": { product: "Complete Set", handle: "complete-set" },
  "self-napping-standard": { product: "RelaxMax", handle: "relaxmax" },
  "self-napping-premium": { product: "EasyUp Standard", handle: "easyup-standard" },
  "self-napping-luxury": { product: "EasyUp Compact", handle: "easyup-compact" },
};

const GiftPicker = () => {
  const [step, setStep] = useState<Step>(1);
  const [selection, setSelection] = useState<Selection>({
    recipient: "",
    usage: "",
    budget: "",
  });

  const getRecommendation = () => {
    const key = `${selection.recipient}-${selection.usage}-${selection.budget}`;
    return recommendations[key] || { product: "RelaxMax", handle: "relaxmax" };
  };

  const handleWhatsAppOrder = () => {
    const rec = getRecommendation();
    const recipientLabel = recipientOptions.find(r => r.id === selection.recipient)?.labelEn || "";
    const usageLabel = usageOptions.find(u => u.id === selection.usage)?.labelEn || "";
    const budgetLabel = budgetOptions.find(b => b.id === selection.budget)?.labelEn || "";
    
    const message = encodeURIComponent(
      `Gift Order from Dandle\n\nRecipient: ${recipientLabel}\nUsage: ${usageLabel}\nBudget: ${budgetLabel}\nRecommended: ${rec.product}\n\nI'd like to proceed with this gift!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selection.recipient;
      case 2: return !!selection.usage;
      case 3: return !!selection.budget;
      default: return true;
    }
  };

  return (
    <>
      <Helmet>
        <title>Gift Finder | Dandle</title>
        <meta name="description" content="Find the perfect Dandle recliner gift. Answer 3 simple questions and we'll recommend the ideal comfort gift." />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-cream-porcelain pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Gift className="w-12 h-12 text-dandle-orange mx-auto mb-4" />
            <h1 
              className="font-headline text-3xl md:text-4xl text-charcoal mb-2"
              data-en="Gift Finder"
              data-ar="دليل الهدايا"
            >
              Gift Finder
            </h1>
            <p 
              className="text-charcoal/60"
              data-en="Find the perfect recliner gift in 3 questions"
              data-ar="اختر هدية الكرسي المثالية في ٣ أسئلة"
            >
              Find the perfect recliner gift in 3 questions
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-dandle-orange" : "bg-charcoal/10"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 
                  className="font-headline text-2xl text-charcoal text-center"
                  data-en="Who is it for?"
                  data-ar="لمين الهدية؟"
                >
                  Who is it for?
                </h2>
                <div className="grid gap-4">
                  {recipientOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelection(s => ({ ...s, recipient: option.id }))}
                      className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        selection.recipient === option.id
                          ? "border-dandle-orange bg-dandle-orange/5"
                          : "border-charcoal/10 hover:border-charcoal/30"
                      }`}
                    >
                      <option.icon className={`w-6 h-6 ${selection.recipient === option.id ? "text-dandle-orange" : "text-charcoal/40"}`} />
                      <span 
                        className="text-lg text-charcoal"
                        data-en={option.labelEn}
                        data-ar={option.labelAr}
                      >
                        {option.labelEn}
                      </span>
                      {selection.recipient === option.id && (
                        <Check className="w-5 h-5 text-dandle-orange ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 
                  className="font-headline text-2xl text-charcoal text-center"
                  data-en="Primary use?"
                  data-ar="الاستخدام الأساسي؟"
                >
                  Primary use?
                </h2>
                <div className="grid gap-4">
                  {usageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelection(s => ({ ...s, usage: option.id }))}
                      className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        selection.usage === option.id
                          ? "border-dandle-orange bg-dandle-orange/5"
                          : "border-charcoal/10 hover:border-charcoal/30"
                      }`}
                    >
                      <option.icon className={`w-6 h-6 ${selection.usage === option.id ? "text-dandle-orange" : "text-charcoal/40"}`} />
                      <span 
                        className="text-lg text-charcoal"
                        data-en={option.labelEn}
                        data-ar={option.labelAr}
                      >
                        {option.labelEn}
                      </span>
                      {selection.usage === option.id && (
                        <Check className="w-5 h-5 text-dandle-orange ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 
                  className="font-headline text-2xl text-charcoal text-center"
                  data-en="Budget range?"
                  data-ar="الميزانية؟"
                >
                  Budget range?
                </h2>
                <div className="grid gap-4">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelection(s => ({ ...s, budget: option.id }))}
                      className={`p-6 rounded-xl border-2 flex flex-col items-start transition-all ${
                        selection.budget === option.id
                          ? "border-dandle-orange bg-dandle-orange/5"
                          : "border-charcoal/10 hover:border-charcoal/30"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span 
                          className="text-lg text-charcoal"
                          data-en={option.labelEn}
                          data-ar={option.labelAr}
                        >
                          {option.labelEn}
                        </span>
                        {selection.budget === option.id && (
                          <Check className="w-5 h-5 text-dandle-orange" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-8"
              >
                <div className="w-20 h-20 rounded-full bg-dandle-orange/10 flex items-center justify-center mx-auto">
                  <Gift className="w-10 h-10 text-dandle-orange" />
                </div>
                <div>
                  <h2 
                    className="font-headline text-2xl text-charcoal mb-2"
                    data-en="Perfect Match Found!"
                    data-ar="وجدنا الهدية المثالية!"
                  >
                    Perfect Match Found!
                  </h2>
                  <p 
                    className="text-charcoal/60"
                    data-en="Based on your answers, we recommend:"
                    data-ar="بناءً على إجاباتك، نرشح لك:"
                  >
                    Based on your answers, we recommend:
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-charcoal/5">
                  <h3 className="font-headline text-3xl text-charcoal mb-4">
                    {getRecommendation().product}
                  </h3>
                  <Button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white py-6 text-lg"
                  >
                    <span data-en="Order as Gift via WhatsApp" data-ar="اطلب كهدية عبر واتساب">
                      Order as Gift via WhatsApp
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-4 mt-10">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span data-en="Back" data-ar="رجوع">Back</span>
                </Button>
              )}
              <Button
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={!canProceed()}
                className="flex-1 bg-dandle-orange hover:bg-dandle-orange/90 text-white"
              >
                <span data-en="Continue" data-ar="متابعة">Continue</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 4 && (
            <Button
              variant="ghost"
              onClick={() => {
                setStep(1);
                setSelection({ recipient: "", usage: "", budget: "" });
              }}
              className="w-full mt-6"
            >
              <span data-en="Start Over" data-ar="ابدأ من جديد">Start Over</span>
            </Button>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default GiftPicker;
