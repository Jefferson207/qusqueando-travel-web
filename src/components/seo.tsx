import { useEffect } from "react";
import { applySeo, type PageSeo } from "@/lib/seo";

/** Título, descripción y canónica de la página (equivalente a `metadata` de Next). */
export function useSeo(page: PageSeo) {
  const { path, title, description, noindex } = page;
  useEffect(() => {
    applySeo({ path, title, description, noindex });
  }, [path, title, description, noindex]);
}

/** Datos estructurados (JSON-LD) de la página. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
