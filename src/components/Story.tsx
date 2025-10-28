const Story = () => {
  return (
    <section id="story" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-foreground">
            We Believe in Earned Luxury
          </h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-xl leading-relaxed mb-6">
              Dandle was founded on a principle: to create world-class products
              that serve as tangible symbols of achievement. When you invest in
              a Dandle, you're not making a purchase; you're making a statement.
            </p>
            <p className="text-xl leading-relaxed mb-8">
              Every recliner in our collection is designed for those who
              understand that true luxury isn't about excess—it's about the
              perfect balance of form, function, and feeling. It's about
              creating a sanctuary where you can rest, recharge, and reflect on
              the journey that brought you here.
            </p>
          </div>

          {/* Signature */}
          <div className="mt-12 pt-8 border-t border-gold/20">
            <p className="font-serif text-2xl text-gradient-luxury mb-2">
              Mourad Farah
            </p>
            <p className="text-muted-foreground">Founder, Dandle Store Group</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { number: "5+", label: "Years of Excellence" },
              { number: "10K+", label: "Happy Customers" },
              { number: "99%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="font-serif text-5xl font-bold text-gradient-luxury mb-2">
                  {stat.number}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
