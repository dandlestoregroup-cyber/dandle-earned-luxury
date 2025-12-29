import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Quote from "@/components/Quote";
import PromiseGrid from "@/components/PromiseGrid";
import ReclinerColorStudio from "@/components/ReclinerColorStudio";
import FreeRoomMakeover from "@/components/FreeRoomMakeover";
import ProductGallery from "@/components/ProductGallery";
import Partners from "@/components/Partners";
import SocialProof from "@/components/SocialProof";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import FestiveSnowfall from "@/components/FestiveSnowfall";
import StickyMobileCart from "@/components/StickyMobileCart";

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

        {/* Recliner Color Studio - Replace ARDemo */}
        <div id="color-studio">
          <ReclinerColorStudio />
        </div>

        <div id="products" className="festive-ribbon">
          <ProductGallery />
        </div>

        {/* Free Room Makeover Section */}
        <div id="room-makeover">
          <FreeRoomMakeover />
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
      <StickyMobileCart />

      {/* Exit intent popup - only on desktop */}
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
