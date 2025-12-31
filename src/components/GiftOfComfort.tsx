import { motion } from "framer-motion";
import { Gift, Heart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const GiftOfComfort = () => {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const checkLanguage = () => {
      setIsArabic(document.documentElement.lang === 'ar');
    };
    checkLanguage();

    const observer = new MutationObserver(checkLanguage);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="gift-of-comfort" className="py-20 px-6 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 mb-6">
            <Gift className="w-4 h-4 text-accent" />
            <span className="text-sm font-body text-foreground/80">
              {isArabic ? "هدية مميزة" : "A Gift They'll Love"}
            </span>
          </div>

          <h2 className="font-headline text-3xl md:text-5xl font-semibold text-foreground mb-4">
            {isArabic ? "هدية الراحة" : "The Gift of Comfort"}
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg">
            {isArabic
              ? "امنح من تحب راحة لا تُنسى — هدية تدوم لسنوات."
              : "Give someone you love the gift of lasting comfort — a present they'll enjoy for years."
            }
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Heart,
              titleEn: "Personal & Thoughtful",
              titleAr: "شخصية ومدروسة",
              descEn: "A recliner is more than furniture — it's a daily sanctuary for someone you care about.",
              descAr: "الكرسي ليس مجرد أثاث — إنه ملاذ يومي لمن تحب."
            },
            {
              icon: Star,
              titleEn: "Premium Quality",
              titleAr: "جودة فاخرة",
              descEn: "Handcrafted in Cairo with 5-year warranty. A gift that lasts.",
              descAr: "صناعة يدوية في القاهرة مع ضمان 5 سنوات. هدية تدوم."
            },
            {
              icon: Gift,
              titleEn: "White-Glove Delivery",
              titleAr: "توصيل راقي",
              descEn: "We deliver, assemble, and place — making gifting effortless.",
              descAr: "نوصل ونركب ونضع — نجعل الهدية سهلة."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 rounded-lg border border-border/50 text-center hover:shadow-elegant transition-shadow duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-headline text-xl font-semibold text-foreground mb-2">
                {isArabic ? item.titleAr : item.titleEn}
              </h3>
              <p className="font-body text-muted-foreground text-sm">
                {isArabic ? item.descAr : item.descEn}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-body rounded-md transition-all duration-300"
          >
            {isArabic ? "اختر الهدية المثالية" : "Choose the Perfect Gift"}
            <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isArabic ? 'mr-2 rotate-180' : 'ml-2'}`} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftOfComfort;
