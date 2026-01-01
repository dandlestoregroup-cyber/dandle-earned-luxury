import { motion } from "framer-motion";
import { MapPin, Calendar, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const IstikbalShowroom = () => {
  const handleBookAppointment = () => {
    const message = encodeURIComponent(
      "Hello DANDLE! I'd like to book an appointment to visit the Istikbal showroom and experience your recliners. Please let me know available slots."
    );
    window.open(`https://wa.me/201222804255?text=${message}`, "_blank");
  };

  return (
    <section className="istikbal-section py-10 md:py-14 bg-gradient-to-br from-bronze/90 via-bronze to-charcoal/80 overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-dandle-orange fill-dandle-orange" />
              <span 
                className="text-warm-white font-body text-sm tracking-[0.15em] uppercase"
                data-en="Official Partner"
                data-ar="شريك رسمي"
              >
                Official Partner
              </span>
            </div>
            
            <h2 
              className="font-headline text-3xl md:text-4xl text-warm-white leading-tight"
              data-en="Come feel the difference."
              data-ar="تعال واشعر بالفرق."
            >
              Come feel the difference.
            </h2>
            
            <p 
              className="text-base text-warm-white/90 font-body leading-relaxed"
              data-en="Experience Dandle at Istikbal showrooms. Sit, relax, and discover which model calls to you."
              data-ar="جرب Dandle في صالات عرض إستيكبال. اجلس، استرخِ، واكتشف أي موديل يناديك."
            >
              Experience Dandle at Istikbal showrooms. Sit, relax, and discover which model calls to you.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-dandle-orange/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-warm-white" />
                </div>
                <div>
                  <h4 
                    className="font-headline text-base text-warm-white"
                    data-en="Dedicated DANDLE Section"
                    data-ar="قسم DANDLE مخصص"
                  >
                    Dedicated DANDLE Section
                  </h4>
                  <p 
                    className="text-warm-white/70 font-body text-sm"
                    data-en="Full collection on display inside Istikbal showrooms"
                    data-ar="المجموعة الكاملة معروضة داخل صالات عرض إستيكبال"
                  >
                    Full collection on display inside Istikbal showrooms
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-dandle-orange/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-warm-white" />
                </div>
                <div>
                  <h4 
                    className="font-headline text-base text-warm-white"
                    data-en="Personal Consultation"
                    data-ar="استشارة شخصية"
                  >
                    Personal Consultation
                  </h4>
                  <p 
                    className="text-warm-white/70 font-body text-sm"
                    data-en="Book a private appointment with our comfort specialists"
                    data-ar="احجز موعداً خاصاً مع متخصصي الراحة لدينا"
                  >
                    Book a private appointment with our comfort specialists
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleBookAppointment}
                size="lg"
                className="bg-dandle-orange hover:bg-dandle-orange/90 text-white font-headline text-base px-6 py-5 rounded-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span data-en="Book an Appointment" data-ar="احجز موعد">Book an Appointment</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-warm-white/50 text-warm-white hover:bg-warm-white/20 font-body px-6 py-5 rounded-full"
                onClick={() => window.open("tel:+201222804255")}
              >
                <Phone className="w-4 h-4 mr-2" />
                <span data-en="Call Showroom" data-ar="اتصل بالمعرض">Call Showroom</span>
              </Button>
            </div>
          </motion.div>

          {/* Visual Element - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-warm-white/10 to-dandle-orange/20 rounded-2xl p-6 md:p-8">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-dandle-orange/15 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-warm-white/10 rounded-full translate-y-1/3 -translate-x-1/4" />
              
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-block">
                  <span className="font-headline text-5xl md:text-6xl text-warm-white">
                    Istikbal
                  </span>
                </div>
                
                <p 
                  className="font-body text-lg text-warm-white/95"
                  data-en="Where Quality Meets Comfort"
                  data-ar="حيث تلتقي الجودة بالراحة"
                >
                  Where Quality Meets Comfort
                </p>
                
                <p 
                  className="text-warm-white/80 text-base font-body leading-relaxed max-w-sm mx-auto"
                  data-en="Walk in curious. Sit down. Feel the difference. Leave knowing exactly what comfort means to you."
                  data-ar="ادخل بفضول. اجلس. اشعر بالفرق. غادر وأنت تعرف تماماً ما تعنيه الراحة لك."
                >
                  Walk in curious. Sit down. Feel the difference. 
                  Leave knowing exactly what comfort means to you.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IstikbalShowroom;
