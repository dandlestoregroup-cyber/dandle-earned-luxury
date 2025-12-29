import { useState } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import RoleApplicationModal from "@/components/careers/RoleApplicationModal";
import GeneralApplicationModal from "@/components/careers/GeneralApplicationModal";

const benefits = [
  "Health insurance after probation",
  "Fair compensation based on impact",
  "Structured training & skill development",
  "Work-life balance (no burnout culture)",
  "Real team moments, not forced events",
];

const Careers = () => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [generalModalOpen, setGeneralModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Careers at DANDLE — Join the Achievers</title>
        <meta
          name="description"
          content="Join DANDLE, Egypt's premium recliner brand. We hire people who chase precision, not noise."
        />
      </Helmet>

      <Navigation />

      <main className="bg-warm-white min-h-screen pt-20">
        {/* HERO */}
        <section className="w-full px-6 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-charcoal mb-4">
              Build What People Feel
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              DANDLE is the Swiss Knife of Comfort. We hire people who treat craft like a signature and operations like a science.
            </p>
            <div className="flex flex-row gap-4 justify-center flex-wrap">
              <Button
                onClick={() => setRoleModalOpen(true)}
                className="h-12 px-6 bg-charcoal text-warm-white hover:bg-charcoal/90 rounded-sm font-body gap-2"
              >
                View Open Roles <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setGeneralModalOpen(true)}
                className="h-12 px-6 border-charcoal text-charcoal hover:bg-charcoal/5 rounded-sm font-body"
              >
                General Application
              </Button>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="w-full px-6 py-12 bg-warm-beige/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline text-2xl font-bold text-charcoal text-center mb-8">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-bronze flex-shrink-0" />
                  <p className="text-charcoal">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CURRENT OPENING */}
        <section className="w-full px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline text-2xl font-bold text-charcoal mb-6">
              Open Position
            </h2>

            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h3 className="font-headline text-xl md:text-2xl font-bold text-charcoal mb-2">
                Executive Assistant
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <span className="bg-warm-beige/50 px-2 py-1 rounded">Cairo</span>
                <span className="bg-warm-beige/50 px-2 py-1 rounded">Full-time</span>
              </div>

              <p className="text-muted-foreground mb-6">
                You're the Executive Manager's force multiplier. Convert priorities into structured actions, keep operational truth clean.
              </p>

              <div className="mb-6">
                <p className="font-bold text-charcoal mb-2">Key Responsibilities:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Calendar control & meeting readiness</li>
                  <li>• Action items tracked until closed</li>
                  <li>• Notion/Sheets accuracy</li>
                  <li>• Weekly planning & KPI reporting</li>
                </ul>
              </div>

              <Button
                onClick={() => setRoleModalOpen(true)}
                className="h-11 px-6 bg-charcoal text-warm-white hover:bg-charcoal/90 rounded-sm font-body"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </section>

        {/* GENERAL APPLICATION CTA */}
        <section className="w-full px-6 py-12 bg-charcoal">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-headline text-2xl font-bold text-warm-white mb-3">
              Don't See Your Role?
            </h2>
            <p className="text-warm-white/70 mb-6">
              If you're exceptional, we want to meet you. Send us your CV.
            </p>
            <Button
              variant="outline"
              onClick={() => setGeneralModalOpen(true)}
              className="h-11 px-6 border-warm-white text-warm-white hover:bg-warm-white/10 rounded-sm font-body"
            >
              General Application
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      <RoleApplicationModal open={roleModalOpen} onOpenChange={setRoleModalOpen} />
      <GeneralApplicationModal open={generalModalOpen} onOpenChange={setGeneralModalOpen} />
    </>
  );
};

export default Careers;
