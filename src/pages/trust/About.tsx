import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { Award, Heart, Users, Sparkles } from "lucide-react";

const About = () => {
  useEffect(() => {
    document.title = "About Us - DANDLE | Egyptian Craftsmanship Since 2010";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn about DANDLE's journey: Egyptian craftsmen creating earned luxury recliners since 2010. Our mission is quiet sophistication and lasting comfort."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Learn about DANDLE's journey: Egyptian craftsmen creating earned luxury recliners since 2010. Our mission is quiet sophistication and lasting comfort.";
      document.head.appendChild(meta);
    }
  }, []);

  const values = [
    {
      icon: Award,
      title: "Earned Luxury",
      description: "We create recliners for those who have worked hard and deserve the best. Every piece is a symbol of achievement and success."
    },
    {
      icon: Heart,
      title: "Quiet Sophistication",
      description: "True luxury doesn't need to shout. Our designs speak through quality, comfort, and timeless elegance."
    },
    {
      icon: Users,
      title: "Egyptian Craftsmanship",
      description: "Since 2010, our skilled artisans have been perfecting the art of recliner making, blending traditional techniques with modern innovation."
    },
    {
      icon: Sparkles,
      title: "Lasting Comfort",
      description: "We build for the long term. Quality materials, expert construction, and comprehensive warranties ensure your investment lasts."
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
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">
                About DANDLE
              </h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">
                Because You've Earned It
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="prose prose-lg max-w-none"
              >
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-foreground">
                  Our Story
                </h2>

                <div className="space-y-6 font-body text-foreground/80 text-lg leading-relaxed">
                  <p>
                    Since 2010, DANDLE has been crafting world-class recliners in Egypt, serving those who understand that true luxury is earned, not given. We believe that comfort is a reward for hard work, and every piece we create reflects this philosophy.
                  </p>

                  <p>
                    Our journey began with a simple mission: to create recliners that serve as tangible symbols of achievement. Not flashy or ostentatious, but quietly sophisticated pieces that speak to those who value quality over quantity, substance over show.
                  </p>

                  <p>
                    Every DANDLE recliner is handcrafted by skilled Egyptian artisans who have perfected their craft over years of dedication. We combine time-honored techniques with modern innovations to deliver exceptional comfort, durability, and style.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                Our Mission & Values
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-lg p-8 shadow-elegant border border-bronze/10"
                  >
                    <value.icon className="w-12 h-12 text-dandle-orange mb-4" />
                    <h3 className="font-headline text-2xl font-semibold mb-3 text-foreground">
                      {value.title}
                    </h3>
                    <p className="font-body text-foreground/70 leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coverage Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Serving Egypt
                </h2>
                <p className="font-body text-lg text-foreground/80 leading-relaxed mb-8">
                  We proudly deliver our handcrafted recliners across Egypt, bringing earned luxury to discerning customers nationwide. Our white-glove delivery service ensures your investment arrives in perfect condition.
                </p>
                <div className="bg-muted/30 rounded-lg p-6 inline-block">
                  <p className="font-body text-foreground font-semibold">
                    Delivery: up to 14 days
                  </p>
                  <p className="font-body text-sm text-foreground/70 mt-2">
                    We confirm your delivery appointment via WhatsApp/phone
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

export default About;
