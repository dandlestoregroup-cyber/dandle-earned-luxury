import { motion } from "framer-motion";
import { Eye, Palette } from "lucide-react";
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
            data-en="Experience Before You Buy"
            data-ar="جرّب قبل ما تشتري"
          >
            Experience Before You Buy
          </h2>
          <p 
            className="text-lg text-charcoal/70 max-w-2xl mx-auto"
            data-en="See your recliner in your space, in your color"
            data-ar="شوف كرسيك في مكانك، بلونك"
          >
            See your recliner in your space, in your color
          </p>
        </motion.div>

        {/* Two Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Room Preview - Manual via WhatsApp */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Eye className="w-7 h-7 text-dandle-orange" />
              </div>
              <div>
                <h3 
                  className="font-headline text-2xl text-charcoal"
                  data-en="Room Preview"
                  data-ar="معاينة الغرفة"
                >
                  Room Preview
                </h3>
                <p 
                  className="text-xs text-charcoal/60 mt-1"
                  data-en="48-hour response"
                  data-ar="رد خلال 48 ساعة"
                >
                  48-hour response
                </p>
              </div>
            </div>
            
            <p 
              className="text-charcoal/70 mb-6"
              data-en="Send 1–3 wide corner photos of your room in daylight. Our team will place the recliner, recommend fabrics, and suggest room enhancements."
              data-ar="ابعت 1-3 صور واسعة لزوايا غرفتك بضوء النهار. فريقنا هيحط الكرسي، ويقترح الخامات، ونصائح لتحسين الغرفة."
            >
              Send 1–3 wide corner photos of your room in daylight. Our team will place 
              the recliner, recommend fabrics, and suggest room enhancements.
            </p>

            <Button
              onClick={handleRoomPreviewClick}
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium"
            >
              <WhatsAppIcon size={18} />
              <span 
                className="ml-2"
                data-en="Send Room Photos"
                data-ar="ابعت صور الغرفة"
              >
                Send Room Photos
              </span>
            </Button>
          </motion.div>

          {/* Chair Recoloring - Swatch-based */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-warm-beige hover:border-dandle-orange/30 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-dandle-orange/20 flex items-center justify-center">
                <Palette className="w-7 h-7 text-dandle-orange" />
              </div>
              <div>
                <h3 
                  className="font-headline text-2xl text-charcoal"
                  data-en="Chair Recoloring"
                  data-ar="تلوين الكرسي"
                >
                  Chair Recoloring
                </h3>
                <Badge className="bg-dandle-orange/20 text-dandle-orange border-dandle-orange/30 text-xs mt-1">
                  <span data-en="Coming Soon" data-ar="قريباً">Coming Soon</span>
                </Badge>
              </div>
            </div>
            
            <p 
              className="text-charcoal/70 mb-6"
              data-en="Preview any recliner in our curated fabric palette. Tap a swatch on the product page to see your exact model recolored — no uploads needed."
              data-ar="شوف أي كرسي بألوان الأقمشة المتاحة. اضغط على اللون في صفحة المنتج وشوف الموديل بتاعك — من غير رفع صور."
            >
              Preview any recliner in our curated fabric palette. Tap a swatch on the 
              product page to see your exact model recolored — no uploads needed.
            </p>

            <div className="flex gap-2 flex-wrap">
              {["#2B547E", "#C4A35A", "#8B7355", "#6B8E23", "#CD5C5C", "#708090", "#D4C4A8"].map((color) => (
                <div 
                  key={color}
                  className="w-8 h-8 rounded-lg border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ARDemo;