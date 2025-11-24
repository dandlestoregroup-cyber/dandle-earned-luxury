const RaytexSection = () => {
  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-6 py-3 bg-muted/50 rounded-sm mb-4">
              <span className="font-headline text-2xl font-normal text-foreground">Raytex</span>
            </div>
            <h3 className="font-headline text-2xl md:text-3xl font-normal text-foreground mb-4">
              Alexandria. 100,000 cycles.
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0 font-normal">
              Raytex weaves every thread in Alexandria.
              Salt air, four years of testing, still perfect.
            </p>
          </div>
          
          <div className="flex-1 w-full">
            <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-luxury">
              <img
                src="/images/relaxmax-hero-offwhite.jpg"
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RaytexSection;
