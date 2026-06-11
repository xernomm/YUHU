import { site } from "@/lib/site";
import { products } from "@/lib/data/products";
import { faqs } from "@/lib/data/content";
import { discountedPrice } from "@/lib/utils";

// schema.org structured data: Organization, WebSite, Product list, FAQPage.
export function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/icons/icon-512.svg`,
      email: site.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Kebon Dua Ratus",
        addressRegion: "Sumatera Selatan",
        postalCode: "30114",
        addressCountry: "ID",
      },
      sameAs: [site.social.instagram, site.social.facebook],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      inLanguage: "id-ID",
    },
    ...products.map((p) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description,
      image: `${site.url}${p.image}`,
      brand: { "@type": "Brand", name: site.shortName },
      offers: {
        "@type": "Offer",
        priceCurrency: "IDR",
        price: discountedPrice(p.price, p.discountPercent),
        availability: "https://schema.org/InStock",
        url: `${site.url}/#produk`,
      },
    })),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
