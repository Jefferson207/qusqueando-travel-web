import { publicPaths, siteUrl } from "../src/lib/seo.js";
import { handle } from "./_lib.js";
import { getPublicExperiences } from "./_store.js";

// Se sirve en /sitemap.xml (ver vercel.json).
export const GET = handle(async () => {
  const experiences = await getPublicExperiences();
  const paths = [
    ...new Set([...publicPaths, ...experiences.map((experience) => `/experiencias/${encodeURIComponent(experience.slug)}`)]),
  ];
  const urls = paths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" },
  });
});
