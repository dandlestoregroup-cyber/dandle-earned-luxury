import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Building2, FileText, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Payment = () => {
  useEffect(() => {
    document.title = "Payment Information - DANDLE | Flexible Payment Options";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "DANDLE payment options: 40% deposit, 60% on delivery. We accept bank transfer, Vodafone Cash, and InstaPay. Secure and flexible payment methods."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "DANDLE payment options: 40% deposit, 60% on delivery. We accept bank transfer, Vodafone Cash, and InstaPay. Secure and flexible payment methods.";
      document.head.appendChild(meta);
    }
  }, []);

  const paymentMethods = [
    {
      icon: Building2,
      title: "Bank Transfer",
      description: "Direct bank transfer to our business account. Bank details will be provided after order confirmation."
    },
    {
      icon: Smartphone,
      title: "Vodafone Cash",
      description: "Quick and convenient mobile payment via Vodafone Cash to our registered number."
    },
    {
      icon: CreditCard,
      title: "InstaPay",
      description: "Instant bank transfers using InstaPay for fast, secure transactions."
    }
  ];

  const paymentSteps = [
    {
      step: "40% Deposit",
      title: "Confirm Your Order",
      description: "Pay 40% deposit after order confirmation to begin production and secure your delivery slot.",
      icon: CheckCircle
    },
    {
      step: "60% Balance",
      title: "Payment on Delivery",
      description: "Pay the remaining 60% when your recliner is delivered, before our team completes setup.",
      icon: CheckCircle
    }
  ];

  const invoicingProcess = [
    "Order confirmation sent via WhatsApp with reference number",
    "Deposit invoice/receipt sent after 40% payment received",
    "Final invoice sent after delivery and full payment",
    "All invoices include itemized details and payment breakdown"
  ];

  const securityFeatures = [
    {
      title: "Secure Transactions",
      description: "All payment methods are verified and secure. We never store your financial information."
    },
    {
      title: "Order Confirmation",
      description: "You'll receive immediate confirmation of your order and payment via WhatsApp."
    },
    {
      title: "Clear Documentation",
      description: "Every payment is documented with an invoice/receipt for your records."
    },
    {
      title: "Protected Deposits",
      description: "Your deposit secures your order and delivery slot. We honor all commitments."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-nile-blue/10 via-background to-dandle-orange/5 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <CreditCard className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">
                Payment Information
              </h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">
                Flexible and secure payment options
              </p>
            </motion.div>
          </div>
        </section>

        {/* Payment Structure */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                How Payment Works
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {paymentSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-bronze/20 shadow-elegant hover:shadow-glow transition-all">
                      <CardHeader>
                        <div className="w-16 h-16 rounded-full bg-dandle-orange/10 flex items-center justify-center mb-4">
                          <step.icon className="w-8 h-8 text-dandle-orange" />
                        </div>
                        <div className="text-sm font-body font-semibold text-dandle-orange mb-2">
                          {step.step}
                        </div>
                        <CardTitle className="font-headline text-2xl">
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-foreground/70 leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 border border-bronze/20 text-center"
              >
                <p className="font-body text-lg text-foreground/80 leading-relaxed">
                  <strong>Why split payments?</strong> The deposit confirms your order and reserves your delivery slot.
                  The balance on delivery ensures you're completely satisfied before final payment.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                Accepted Payment Methods
              </motion.h2>

              <div className="grid md:grid-cols-3 gap-8">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-bronze/20 shadow-elegant hover:shadow-glow transition-all text-center">
                      <CardHeader>
                        <method.icon className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                        <CardTitle className="font-headline text-xl">
                          {method.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-foreground/70 leading-relaxed">
                          {method.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <p className="font-body text-foreground/70">
                  Payment details will be provided via WhatsApp after order confirmation.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Invoicing */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground"
              >
                Invoicing & Documentation
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-muted/30 rounded-lg p-8 border border-bronze/10"
              >
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-dandle-orange flex-shrink-0" />
                  <div>
                    <h3 className="font-headline text-2xl font-semibold mb-4 text-foreground">
                      Professional Documentation
                    </h3>
                    <p className="font-body text-foreground/80 leading-relaxed mb-6">
                      We provide clear, professional invoices/receipts for all transactions via WhatsApp:
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {invoicingProcess.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 font-body text-foreground/70"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Security & Trust */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <Shield className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                  Your Payment is Secure
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-lg p-6 border border-bronze/10 shadow-elegant"
                  >
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {feature.title}
                    </h3>
                    <p className="font-body text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 border border-bronze/20"
              >
                <h2 className="font-headline text-2xl font-bold mb-4 text-foreground">
                  Questions About Payment?
                </h2>
                <p className="font-body text-foreground/70 mb-6">
                  Our team is here to help with any payment-related questions.
                </p>
                <div className="space-y-2 font-body text-foreground/80">
                  <p><strong>WhatsApp:</strong> 01222804255</p>
                  <p><strong>Email:</strong> Tell.me@DandleStoreGroup.com</p>
                  <p><strong>Hours:</strong> Daily 10AM-3PM & 7PM-9PM</p>
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

export default Payment;
