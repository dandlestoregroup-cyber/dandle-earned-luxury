import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Quote from "@/components/Quote";
import PromiseGrid from "@/components/PromiseGrid";
import ARDemo from "@/components/ARDemo";
import ProductGallery from "@/components/ProductGallery";
import SocialProof from "@/components/SocialProof";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import WorkWithUs from "@/components/WorkWithUs";
import OfferRibbon from "@/components/OfferRibbon";
import Testimonials from "@/components/Testimonials";
import LifestyleGallery from "@/components/LifestyleGallery";
import PressRecognition from "@/components/PressRecognition";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <OfferRibbon />
      <main>
        <Hero />
        <Quote />
        <PromiseGrid />
        <ARDemo />
        <div id="products">
          <ProductGallery />
        </div>
        <LifestyleGallery />
        <Testimonials />
        <PressRecognition />
        <SocialProof />
        <WorkWithUs />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
