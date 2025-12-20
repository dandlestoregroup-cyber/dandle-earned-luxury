import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { Wrench, Package, CheckCircle, Clock, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Installation = () => {
  useEffect(() => {
    document.title = "Installation Service - DANDLE | Professional Setup Included";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "DANDLE installation service: Professional assembly and setup included with delivery. Expert team ensures perfect installation in 15-30 minutes."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "DANDLE installation service: Professional assembly and setup included with delivery. Expert team ensures perfect installation in 15-30 minutes.";
      document.head.appendChild(meta);
    }
  }, []);

  const installationIncludes = [
    {
      icon: Package,
      title: "Unpacking",
      description: "Careful removal of all packaging materials with attention to your home's cleanliness"
    },
    {
      icon: Wrench,
      title: "Assembly",
      description: "Professional assembly of your recliner using proper tools and techniques"
    },
    {
      icon: CheckCircle,
      title: "Quality Check",
      description: "Thorough inspection to ensure all components are functioning perfectly"
    },
    {
      icon: Award,
      title: "Demonstration",
      description: "Complete walkthrough of all features and functions of your new recliner"
    }
  ];

  const installationProcess = [
    {
      step: 1,
      title: "Delivery & Placement",
      description: "Our team brings your recliner to your preferred room and position. We'll work with you to find the perfect spot."
    },
    {
      step: 2,
      title: "Professional Assembly",
      description: "If required, we assemble your recliner using professional tools and expertise. Most installations take 15-30 minutes."
    },
    {
      step: 3,
      title: "Function Testing",
      description: "We test all reclining mechanisms, motors, and features to ensure everything works smoothly and correctly."
    },
    {
      step: 4,
      title: "Feature Demonstration",
      description: "Our team shows you how to use all features, adjust settings, and maintain your recliner for optimal performance."
    },
    {
      step: 5,
      title: "Final Inspection",
      description: "You inspect the recliner with us present. We address any concerns before completing the installation."
    },
    {
      step: 6,
      title: "Cleanup & Documentation",
      description: "We remove all packaging, clean the area, and provide care instructions before leaving your home."
    }
  ];

  const whatsIncluded = [
    "Complete assembly of your recliner (if required)",
    "Proper positioning in your chosen location",
    "Testing of all mechanical and electrical components",
    "Demonstration of all features and functions",
    "Care and maintenance instructions",
    "Removal of all packaging materials",
    "Final inspection and quality assurance"
  ];

  const expertTeam = [
    {
      title: "Trained Professionals",
      description: "Our installation team is specially trained in DANDLE product assembly and customer service."
    },
    {
      title: "Experienced Craftsmen",
      description: "Years of experience handling luxury furniture with care and precision."
    },
    {
      title: "Customer-Focused",
      description: "We ensure you're completely satisfied and comfortable with your new recliner."
    },
    {
      title: "Quality Assured",
      description: "Every installation meets our high standards for safety and functionality."
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
              <Wrench className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">
                Installation Service
              </h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">
                Professional setup included with every delivery
              </p>
            </motion.div>
          </div>
        </section>

        {/* Installation Included */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 md:p-12 border border-bronze/20 shadow-elegant text-center"
              >
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h2 className="font-headline text-3xl font-bold mb-4 text-foreground">
                  Installation is Included
                </h2>
                <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6">
                  Professional assembly and setup are included with your purchase at no additional cost.
                  Our expert team ensures your recliner is perfectly installed and ready to enjoy.
                </p>
                <div className="flex items-center justify-center gap-2 text-foreground/70">
                  <Clock className="w-5 h-5" />
                  <p className="font-body">
                    Most installations completed in 15-30 minutes
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                What's Included
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {installationIncludes.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-bronze/20 shadow-elegant hover:shadow-glow transition-all text-center">
                      <CardHeader>
                        <item.icon className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                        <CardTitle className="font-headline text-lg">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-sm text-foreground/70 leading-relaxed">
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

        {/* Installation Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                Installation Process
              </motion.h2>

              <div className="space-y-6">
                {installationProcess.map((step, index) => (
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

        {/* What's Included List */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center text-foreground"
              >
                Installation Service Includes
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-muted/30 rounded-lg p-8"
              >
                <ul className="space-y-4">
                  {whatsIncluded.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 font-body text-foreground/80"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Expert Team */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <Users className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                  Our Expert Installation Team
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {expertTeam.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-lg p-6 border border-bronze/10 shadow-elegant"
                  >
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-dandle-orange" />
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

        {/* Timing Note */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 border border-bronze/20 text-center"
              >
                <Clock className="w-10 h-10 mx-auto mb-4 text-dandle-orange" />
                <h2 className="font-headline text-2xl font-bold mb-4 text-foreground">
                  Installation Timing
                </h2>
                <p className="font-body text-foreground/80 leading-relaxed mb-4">
                  Installation is completed as part of your delivery service. Delivery takes up to 14 days,
                  and installation is performed immediately upon delivery.
                </p>
                <p className="font-body text-sm text-foreground/70">
                  We confirm your delivery appointment via WhatsApp/phone
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

export default Installation;
