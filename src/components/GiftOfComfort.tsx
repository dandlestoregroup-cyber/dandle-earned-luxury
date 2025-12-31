import { motion } from "framer-motion";
import { Gift, Heart, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const GiftOfComfort = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Gift,
      title: "Premium Gift Wrapping",
      titleAr: "تغليف هدايا فاخر",
      desc: "Elegant presentation for your loved ones",
      descAr: "تقديم أنيق لأحبائك"
    },
    {
      icon: Heart,
      title: "Personalized Message",
      titleAr: "رسالة شخصية",
      desc: "Include a heartfelt note with your gift",
      descAr: "أضف رسالة صادقة مع هديتك"
    },
    {
      icon: Star,
      title: "White-Glove Delivery",
      titleAr: "توصيل راقي",
      desc: "Professional setup in their home",
      descAr: "تركيب احترافي في منزلهم"
    }
  ];

  return (
    <section id="gift-of-comfort" className="py-20 md:py-28 bg-warm-beige/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-dandle-orange/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-dandle-orange" />
            <span 
              className="text-sm font-body text-dandle-orange font-medium"
              data-en="Gift of Comfort"
              data-ar="هدية الراحة"
            >
              Gift of Comfort
            </span>
          </div>
          
          <h2 
            className="font-headline text-3xl md:text-5xl text-charcoal mb-4"
            data-en="Give the Gift of Rest"
            data-ar="أهدِ راحةً لمن تحب"
          >
            Give the Gift of Rest
          </h2>
          
          <p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg font-body"
            data-en="A DANDLE recliner isn't just furniture — it's an invitation to slow down. Perfect for birthdays, anniversaries, or simply saying 'you deserve this.'"
            data-ar="كرسي DANDLE ليس مجرد أثاث — إنه دعوة للاسترخاء. مثالي لأعياد الميلاد، الذكرى السنوية، أو ببساطة للقول 'أنت تستحق هذا.'"
          >
            A DANDLE recliner isn't just furniture — it's an invitation to slow down. Perfect for birthdays, anniversaries, or simply saying "you deserve this."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 text-center border border-border/50 shadow-subtle"
            >
              <div className="w-12 h-12 rounded-full bg-dandle-orange/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-dandle-orange" />
              </div>
              <h3 
                className="font-headline text-xl text-charcoal mb-2"
                data-en={feature.title}
                data-ar={feature.titleAr}
              >
                {feature.title}
              </h3>
              <p 
                className="text-muted-foreground text-sm font-body"
                data-en={feature.desc}
                data-ar={feature.descAr}
              >
                {feature.desc}
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
            variant="hero"
            size="lg"
            onClick={() => navigate('/#collection')}
            className="gap-2"
          >
            <Gift className="w-5 h-5" />
            <span data-en="Explore Gift Options" data-ar="استكشف خيارات الهدايا">
              Explore Gift Options
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftOfComfort;
