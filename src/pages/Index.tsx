import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Quote from "@/components/Quote";
import PromiseGrid from "@/components/PromiseGrid";
import ARDemo from "@/components/ARDemo";
import ProductGallery from "@/components/ProductGallery";
import Partners from "@/components/Partners";
import SocialProof from "@/components/SocialProof";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Quote />
        <PromiseGrid />
        <ARDemo />
        <div id="products">
          <ProductGallery />
        </div>
        <div id="partners">
          <Partners />
        </div>
        <SocialProof />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
