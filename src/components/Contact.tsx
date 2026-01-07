import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const handleWhatsAppContact = () => {
    window.open(
      "https://wa.me/201222804255?text=Hello! I'd like to learn more about Dandle recliners.",
      "_blank"
    );
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-obsidian">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span 
              className="text-xs text-champagne/80 tracking-[0.2em] uppercase font-body font-light"
              data-en="Get in Touch"
              data-ar="تواصل معنا"
            >
              Get in Touch
            </span>
            
            <h2 
              className="font-headline text-4xl md:text-5xl text-warm-white mt-4 mb-8 font-light"
              data-en="Visit Our Showrooms"
              data-ar="زُر معارضنا"
            >
              Visit Our Showrooms
            </h2>
          </motion.div>
          
          {/* Phone Number - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <a 
              href="tel:01222804255" 
              className="inline-flex items-center gap-4 text-warm-white hover:text-champagne transition-colors group"
            >
              <Phone className="w-5 h-5 text-champagne" />
              <span className="font-headline text-3xl md:text-4xl font-light tracking-wide" dir="ltr">
                01222804255
              </span>
            </a>
            <p 
              className="text-champagne/90 text-sm mt-4 font-body font-light"
              data-en="Daily: 10AM-3PM & 7PM-9PM"
              data-ar="يومياً: 10ص-3م و 7م-9م"
            >
              Daily: 10AM-3PM & 7PM-9PM
            </p>
          </motion.div>
          
          {/* Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-12"
          >
            <div className="flex items-center justify-center gap-3 text-warm-white/90">
              <MapPin className="w-4 h-4 text-champagne" />
              <span className="text-sm font-body font-light">Istikbal City Stars</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-warm-white/90">
              <MapPin className="w-4 h-4 text-champagne" />
              <span className="text-sm font-body font-light">Istikbal Al Sawalhi</span>
            </div>
          </motion.div>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={handleWhatsAppContact}
              className="btn-refined rounded-none"
            >
              <span data-en="Connect via WhatsApp" data-ar="تواصل عبر واتساب">
                Connect via WhatsApp
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
