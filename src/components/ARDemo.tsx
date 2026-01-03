import { motion } from "framer-motion";
import { Eye, Palette, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const ARDemo = () => {
  const handleRoomPreviewClick = () => {
    const message = encodeURIComponent(
      "Room Preview Request\n\nCity: \nModel: \nPreferred spot (optional): \n\n[I'll attach 1-3 wide corner photos in daylight]"
    );
    window.open(`https://wa.me/201222804255?text=${message}`, "_blank");
  };

  const handleComfortQuizClick = () => {
    const message = encodeURIComponent(
      "Comfort Quiz Request\n\nI'd like help finding my perfect recliner!"
    );
    window.open(`https://wa.me/201222804255?text=${message}`, "_blank");
  };

  return (
    <section className="bg-warm-beige py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="font-headline text-4xl md:text-5xl text-charcoal mb-4"
            data-en="Premium Tools"
            data-ar="أدوات مميزة"
          >
            Premium Tools
          </h2>
          <p 
            className="text-lg text-charcoal/70 max-w-2xl mx-auto"
            data-en="See your recliner in your space, in your color"
            data-ar="شوف كرسيك في مكانك، بلونك"
          >
            See your recliner in your space, in your color
          </p>
        </motion.div>

        {/* Three Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Room Visualizer */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-dandle-orange" />
              </div>
              <div>
                <h3 
                  className="font-headline text-xl text-charcoal"
                  data-en="Room Visualizer"
                  data-ar="معاينة الغرفة"
                >
                  Room Visualizer
                </h3>
              </div>
            </div>
            
            <p 
              className="text-charcoal/70 mb-6 text-sm"
              data-en="See your recliner in your space with AR visualization."
              data-ar="شوف كرسيك في مكانك بتقنية الواقع المعزز."
            >
              See your recliner in your space with AR visualization.
            </p>

            <Button
              onClick={handleRoomPreviewClick}
              className="w-full bg-dandle-orange hover:bg-dandle-orange/90 text-white font-medium"
            >
              <span data-en="Try Now" data-ar="جرّب الآن">Try Now</span>
            </Button>
          </motion.div>

          {/* Fabric Matcher */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Palette className="w-6 h-6 text-dandle-orange" />
              </div>
              <div>
                <h3 
                  className="font-headline text-xl text-charcoal"
                  data-en="Fabric Matcher"
                  data-ar="مطابقة الأقمشة"
                >
                  Fabric Matcher
                </h3>
              </div>
            </div>
            
            <p 
              className="text-charcoal/70 mb-6 text-sm"
              data-en="Match fabrics to your existing décor instantly."
              data-ar="طابق الأقمشة مع ديكورك الحالي فوراً."
            >
              Match fabrics to your existing décor instantly.
            </p>

            <Button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="outline"
              className="w-full border-dandle-orange text-dandle-orange hover:bg-dandle-orange/10"
            >
              <span data-en="Explore" data-ar="استكشف">Explore</span>
            </Button>
          </motion.div>

          {/* Comfort Quiz */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-dandle-orange" />
              </div>
              <div className="flex items-center gap-2">
                <h3 
                  className="font-headline text-xl text-charcoal"
                  data-en="Comfort Quiz"
                  data-ar="اختبار الراحة"
                >
                  Comfort Quiz
                </h3>
                <Badge className="bg-dandle-orange/20 text-dandle-orange border-dandle-orange/30 text-xs">
                  <span data-en="New" data-ar="جديد">New</span>
                </Badge>
              </div>
            </div>
            
            <p 
              className="text-charcoal/70 mb-6 text-sm"
              data-en="Find your perfect recliner in 30 seconds."
              data-ar="اعثر على كرسيك المثالي في 30 ثانية."
            >
              Find your perfect recliner in 30 seconds.
            </p>

            <Button
              onClick={handleComfortQuizClick}
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium"
            >
              <WhatsAppIcon size={18} />
              <span className="ml-2" data-en="Start Quiz" data-ar="ابدأ الاختبار">Start Quiz</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ARDemo;
