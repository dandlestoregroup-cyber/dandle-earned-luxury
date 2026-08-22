import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, FileText, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Payment = () => {
  useEffect(() => {
    document.title = "Payment Information - DANDLE | PayTabs & InstaPay";
    const description =
      "DANDLE payment: 40% verified deposit after order confirmation. PayTabs is primary; InstaPay is the fallback when card payment cannot complete. 60% balance is due on delivery.";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", description);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, []);

  const paymentMethods = [
    {
      icon: CreditCard,
      title: "PayTabs — Primary",
      description:
        "For accepted or amended orders, Dandle creates a PayTabs hosted payment page using the verified 40% deposit amount. Card details are handled by PayTabs, not stored by Dandle.",
    },
    {
      icon: Smartphone,
      title: "InstaPay — Fallback",
      description:
        "If PayTabs cannot complete and there is no uncertain payment still being verified, the same order can continue through InstaPay using the same reference and server-verified deposit amount.",
    },
  ];

  const paymentSteps = [
    {
      step: "40% Deposit",
      title: "After Dandle Confirms the Order",
      description:
        "The website re-checks the accepted order and calculates the payable deposit from the verified commercial order total before starting payment.",
      icon: CheckCircle,
    },
    {
      step: "60% Balance",
      title: "On Delivery",
      description:
        "The remaining 60% is due on delivery under the current Dandle commercial flow.",
      icon: CheckCircle,
    },
  ];

  const invoicingProcess = [
    "The Dandle order reference remains the same if payment switches from PayTabs to InstaPay.",
    "PayTabs payment is only treated as paid after server-side verification with PayTabs.",
    "An InstaPay transfer or transaction reference is evidence only; Dandle verifies receipt before marking the order paid.",
    "If a PayTabs payment is still pending or uncertain, the customer is told not to make a second payment yet.",
  ];

  const securityFeatures = [
    {
      title: "Server-Verified Amount",
      description:
        "The payment amount comes from the verified order record. A browser cannot lower the amount by changing checkout data.",
    },
    {
      title: "Verified PayTabs Callback",
      description:
        "Public callback fields do not decide payment success. Dandle queries PayTabs server-side before recording the payment result.",
    },
    {
      title: "No Blind Double Payment",
      description:
        "A pending PayTabs transaction blocks InstaPay fallback until the first payment is conclusively unpaid, cancelled, expired or failed.",
    },
    {
      title: "InstaPay Needs Receipt Verification",
      description:
        "Clicking a button or entering a transaction reference never marks an InstaPay payment as paid. Dandle must verify receipt.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
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
                PayTabs first. InstaPay when PayTabs cannot complete safely.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">How Payment Works</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {paymentSteps.map((step) => (
                  <Card key={step.step} className="h-full border-bronze/20 shadow-elegant">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-dandle-orange/10 flex items-center justify-center mb-4">
                        <step.icon className="w-8 h-8 text-dandle-orange" />
                      </div>
                      <div className="text-sm font-body font-semibold text-dandle-orange mb-2">{step.step}</div>
                      <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="font-body text-foreground/70 leading-relaxed">{step.description}</p></CardContent>
                  </Card>
                ))}
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium">If a payment status is uncertain, do not pay again yet.</p>
                  <p className="text-muted-foreground">Dandle will keep checking the first payment before offering a second payment method.</p>
                  <p className="text-muted-foreground" dir="rtl" lang="ar">إذا كانت حالة الدفع غير مؤكدة، لا تدفع مرة أخرى الآن. يتم التحقق من الدفع الأول قبل إتاحة طريقة دفع بديلة.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">Payment Methods</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {paymentMethods.map((method) => (
                  <Card key={method.title} className="h-full border-bronze/20 shadow-elegant text-center">
                    <CardHeader>
                      <method.icon className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                      <CardTitle className="font-headline text-xl">{method.title}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="font-body text-foreground/70 leading-relaxed">{method.description}</p></CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-8">
                InstaPay receiving details are shown only from Dandle's server-controlled payment configuration when fallback is available.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-10 text-center text-foreground">Verification & Documentation</h2>
              <div className="bg-muted/30 rounded-lg p-8 border border-bronze/10">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-dandle-orange flex-shrink-0" />
                  <p className="font-body text-foreground/80 leading-relaxed">
                    Dandle keeps payment state tied to the same order reference throughout the payment journey.
                  </p>
                </div>
                <ul className="space-y-3">
                  {invoicingProcess.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-body text-foreground/70">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Shield className="w-12 h-12 mx-auto mb-4 text-dandle-orange" />
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Payment Safety</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {securityFeatures.map((feature) => (
                  <div key={feature.title} className="bg-background rounded-lg p-6 border border-bronze/10 shadow-elegant">
                    <h3 className="font-headline text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />{feature.title}
                    </h3>
                    <p className="font-body text-foreground/70 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
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
