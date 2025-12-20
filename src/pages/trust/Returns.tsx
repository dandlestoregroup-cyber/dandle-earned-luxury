import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle, CheckCircle, Clock, MessageCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Returns = () => {
  useEffect(() => {
    document.title = "Returns & Exchanges - DANDLE | Fair Return Policy";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "DANDLE returns and exchanges policy: Contact within 48 hours for manufacturing defects. Fair resolution process with customer satisfaction guaranteed."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "DANDLE returns and exchanges policy: Contact within 48 hours for manufacturing defects. Fair resolution process with customer satisfaction guaranteed.";
      document.head.appendChild(meta);
    }
  }, []);

  const returnPolicy = [
    {
      icon: Clock,
      title: "48-Hour Window",
      description: "Contact us within 48 hours of delivery if you discover any manufacturing defects or damage."
    },
    {
      icon: Shield,
      title: "Inspection Required",
      description: "Thoroughly inspect your recliner upon delivery with our team present. Document any concerns immediately."
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Reach out via WhatsApp at 01222804255 or email Tell.me@DandleStoreGroup.com with photos and description."
    }
  ];

  const acceptableReasons = [
    "Manufacturing defects (structural, mechanical, or upholstery flaws)",
    "Damage during shipping or delivery",
    "Incorrect product delivered (wrong model or color)",
    "Missing components or accessories",
    "Reclining mechanism failure upon delivery"
  ];

  const notAcceptable = [
    "Change of mind or buyer's remorse",
    "Fabric color looks different from online images (due to screen variations)",
    "Room measurements were incorrect",
    "Normal wear and tear after use",
    "Damage caused after delivery (pet damage, stains, misuse)"
  ];

  const returnProcess = [
    {
      step: 1,
      title: "Contact Us Immediately",
      description: "Within 48 hours of delivery, contact us via WhatsApp or email with your order reference number."
    },
    {
      step: 2,
      title: "Provide Documentation",
      description: "Send clear photos of the issue from multiple angles and a detailed description of the problem."
    },
    {
      step: 3,
      title: "Assessment",
      description: "Our team reviews your case. We may arrange an in-person inspection if needed to assess the issue."
    },
    {
      step: 4,
      title: "Resolution",
      description: "Based on assessment, we'll offer repair, replacement, or in rare cases, a full refund."
    }
  ];

  const exchangeOptions = [
    {
      title: "Different Color/Fabric",
      description: "Exchanges for color or fabric preferences are evaluated case-by-case and may be subject to restocking fees and availability."
    },
    {
      title: "Different Model",
      description: "Upgrading to a different model may be possible with price adjustment. Contact us to discuss options."
    },
    {
      title: "Warranty Replacement",
      description: "Items covered under warranty may be repaired or replaced per warranty terms. See our Warranty page for details."
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
              <RefreshCw className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">
                Returns & Exchanges
              </h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">
                Fair policies focused on customer satisfaction
              </p>
            </motion.div>
          </div>
        </section>

        {/* Return Policy Overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 md:p-12 border border-bronze/20 shadow-elegant"
              >
                <h2 className="font-headline text-3xl font-bold mb-6 text-center text-foreground">
                  Our Return Policy
                </h2>
                <p className="font-body text-lg text-foreground/80 leading-relaxed text-center mb-6">
                  Due to the custom nature of our furniture, we have a limited return policy focused on
                  manufacturing defects and delivery damage. Your satisfaction is our priority, and we're
                  committed to resolving any legitimate concerns promptly and fairly.
                </p>
                <div className="text-center bg-background rounded-lg p-6 border border-bronze/10">
                  <p className="font-body font-semibold text-dandle-orange text-xl mb-2">
                    Contact within 48 hours of delivery
                  </p>
                  <p className="font-body text-foreground/70">
                    for manufacturing defects or delivery damage
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {returnPolicy.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-bronze/20 shadow-elegant hover:shadow-glow transition-all">
                      <CardHeader>
                        <item.icon className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                        <CardTitle className="font-headline text-xl text-center">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-foreground/70 text-center leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                Return Process
              </motion.h2>

              <div className="space-y-6">
                {returnProcess.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 bg-background rounded-lg p-6 shadow-elegant border border-bronze/10"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-dandle-orange text-white flex items-center justify-center font-headline text-xl font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-semibold mb-2 text-foreground">
                        {step.title}
                      </h3>
                      <p className="font-body text-foreground/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Acceptable vs Not Acceptable */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                What Qualifies for Return
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Acceptable */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <h3 className="font-headline text-2xl font-semibold text-foreground">
                      Acceptable Reasons
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {acceptableReasons.map((reason, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 font-body text-foreground/80"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Not Acceptable */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    <h3 className="font-headline text-2xl font-semibold text-foreground">
                      Not Acceptable
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {notAcceptable.map((reason, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 font-body text-foreground/80"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Options */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                Exchange Options
              </motion.h2>

              <div className="space-y-6">
                {exchangeOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-lg p-6 border border-bronze/10 shadow-elegant"
                  >
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground">
                      {option.title}
                    </h3>
                    <p className="font-body text-foreground/70 leading-relaxed">
                      {option.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-4 mb-6">
                  <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-headline text-2xl font-semibold mb-4 text-foreground">
                      Important Notes
                    </h3>
                    <div className="space-y-4 font-body text-foreground/80 leading-relaxed">
                      <p>
                        <strong>Inspect Upon Delivery:</strong> Always inspect your recliner thoroughly
                        when our delivery team is present. This is the best time to identify and document
                        any concerns.
                      </p>
                      <p>
                        <strong>Photography:</strong> Take clear photos of any damage or defects from
                        multiple angles. This helps us process your claim quickly.
                      </p>
                      <p>
                        <strong>Custom Orders:</strong> Due to the bespoke nature of our furniture,
                        we cannot accept returns for change of mind. Please review your order carefully
                        before confirming.
                      </p>
                      <p>
                        <strong>Warranty Coverage:</strong> Many issues are covered under our comprehensive
                        warranty program. Visit our Warranty page for details.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 border border-bronze/20"
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                <h2 className="font-headline text-2xl font-bold mb-4 text-foreground">
                  Need to Initiate a Return?
                </h2>
                <p className="font-body text-foreground/70 mb-6">
                  Contact us immediately if you have concerns about your delivery.
                </p>
                <div className="space-y-2 font-body text-foreground/80">
                  <p><strong>WhatsApp:</strong> 01222804255</p>
                  <p><strong>Email:</strong> Tell.me@DandleStoreGroup.com</p>
                  <p><strong>Hours:</strong> Daily 10AM-3PM & 7PM-9PM</p>
                </div>
                <p className="font-body text-sm text-foreground/60 mt-6">
                  Remember: Contact within 48 hours of delivery for fastest resolution
                </p>
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

export default Returns;
