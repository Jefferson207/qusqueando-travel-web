import type { MetadataRoute } from "next";
import { getPublicExperiences } from "@/lib/store";
import { publicPaths, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const experiences = await getPublicExperiences();
  const paths = [...publicPaths, ...experiences
    .map((experience) => `/experiencias/${encodeURIComponent(experience.slug)}`)];
  return [...new Set(paths)].map((path) => ({ url: `${siteUrl}${path}` }));
}
