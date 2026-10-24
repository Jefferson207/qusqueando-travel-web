import { slugify } from "../src/lib/utils.js";
import { HttpError, categorySchema, handle, json, parse, readBody, requireAdmin } from "./_lib.js";
import { deleteCategory, getCategories, getExperiences, saveCategory } from "./_store.js";

export const POST = handle(async (request) => {
  requireAdmin(request);
  const name = parse(categorySchema, (await readBody<{ name?: unknown }>(request)).name ?? "");
  const slug = slugify(name);
  if (!slug) throw new HttpError(400, "El nombre debe contener letras o números.");

  const category = { id: slug, name, slug };
  await saveCategory(category);
  return json({ category });
});

export const DELETE = handle(async (request) => {
  requireAdmin(request);
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) throw new HttpError(404, "La categoría no existe.");

  const inUse = (await getExperiences()).filter((experience) => experience.category === category.name);
  if (inUse.length) {
    throw new HttpError(
      409,
      `No se puede eliminar "${category.name}": la usan ${inUse.length} experiencia(s). Cámbialas de categoría primero.`,
    );
  }

  await deleteCategory(slug);
  return json({ ok: true });
});
