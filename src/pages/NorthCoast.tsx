import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroNorthCoast from "@/components/hero/HeroNorthCoast";
import NorthCoastConsultation from "@/components/north-coast/NorthCoastConsultation";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useLang } from "@/hooks/useBilingualText";
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
  const { isArabic } = useLang();

  useEffect(() => {
    captureCampaignAttribution();
    trackCampaign("north_coast_view", { surface: "page" });
  }, []);

  useEffect(() => {
    const title = isArabic
      ? "دانديل الساحل الشمالي — أقمشة صيفية مقاومة للماء"
      : "Dandle North Coast — Waterproof Summer Fabrics";
    const description = isArabic
      ? "أقمشة صيفية مقاومة للماء لكراسي دانديل مع لوحة ألوان ساحلية مختارة. اختار اتجاه اللون ولاقي الكرسي المناسب."
      : "Waterproof summer fabrics for Dandle recliners with a curated coastal palette. Choose a colour direction and find your recliner.";
    const canonical = "https://dandle-vie.com/north-coast";

    document.title = title;
    ensureMeta('meta[name="description"]', { name: "description", content: description });
    ensureMeta('link[rel="canonical"]', { rel: "canonical", href: canonical });
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: "https://dandle-vie.com/images/complete-set-coastal-modern.jpg" });
    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: "https://dandle-vie.com/images/complete-set-coastal-modern.jpg" });
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
