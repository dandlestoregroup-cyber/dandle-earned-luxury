import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed Hassan",
    location: "Cairo, Maadi",
    rating: 5,
    text: "The RelaxMax transformed our living room. My father finally has the comfort he deserves after years of searching.",
    product: "RelaxMax Premium"
  },
  {
    name: "Fatma El-Sayed",
    location: "Alexandria",
    rating: 5,
    text: "Installation was flawless. The team treated our home with such care. Worth every piaster.",
    product: "EasyUp Standard"
  },
  {
    name: "Omar Khalil",
    location: "New Cairo",
    rating: 5,
    text: "As a gift for my parents' anniversary, the CozyCompanion was perfect. They use it every single day.",
    product: "CozyCompanion Duo"
  },
  {
    name: "Laila Mahmoud",
    location: "Giza",
    rating: 5,
    text: "The AR feature helped us visualize exactly how it would look. No surprises, just pure satisfaction.",
    product: "SpaceSaver Compact"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-bronze font-body text-sm tracking-[0.2em] uppercase">
            Loved by Families
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-foreground mt-3">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background p-8 rounded-sm shadow-subtle border border-border/50 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-bronze/20" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-dandle-orange text-dandle-orange" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-body text-foreground leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-headline text-lg text-foreground">
                  {testimonial.name}
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  {testimonial.location} • {testimonial.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
