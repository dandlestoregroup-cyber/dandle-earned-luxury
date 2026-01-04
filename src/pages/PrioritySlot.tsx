import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Truck, Shield, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const WHATSAPP_NUMBER = "201222804255";

const cities = [
  { id: "cairo", labelEn: "Cairo", labelAr: "القاهرة" },
  { id: "giza", labelEn: "Giza", labelAr: "الجيزة" },
  { id: "alexandria", labelEn: "Alexandria", labelAr: "الإسكندرية" },
  { id: "mansoura", labelEn: "Mansoura", labelAr: "المنصورة" },
  { id: "tanta", labelEn: "Tanta", labelAr: "طنطا" },
  { id: "other", labelEn: "Other City", labelAr: "مدينة أخرى" },
];

const timeSlots = [
  { id: "week1", labelEn: "Within 7 days", labelAr: "خلال ٧ أيام" },
  { id: "week2", labelEn: "Within 14 days", labelAr: "خلال ١٤ يوم" },
  { id: "flexible", labelEn: "I'm flexible", labelAr: "مرن" },
];

const benefits = [
  { icon: Truck, titleEn: "White-Glove Delivery", titleAr: "توصيل راقي", descEn: "Professional setup in your home", descAr: "تركيب احترافي في منزلك" },
  { icon: Shield, titleEn: "2-Year Warranty", titleAr: "ضمان سنتين", descEn: "Full coverage on all parts", descAr: "تغطية كاملة لجميع الأجزاء" },
  { icon: Star, titleEn: "Priority Support", titleAr: "دعم أولوية", descEn: "Dedicated customer care", descAr: "خدمة عملاء مخصصة" },
];

const PrioritySlot = () => {
  const [city, setCity] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const handleBookSlot = () => {
    const cityLabel = cities.find(c => c.id === city)?.labelEn || city;
    const timeLabel = timeSlots.find(t => t.id === timeSlot)?.labelEn || timeSlot;
    
    const message = encodeURIComponent(
      `Priority Delivery Request\n\nCity: ${cityLabel}\nPreferred Timeline: ${timeLabel}\n\nI'd like to book a priority delivery slot.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const canBook = city && timeSlot;

  return (
    <>
      <Helmet>
        <title>Priority Delivery Slot | Dandle</title>
        <meta name="description" content="Book your priority delivery slot for fast-track Dandle recliner delivery within 14 days. White-glove setup included." />
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
            <Clock className="w-12 h-12 text-dandle-orange mx-auto mb-4" />
            <h1 
              className="font-headline text-3xl md:text-4xl text-charcoal mb-2"
              data-en="Priority Delivery"
              data-ar="أولوية الاستلام"
            >
              Priority Delivery
            </h1>
            <p 
              className="text-charcoal/60"
              data-en="Fast-track your delivery within 14 days"
              data-ar="سرّع توصيلك خلال ١٤ يوم"
            >
              Fast-track your delivery within 14 days
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="grid md:grid-cols-3 gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-charcoal/5 text-center"
              >
                <benefit.icon className="w-8 h-8 text-dandle-orange mx-auto mb-3" />
                <h3 
                  className="font-headline text-sm text-charcoal mb-1"
                  data-en={benefit.titleEn}
                  data-ar={benefit.titleAr}
                >
                  {benefit.titleEn}
                </h3>
                <p 
                  className="text-xs text-charcoal/50"
                  data-en={benefit.descEn}
                  data-ar={benefit.descAr}
                >
                  {benefit.descEn}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Booking Form */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border border-charcoal/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 
              className="font-headline text-xl text-charcoal mb-6"
              data-en="Book Your Slot"
              data-ar="احجز موعدك"
            >
              Book Your Slot
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label 
                  className="text-charcoal/70 mb-2 block"
                  data-en="Delivery City"
                  data-ar="مدينة التوصيل"
                >
                  Delivery City
                </Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <span data-en={c.labelEn} data-ar={c.labelAr}>{c.labelEn}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label 
                  className="text-charcoal/70 mb-2 block"
                  data-en="Preferred Timeline"
                  data-ar="الموعد المفضل"
                >
                  Preferred Timeline
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setTimeSlot(slot.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        timeSlot === slot.id
                          ? "border-dandle-orange bg-dandle-orange/5"
                          : "border-charcoal/10 hover:border-charcoal/30"
                      }`}
                    >
                      <span 
                        className="text-sm text-charcoal"
                        data-en={slot.labelEn}
                        data-ar={slot.labelAr}
                      >
                        {slot.labelEn}
                      </span>
                      {timeSlot === slot.id && (
                        <Check className="w-4 h-4 text-dandle-orange mx-auto mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleBookSlot}
                disabled={!canBook}
                className="w-full bg-dandle-orange hover:bg-dandle-orange/90 text-white py-6 text-lg mt-4"
              >
                <span data-en="Book Priority Slot" data-ar="احجز أولوية الاستلام">
                  Book Priority Slot
                </span>
              </Button>
            </div>
          </motion.div>

          {/* Note */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p 
              className="text-sm text-charcoal/50"
              data-en="A team member will confirm your slot within 24 hours"
              data-ar="سيتواصل معك فريقنا خلال ٢٤ ساعة لتأكيد الموعد"
            >
              A team member will confirm your slot within 24 hours
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PrioritySlot;
