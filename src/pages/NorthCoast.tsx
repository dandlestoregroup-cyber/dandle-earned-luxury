import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroNorthCoast from "@/components/hero/HeroNorthCoast";
import NorthCoastConsultation from "@/components/north-coast/NorthCoastConsultation";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useIsArabic } from "@/hooks/useIsArabic";
import { captureCampaignAttribution, trackCampaign } from "@/lib/campaign";

const ensureMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    el = document.createElement(attrs.rel ? "link" : "meta") as HTMLMetaElement | HTMLLinkElement;
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el?.setAttribute(key, value));
};

const NorthCoast = () => {
  const isArabic = useIsArabic();

  useEffect(() => {
    captureCampaignAttribution();
    trackCampaign("north_coast_view", { surface: "page" });
  }, []);

  useEffect(() => {
    const title = isArabic
      ? "دانديل الساحل الشمالي — قماش صيفي مقاوم للماء"
      : "Dandle North Coast — Waterproof Summer Fabric";
    const description = isArabic
      ? "قماش صيفي مقاوم للماء لكراسي دانديل. استكشف اتجاهات الألوان، اختار الكرسي، وشوفه في أوضتك مع نور."
      : "Waterproof summer fabric for Dandle recliners. Explore colour directions, choose a recliner and see it in your room with Nour.";
    const canonical = "https://dandle-vie.com/north-coast";
    const socialImage = "https://dandle-vie.com/images/complete-set-coastal-modern.jpg";

    document.title = title;
    ensureMeta('meta[name="description"]', { name: "description", content: description });
    ensureMeta('link[rel="canonical"]', { rel: "canonical", href: canonical });
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: socialImage });
    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: socialImage });
  }, [isArabic]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroNorthCoast />
        <NorthCoastConsultation surface="page" />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default NorthCoast;
