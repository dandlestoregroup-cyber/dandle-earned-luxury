import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";

const Terms = () => {
  useEffect(() => {
    document.title = "Terms of Service - DANDLE | Purchase Terms";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "DANDLE Terms of Service: Understand our purchase terms, warranty conditions, and customer rights when buying luxury recliners."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <section className="bg-gradient-to-br from-nile-blue/10 via-background to-dandle-orange/5 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Terms of Service
              </h1>
              <p className="font-body text-foreground/70">
                Last updated: December 2024
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-8 font-body text-foreground/80"
              >
                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Order & Payment
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All prices are listed in Egyptian Pounds (EGP)</li>
                    <li>Payment methods: Cash on Delivery, Fawry, Paymob, Bank Transfer</li>
                    <li>A 50% deposit may be required for certain products</li>
                    <li>Orders are confirmed via WhatsApp or phone call</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Delivery
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Delivery within Egypt takes up to 14 business days</li>
                    <li>Free delivery on orders above EGP 50,000</li>
                    <li>Delivery appointments confirmed via WhatsApp/phone</li>
                    <li>White-glove delivery includes placement in your chosen room</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Warranty
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>5-year warranty on frame and mechanism</li>
                    <li>2-year warranty on leather and upholstery</li>
                    <li>1-year warranty on electrical components (for power recliners)</li>
                    <li>Warranty does not cover normal wear and tear or misuse</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Returns & Exchanges
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>7-day return window from delivery date</li>
                    <li>Product must be unused and in original condition</li>
                    <li>Return shipping costs are the customer's responsibility</li>
                    <li>Refunds processed within 14 business days</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Intellectual Property
                  </h2>
                  <p>
                    DANDLE™, RelaxMax™, and CozyCompanion™ are registered trademarks of 
                    Dandle Store Group. All product designs are protected by international 
                    design patents. Unauthorized reproduction is prohibited.
                  </p>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Contact
                  </h2>
                  <p>
                    For questions about these terms:{" "}
                    <a href="mailto:Tell.me@DandleStoreGroup.com" className="text-accent hover:underline">
                      Tell.me@DandleStoreGroup.com
                    </a>
                    <br />
                    Phone: 01222804255
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Terms;
