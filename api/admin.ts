import { handle, json, requireAdmin } from "./_lib.js";
import { getCategories, getExperiences, getSiteConfig, seedRedisIfEmpty } from "./_store.js";

// Todo el contenido (incluidos los borradores) para el panel.
export const GET = handle(async (request) => {
  requireAdmin(request);
  await seedRedisIfEmpty();
  const [experiences, categories, config] = await Promise.all([getExperiences(), getCategories(), getSiteConfig()]);
  return json({ experiences, categories, config });
});
