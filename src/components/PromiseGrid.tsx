const PromiseGrid = () => {
  const promises = [
    {
      icon: "🚚",
      titleEn: "Delivery in 14 Days",
      titleAr: "تسليم خلال 14 يوم",
      textEn: "Fast nationwide delivery to your door",
      textAr: "توصيل سريع لجميع المحافظات",
    },
    {
      icon: "🔧",
      titleEn: "Free Installation",
      titleAr: "تركيب مجاني",
      textEn: "Professional setup in your home",
      textAr: "تركيب احترافي في منزلك",
    },
    {
      icon: "🛡️",
      titleEn: "2-Year Warranty",
      titleAr: "ضمان سنتين",
      textEn: "Full coverage on all parts & fabric",
      textAr: "تغطية شاملة للقطع والخامات",
    },
  ];

  return (
    <section className="bg-warm-white py-24 px-6">
      <div className="grid md:grid-cols-3 gap-10 text-center max-w-screen-xl mx-auto">
        {promises.map((p, i) => (
          <div key={i} className="space-y-3">
            <div className="text-4xl">{p.icon}</div>
            <h3 
              className="font-headline text-xl text-charcoal"
              data-en={p.titleEn}
              data-ar={p.titleAr}
            >
              {p.titleEn}
            </h3>
            <p 
              className="text-charcoal/80 font-body"
              data-en={p.textEn}
              data-ar={p.textAr}
            >
              {p.textEn}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromiseGrid;
