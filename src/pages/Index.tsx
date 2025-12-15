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
import MobileBottomNav from "@/components/MobileBottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />

        <section id="about">
          <Quote />
        </section>

        <section id="promise">
          <PromiseGrid />
        </section>

        <ARDemo />

        <section id="collection">
          <div id="products">
            <ProductGallery />
          </div>
        </section>

        <section id="reviews">
          <SocialProof />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />

      {/* Bottom padding for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Index;
