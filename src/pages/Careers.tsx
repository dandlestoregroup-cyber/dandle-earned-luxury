import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { 
  Heart, 
  Users, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  Clock, 
  Coffee, 
  TrendingUp,
  Shield,
  Sun,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Careers = () => {
  useEffect(() => {
    document.title = "Careers - DANDLE | Join Our Team";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Join the DANDLE family. Discover career opportunities with Egypt's leading luxury recliner brand. Culture of craftsmanship, growth, and earned success."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Join the DANDLE family. Discover career opportunities with Egypt's leading luxury recliner brand. Culture of craftsmanship, growth, and earned success.";
      document.head.appendChild(meta);
    }
  }, []);

  const cultureValues = [
    {
      icon: Heart,
      title: "Craftsmanship Pride",
      description: "We take immense pride in every piece we create. Quality is not just a goal, it is who we are."
    },
    {
      icon: Users,
      title: "Family Spirit",
      description: "At DANDLE, colleagues become family. We support each other through challenges and celebrate successes together."
    },
    {
      icon: Sparkles,
      title: "Earned Excellence",
      description: "Just like our products, excellence here is earned through dedication, skill, and passion for what we do."
    },
    {
      icon: TrendingUp,
      title: "Growth Mindset",
      description: "We invest in our people. From apprentices to master craftsmen, everyone has room to grow and develop."
    }
  ];

  const benefits = [
    { icon: Shield, title: "Health & Insurance", description: "Comprehensive health coverage for you and your family" },
    { icon: Sun, title: "Work-Life Balance", description: "Flexible schedules and respect for personal time" },
    { icon: Coffee, title: "Modern Workspace", description: "Comfortable, well-equipped facilities in a creative environment" },
    { icon: TrendingUp, title: "Career Growth", description: "Clear pathways for advancement and skill development" },
    { icon: Users, title: "Team Events", description: "Regular team outings, celebrations, and bonding activities" },
    { icon: Briefcase, title: "Competitive Salary", description: "Fair compensation that rewards your expertise and contribution" }
  ];

  const openPositions = [
    { title: "Operations Manager", department: "Operations", location: "Cairo", type: "Full-time" }
  ];

  const handleApply = (position: string) => {
    const message = encodeURIComponent(`Hello! I'm interested in the ${position} position at DANDLE. I'd like to learn more about the opportunity.`);
    window.open(`https://wa.me/201234567890?text=${message}`, '_blank');
  };

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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dandle-orange/10 text-dandle-orange text-sm font-body mb-6">
                <Briefcase className="w-4 h-4" />
                We're Hiring
              </span>
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">
                Join the DANDLE Family
              </h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Build a career where craftsmanship meets passion. We're looking for talented individuals who believe in earned excellence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Our Culture
                </h2>
                <p className="font-body text-lg text-foreground/70 max-w-2xl mx-auto">
                  At DANDLE, we don't just make recliners. We create an environment where talent thrives and craftsmanship is celebrated.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {cultureValues.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-muted/30 rounded-xl p-8 border border-bronze/10 hover:border-dandle-orange/30 transition-colors"
                  >
                    <value.icon className="w-10 h-10 text-dandle-orange mb-4" />
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground">
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

        {/* Team Environment Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">
                    A Workplace You'll Love
                  </h2>
                  <div className="space-y-4 font-body text-foreground/80">
                    <p>
                      Our workshop in Cairo blends traditional craftsmanship with modern comfort. Natural light floods our workspace, and the aroma of fine leather fills the air.
                    </p>
                    <p>
                      We believe the best work comes from happy people. That's why we've created an environment where creativity flows, ideas are welcomed, and every team member feels valued.
                    </p>
                    <p>
                      From morning coffee rituals to Friday celebrations, we've built traditions that bring us together and make work feel like more than just a job.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="aspect-4/3 rounded-xl overflow-hidden"
                >
                  <img 
                    src="/images/complete-set-family-modern.jpg" 
                    alt="DANDLE workshop and team environment"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Benefits & Perks
                </h2>
                <p className="font-body text-lg text-foreground/70">
                  We take care of our team so they can focus on what they do best.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-muted/30 rounded-lg p-6 border border-bronze/10"
                  >
                    <benefit.icon className="w-8 h-8 text-dandle-orange mb-3" />
                    <h3 className="font-headline text-lg font-semibold mb-2 text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="font-body text-sm text-foreground/70">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Open Positions
                </h2>
                <p className="font-body text-lg text-foreground/70">
                  Find your place in the DANDLE family.
                </p>
              </motion.div>

              <div className="space-y-4">
                {openPositions.map((position, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-xl p-6 border border-bronze/10 hover:border-dandle-orange/30 transition-all hover:shadow-elegant"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-xl font-semibold text-foreground mb-2">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm font-body text-foreground/60">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {position.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {position.type}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleApply(position.title)}
                        className="bg-dandle-orange hover:bg-dandle-orange/90 text-white font-body"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* General Application */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 text-center bg-gradient-to-r from-nile-blue/10 to-dandle-orange/10 rounded-xl p-8"
              >
                <h3 className="font-headline text-xl font-semibold mb-3 text-foreground">
                  Don't see the right role?
                </h3>
                <p className="font-body text-foreground/70 mb-6">
                  We're always looking for exceptional talent. Send us your CV and tell us how you'd contribute to the DANDLE family.
                </p>
                <Button
                  onClick={() => handleApply("General Inquiry")}
                  variant="outline"
                  className="border-dandle-orange text-dandle-orange hover:bg-dandle-orange hover:text-white font-body"
                >
                  Send General Application
                </Button>
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

export default Careers;
