import { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Sparkles, Bell, ArrowRight, Camera, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "201222804255";
const WHATSAPP_PREFILL = encodeURIComponent(
  "Room Preview by Nour\nCity: [my city]\nModel: [preferred model]\n(uploading room photo)"
);

const NourComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate subscription (replace with actual API call later)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    toast({
      title: "You're on the list!",
      description: "We'll notify you when Nour AI launches.",
    });
    
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Nour AI - Coming Soon | DANDLE</title>
        <meta
          name="description"
          content="Nour AI: Your intelligent design companion for visualizing DANDLE recliners in your space. Sign up to be notified when we launch."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-charcoal/95 pt-20 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-dandle-orange via-pink-500 to-purple-500 flex items-center justify-center shadow-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-dandle-orange/20 text-dandle-orange px-4 py-2 rounded-full text-sm font-body mb-6"
            >
              <Bell className="w-4 h-4" />
              Coming Soon
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-headline text-5xl md:text-7xl text-warm-white mb-4"
            >
              Meet <span className="text-dandle-orange">Nour</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-warm-white/80 mb-4 font-body"
            >
              Your AI Design Companion
            </motion.p>

            {/* Description - Bilingual */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-warm-white/60 mb-10 max-w-lg mx-auto leading-relaxed"
              data-en="Upload a photo of your room to help visualize the right DANDLE recliner in your space — with style and color suggestions to choose confidently."
              data-ar="ارفع صورة غرفتك لمساعدتك في تصور كرسي DANDLE الأنسب داخل مساحتك — مع اقتراحات للستايل والألوان لتختار بثقة."
            >
              Upload a photo of your room to help visualize the right DANDLE recliner in your space — with style and color suggestions to choose confidently.
            </motion.p>

            {/* 3-Step Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              {[
                { icon: Camera, step: "1", title: "Snap Your Room", desc: "Wide angle, natural daylight" },
                { icon: MessageCircle, step: "2", title: "Send on WhatsApp", desc: "Include city + model" },
                { icon: Clock, step: "3", title: "Receive Preview", desc: "Within 72 hours" },
              ].map((feature, i) => (
                <div key={i} className="bg-warm-white/5 backdrop-blur-sm rounded-xl p-4 border border-warm-white/10 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-dandle-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {feature.step}
                  </div>
                  <feature.icon className="w-8 h-8 text-dandle-orange mb-2 mx-auto" />
                  <h3 className="text-warm-white font-headline text-lg mb-1">{feature.title}</h3>
                  <p className="text-warm-white/50 text-sm">{feature.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Primary CTA: WhatsApp Room Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <Button
                onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PREFILL}`, "_blank")}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#25D366]/90 text-white font-body gap-2 px-8 py-6 text-lg flex flex-col items-center"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Send Room Photo
                </span>
                <span className="text-xs opacity-80">via WhatsApp</span>
              </Button>
              
              <p className="text-warm-white/60 text-sm">
                Reply within <span className="text-dandle-orange font-semibold">72 hours</span> guaranteed
              </p>
            </motion.div>

            {/* Secondary: Email Signup */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 pt-8 border-t border-warm-white/10"
            >
              <p className="text-warm-white/50 text-sm mb-4">Or get notified when full AI preview launches</p>
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-warm-white/10 border-warm-white/20 text-warm-white placeholder:text-warm-white/40 focus:border-dandle-orange"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="outline"
                    className="border-warm-white/20 text-warm-white hover:bg-warm-white/10 font-body gap-2"
                  >
                    {isSubmitting ? "Joining..." : "Notify Me"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <div className="bg-green-500/20 text-green-400 rounded-xl p-6 border border-green-500/30">
                  <p className="font-headline text-xl mb-2">You're on the list!</p>
                  <p className="text-green-400/70">We'll email you when Nour AI launches.</p>
                </div>
              )}
            </motion.div>

            {/* Social Proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-warm-white/40 text-sm mt-8"
            >
              Join 500+ homeowners waiting for launch
            </motion.p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NourComingSoon;
