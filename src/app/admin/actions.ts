"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  checkAdminCredentials,
  clearLoginAttempts,
  createAdminSession,
  destroyAdminSession,
  registerLoginAttempt,
  requireAdmin,
} from "@/lib/admin-auth";
import type { Experience } from "@/lib/data";
import { isAllowedImageUrl } from "@/lib/image-hosts";
import {
  deleteCategory,
  deleteExperience,
  getCategories,
  getExperience,
  getExperiences,
  getSiteConfig,
  saveCategory,
  saveExperience,
  saveSiteConfig,
  seedRedisIfEmpty,
} from "@/lib/store";
import { currencies, slugify } from "@/lib/utils";

function fail(path: string, message: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}error=${encodeURIComponent(message)}`);
}

function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Datos inválidos.";
}

const imageUrl = z
  .string()
  .trim()
  .refine(isAllowedImageUrl, "La imagen debe ser una URL https de Cloudinary, Unsplash o qusqueandotravel.com.");

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function loginAdmin(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/login?error=1");

  if (!(await registerLoginAttempt())) {
    redirect("/admin/login?error=bloqueado");
  }

  if (!checkAdminCredentials(parsed.data.username, parsed.data.password)) {
    redirect("/admin/login?error=1");
  }

  await clearLoginAttempts();
  await seedRedisIfEmpty();
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await destroyAdminSession();
  redirect("/admin/login");
}

const experienceSchema = z.object({
  originalSlug: z.string().optional(),
  mainImage: imageUrl,
  gallery: z.string(),
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres."),
  category: z.string().min(1, "Elige una categoría."),
  shortDescription: z.string().trim().min(10, "La descripción corta debe tener al menos 10 caracteres."),
  fullDescription: z.string().trim().min(20, "La descripción completa debe tener al menos 20 caracteres."),
  duration: z.string().trim().min(1, "Indica la duración."),
  location: z.string().trim().min(1, "Indica la ubicación."),
  difficulty: z.string().trim().min(1, "Indica el nivel."),
  modality: z.string().trim().min(1, "Indica la modalidad."),
  priceFrom: z.coerce.number().min(0, "El precio no puede ser negativo."),
  currency: z.enum(currencies, "Moneda no válida."),
  includes: z.string(),
  excludes: z.string(),
  itinerary: z.string(),
  faqs: z.string(),
  status: z.enum(["ACTIVE", "DRAFT"]),
  featured: z.boolean(),
  order: z.coerce.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const lines = (value: string) =>
  value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

export async function upsertExperience(formData: FormData) {
  await requireAdmin();
  const originalSlug = String(formData.get("originalSlug") ?? "");
  const backTo = originalSlug
    ? `/admin/experiencias?edit=${encodeURIComponent(originalSlug)}`
    : "/admin/experiencias";

  const result = experienceSchema.safeParse({
    ...Object.fromEntries(formData),
    featured: formData.get("featured") === "on",
  });
  if (!result.success) fail(backTo, firstIssue(result.error));
  const parsed = result.data;

  const slug = slugify(parsed.name);
  if (!slug) fail(backTo, "El nombre debe contener letras o números.");

  const categories = await getCategories();
  if (!categories.some((category) => category.name === parsed.category)) {
    fail(backTo, "La categoría elegida no existe.");
  }

  const gallery = parsed.gallery
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (gallery.some((url) => !isAllowedImageUrl(url))) {
    fail(backTo, "Todas las imágenes de la galería deben ser URLs https de Cloudinary, Unsplash o qusqueandotravel.com.");
  }

  const renamed = Boolean(parsed.originalSlug) && parsed.originalSlug !== slug;
  if (!parsed.originalSlug || renamed) {
    const existing = await getExperience(slug);
    if (existing) fail(backTo, `Ya existe una experiencia con el enlace "/experiencias/${slug}". Usa otro nombre.`);
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
    includes: lines(parsed.includes),
    excludes: lines(parsed.excludes),
    itinerary: lines(parsed.itinerary).map((line) => {
      const [title, ...rest] = line.split(":");
      return { title: title.trim(), description: rest.join(":").trim() || title.trim() };
    }),
    faqs: lines(parsed.faqs).map((line) => {
      const [question, ...rest] = line.split("?");
      return {
        question: `${question.trim()}?`,
        answer: rest.join("?").replace(/^[:\s]+/, "").trim() || "Por confirmar.",
      };
    }),
    status: parsed.status,
    featured: parsed.featured,
    order: parsed.order,
    seoTitle: parsed.seoTitle || `${parsed.name} | Qusqueando Travel`,
    seoDescription:
      parsed.seoDescription ||
      `Reserva ${parsed.name} con Qusqueando Travel y descubre Perú.`,
  };

  // Guardar primero y borrar después: si algo falla no se pierde la experiencia.
  await saveExperience(experience);
  if (renamed && parsed.originalSlug) {
    await deleteExperience(parsed.originalSlug);
    revalidatePath(`/experiencias/${parsed.originalSlug}`);
  }

  revalidatePath("/");
  revalidatePath("/experiencias");
  revalidatePath(`/experiencias/${slug}`);
  redirect("/admin/experiencias?saved=1");
}

export async function removeExperience(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (slug) await deleteExperience(slug);
  revalidatePath("/");
  revalidatePath("/experiencias");
  revalidatePath(`/experiencias/${slug}`);
  redirect("/admin/experiencias?saved=1");
}

const categorySchema = z
  .string()
  .trim()
  .min(2, "El nombre de la categoría debe tener al menos 2 caracteres.")
  .max(60, "El nombre de la categoría es demasiado largo.");

export async function upsertCategory(formData: FormData) {
  await requireAdmin();
  const result = categorySchema.safeParse(formData.get("name") ?? "");
  if (!result.success) fail("/admin/categorias", firstIssue(result.error));

  const name = result.data;
  const slug = slugify(name);
  if (!slug) fail("/admin/categorias", "El nombre debe contener letras o números.");

  await saveCategory({ id: slug, name, slug });
  revalidatePath("/experiencias");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias?saved=1");
}

export async function removeCategory(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) fail("/admin/categorias", "La categoría no existe.");

  const inUse = (await getExperiences()).filter((experience) => experience.category === category.name);
  if (inUse.length) {
    fail(
      "/admin/categorias",
      `No se puede eliminar "${category.name}": la usan ${inUse.length} experiencia(s). Cámbialas de categoría primero.`,
    );
  }

  await deleteCategory(slug);
  revalidatePath("/experiencias");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias?saved=1");
}

const siteConfigSchema = z.object({
  name: z.string().trim().min(2, "Indica el nombre de la empresa."),
  whatsappDisplay: z.string().trim().min(6, "Indica el WhatsApp visible."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, "El WhatsApp técnico debe tener solo dígitos con código de país, por ejemplo +51916788768."),
  email: z.email("El correo no es válido."),
  address: z.string().trim().min(2, "Indica la dirección."),
  heroTitle: z.string().trim().min(5, "El texto del hero es muy corto."),
  heroSubtitle: z.string().trim().min(5, "El subtítulo del hero es muy corto."),
  heroImage: imageUrl,
});

export async function updateSiteConfig(formData: FormData) {
  await requireAdmin();
  const result = siteConfigSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) fail("/admin/configuracion", firstIssue(result.error));

  const current = await getSiteConfig();
  await saveSiteConfig({ ...current, ...result.data });
  revalidatePath("/", "layout");
  redirect("/admin/configuracion?saved=1");
}
