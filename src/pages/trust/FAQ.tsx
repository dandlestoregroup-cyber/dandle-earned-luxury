import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  useEffect(() => {
    document.title = "Frequently Asked Questions - DANDLE";
    const description =
      "Find answers to common questions about DANDLE recliners: ordering, secure PayTabs payment, delivery, installation, warranty, returns, and fabric care.";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", description);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, []);

  const faqSections = [
    {
      title: "Ordering",
      questions: [
        {
          q: "How do I place an order?",
          a: "Browse the DANDLE collection, select the exact model, color, mechanism and available options, add them to your cart, then complete secure checkout. You can also contact us via WhatsApp at 01222804255 or email Tell.me@DandleStoreGroup.com for assistance before checkout.",
        },
        {
          q: "Can I customize my recliner?",
          a: "Available colors, fabrics, mechanisms and selectable options are shown for each model. Checkout verifies the exact configuration and current price server-side before payment starts.",
        },
        {
          q: "What happens after I place an order?",
          a: "DANDLE creates your order first, then redirects you to the secure PayTabs hosted card page for the full order total in EGP. Your order is confirmed as paid only after DANDLE verifies the PayTabs transaction server-to-server.",
        },
      ],
    },
    {
      title: "Payment",
      questions: [
        {
          q: "What payment method do you accept online?",
          a: "Online checkout uses secure card payment via PayTabs. DANDLE does not collect or store your raw card details.",
        },
        {
          q: "When do I need to pay?",
          a: "The full server-verified order total is submitted to PayTabs during checkout. Browser-displayed or manually changed totals cannot override the amount DANDLE verifies on the server.",
        },
        {
          q: "How do I know payment succeeded?",
          a: "Returning from PayTabs does not by itself mark an order paid. DANDLE verifies the transaction with PayTabs and then shows the confirmed payment state on the order result page.",
        },
        {
          q: "Will I receive an invoice or receipt?",
          a: "Your verified DANDLE order keeps the exact model, color, configuration, SKU and paid total. Our team can provide the corresponding invoice or receipt for the confirmed order.",
        },
      ],
    },
    {
      title: "Delivery",
      questions: [
        {
          q: "How long does delivery take?",
          a: "Delivery takes up to 14 days. We confirm the delivery appointment via WhatsApp or phone.",
        },
        {
          q: "Do you deliver across all of Egypt?",
          a: "Yes, we provide white-glove delivery service across Egypt. Contact us if you have questions about delivery to your specific location.",
        },
        {
          q: "What is white-glove delivery?",
          a: "Our professional team delivers your recliner, unpacks it, sets it up if assembly is required, removes packaging, and checks the product before leaving.",
        },
        {
          q: "Can I reschedule my delivery?",
          a: "Yes. Contact us via WhatsApp or phone to reschedule your delivery appointment and we will do our best to accommodate the requested time.",
        },
      ],
    },
    {
      title: "Installation",
      questions: [
        {
          q: "Is installation included?",
          a: "Yes. If assembly is required, our delivery team will set up your recliner and confirm that it is functioning correctly.",
        },
        {
          q: "How long does installation take?",
          a: "Most recliners can be set up in 15-30 minutes, depending on the model and installation requirements.",
        },
        {
          q: "Will you demonstrate how to use my recliner?",
          a: "Yes. Our team can walk you through the main functions of your recliner during delivery and setup.",
        },
      ],
    },
    {
      title: "Warranty",
      questions: [
        {
          q: "What warranty do you offer?",
          a: "We offer a 5-year frame warranty, 2-year motor warranty, and 1-year upholstery warranty. Visit our Warranty page for complete details.",
        },
        {
          q: "How do I make a warranty claim?",
          a: "Contact us via WhatsApp at 01222804255 or email Tell.me@DandleStoreGroup.com with your order reference, photos of the issue, and a description. Our team will guide you through the process.",
        },
        {
          q: "What's not covered under warranty?",
          a: "Normal wear and tear, misuse, commercial use, unauthorized repairs, and pet damage are not covered. See our Warranty page for full exclusions.",
        },
      ],
    },
    {
      title: "Returns & Exchanges",
      questions: [
        {
          q: "Can I return my recliner?",
          a: "Due to the custom nature of our furniture, we have a limited return policy. Contact us within 48 hours of delivery if there are manufacturing defects or delivery damage.",
        },
        {
          q: "What if my recliner is damaged during delivery?",
          a: "Please inspect your recliner upon delivery. If you notice damage, inform our delivery team immediately so the issue can be documented and resolved.",
        },
        {
          q: "Can I exchange for a different model?",
          a: "Exchanges are evaluated case by case. Contact us with your order reference and requested change so we can review the available options.",
        },
      ],
    },
    {
      title: "Fabric Care",
      questions: [
        {
          q: "How do I clean my recliner?",
          a: "For fabric upholstery, vacuum regularly and spot clean with a mild detergent and water. For leather, use a damp cloth and suitable leather conditioner. Follow the care guidance supplied for your upholstery.",
        },
        {
          q: "Can I use cleaning products on my recliner?",
          a: "Use only mild, pH-neutral cleaners suitable for the upholstery. Avoid harsh chemicals, bleach, or abrasive cleaners that can damage fabric or leather.",
        },
        {
          q: "How do I protect my recliner from stains?",
          a: "Clean spills promptly by blotting rather than rubbing. If using a fabric protector, first confirm it is suitable for the upholstery and test it on a hidden area.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-nile-blue/10 via-background to-dandle-orange/5 py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center">
              <HelpCircle className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">Frequently Asked Questions</h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">Everything you need to know about DANDLE</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {faqSections.map((section, sectionIndex) => (
                <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: sectionIndex * 0.1 }}>
                  <h2 className="font-headline text-3xl font-bold mb-6 text-foreground">{section.title}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {section.questions.map((item, index) => (
                      <AccordionItem key={item.q} value={`${sectionIndex}-${index}`} className="border border-bronze/20 rounded-lg px-6 bg-muted/20 hover:bg-muted/30 transition-colors">
                        <AccordionTrigger className="font-body text-lg font-semibold text-left hover:text-dandle-orange transition-colors">{item.q}</AccordionTrigger>
                        <AccordionContent className="font-body text-foreground/70 leading-relaxed pt-2">{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-nile-blue/10 to-dandle-orange/10 rounded-lg p-8 md:p-12 border border-bronze/20 shadow-elegant">
                <h2 className="font-headline text-3xl font-bold mb-4 text-foreground">Still Have Questions?</h2>
                <p className="font-body text-foreground/70 mb-6 leading-relaxed">Our team is here to help. Contact us via WhatsApp, phone, or email.</p>
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

export default FAQ;
