import { motion } from "framer-motion";
import { MapPin, Calendar, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const IstikbalShowroom = () => {
  const handleBookAppointment = () => {
    // Open WhatsApp with appointment message
    const message = encodeURIComponent(
      "Hello DANDLE! I'd like to book an appointment to visit the Istikbal showroom and experience your recliners. Please let me know available slots."
    );
    window.open(`https://wa.me/201222804255?text=${message}`, "_blank");
  };

  return (
    <section className="istikbal-section py-12 md:py-16 bg-charcoal overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-dandle-orange fill-dandle-orange" />
              <span className="text-bronze font-body text-sm tracking-[0.15em] uppercase">
                Official Partner
              </span>
            </div>
            
            <h2 className="font-headline text-4xl md:text-5xl text-warm-white leading-tight">
              Visit the DANDLE Section at{" "}
              <span className="text-dandle-orange">Istikbal</span>
            </h2>
            
            <p className="text-lg text-warm-white/80 font-body leading-relaxed">
              Experience our full collection at the dedicated DANDLE section inside Istikbal — 
              Egypt&apos;s most trusted furniture destination. Feel the premium craftsmanship, 
              test the zero-gravity recline, and discover your perfect comfort companion in person.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-dandle-orange/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-dandle-orange" />
                </div>
                <div>
                  <h4 className="font-headline text-lg text-warm-white">Dedicated DANDLE Section</h4>
                  <p className="text-warm-white/60 font-body">
                    Full collection on display inside Istikbal showrooms
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-dandle-orange/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-dandle-orange" />
                </div>
                <div>
                  <h4 className="font-headline text-lg text-warm-white">Personal Consultation</h4>
                  <p className="text-warm-white/60 font-body">
                    Book a private appointment with our comfort specialists
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleBookAppointment}
                size="lg"
                className="bg-dandle-orange hover:bg-dandle-orange/90 text-white font-headline text-lg px-8 py-6 rounded-full"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book an Appointment
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-warm-white/30 text-warm-white hover:bg-warm-white/10 font-body px-8 py-6 rounded-full"
                onClick={() => window.open("tel:+201222804255")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Showroom
              </Button>
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-dandle-orange/20 to-bronze/20 rounded-3xl p-8 md:p-12">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-dandle-orange/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-bronze/20 rounded-full translate-y-1/3 -translate-x-1/4" />
              
              <div className="relative z-10 text-center space-y-6">
                <div className="inline-block">
                  <span className="font-headline text-6xl md:text-7xl text-dandle-orange">
                    Istikbal
                  </span>
                </div>
                
                <p className="font-body text-xl text-warm-white/90">
                  Where Quality Meets Comfort
                </p>
                
                <p className="text-warm-white/80 text-lg font-body leading-relaxed max-w-md mx-auto pt-4">
                  Walk in curious. Sit down. Feel the difference. 
                  Leave knowing exactly what comfort means to you.
                </p>

                <p className="text-warm-white/50 text-sm font-body italic pt-2">
                  The moment you sit, you&apos;ll understand.
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