import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - DANDLE | Your Data Protection";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "DANDLE Privacy Policy: Learn how we collect, use, and protect your personal information when you shop with us."
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
                Privacy Policy
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
                    Information We Collect
                  </h2>
                  <p>When you make a purchase or interact with our website, we may collect:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Name and contact information (email, phone, address)</li>
                    <li>Payment information (processed securely via our payment partners)</li>
                    <li>Order history and preferences</li>
                    <li>Communication records from WhatsApp or email interactions</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    How We Use Your Information
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Processing and fulfilling your orders</li>
                    <li>Communicating about delivery and installation</li>
                    <li>Providing customer support</li>
                    <li>Sending order updates via WhatsApp or email</li>
                    <li>Improving our products and services</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Data Protection
                  </h2>
                  <p>
                    We implement appropriate security measures to protect your personal information. 
                    Payment processing is handled by secure third-party providers (Fawry, Paymob) 
                    and we never store complete payment card details.
                  </p>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Your Rights
                  </h2>
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Access your personal data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Contact Us
                  </h2>
                  <p>
                    For privacy-related inquiries, contact us at:{" "}
                    <a href="mailto:Tell.me@DandleStoreGroup.com" className="text-accent hover:underline">
                      Tell.me@DandleStoreGroup.com
                    </a>
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

export default Privacy;
