import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { Shield, Clock, AlertCircle, CheckCircle, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Warranty = () => {
  useEffect(() => {
    document.title = "Warranty Information - DANDLE | Comprehensive Coverage";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "DANDLE warranty coverage: 2-year motor, 5-year frame, 1-year upholstery. Learn about our comprehensive warranty terms and how to make a claim."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "DANDLE warranty coverage: 2-year motor, 5-year frame, 1-year upholstery. Learn about our comprehensive warranty terms and how to make a claim.";
      document.head.appendChild(meta);
    }
  }, []);

  const warranties = [
    {
      icon: Shield,
      title: "5-Year Frame Warranty",
      description: "Comprehensive coverage on all structural components and frame integrity",
      color: "text-nile-blue"
    },
    {
      icon: Clock,
      title: "2-Year Motor Warranty",
      description: "Full protection for reclining mechanisms, motors, and electrical components",
      color: "text-dandle-orange"
    },
    {
      icon: Shield,
      title: "1-Year Upholstery Warranty",
      description: "Coverage against manufacturing defects in fabric and upholstery materials",
      color: "text-bronze"
    }
  ];

  const claimSteps = [
    {
      step: 1,
      title: "Contact Us",
      description: "Reach out via WhatsApp at 01222804255 or email Tell.me@DandleStoreGroup.com"
    },
    {
      step: 2,
      title: "Provide Details",
      description: "Share your order reference, photos of the issue, and a brief description"
    },
    {
      step: 3,
      title: "Assessment",
      description: "Our team will review your claim and may arrange an inspection if needed"
    },
    {
      step: 4,
      title: "Resolution",
      description: "We'll repair, replace, or provide appropriate remedy based on warranty terms"
    }
  ];

  const exclusions = [
    "Normal wear and tear from regular use",
    "Damage from misuse, abuse, or accidents",
    "Commercial or institutional use (warranty applies to residential use only)",
    "Unauthorized repairs or modifications",
    "Damage from improper cleaning or maintenance",
    "Fading or discoloration from sun exposure",
    "Pet damage or stains not covered under upholstery warranty"
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
              <Shield className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">
                Warranty Information
              </h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">
                Comprehensive coverage for your investment
              </p>
            </motion.div>
          </div>
        </section>

        {/* Warranty Coverage */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                Our Warranty Coverage
              </motion.h2>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {warranties.map((warranty, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-bronze/20 shadow-elegant hover:shadow-glow transition-all">
                      <CardHeader>
                        <warranty.icon className={`w-12 h-12 ${warranty.color} mb-4`} />
                        <CardTitle className="font-headline text-2xl">
                          {warranty.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {warranty.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Claim */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                How to Make a Warranty Claim
              </motion.h2>

              <div className="space-y-6">
                {claimSteps.map((step, index) => (
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
                      <p className="font-body text-foreground/70">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-12 bg-nile-blue/10 rounded-lg p-8 border border-nile-blue/20"
              >
                <div className="flex items-start gap-4">
                  <MessageCircle className="w-8 h-8 text-nile-blue flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground">
                      Contact for Warranty Claims
                    </h3>
                    <div className="space-y-2 font-body text-foreground/80">
                      <p><strong>WhatsApp:</strong> 01222804255</p>
                      <p><strong>Email:</strong> Tell.me@DandleStoreGroup.com</p>
                      <p><strong>Hours:</strong> Daily 10AM-3PM & 7PM-9PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Exclusions */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center text-foreground"
              >
                Warranty Exclusions
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-muted/30 rounded-lg p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <AlertCircle className="w-6 h-6 text-dandle-orange flex-shrink-0 mt-1" />
                  <p className="font-body text-foreground/80">
                    The following are not covered under our warranty:
                  </p>
                </div>

                <ul className="space-y-3">
                  {exclusions.map((exclusion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 font-body text-foreground/70"
                    >
                      <span className="text-dandle-orange mt-1">•</span>
                      <span>{exclusion}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <p className="font-body text-foreground/80">
                    <strong>Important:</strong> To maintain your warranty coverage, please follow the care instructions provided with your recliner and perform regular maintenance as recommended.
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

export default Warranty;
