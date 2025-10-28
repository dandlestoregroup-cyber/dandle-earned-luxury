import { Palette, Smartphone, Truck } from "lucide-react";

const USPStrip = () => {
  const features = [
    {
      icon: Palette,
      title: "Fully Customizable",
      description: "Choose premium materials & colors",
    },
    {
      icon: Smartphone,
      title: "AR Visualization",
      description: "See exactly how it fits your space",
    },
    {
      icon: Truck,
      title: "White Glove Delivery",
      description: "Professional assembly & placement",
    },
  ];

  return (
    <section className="py-16 bg-cream border-y border-gold/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-primary to-secondary shadow-luxury group-hover:shadow-gold transition-all duration-300 group-hover:scale-110">
                <feature.icon size={32} className="text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPStrip;
