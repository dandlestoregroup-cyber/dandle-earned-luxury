import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Quote from "@/components/Quote";
import ProductGallery from "@/components/ProductGallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Partners from "@/components/Partners";
import CollectionIntro from "@/components/CollectionIntro";
import TrustBlock from "@/components/TrustBlock";
import GiftOfComfort from "@/components/GiftOfComfort";
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/utils/structuredData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(generateOrganizationSchema())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(generateLocalBusinessSchema())}
        </script>
      </Helmet>
      <Navigation />
      <main>
        <Hero />
        <Quote />
        <CollectionIntro />
        <div id="products">
          <ProductGallery />
        </div>
        <GiftOfComfort />
        <TrustBlock />
        <Partners />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
