import { useState } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import RoleApplicationModal from "@/components/careers/RoleApplicationModal";
import GeneralApplicationModal from "@/components/careers/GeneralApplicationModal";

const cultureCards = [
  {
    title: "The Art of Deserving",
    body: "We believe comfort is earned — and so is respect. We serve 'The Achiever,' and we hire them too. If you show up with discipline, care, and ownership, you will be seen here. Not with speeches, but with trust.",
  },
  {
    title: "Uncompromising Precision",
    body: "Quality isn't just a KPI; it is code. It's the way we hold a stitch, align a seam, or manage a spreadsheet. If it wobbles, if it's loose, if it's vague — it doesn't leave. We treat our work with the focus of a watchmaker.",
  },
  {
    title: "The Flawless Engine",
    body: "We move fast, but we don't move messy. We use technology to strip away the fluff of work. No drama. No chaos. Just clear handoffs, clean data, and quiet problem-solving. More impact with less noise.",
    filter: "If you need drama to feel busy, Dandle won't suit you.",
  },
  {
    title: "Proudly Lived With",
    body: "Our pieces are meant to be used daily, not just looked at. We work the same way: responsibly, consistently, and with pride. We build the legacy we want to live in.",
  },
];

const benefits = [
  "Health & Security: Insurance support (by role and after probation).",
  "Fair & Clear: Compensation that reflects your impact, not just your hours.",
  "Skill Architecture: Structured training. You master the basics, then you raise the standard.",
  "Balanced Life: We respect personal time. We don't glorify burnout; we glorify efficiency.",
  "Human Connection: Team moments that feel real, not forced.",
];

