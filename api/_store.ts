import type { Category, Experience } from "../src/lib/data.js";
import { categories as seedCategories, experiences as seedExperiences } from "../src/lib/data.js";
import experienceImages from "../src/lib/experience-images.json" with { type: "json" };
import { legacySiteDefaults, siteConfig, type SiteConfig } from "../src/lib/site.js";
import { redis, redisKeys } from "./_redis.js";

export type StoredSiteConfig = SiteConfig;

// Imágenes de ejemplo de la primera versión (Unsplash). Si una experiencia
// guardada en Redis aún las usa, se muestran las fotos nuevas de
// experience-images.json. Las imágenes cambiadas desde el admin se respetan.
const legacySeedImages = new Set([
  "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531968455001-5c5272a41129?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1627896157734-4d7d438b0896?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop",
]);
const imagesBySlug: Record<string, string[] | undefined> = experienceImages;

function withCurrentImages(experience: Experience): Experience {
  const images = imagesBySlug[experience.slug];
  if (!images) return experience;
  const mainImage = legacySeedImages.has(experience.mainImage) ? images[0] : experience.mainImage;
  const gallery = experience.gallery.every((url) => legacySeedImages.has(url)) ? images : experience.gallery;
  return mainImage === experience.mainImage && gallery === experience.gallery
    ? experience
    : { ...experience, mainImage, gallery };
}

async function isSeeded() {
  return Boolean(await redis.exists(redisKeys.seeded));
}

export async function getExperiences() {
  try {
    const slugs = await redis.smembers<string[]>(redisKeys.experiencesIndex);
    if (!slugs.length) return (await isSeeded()) ? [] : seedExperiences;

    const rows = await redis.mget<(Experience | null)[]>(
      ...slugs.map((slug) => redisKeys.experience(slug)),
    );

    return rows
      .filter((row): row is Experience => Boolean(row))
      .map(withCurrentImages)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("[store] No se pudo leer experiencias de Redis, usando datos de ejemplo", error);
    return seedExperiences;
  }
}

export async function getPublicExperiences() {
  return (await getExperiences()).filter((experience) => experience.status === "ACTIVE");
}

export async function getExperience(slug: string) {
  try {
    const row = await redis.get<Experience>(redisKeys.experience(slug));
    if (row) return withCurrentImages(row);
    if (await isSeeded()) return undefined;
  } catch (error) {
    console.error(`[store] No se pudo leer la experiencia "${slug}" de Redis`, error);
  }

  return seedExperiences.find((experience) => experience.slug === slug);
}

export async function saveExperience(experience: Experience) {
  await redis.set(redisKeys.experience(experience.slug), experience);
  await redis.sadd(redisKeys.experiencesIndex, experience.slug);
}

export async function deleteExperience(slug: string) {
  await redis.del(redisKeys.experience(slug));
  await redis.srem(redisKeys.experiencesIndex, slug);
}

export async function getCategories() {
  try {
    const slugs = await redis.smembers<string[]>(redisKeys.categoriesIndex);
    if (!slugs.length) return (await isSeeded()) ? [] : seedCategories;

    const rows = await redis.mget<(Category | null)[]>(
      ...slugs.map((slug) => redisKeys.category(slug)),
    );

    return rows
      .filter((row): row is Category => Boolean(row))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  } catch (error) {
    console.error("[store] No se pudo leer categorías de Redis, usando datos de ejemplo", error);
    return seedCategories;
  }
}

export async function saveCategory(category: Category) {
  await redis.set(redisKeys.category(category.slug), category);
  await redis.sadd(redisKeys.categoriesIndex, category.slug);
}

export async function deleteCategory(slug: string) {
  await redis.del(redisKeys.category(slug));
  await redis.srem(redisKeys.categoriesIndex, slug);
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const stored = { ...(await redis.get<Partial<SiteConfig>>(redisKeys.siteConfig)) };
    for (const key of Object.keys(legacySiteDefaults) as (keyof typeof legacySiteDefaults)[]) {
      if (stored[key] === legacySiteDefaults[key]) delete stored[key];
    }
    return {
      ...siteConfig,
      ...stored,
      socials: { ...siteConfig.socials, ...stored?.socials },
    };
  } catch (error) {
    console.error("[store] No se pudo leer la configuración de Redis", error);
    return siteConfig;
  }
}

export async function saveSiteConfig(config: SiteConfig) {
  await redis.set(redisKeys.siteConfig, config);
}

export async function seedRedisIfEmpty() {
  if (await isSeeded()) return;

  const experienceSlugs = await redis.smembers<string[]>(redisKeys.experiencesIndex);
  if (!experienceSlugs.length) {
    await Promise.all(seedExperiences.map((experience) => saveExperience(experience)));
  }

  const categorySlugs = await redis.smembers<string[]>(redisKeys.categoriesIndex);
  if (!categorySlugs.length) {
    await Promise.all(seedCategories.map((category) => saveCategory(category)));
  }

  const config = await redis.get(redisKeys.siteConfig);
  if (!config) {
    await saveSiteConfig(siteConfig);
  }

  await redis.set(redisKeys.seeded, Date.now());
}
