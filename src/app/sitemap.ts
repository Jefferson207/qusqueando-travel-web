import type { MetadataRoute } from "next";
import { getExperiences } from "@/lib/store";
import { publicPaths, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const experiences = await getExperiences();
  const paths = [...publicPaths, ...experiences
    .filter((experience) => experience.status === "ACTIVE")
    .map((experience) => `/experiencias/${encodeURIComponent(experience.slug)}`)];
  return [...new Set(paths)].map((path) => ({ url: `${siteUrl}${path}` }));
}
