import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { Truck, Calendar, MapPin, CheckCircle, Phone, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Delivery = () => {
  useEffect(() => {
    document.title = "Delivery Information - DANDLE | White-Glove Service";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "DANDLE delivery: up to 14 days across Egypt. White-glove service with appointment confirmation via WhatsApp/phone. Professional setup included."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "DANDLE delivery: up to 14 days across Egypt. White-glove service with appointment confirmation via WhatsApp/phone. Professional setup included.";
      document.head.appendChild(meta);
    }
  }, []);

  const deliveryProcess = [
    {
      icon: CheckCircle,
      title: "Order Confirmation",
      description: "After you place your order and deposit payment is confirmed, you'll receive an order confirmation via WhatsApp with your reference number."
    },
    {
      icon: Calendar,
      title: "Delivery Scheduling",
      description: "We'll contact you within 1-2 business days to schedule your delivery appointment. Delivery takes up to 14 days from order confirmation."
    },
    {
      icon: Phone,
      title: "Appointment Confirmation",
      description: "We confirm your delivery appointment via WhatsApp or phone. You'll receive a reminder 1 day before delivery."
    },
    {
      icon: Truck,
      title: "White-Glove Delivery",
      description: "Our professional team delivers your recliner, unpacks it, and ensures everything is in perfect condition."
    },
    {
      icon: Package,
      title: "Setup & Installation",
      description: "If assembly is required, our team will set up your recliner and ensure it's functioning perfectly before we leave."
    }
  ];

  const whatToExpect = [
    {
      title: "Professional Service",
      description: "Our trained delivery team treats your home with respect and your furniture with care."
    },
    {
      title: "Inspection Upon Delivery",
      description: "We encourage you to inspect your recliner upon delivery to ensure everything meets your expectations."
    },
    {
      title: "Packaging Removal",
      description: "We'll remove all packaging materials and leave your space clean and ready to enjoy."
    },
    {
      title: "Final Walkthrough",
      description: "Our team will demonstrate your recliner's features and answer any questions before leaving."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-nile-blue/10 via-background to-dandle-orange/5 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Truck className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">
                Delivery Information
              </h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">
                White-glove service across Egypt
              </p>
            </motion.div>
          </div>
        </section>

        {/* Delivery Policy */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 md:p-12 border border-bronze/20 shadow-elegant"
              >
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">
                  Our Delivery Policy
                </h2>
                <div className="text-center space-y-4">
                  <p className="font-body text-2xl font-semibold text-dandle-orange">
                    Delivery: up to 14 days
                  </p>
                  <p className="font-body text-lg text-foreground/80 leading-relaxed">
                    Delivery typically arrives within 14 days depending on scheduling and location.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-foreground/70">
                    <Phone className="w-5 h-5" />
                    <p className="font-body">
                      We confirm your delivery appointment via WhatsApp/phone
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Delivery Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                What to Expect
              </motion.h2>

              <div className="space-y-8">
                {deliveryProcess.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-bronze/20 shadow-elegant hover:shadow-glow transition-all">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-dandle-orange/10">
                            <step.icon className="w-8 h-8 text-dandle-orange" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="font-headline text-2xl mb-3">
                              {step.title}
                            </CardTitle>
                            <CardContent className="p-0">
                              <p className="font-body text-foreground/70 text-base leading-relaxed">
                                {step.description}
                              </p>
                            </CardContent>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect on Delivery Day */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                On Delivery Day
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-6">
                {whatToExpect.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-muted/30 rounded-lg p-6 border border-bronze/10"
                  >
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {item.title}
                    </h3>
                    <p className="font-body text-foreground/70 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coverage Map */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <MapPin className="w-12 h-12 mx-auto mb-6 text-dandle-orange" />
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Delivery Coverage
                </h2>
                <p className="font-body text-lg text-foreground/80 leading-relaxed mb-8">
                  We proudly serve customers across Egypt with our white-glove delivery service.
                  From Cairo to Alexandria, and throughout the country, we bring earned luxury to your doorstep.
                </p>
                <div className="bg-background rounded-lg p-6 inline-block border border-bronze/20 shadow-elegant">
                  <p className="font-body font-semibold text-foreground mb-2">
                    Questions about delivery to your area?
                  </p>
                  <p className="font-body text-foreground/70">
                    Contact us: 01222804255 or Tell.me@DandleStoreGroup.com
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Delivery;
