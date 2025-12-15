import { Helmet } from "react-helmet-async";

interface ProductSEOProps {
  title: string;
  subtitle: string;
  handle: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  heroImageSrc: string;
  currency?: string;
  isAvailable?: boolean;
}

export const ProductSEO = ({
  title,
  subtitle,
  handle,
  basePrice,
  rating,
  reviewCount,
  heroImageSrc,
  currency = "EGP",
  isAvailable = true
}: ProductSEOProps) => {
  const siteUrl = "https://dandle-earned-luxury.lovable.app";
  const productUrl = `${siteUrl}/product/${handle}`;
  const imageUrl = heroImageSrc.startsWith("http") 
    ? heroImageSrc 
    : `${siteUrl}${heroImageSrc}`;
  
  const formattedPrice = new Intl.NumberFormat("en-EG").format(basePrice);
  
  const pageTitle = `${title} - ${subtitle} | Dandle Egypt`;
  const metaDescription = `${title}: ${subtitle}. From ${currency} ${formattedPrice}. Free delivery across Egypt. 2-year warranty. Handcrafted premium recliner.`;

  // Schema.org Product structured data
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: title,
    image: imageUrl,
    description: `${subtitle}. Handcrafted premium recliner with ergonomic design.`,
    brand: {
      "@type": "Brand",
      name: "Dandle"
    },
    offers: {
      "@type": "Offer",
      price: basePrice,
      priceCurrency: currency,
      availability: isAvailable 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: "Dandle Store Group"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={productUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={productUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Dandle Recliners" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={productUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Product specific meta */}
      <meta property="product:price:amount" content={String(basePrice)} />
      <meta property="product:price:currency" content={currency} />
      <meta property="product:availability" content={isAvailable ? "in stock" : "out of stock"} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
