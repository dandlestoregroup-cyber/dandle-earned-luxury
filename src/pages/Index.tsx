import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BeliefStatements from "@/components/BeliefStatements";
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
import LifestyleGallery from "@/components/LifestyleGallery";
import IstikbalShowroom from "@/components/IstikbalShowroom";
import Partners from "@/components/Partners";
import FabricsSection from "@/components/FabricsSection";
import CollectionIntro from "@/components/CollectionIntro";
import TrustBlock from "@/components/TrustBlock";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <OfferRibbon />
      <main>
        <Hero />
        <BeliefStatements />
        <Quote />
        <PromiseGrid />
        <ARDemo />
        <CollectionIntro />
        <div id="products">
          <ProductGallery />
        </div>
        <TrustBlock />
        <FabricsSection />
        <LifestyleGallery />
        <Partners />
        <IstikbalShowroom />
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