const Careers = () => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [generalModalOpen, setGeneralModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Dandle Careers — Built for the Achiever</title>
        <meta
          name="description"
          content="Join Dandle, the Swiss Knife of Comfort. A tech-enabled brand built on quiet precision. Explore roles and apply."
        />
      </Helmet>

      <Navigation />

      <main className="bg-warm-white min-h-screen pt-20">
        {/* SECTION 1: HERO */}
        <section className="w-full px-6 py-20 md:py-24">
          <div className="max-w-[1280px] mx-auto">
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-charcoal mb-4">
              DANDLE CAREERS
            </h1>
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-charcoal mb-3">
              Built for the Achiever. Managed by Intelligence.
            </h2>
            <p className="text-xl text-charcoal mb-6">
              Come Build What People Feel.
            </p>
            <p className="text-lg text-muted-foreground max-w-[600px] mb-8 leading-relaxed">
              Dandle is the Swiss Knife of Comfort — practical, premium, and proudly used every day. Behind every piece is a team that treats craft like a signature and operations like a science. We hire people who chase precision, not noise.
            </p>
            <div className="flex flex-row gap-4 flex-wrap">
              <Button
                onClick={() => {
                  scrollToSection("open-positions");
                  setTimeout(() => setRoleModalOpen(true), 500);
                }}
                className="h-12 px-6 bg-charcoal text-warm-white hover:bg-charcoal/90 rounded-sm font-body"
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection("general-application")}
                className="h-12 px-6 border-charcoal text-charcoal hover:bg-charcoal/5 rounded-sm font-body"
              >
                General Application
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION 2: CULTURE CARDS */}
        <section className="w-full px-6 py-24 bg-warm-white">
          <div className="max-w-[1120px] mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
              Our Culture — The Guardian's Code
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cultureCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-10 shadow-subtle"
                >
                  <h3 className="font-headline text-2xl font-bold text-charcoal mb-4">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.body}
                  </p>
                  {card.filter && (
                    <p className="text-sm italic text-muted-foreground/70 mt-4">
                      {card.filter}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: WORKPLACE */}
        <section className="w-full px-6 py-20">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-charcoal mb-6">
              Where You'll Work
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our environment is built for focus: real materials, real tools, real craft. Whether you are in the Cairo workshop or the digital cockpit, you will feel the rhythm: light, order, and logic — the kind of space that makes excellence easier to repeat.
            </p>
          </div>
        </section>

        {/* SECTION 4: BENEFITS */}
        <section className="w-full px-6 py-24 bg-warm-beige/30">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
              Benefits — The Guardian's Pledge
            </h2>
            <div className="flex flex-col gap-5">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-bronze flex-shrink-0 mt-0.5" />
                  <p className="text-lg text-charcoal">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: OPEN POSITIONS */}
        <section id="open-positions" className="w-full px-6 py-24">
          <div className="max-w-[900px] mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-charcoal mb-10">
              Open Positions
            </h2>

            {/* Role Card */}
            <div className="bg-card border-2 border-charcoal rounded-2xl p-8 md:p-12">
              <h3 className="font-headline text-2xl md:text-3xl font-bold text-charcoal mb-2">
                Executive Assistant (to the Executive Manager)
              </h3>
              <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-muted-foreground mb-6">
                <span>Department: Intelligence Office (The Cockpit)</span>
                <span>Location: Cairo</span>
                <span>Type: Full-time</span>
              </div>

              <p className="text-lg text-charcoal mb-6">
                You are the Executive Manager's force multiplier. Not a secretary — an execution partner. You protect focus, convert priorities into structured actions, and keep the company's operational truth clean.
              </p>

              <p className="font-bold text-charcoal mb-2">Mission:</p>
              <p className="text-muted-foreground mb-8">
                Make leadership decisions land in reality: clear owners, clear deadlines, clean documentation.
              </p>

              <div className="mb-8">
                <h4 className="text-lg font-bold text-charcoal mb-3">What You Will Own</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>The Executive Brief:</strong> Daily priorities, calendar control, and meeting readiness (no surprises).</li>
                  <li>• <strong>The Follow-Through:</strong> Action items tracked until closed — no floating tasks.</li>
                  <li>• <strong>The System Truth:</strong> Notion / Sheets accuracy. If it's not in the system, it didn't happen.</li>
                  <li>• <strong>The Communication:</strong> Clear internal updates; polite, firm external coordination when needed.</li>
                  <li>• <strong>The Rhythm:</strong> Weekly planning cadence, KPI snapshots, and clean reporting the Executive Manager can trust.</li>
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-bold text-charcoal mb-3">Who You Are</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Calm under pressure:</strong> You don't react — you resolve.</li>
                  <li>• <strong>Structured thinker:</strong> You love checklists, templates, timestamps, and dashboards.</li>
                  <li>• <strong>Discreet & trustworthy:</strong> You handle sensitive info with maturity and silence.</li>
                  <li>• <strong>Clear communicator:</strong> Arabic essential; English is a strong asset.</li>
                  <li>• <strong>Tech-ready:</strong> Comfortable with Notion, Google Sheets/Excel, WhatsApp Business, and learning fast.</li>
                </ul>
              </div>

              <div className="mb-10">
                <h4 className="text-lg font-bold text-charcoal mb-3">Scorecard (First 60–90 Days)</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Action closure rate:</strong> decisions become completed tasks, not notes.</li>
                  <li>• <strong>Calendar accuracy:</strong> zero missed/unclear commitments.</li>
                  <li>• <strong>Documentation quality:</strong> decisions + rationale logged same-day.</li>
                  <li>• <strong>Time protection:</strong> fewer interruptions, fewer repeat questions, cleaner handoffs.</li>
                </ul>
              </div>

              <Button
                onClick={() => setRoleModalOpen(true)}
                className="h-14 px-8 bg-charcoal text-warm-white hover:bg-charcoal/90 rounded-sm font-body text-lg"
              >
                Apply Now
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Send your CV + 5 lines: (1) your proudest 'mess → system' story (2) the tool you use best (3) why Dandle.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6: GENERAL APPLICATION */}
        <section id="general-application" className="w-full px-6 py-24 bg-warm-beige/30">
          <div className="max-w-[700px] mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-charcoal mb-6">
              Don't See Your Role?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              If you are exceptional, we want to meet you. We are always looking for Craftsmen, Digital Wizards, and Brand Voices.
            </p>
            <p className="text-base text-charcoal mb-8">
              Send your CV + a short note:<br />
              (1) What are you known for?<br />
              (2) What do you want to master next?<br />
              (3) Why Dandle?
            </p>
            <Button
              variant="outline"
              onClick={() => setGeneralModalOpen(true)}
              className="h-12 px-6 border-charcoal text-charcoal hover:bg-charcoal/5 rounded-sm font-body"
            >
              Send General Application
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
