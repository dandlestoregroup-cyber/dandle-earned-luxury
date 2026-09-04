import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://dandle-vie.com";

type PageMeta = {
  title: string;
  description: string;
};

const PUBLIC_PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Dandle Recliners Egypt | Comfort Crafted for Refined Taste",
    description:
      "Discover Dandle recliners in Egypt, designed around the way you live, work and unwind.",
  },
  "/north-coast": {
    title: "Dandle North Coast | Recliner Comfort for Coastal Living",
    description: "Discover Dandle comfort selected for relaxed North Coast living in Egypt.",
  },
  "/complete-set": {
    title: "Dandle Complete Set | Coordinated Recliner Comfort",
    description: "Explore Dandle coordinated living-room comfort built around reclining seating.",
  },
  "/about": {
    title: "About Dandle | Recliner Comfort in Egypt",
    description: "Meet Dandle and the thinking behind comfort crafted for refined taste.",
  },
  "/warranty": {
    title: "Warranty | Dandle",
    description: "Review Dandle warranty information and the terms that apply to your order.",
  },
  "/delivery": {
    title: "Delivery | Dandle",
    description: "Review Dandle delivery information for recliner orders in Egypt.",
  },
  "/faq": {
    title: "Frequently Asked Questions | Dandle",
    description: "Answers to common questions about Dandle recliners, ordering, delivery and care.",
  },
  "/payment": {
    title: "Payment | Dandle",
    description: "Review Dandle payment information and checkout guidance.",
  },
  "/installation": {
    title: "Installation | Dandle",
    description: "Review Dandle installation information for your recliner order.",
  },
  "/returns": {
    title: "Returns | Dandle",
    description: "Review Dandle return information and the terms that apply to your order.",
  },
  "/contact": {
    title: "Contact Dandle | Recliner Consultation",
    description: "Contact Dandle for product guidance, ordering and recliner support in Egypt.",
  },
};

const setMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const setCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
};

export default function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Product pages own their richer product-specific metadata.
    if (pathname.startsWith("/products/")) return;

    const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    const isPrivateOrTransactional =
      pathname === "/cart" ||
      pathname === "/nour-chat" ||
      pathname === "/backoffice" ||
      pathname.startsWith("/order/");
    const pageMeta = PUBLIC_PAGE_META[pathname];

    setCanonical(canonical);

    if (isPrivateOrTransactional || !pageMeta) {
      document.title = "Dandle";
      setMeta("name", "robots", "noindex,nofollow");
      setMeta("property", "og:url", canonical);
      return;
    }

    document.title = pageMeta.title;
    setMeta("name", "description", pageMeta.description);
    setMeta("name", "robots", "index,follow,max-image-preview:large");
    setMeta("property", "og:title", pageMeta.title);
    setMeta("property", "og:description", pageMeta.description);
    setMeta("property", "og:url", canonical);
    setMeta("name", "twitter:title", pageMeta.title);
    setMeta("name", "twitter:description", pageMeta.description);
  }, [pathname]);

  return null;
}
