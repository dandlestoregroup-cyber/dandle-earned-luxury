import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import USPStrip from "@/components/USPStrip";
import ProductCollection from "@/components/ProductCollection";
import ARDemo from "@/components/ARDemo";
import Story from "@/components/Story";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <USPStrip />
        <ProductCollection />
        <ARDemo />
        <Story />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
