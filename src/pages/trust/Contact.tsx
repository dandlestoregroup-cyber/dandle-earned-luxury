import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    document.title = "Contact DANDLE | WhatsApp, Phone, Email";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Contact DANDLE for luxury recliners in Egypt. Reach us via WhatsApp, phone 01222804255, or email. Hours: 10AM-3PM & 7PM-9PM daily."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Contact DANDLE for luxury recliners in Egypt. Reach us via WhatsApp, phone 01222804255, or email. Hours: 10AM-3PM & 7PM-9PM daily.";
      document.head.appendChild(meta);
    }
  }, []);

  const handleWhatsAppClick = () => {
    const message = "Hello! I have a question about DANDLE recliners.";
    window.open(`https://wa.me/201222804255?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mailtoLink = `mailto:Tell.me@DandleStoreGroup.com?subject=${encodeURIComponent(formData.subject || "Website Inquiry")}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    toast.success("Opening your email client...");
    
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "01222804255",
      action: () => window.open("tel:+201222804255")
    },
    {
      icon: Mail,
      title: "Email",
      value: "Tell.me@DandleStoreGroup.com",
      action: () => window.location.href = "mailto:Tell.me@DandleStoreGroup.com"
    },
    {
      icon: Clock,
      title: "Hours",
      value: "10AM - 3PM & 7PM - 9PM",
      subtitle: "Daily, 7 days a week"
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
              <MessageCircle className="w-16 h-16 mx-auto mb-6 text-dandle-orange" />
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-nile-blue via-dandle-orange to-bronze bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="font-body text-xl md:text-2xl text-foreground/80 leading-relaxed">
                We're here to help you find your perfect recliner.
              </p>
            </motion.div>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <Card className="border-[#25D366]/30 bg-gradient-to-br from-[#25D366]/10 to-transparent shadow-elegant">
                <CardContent className="py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#25D366]" />
                  <h2 className="font-headline text-2xl font-bold mb-3">Fastest Response via WhatsApp</h2>
                  <p className="font-body text-foreground/70 mb-6">
                    Get instant answers to your questions. Our team responds within minutes during business hours.
                  </p>
                  <Button 
                    onClick={handleWhatsAppClick}
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white text-lg px-8"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`h-full border-bronze/10 shadow-elegant text-center ${item.action ? 'cursor-pointer hover:border-dandle-orange/30 transition-colors' : ''}`}
                      onClick={item.action}
                    >
                      <CardHeader>
                        <item.icon className="w-10 h-10 mx-auto text-dandle-orange mb-2" />
                        <CardTitle className="font-headline text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body font-semibold text-foreground">{item.value}</p>
                        {item.subtitle && (
                          <p className="font-body text-sm text-foreground/60 mt-1">{item.subtitle}</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
                  Send Us a Message
                </h2>
                
                <Card className="border-bronze/10 shadow-elegant">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="font-body">Name *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            className="font-body"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-body">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="font-body"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="font-body">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="How can we help?"
                          className="font-body"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="font-body">Message *</Label>
                        <Textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about your inquiry..."
                          className="font-body resize-none"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" size="lg">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      
                      <p className="text-center text-sm text-muted-foreground font-body">
                        This will open your email client to send the message.
                      </p>
                    </form>
                  </CardContent>
                </Card>
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

export default Contact;
