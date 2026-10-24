import type { Experience } from "../src/lib/data.js";
import { slugify } from "../src/lib/utils.js";
import { HttpError, experienceSchema, handle, isAllowedImageUrl, json, parse, readBody, requireAdmin } from "./_lib.js";
import { deleteExperience, getCategories, getExperience, saveExperience } from "./_store.js";

const lines = (value: string) =>
  value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

// Un paquete por su slug (también borradores): vista previa del administrador.
export const GET = handle(async (request) => {
  requireAdmin(request);
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  const experience = slug ? await getExperience(slug) : undefined;
  if (!experience) throw new HttpError(404, "El paquete no existe.");
  return json({ experience });
});

// Crea o actualiza un paquete.
export const PUT = handle(async (request) => {
  requireAdmin(request);
  const parsed = parse(experienceSchema, await readBody(request));

  const slug = slugify(parsed.name);
  if (!slug) throw new HttpError(400, "El nombre debe contener letras o números.");

  const categories = await getCategories();
  if (!categories.some((category) => category.name === parsed.category)) {
    throw new HttpError(400, "La categoría elegida no existe.");
  }

  const gallery = parsed.gallery
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (gallery.some((url) => !isAllowedImageUrl(url))) {
    throw new HttpError(400, "Alguna imagen de la galería no es válida: usa el botón Subir o una ruta /images/...");
  }

  const renamed = Boolean(parsed.originalSlug) && parsed.originalSlug !== slug;
  if (!parsed.originalSlug || renamed) {
    const existing = await getExperience(slug);
    if (existing) throw new HttpError(409, `Ya existe una experiencia con el enlace "/experiencias/${slug}". Usa otro nombre.`);
  }

  const previous = parsed.originalSlug ? await getExperience(parsed.originalSlug) : undefined;
  const experience: Experience = {
    id: previous?.id ?? slug,
    name: parsed.name,
    slug,
    category: parsed.category,
    shortDescription: parsed.shortDescription,
    fullDescription: parsed.fullDescription,
    duration: parsed.duration,
    location: parsed.location,
    difficulty: parsed.difficulty,
    modality: parsed.modality,
    priceFrom: parsed.priceFrom,
    currency: parsed.currency,
    mainImage: parsed.mainImage,
    gallery: gallery.length ? gallery : [parsed.mainImage],
    includes: typeof parsed.includes === "string" ? lines(parsed.includes) : parsed.includes.filter(Boolean),
    excludes: typeof parsed.excludes === "string" ? lines(parsed.excludes) : parsed.excludes.filter(Boolean),
    itinerary:
      typeof parsed.itinerary === "string"
        ? lines(parsed.itinerary).map((line) => {
            const [title, ...rest] = line.split(":");
            return { title: title.trim(), description: rest.join(":").trim() || title.trim() };
          })
        : parsed.itinerary.filter((step) => step.title || step.text).map((step) => ({ title: step.title || "Paso", description: step.text || step.title })),
    faqs:
      typeof parsed.faqs === "string"
        ? lines(parsed.faqs).map((line) => {
            const [question, ...rest] = line.split("?");
            return { question: `${question.trim()}?`, answer: rest.join("?").replace(/^[:\s]+/, "").trim() || "Por confirmar." };
          })
        : parsed.faqs
            .filter((faq) => faq.title)
            .map((faq) => ({ question: /[?？]$/.test(faq.title) ? faq.title : `${faq.title}?`, answer: faq.text || "Por confirmar." })),
    status: parsed.status,
    featured: parsed.featured,
    order: parsed.order,
    seoTitle: parsed.seoTitle || `${parsed.name} | Qusqueando Travel`,
    seoDescription: parsed.seoDescription || `Reserva ${parsed.name} con Qusqueando Travel y descubre Perú.`,
  };

  // Guardar primero y borrar después: si algo falla no se pierde la experiencia.
  await saveExperience(experience);
  if (renamed && parsed.originalSlug) await deleteExperience(parsed.originalSlug);

  return json({ experience });
});

export const DELETE = handle(async (request) => {
  requireAdmin(request);
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (slug) await deleteExperience(slug);
  return json({ ok: true });
});
