import type { Experience } from "./data.js";
import { siteConfig } from "./site.js";

export const siteUrl = "https://qusqueandotravel.com";
export const publicPaths = ["/", "/nosotros", "/experiencias", "/contacto", "/politica-de-privacidad", "/politica-de-proteccion-de-datos-personales", "/terminos-y-condiciones", "/medios-de-pago", "/politica-de-cookies", "/afiche-esnna-mincetur", "/libro-de-reclamaciones"];

export type PageSeo = { path: string; title: string; description: string; noindex?: boolean };

const absoluteUrl = (url: string) => (url.startsWith("/") ? `${siteUrl}${url}` : url);

export function pageMetadata(page: PageSeo): PageSeo {
  return page;
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
    noindex: experience.status !== "ACTIVE",
  });
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

/** Actualiza título, descripción, canónica y vista previa al compartir de la página actual. */
export function applySeo({ path, title, description, noindex = false }: PageSeo) {
  const fullTitle = title.endsWith(`| ${siteConfig.name}`) ? title : `${title} | ${siteConfig.name}`;
  document.title = fullTitle;
  setMeta("name", "description", description);
  setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", `${siteUrl}${path}`);
  setMeta("name", "twitter:title", fullTitle);
  setMeta("name", "twitter:description", description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (noindex) {
    canonical?.remove();
  } else {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}${path}`;
  }
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
