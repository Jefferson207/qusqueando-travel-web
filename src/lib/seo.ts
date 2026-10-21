import type { Metadata } from "next";
import type { Experience } from "@/lib/data";
import { siteConfig, type SiteConfig } from "@/lib/site";

export const siteUrl = "https://qusqueandotravel.com";
export const publicPaths = ["/", "/nosotros", "/experiencias", "/contacto", "/politica-de-privacidad", "/politica-de-proteccion-de-datos-personales", "/terminos-y-condiciones", "/medios-de-pago", "/politica-de-cookies", "/afiche-esnna-mincetur", "/libro-de-reclamaciones"];

type PageSeo = { path: string; title: string; description: string; image?: string; noindex?: boolean };

const absoluteUrl = (url: string) => (url.startsWith("/") ? `${siteUrl}${url}` : url);

export function pageMetadata({ path, title, description, image = siteConfig.heroImage, noindex = false }: PageSeo): Metadata {
  const fullTitle = title.endsWith(`| ${siteConfig.name}`) ? title : `${title} | ${siteConfig.name}`;
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: noindex ? null : `${siteUrl}${path}` },
    robots: { index: !noindex, follow: true, googleBot: { index: !noindex, follow: true, "max-image-preview": "large" } },
    openGraph: { title: fullTitle, description, url: `${siteUrl}${path}`, siteName: siteConfig.name, locale: "es_PE", type: "website", images: [{ url: absoluteUrl(image), alt: title }] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [{ url: absoluteUrl(image), alt: title }] },
  };
}

export const homeMetadata = pageMetadata({
  path: "/", title: "Tours culturales y experiencias en Perú",
  description: "Descubre Perú con Qusqueando Travel: experiencias culturales, arqueoastronomía y naturaleza desde Cusco. Explora nuestros tours y consulta disponibilidad.",
});

export function experienceMetadata(experience: Experience) {
  return pageMetadata({
    path: `/experiencias/${encodeURIComponent(experience.slug)}`,
    title: experience.seoTitle || experience.name,
    description: experience.seoDescription || experience.shortDescription,
    image: experience.mainImage,
    noindex: experience.status !== "ACTIVE",
  });
}

export function experienceSchema(experience: Experience) {
  const url = `${siteUrl}/experiencias/${encodeURIComponent(experience.slug)}`;
  return {
    "@context": "https://schema.org", "@type": "ItemPage", "@id": `${url}#webpage`,
    url, name: experience.name, description: experience.shortDescription, image: absoluteUrl(experience.mainImage),
    inLanguage: "es-PE", isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#agency` },
    breadcrumb: {
      "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Experiencias", item: `${siteUrl}/experiencias` },
        { "@type": "ListItem", position: 3, name: experience.name, item: url },
      ],
    },
  };
}

export function siteSchema(config: SiteConfig = siteConfig) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "TravelAgency", "@id": `${siteUrl}/#agency`, name: config.name, url: `${siteUrl}/`,
        telephone: config.whatsapp, email: config.email, image: absoluteUrl(config.heroImage), logo: absoluteUrl(config.logoFull),
        address: { "@type": "PostalAddress", addressLocality: "Cusco", addressCountry: "PE" },
        sameAs: Object.values(config.socials).filter(Boolean),
      },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: config.name, url: `${siteUrl}/`,
        inLanguage: "es-PE", publisher: { "@id": `${siteUrl}/#agency` },
      },
    ],
  };
}
