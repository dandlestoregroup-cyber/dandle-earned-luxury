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
import ExitIntentPopup from "@/components/ExitIntentPopup";
import FestiveSnowfall from "@/components/FestiveSnowfall";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Festive snowfall effect - shows for 5s on first visit */}
      <FestiveSnowfall />

      <Navigation />
      <main>
        <Hero />

        {/* Festive ribbon divider */}
        <div className="festive-ribbon h-px" />

        <Quote />
        <PromiseGrid />
        <ARDemo />

        <div id="products" className="festive-ribbon">
          <ProductGallery />
        </div>

        <div id="partners" className="festive-ribbon">
          <Partners />
        </div>

        <SocialProof />
        <Contact />
      </main>
      <Footer />

      {/* Floating elements */}
      <WhatsAppFloat />

      {/* Exit intent popup - only on desktop */}
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
