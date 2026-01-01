const PromiseGrid = () => {
  const promises = [
    {
      icon: "✨",
      titleEn: "Fully Customizable",
      titleAr: "قابل للتخصيص بالكامل",
      textEn: "Premium materials, your exact specifications",
      textAr: "خامات فاخرة، حسب مواصفاتك",
    },
    {
      icon: "📱",
      titleEn: "AR Visualization",
      titleAr: "معاينة بالواقع المعزز",
      textEn: "See it in your space before you buy",
      textAr: "شاهده في مكانك قبل الشراء",
    },
    {
      icon: "🚚",
      titleEn: "White Glove Service",
      titleAr: "خدمة راقية",
      textEn: "Delivery, assembly & placement included",
      textAr: "التوصيل والتركيب والتنسيق مشمول",
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
