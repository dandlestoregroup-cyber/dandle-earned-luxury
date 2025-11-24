import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PremiumGallery from "@/components/PremiumGallery";
import Quote from "@/components/Quote";
import PromiseGrid from "@/components/PromiseGrid";
import ARDemo from "@/components/ARDemo";
import ProductGallery from "@/components/ProductGallery";
import SocialProof from "@/components/SocialProof";
import Contact from "@/components/Contact";
import RaytexSection from "@/components/RaytexSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <PremiumGallery />
        <Quote />
        <PromiseGrid />
        <ARDemo />
        <div id="products">
          <ProductGallery />
        </div>
        <SocialProof />
        <Contact />
        <RaytexSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
