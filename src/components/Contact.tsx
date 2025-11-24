import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const Contact = () => {
  const showrooms = [
    {
      name: "Istikbal City Stars Mall",
      location: "Nasr City, Cairo",
      status: "Open",
    },
    {
      name: "Al Sawalhi",
      location: "Extension Of Makram Ebaid St.",
      status: "Open",
    },
    {
      name: "Mohandessin",
      location: "Coming Soon",
      status: "Coming Soon",
    },
    {
      name: "Alexandria",
      location: "Coming Soon",
      status: "Coming Soon",
    },
  ];

  const handleWhatsAppContact = () => {
    window.open(
      "https://wa.me/201222804255?text=Hello! I'd like to learn more about Dandle recliners.",
      "_blank"
    );
  };

  return (
    <section id="contact" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Visit Our Showrooms
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience Dandle recliners in person. Our expert team is ready to
            help you find your perfect match.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h3 className="font-serif text-2xl font-semibold mb-6 text-foreground">
                Get in Touch
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Phone className="text-accent mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <a
                      href="tel:01222804255"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      01222804255
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-accent mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a
                      href="mailto:Tell.me@DandleStoreGroup.com"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      Tell.me@DandleStoreGroup.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="text-accent mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-foreground">Hours</p>
                    <p className="text-muted-foreground">
                      Daily: 10AM-3PM & 7PM-9PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleWhatsAppContact}
                >
                  Connect via WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Showrooms */}
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h3 className="font-serif text-2xl font-semibold mb-6 text-foreground">
              Our Locations
            </h3>
            <div className="space-y-4">
              {showrooms.map((showroom, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-6 border border-gold/20 hover:shadow-luxury transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <MapPin className="text-accent mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {showroom.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {showroom.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        showroom.status === "Open"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {showroom.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
