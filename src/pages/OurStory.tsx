import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, Heart, Shield, Sofa, Armchair } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    name: "Diva",
    tagline: "The Crown Jewel",
    description: "Our design statement: refined presence for elegant spaces, with comfort that still feels serious."
  },
  {
    name: "RelaxMax",
    tagline: "The Daily Anchor",
    description: "The dependable favorite for everyday living—practical, versatile, and built for real household rhythm.",
    note: "ComfortPlus available on select configurations."
  },
  {
    name: "EasyUp",
    tagline: "Independence",
    description: "Power-lift support that makes standing and sitting easier—engineered to look like premium furniture, not medical equipment."
  },
  {
    name: "EasyUpCompact",
    tagline: "Independence, Sized Right",
    description: "A more space-conscious option with the same dignity-first support."
  },
  {
    name: "WorkNest",
    tagline: "The Productivity Partner",
    description: "Posture-first when you work, then transitions into deep recline when you reset.",
    note: "ComfortPlus available on select configurations."
  },
  {
    name: "CozyCompanion",
    tagline: "The Two-Seater Escape",
    description: "A two-seated couch built for shared comfort—soft, welcoming, and designed for long evenings, not quick sitting."
  }
];

const differentiators = [
  {
    icon: Armchair,
    title: "The Swiss Knife of Comfort",
    description: "Our pieces are designed to be the most useful object in your room. Practical enough to be your daily companion for work and naps, yet premium enough to be the crown of your home."
  },
  {
    icon: Heart,
    title: "Proudly Lived With",
    description: "We build for reality, not just for showrooms. A Dandle piece anchors the room. It invites you in. It ages beautifully with you. It is meant to be used, loved, and relied upon every single day."
  },
  {
    icon: Shield,
    title: "Uncompromising Quality",
    description: "We don't believe in \"good enough.\" Every stitch is straight, every motor is silent, and every frame is inspected by computer vision. Quality is not an opinion; it is code."
  },
  {
    icon: Sparkles,
    title: "Made To Live With You",
    description: "RelaxMax options like massage, zero gravity, and practical details. Deep rest recline up to 170°. Customization so your chair fits you, not the other way around."
  }
];

const OurStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Our Story | Dandle - Where Excellence Meets Elegance</title>
        <meta name="description" content="At Dandle, comfort isn't decoration—it's a standard. Discover our story of crafting premium recliners in Cairo, Egypt for those who refuse to settle." />
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
            DANDLE RECLINERS • Cairo, Egypt
          </span>
          <h1 className="font-headline text-5xl md:text-7xl text-warm-white mt-4 mb-6">
            Our Story
          </h1>
          <p className="font-body text-xl text-warm-white/80 leading-relaxed max-w-2xl mx-auto">
            At Dandle, comfort isn't decoration—it's a standard.
          </p>
        </motion.div>
      </section>

      {/* Story Introduction */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Over the years, our dedication to bringing comfort and elegance into every space we touch has only deepened. Every recliner we craft is built with the same mindset: details matter, because the feeling you get when you sit down is the whole point.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                We do the work properly—through meticulous discussions, relentless attention to detail, and partnerships with the best. Strong like lions. Clear like eagles. Proud, but never arrogant.
              </p>
              <p className="font-body text-lg text-foreground leading-relaxed font-medium">
                Dandle isn't for everyone—and that's intentional.<br />
                It's for people who value themselves and refuse to settle for less.
              </p>
              <div className="pt-6 border-t border-border">
                <p className="font-headline text-xl text-bronze italic">
                  "Dandle Recliners: Where Excellence Meets Elegance, for Those Who Refuse to Settle."
                </p>
                <p className="font-body text-muted-foreground mt-2">
                  Your Comfort, Our Commitment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-24 bg-background">
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
                From the Founder
              </span>
              <blockquote className="font-headline text-2xl md:text-3xl text-foreground mt-6 leading-relaxed italic">
                "We don't build 'just furniture.' We build the seat you trust—every day.
                The one that supports you when life is busy, and restores you when it finally goes quiet."
              </blockquote>
              <div className="mt-8">
                <div className="w-16 h-0.5 bg-bronze mx-auto mb-4" />
                <p className="font-body text-muted-foreground">
                  — Mourad Farah, Founder & Director
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Dandle Different */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
              What Sets Us Apart
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-foreground mt-3">
              What Makes Dandle Different
            </h2>
            <p className="font-body text-lg text-muted-foreground mt-4 italic">
              "Dandle is the Swiss Knife of Comfort — practical, premium, proudly used."
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-8 rounded-lg border border-border"
              >
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-bronze" />
                </div>
                <h3 className="font-headline text-xl text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
              Our Collections
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-foreground mt-3">
              Product Catalog
            </h2>
            <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
              A Dandle collection isn't defined by style. It's defined by purpose—what you need the piece to do for your day.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-background p-6 rounded-lg border border-border hover:border-bronze/50 transition-colors"
              >
                <h3 className="font-headline text-xl text-foreground">
                  {product.name}
                </h3>
                <p className="text-bronze font-body text-sm mt-1">
                  {product.tagline}
                </p>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mt-3">
                  {product.description}
                </p>
                {product.note && (
                  <p className="font-body text-xs text-bronze/80 mt-2 italic">
                    {product.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 p-6 bg-secondary/50 rounded-lg max-w-2xl mx-auto"
          >
            <p className="font-body text-muted-foreground">
              <span className="font-medium text-foreground">Not sure what fits you?</span><br />
              Choose by lifestyle: <span className="text-bronze">Design (Diva)</span> • <span className="text-bronze">Daily (RelaxMax)</span> • <span className="text-bronze">Support (EasyUp)</span> • <span className="text-bronze">Work-to-Rest (WorkNest)</span> • <span className="text-bronze">Shared Comfort (CozyCompanion)</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
              Explore Dandle
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto mb-8">
              Discover the collections built for comfort, posture, and presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#collection"
                className="inline-block bg-dandle-orange text-warm-white px-8 py-4 rounded-sm font-body font-semibold hover:bg-dandle-orange/90 transition-colors shadow-elegant"
              >
                Explore the Collection
              </Link>
              <Link
                to="/#collection"
                className="inline-block border-2 border-foreground text-foreground px-8 py-4 rounded-sm font-body font-semibold hover:bg-foreground hover:text-background transition-colors"
              >
                Explore Diva
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurStory;
