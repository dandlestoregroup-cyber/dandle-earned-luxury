import { motion } from "framer-motion";

const milestones = [
  {
    year: "2010",
    title: "The Beginning",
    description: "Founded in Cairo with a vision to bring world-class comfort to Egyptian homes."
  },
  {
    year: "2014",
    title: "First Workshop",
    description: "Opened our dedicated craftsmanship workshop with master artisans."
  },
  {
    year: "2017",
    title: "10,000 Families",
    description: "Celebrated serving our 10,000th family across Egypt."
  },
  {
    year: "2020",
    title: "Innovation Hub",
    description: "Launched our R&D center focusing on ergonomic excellence."
  },
  {
    year: "2023",
    title: "AR Experience",
    description: "Pioneered augmented reality for home furniture visualization."
  },
  {
    year: "2025",
    title: "Legacy Continues",
    description: "15 years of crafting comfort, now with Nour AI assistant."
  }
];

const HeritageTimeline = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
            Our Journey
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-foreground mt-3">
            15 Years of Craftsmanship
          </h2>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-bronze/20 via-bronze to-bronze/20 hidden md:block" />
          
          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative md:flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-card p-6 rounded-sm shadow-subtle border border-border/50">
                    <span className="text-dandle-orange font-headline text-2xl font-bold">
                      {milestone.year}
                    </span>
                    <h3 className="font-headline text-xl text-foreground mt-2">
                      {milestone.title}
                    </h3>
                    <p className="font-body text-muted-foreground mt-2">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-bronze rounded-full border-4 border-card shadow-refined" />

                {/* Empty space for opposite side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageTimeline;
