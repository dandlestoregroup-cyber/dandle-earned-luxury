import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import TopBanner from "@/components/TopBanner";
import Hero from "@/components/Hero";
import PromiseGrid from "@/components/PromiseGrid";
import ARDemo from "@/components/ARDemo";
import ProductGallery from "@/components/ProductGallery";
import SocialProof from "@/components/SocialProof";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import NorthCoastConsultation from "@/components/north-coast/NorthCoastConsultation";
import { captureCampaignAttribution, trackCampaign } from "@/lib/campaign";

const Index = () => {
  useEffect(() => {
    captureCampaignAttribution();
    trackCampaign("north_coast_view", { surface: "homepage" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Navigation />
      <main>
        <Hero />
        <PromiseGrid />
        <NorthCoastConsultation surface="module" />
        <ARDemo />
        <div id="products">
          <ProductGallery />
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
