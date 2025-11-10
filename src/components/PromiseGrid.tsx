const PromiseGrid = () => {
  const promises = [
    {
      icon: "✨",
      title: "Fully Customizable",
      text: "Premium materials, your exact specifications",
    },
    {
      icon: "📱",
      title: "AR Visualization",
      text: "See it in your space before you buy",
    },
    {
      icon: "🚚",
      title: "White Glove Service",
      text: "Delivery, assembly & placement included",
    },
  ];

  return (
    <section className="bg-warm-white py-24 px-6">
      <div className="grid md:grid-cols-3 gap-10 text-center max-w-screen-xl mx-auto">
        {promises.map((p, i) => (
          <div key={i} className="space-y-3">
            <div className="text-4xl">{p.icon}</div>
            <h3 className="font-headline text-xl text-charcoal">{p.title}</h3>
            <p className="text-charcoal/80 font-body">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromiseGrid;
