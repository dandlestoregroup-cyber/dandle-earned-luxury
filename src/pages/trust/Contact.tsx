import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Clock, MessageCircle, MapPin } from "lucide-react";

const Contact = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/201222804255?text=Hello! I have a question about Dandle recliners.", "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Contact Dandle | WhatsApp, Phone, Email Support</title>
        <meta
          name="description"
          content="Get in touch with Dandle. WhatsApp support, phone, and email available daily 10AM-3PM & 7PM-9PM. We're here to help with your recliner inquiries."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get in <span className="text-gradient-luxury">Touch</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We're here to help with any questions about our luxury recliners.
                Reach out via WhatsApp for the fastest response.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-8">
                {/* WhatsApp CTA */}
                <div className="bg-card rounded-xl p-8 border border-gold/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                    WhatsApp Support
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Get instant responses from our team. We typically reply within minutes during business hours.
                  </p>
                  <Button
                    onClick={handleWhatsApp}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </div>

                {/* Contact Details */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href="tel:+201222804255" className="text-muted-foreground hover:text-accent transition-colors">
                        01222804255
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:Tell.me@DandleStoreGroup.com" className="text-muted-foreground hover:text-accent transition-colors">
                        Tell.me@DandleStoreGroup.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Daily: 10AM - 3PM & 7PM - 9PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Service Area</h3>
                      <p className="text-muted-foreground">
                        Nationwide delivery across Egypt
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form (mailto) */}
              <div className="bg-card rounded-xl p-8 border border-gold/20">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form
                  action="mailto:Tell.me@DandleStoreGroup.com"
                  method="POST"
                  encType="text/plain"
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" variant="luxury" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>

                <p className="text-sm text-muted-foreground mt-4 text-center">
                  For faster response, use WhatsApp
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;