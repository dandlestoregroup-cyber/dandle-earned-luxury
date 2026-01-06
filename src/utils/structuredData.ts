import { Product } from '@/types/product';

export const generateProductSchema = (product: Product) => ({
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": product.name,
  "image": product.imageUrl?.startsWith('http') 
    ? [product.imageUrl] 
    : [`https://dandle-earned-luxury.lovable.app${product.imageUrl}`],
  "description": product.tagline,
  "brand": {
    "@type": "Brand",
    "name": "Dandle"
  },
  "offers": {
    "@type": "Offer",
    "url": `https://dandle-earned-luxury.lovable.app/products/${product.id}`,
    "priceCurrency": "EGP",
    "price": product.priceManual || product.price || 0,
    "availability": product.comingSoon 
      ? "https://schema.org/PreOrder" 
      : "https://schema.org/InStock"
  }
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dandle Recliners",
  "url": "https://dandle-earned-luxury.lovable.app",
  "logo": "https://dandle-earned-luxury.lovable.app/favicon.ico",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+20-1222804255",
    "contactType": "customer service",
    "areaServed": "EG",
    "availableLanguage": ["Arabic", "English"]
  }
});

export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "Dandle Recliners",
  "url": "https://dandle-earned-luxury.lovable.app",
  "telephone": "+20-1222804255",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "EG"
  },
  "priceRange": "EGP 21,900 - EGP 90,900"
});
