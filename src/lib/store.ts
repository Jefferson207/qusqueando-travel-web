import "server-only";

import { unstable_rethrow } from "next/navigation";

import type { Category, Experience } from "@/lib/data";
import { categories as seedCategories, experiences as seedExperiences } from "@/lib/data";
import { redis, redisKeys } from "@/lib/redis";
import { siteConfig, type SiteConfig } from "@/lib/site";

export type StoredSiteConfig = SiteConfig;

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

    return rows.filter((row): row is Experience => Boolean(row)).sort((a, b) => a.order - b.order);
  } catch (error) {
    unstable_rethrow(error);
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
    if (row) return row;
    if (await isSeeded()) return undefined;
  } catch (error) {
    unstable_rethrow(error);
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
    unstable_rethrow(error);
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
    const stored = await redis.get<Partial<SiteConfig>>(redisKeys.siteConfig);
    return {
      ...siteConfig,
      ...stored,
      socials: { ...siteConfig.socials, ...stored?.socials },
    };
  } catch (error) {
    unstable_rethrow(error);
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
