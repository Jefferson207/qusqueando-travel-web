import { handle, json } from "./_lib.js";
import { getCategories, getPublicExperiences, getSiteConfig } from "./_store.js";

// Contenido público de la web: paquetes publicados, categorías y configuración.
export const GET = handle(async () => {
  const [experiences, categories, config] = await Promise.all([getPublicExperiences(), getCategories(), getSiteConfig()]);
  return json({ experiences, categories, config }, 200, {
    "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
  });
});
