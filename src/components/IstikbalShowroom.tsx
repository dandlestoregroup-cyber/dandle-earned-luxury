import { motion } from "framer-motion";
import { MapPin, Calendar, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getLangFromStorage, type LangKey } from "@/i18n/strings";

// All 4 Istikbal showroom locations in Egypt
const branches = [
  {
    nameEn: "Istikbal Dokki",
    nameAr: "إستيكبال الدقي",
    addressEn: "84 Mohy El Din Abou El Ezz St., Dokki, Giza",
    addressAr: "84 محيي الدين أبو العز، الدقي، محافظة الجيزة",
    city: "Giza",
  },
  {
    nameEn: "Istikbal City Stars",
    nameAr: "إستيكبال سيتي ستارز",
    addressEn: "City Stars Mall, Nasr City, Cairo",
    addressAr: "سيتي ستارز مول، مدينة نصر، القاهرة",
    city: "Cairo",
  },
  {
    nameEn: "Istikbal Nasr City",
    nameAr: "إستيكبال مدينة نصر",
    addressEn: "28 Atiya Al Sawalhi St., Zone 8, Nasr City, Cairo",
    addressAr: "28 عطية الصوالحي، المنطقة الثامنة، مدينة نصر، القاهرة",
    city: "Cairo",
  },
  {
    nameEn: "Istikbal Alexandria",
    nameAr: "إستيكبال الإسكندرية",
    addressEn: "24 Fawzi Moaz St., Ezbet Saad, Sidi Gaber, Alexandria",
    addressAr: "24 محمد فوزي معاذ، عزبة سعد، سيدي جابر، الإسكندرية",
    city: "Alexandria",
  },
];

const IstikbalShowroom = () => {
  const [lang, setLang] = useState<LangKey>('ar');

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

  const handleBookAppointment = () => {
    const message = isArabic
      ? "مرحباً Dandle! أريد حجز موعد لزيارة معرض إستيكبال وتجربة الريكلاينرز. من فضلكم أخبروني بالمواعيد المتاحة."
      : "Hello DANDLE! I'd like to book an appointment to visit the Istikbal showroom and experience your recliners. Please let me know available slots.";
    window.open(`https://wa.me/201222804255?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section 
      className="istikbal-section py-12 md:py-16 bg-gradient-to-br from-bronze/90 via-bronze to-charcoal/80 overflow-hidden relative"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-dandle-orange fill-dandle-orange" />
              <span className={`text-warm-white text-sm tracking-wide ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                {isArabic ? "شريك رسمي" : "Official Partner"}
              </span>
            </div>
            
            <h2 className={`text-3xl md:text-4xl text-warm-white leading-tight ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
              {isArabic ? "تعال واشعر بالفرق." : "Come feel the difference."}
            </h2>
            
            <p className={`text-base md:text-lg text-warm-white/90 leading-relaxed ${isArabic ? 'font-body-ar' : 'font-body'}`}>
              {isArabic 
                ? "جرب Dandle في صالات عرض إستيكبال. اجلس، استرخِ، واكتشف أي موديل يناديك."
                : "Experience Dandle at Istikbal showrooms. Sit, relax, and discover which model calls to you."
              }
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-dandle-orange/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-warm-white" />
                </div>
                <div>
                  <h4 className={`text-base text-warm-white font-medium ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
                    {isArabic ? "قسم DANDLE مخصص" : "Dedicated DANDLE Section"}
                  </h4>
                  <p className={`text-warm-white/70 text-sm ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                    {isArabic ? "المجموعة الكاملة معروضة داخل صالات عرض إستيكبال" : "Full collection on display inside Istikbal showrooms"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-dandle-orange/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-warm-white" />
                </div>
                <div>
                  <h4 className={`text-base text-warm-white font-medium ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
                    {isArabic ? "استشارة شخصية" : "Personal Consultation"}
                  </h4>
                  <p className={`text-warm-white/70 text-sm ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                    {isArabic ? "احجز موعداً خاصاً مع متخصصي الراحة لدينا" : "Book a private appointment with our comfort specialists"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleBookAppointment}
                size="lg"
                className="bg-dandle-orange hover:bg-dandle-orange/90 text-white font-medium text-base px-6 py-5 rounded-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {isArabic ? "احجز موعد" : "Book an Appointment"}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-warm-white/50 text-warm-white hover:bg-warm-white/20 font-medium px-6 py-5 rounded-full"
                onClick={() => window.open("tel:+201222804255")}
              >
                <Phone className="w-4 h-4 mr-2" />
                {isArabic ? "اتصل بالمعرض" : "Call Showroom"}
              </Button>
            </div>
          </motion.div>

          {/* Branches List - All 4 Citystars */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-warm-white/10 to-dandle-orange/10 rounded-lg p-6 md:p-8 backdrop-blur-sm">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-dandle-orange/15 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-14 h-14 bg-warm-white/10 rounded-full translate-y-1/3 -translate-x-1/4" />
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <span className={`text-5xl md:text-6xl text-warm-white ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
                    Istikbal
                  </span>
                  <p className={`text-warm-white/80 text-base mt-2 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                    {isArabic ? "حيث تلتقي الجودة بالراحة" : "Where Quality Meets Comfort"}
                  </p>
                </div>
                
                {/* Branch List */}
                <div className="space-y-4 mt-6">
                  <h4 className={`text-warm-white font-medium text-sm tracking-wide mb-3 ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                    {isArabic ? "فروع إستيكبال" : "Istikbal Showrooms"}
                  </h4>
                  {branches.map((branch, index) => (
                    <motion.div
                      key={branch.nameEn}
                      className="bg-warm-white/10 rounded-sm p-4 border border-warm-white/10"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <h5 className={`text-warm-white font-medium text-base mb-1 ${isArabic ? 'font-body-ar' : 'font-headline'}`}>
                        {isArabic ? branch.nameAr : branch.nameEn}
                      </h5>
                      <p className={`text-warm-white/70 text-sm leading-relaxed ${isArabic ? 'font-body-ar' : 'font-body'}`}>
                        {isArabic ? branch.addressAr : branch.addressEn}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IstikbalShowroom;