import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompleteSet = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warm-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nile-blue/10 via-warm-beige/20 to-bronze/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dandle-orange/10 border border-dandle-orange/30 mb-4">
              <Sparkles className="w-4 h-4 text-dandle-orange" />
              <span className="text-sm font-body text-dandle-orange">The Ultimate Collection</span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-7xl text-charcoal mb-6">
              Dandle Complete Set
            </h1>
            <p className="font-body text-xl md:text-2xl text-charcoal/80 max-w-3xl mx-auto mb-8">
              When guests feel truly supported, they stay longer, return faster, and choose you over others.
            </p>
            <p className="font-body text-lg text-charcoal/70 max-w-2xl mx-auto">
              Transform your property into a place guests remember with their bodies, not just their eyes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Classic Set Section */}
      <section className="py-24 bg-warm-beige/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bronze/20 border border-bronze/40">
                <Home className="w-4 h-4 text-bronze" />
                <span className="text-sm font-body text-charcoal">Classic Elegance</span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl text-charcoal">
                The Classic Collection
              </h2>
              <p className="font-body text-lg text-charcoal/80 leading-relaxed">
                Timeless sophistication meets modern comfort. Rich tones, traditional craftsmanship, 
                and a presence that commands attention in any luxury setting.
              </p>
              <ul className="space-y-3 font-body text-charcoal/70">
                <li className="flex items-start gap-3">
                  <span className="text-dandle-orange mt-1">✦</span>
                  <span>Coordinated 3-piece living room set</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dandle-orange mt-1">✦</span>
                  <span>Premium leather upholstery in warm tones</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dandle-orange mt-1">✦</span>
                  <span>Perfect for traditional luxury properties</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate("/#products")}
                className="bg-gradient-to-r from-dandle-orange to-dandle-orange/80 hover:from-dandle-orange/90 hover:to-dandle-orange/70 text-white px-8 py-6 text-lg"
              >
                Explore Classic Set
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <img
                src="/images/complete-set-classic.jpg"
                alt="Dandle Complete Set Classic - Luxury living room with traditional chandelier and warm brown recliners"
                className="w-full rounded-lg shadow-elegant"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Set Section */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative order-2 md:order-1">
              <img
                src="/images/complete-set-coastal-modern.jpg"
                alt="Dandle Complete Set Modern - Contemporary living space with coastal mountain view"
                className="w-full rounded-lg shadow-elegant"
              />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nile-blue/20 border border-nile-blue/40">
                <Sparkles className="w-4 h-4 text-nile-blue" />
                <span className="text-sm font-body text-charcoal">Modern Luxury</span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl text-charcoal">
                The Modern Collection
              </h2>
              <p className="font-body text-lg text-charcoal/80 leading-relaxed">
                Clean lines, neutral elegance, and understated luxury. Designed for contemporary spaces 
                where light, air, and tranquility define the experience.
              </p>
              <ul className="space-y-3 font-body text-charcoal/70">
                <li className="flex items-start gap-3">
                  <span className="text-dandle-orange mt-1">✦</span>
                  <span>Sleek architectural design language</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dandle-orange mt-1">✦</span>
                  <span>Neutral tones that complement any setting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dandle-orange mt-1">✦</span>
                  <span>Ideal for coastal properties and modern villas</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate("/#products")}
                className="bg-gradient-to-r from-nile-blue to-nile-blue/80 hover:from-nile-blue/90 hover:to-nile-blue/70 text-white px-8 py-6 text-lg"
              >
                Explore Modern Set
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lifestyle Gallery */}
      <section className="py-24 bg-warm-beige/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl text-charcoal mb-4">
              Designed for Life
            </h2>
            <p className="font-body text-lg text-charcoal/70 max-w-2xl mx-auto">
              Every setting tells a story of comfort, connection, and quiet luxury
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <img
                src="/images/complete-set-family-modern.jpg"
                alt="Family enjoying Dandle recliners in bright modern living room"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="/images/complete-set-sunset-fireplace.jpg"
                alt="Dandle recliners in cozy fireplace setting at golden hour"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <img
                src="/images/cozycompanion-couple-lifestyle.jpg"
                alt="Couple relaxing on Dandle loveseat recliner"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-charcoal text-warm-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-headline text-4xl md:text-5xl">
            The Quiet Advantage
          </h2>
          <p className="font-body text-xl text-warm-beige/90 leading-relaxed">
            Comfort creates loyalty, and loyalty creates revenue. A property equipped with Dandle 
            becomes a destination guests remember and return to—not for the view alone, but for 
            how the space makes them feel.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-3">
              <Users className="w-8 h-8 text-dandle-orange mx-auto" />
              <h3 className="font-headline text-xl">Elevates Perceived Value</h3>
              <p className="font-body text-warm-beige/80 text-sm">
                Justifies premium rates the moment guests enter
              </p>
            </div>
            <div className="space-y-3">
              <Home className="w-8 h-8 text-dandle-orange mx-auto" />
              <h3 className="font-headline text-xl">Differentiates Your Property</h3>
              <p className="font-body text-warm-beige/80 text-sm">
                Creates memorable experiences beyond aesthetics
              </p>
            </div>
            <div className="space-y-3">
              <Sparkles className="w-8 h-8 text-dandle-orange mx-auto" />
              <h3 className="font-headline text-xl">Drives Return Visits</h3>
              <p className="font-body text-warm-beige/80 text-sm">
                Comfort is remembered more than design
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/#contact")}
            className="bg-warm-white text-charcoal hover:bg-warm-beige px-8 py-6 text-lg mt-8"
          >
            Request Private Presentation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default CompleteSet;
