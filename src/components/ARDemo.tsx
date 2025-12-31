import { motion } from "framer-motion";
import { Upload, Eye, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ARDemo = () => {
  const navigate = useNavigate();

  const handleSendRoomPhoto = () => {
    // WhatsApp link for room photo submission
    const message = encodeURIComponent("Hi! I'd like to send a room photo for visualization.");
    window.open(`https://wa.me/201222804255?text=${message}`, '_blank');
  };

  return (
    <section id="ar-demo" className="bg-warm-beige py-24 px-6 text-center">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-headline text-4xl md:text-6xl mb-6 text-dandle-orange leading-tight">
          See your recliner<br />
          come alive in<br />
          your own room
        </h2>

        <p className="text-lg md:text-xl text-charcoal/80 mb-12 max-w-2xl mx-auto">
          Upload a photo, choose your Dandle recliner, and watch Nour make it real.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-dandle-orange/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-dandle-orange" />
            </div>
            <h3 className="font-headline text-xl text-charcoal">Upload Room</h3>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-dandle-orange/20 flex items-center justify-center">
              <Eye className="w-8 h-8 text-dandle-orange" />
            </div>
            <h3 className="font-headline text-xl text-charcoal">Pick Spot</h3>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-dandle-orange/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-dandle-orange" />
            </div>
            <h3 className="font-headline text-xl text-charcoal">See Magic</h3>
          </motion.div>
        </div>

        {/* Primary CTA - Try in My Room (AI) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={() => navigate('/nour-chat')}
            size="lg"
            className="bg-gradient-to-r from-dandle-orange to-[hsl(27,80%,45%)] hover:from-dandle-orange/90 hover:to-[hsl(27,80%,40%)] text-white px-8 py-6 text-lg font-headline rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Try it in My Room
          </Button>

          {/* Secondary CTA - Send Room Photo via WhatsApp */}
          <div className="flex flex-col items-center">
            <Button
              onClick={handleSendRoomPhoto}
              size="lg"
              variant="outline"
              className="border-2 border-dandle-brown text-dandle-brown hover:bg-dandle-brown hover:text-warm-cream px-8 py-6 text-lg font-headline rounded-full transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Room Photo
            </Button>
            <span className="text-sm text-charcoal/60 mt-2 font-body">via WhatsApp</span>
          </div>
        </div>

        {/* SLA Text */}
        <p className="text-sm text-charcoal/70 font-body">
          Response within 72 hours • Completely free
        </p>
      </motion.div>
    </section>
  );
};

export default ARDemo;
