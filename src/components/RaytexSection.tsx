const RaytexSection = () => {
  return (
    <section className="py-20 bg-background border-t border-bronze/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-6 py-3 bg-muted/50 rounded-lg mb-4">
              <span className="font-headline text-2xl font-bold text-foreground">Raytex</span>
            </div>
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-foreground mb-4">
              Premium Egyptian Fabrics
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0">
              Every Dandle recliner is upholstered with premium Raytex fabrics, 
              crafted in Egypt to ensure lasting beauty and comfort that stands the test of time.
            </p>
          </div>
          
          {/* Image */}
          <div className="flex-1 w-full">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-luxury">
              <img
                src="/images/relaxmax-hero-offwhite.jpg"
                alt="Raytex Premium Fabric Detail"
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
