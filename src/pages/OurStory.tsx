import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeritageTimeline from "@/components/HeritageTimeline";
import PressRecognition from "@/components/PressRecognition";
import { Heart, Sparkles, Shield, Users } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Crafted with Love",
    description: "Every stitch, every curve, every mechanism is assembled by hands that care."
  },
  {
    icon: Sparkles,
    title: "Innovation Meets Tradition",
    description: "We blend cutting-edge ergonomics with time-honored Egyptian craftsmanship."
  },
  {
    icon: Shield,
    title: "Quality Without Compromise",
    description: "Premium materials sourced globally, assembled locally with pride."
  },
  {
    icon: Users,
    title: "Family First",
    description: "We build for families because we are one. Your comfort is our legacy."
  }
];

const OurStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Our Story | Dandle - 15 Years of Egyptian Craftsmanship</title>
        <meta name="description" content="Discover the heritage behind Dandle. 15 years of crafting premium recliners in Cairo, Egypt. Our journey from a small workshop to Egypt's trusted comfort brand." />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/relaxmax-hero-offwhite.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <span className="text-bronze font-body text-sm tracking-[0.3em] uppercase">
            Est. 2010 • Cairo, Egypt
          </span>
          <h1 className="font-headline text-5xl md:text-7xl text-warm-white mt-4 mb-6">
            Our Story
          </h1>
          <p className="font-body text-xl text-warm-white/80 leading-relaxed max-w-2xl mx-auto">
            What began as a simple dream in a small Cairo workshop has grown into Egypt's most trusted name in premium comfort furniture.
          </p>
        </motion.div>
      </section>

      {/* Founder Message */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
                From Our Founder
              </span>
              <blockquote className="font-headline text-3xl md:text-4xl text-foreground mt-6 leading-relaxed italic">
                "We don't just build furniture. We craft moments of peace for families who deserve the very best."
              </blockquote>
              <div className="mt-8">
                <div className="w-16 h-0.5 bg-bronze mx-auto mb-4" />
                <p className="font-body text-muted-foreground">
                  Mohamed El-Dandle, Founder & Master Craftsman
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
              What We Stand For
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-foreground mt-3">
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-bronze" />
                </div>
                <h3 className="font-headline text-xl text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <HeritageTimeline />

      {/* Stats */}
      <PressRecognition />

      {/* CTA */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-6">
              Become Part of Our Story
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of Egyptian families who have chosen Dandle for their comfort journey.
            </p>
            <a
              href="/#collection"
              className="inline-block bg-dandle-orange text-warm-white px-8 py-4 rounded-sm font-body font-semibold hover:bg-dandle-orange/90 transition-colors shadow-elegant"
            >
              Explore Collection
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurStory;
