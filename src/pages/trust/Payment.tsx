import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { CreditCard, FileText, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Payment = () => {
  useEffect(() => {
    document.title = "Payment Information - DANDLE | Secure PayTabs Checkout";
    const description =
      "DANDLE online checkout uses secure PayTabs card payment for the full server-verified order total in EGP. Payment is confirmed only after server-to-server verification.";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", description);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, []);

  const paymentSteps = [
    {
      step: "1",
      title: "DANDLE Creates the Order",
      description:
        "Before any PayTabs request is created, DANDLE validates the exact model, color, mechanism, selected options, SKU and current server-side price and stores an internal order UUID.",
    },
    {
      step: "2",
      title: "Secure Card Payment via PayTabs",
      description:
        "The full verified order total is sent in EGP to the PayTabs hosted payment page. DANDLE does not collect or store raw card details.",
    },
    {
      step: "3",
      title: "Server-to-Server Verification",
      description:
        "Returning to DANDLE does not mark an order paid. DANDLE verifies the PayTabs transaction, amount, currency, profile, order ID and transaction reference before settlement.",
    },
    {
      step: "4",
      title: "Confirmed Once",
      description:
        "A verified successful transaction moves the order from pending payment to paid atomically and idempotently, so duplicate callbacks or refreshes cannot create a second settlement.",
    },
  ];

  const securityFeatures = [
    {
      title: "Server-Owned Pricing",
      description:
        "Browser totals are never trusted. Product, configuration and option prices are recalculated from DANDLE's server catalogue before checkout.",
    },
    {
      title: "Exact Order Snapshot",
      description:
        "The paid order keeps the exact model, color, mechanism, selected options, SKU, quantities and totals used to create the PayTabs request.",
    },
    {
      title: "Verified PayTabs Callback",
      description:
        "The PayTabs callback is signature-checked and the transaction is independently queried before DANDLE records a successful payment.",
    },
    {
      title: "Safe Return Page",
      description:
        "The payment result page only reads DANDLE's verified order state. A browser redirect alone can never change an order to paid.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-nile-blue/10 via-background to-dandle-orange/5 py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">Payment Information</h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">Secure card payment via PayTabs. Full order total. Server verified.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">How Payment Works</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {paymentSteps.map((step) => (
                  <Card key={step.step} className="h-full border-bronze/20 shadow-elegant">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-dandle-orange/10 flex items-center justify-center mb-4 text-dandle-orange font-bold">{step.step}</div>
                      <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="font-body text-foreground/70 leading-relaxed">{step.description}</p></CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Shield className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Payment Safety</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {securityFeatures.map((feature) => (
                  <div key={feature.title} className="bg-background rounded-lg p-6 border border-bronze/10 shadow-elegant">
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" />{feature.title}</h3>
                    <p className="font-body text-foreground/70 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto rounded-lg border border-bronze/10 bg-muted/30 p-8">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-dandle-orange flex-shrink-0" />
                <div>
                  <h2 className="font-headline text-2xl font-semibold mb-3">Order & Payment Record</h2>
                  <p className="font-body text-foreground/70 leading-relaxed">Your DANDLE order keeps one internal order ID throughout checkout, PayTabs verification, confirmation and reconciliation. Payment status is never inferred from a browser redirect or customer statement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Payment;
