import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroNorthCoast from "@/components/hero/HeroNorthCoast";
import NorthCoastConsultation from "@/components/north-coast/NorthCoastConsultation";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useIsArabic } from "@/hooks/useIsArabic";
import { captureCampaignAttribution, trackCampaign } from "@/lib/campaign";

const setHeadElement = (
  selector: string,
  tagName: "meta" | "link",
  attrs: Record<string, string>,
) => {
  let element = document.head.querySelector(selector);
  const existed = Boolean(element);
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }

  const previous = new Map<string, string | null>();
  Object.keys(attrs).forEach((key) => previous.set(key, element?.getAttribute(key) ?? null));
  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));

  return () => {
    if (!element) return;
    if (!existed) {
      element.remove();
      return;
    }
    previous.forEach((value, key) => {
      if (value === null) element?.removeAttribute(key);
      else element?.setAttribute(key, value);
    });
  };
};

const NorthCoast = () => {
  const isArabic = useIsArabic();

  useEffect(() => {
    captureCampaignAttribution();
    trackCampaign("north_coast_view", { surface: "page" });
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const title = isArabic
      ? "دانديل الساحل الشمالي — قماش صيفي مقاوم للماء"
      : "Dandle North Coast — Waterproof Summer Fabric";
    const description = isArabic
      ? "قماش صيفي مقاوم للماء لكراسي دانديل. استكشف اتجاهات الألوان، اختار الكرسي، وشوفه في أوضتك مع نور."
      : "Waterproof summer fabric for Dandle recliners. Explore colour directions, choose a recliner and see it in your room with Nour.";
    const canonical = "https://dandle-vie.com/north-coast";
    const socialImage = "https://dandle-vie.com/images/complete-set-coastal-modern.jpg";

    document.title = title;
    const cleanups = [
      setHeadElement('meta[name="description"]', "meta", { name: "description", content: description }),
      setHeadElement('link[rel="canonical"]', "link", { rel: "canonical", href: canonical }),
      setHeadElement('meta[property="og:title"]', "meta", { property: "og:title", content: title }),
      setHeadElement('meta[property="og:description"]', "meta", { property: "og:description", content: description }),
      setHeadElement('meta[property="og:url"]', "meta", { property: "og:url", content: canonical }),
      setHeadElement('meta[property="og:type"]', "meta", { property: "og:type", content: "website" }),
      setHeadElement('meta[property="og:image"]', "meta", { property: "og:image", content: socialImage }),
      setHeadElement('meta[name="twitter:card"]', "meta", { name: "twitter:card", content: "summary_large_image" }),
      setHeadElement('meta[name="twitter:title"]', "meta", { name: "twitter:title", content: title }),
      setHeadElement('meta[name="twitter:description"]', "meta", { name: "twitter:description", content: description }),
      setHeadElement('meta[name="twitter:image"]', "meta", { name: "twitter:image", content: socialImage }),
    ];

    return () => {
      document.title = previousTitle;
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
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
