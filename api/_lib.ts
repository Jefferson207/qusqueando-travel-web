import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { isAllowedImageUrl } from "../src/lib/image-hosts.js";
import { currencies } from "../src/lib/utils.js";
import { redis, redisKeys } from "./_redis.js";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const env = (key: string) => process.env[key] || "";

export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

/** Envuelve un handler para devolver siempre mensajes de error entendibles en JSON. */
export function handle(fn: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      return await fn(request);
    } catch (error) {
      if (error instanceof HttpError) return json({ message: error.message }, error.status);
      console.error(error);
      return json({ message: "Ocurrió un error inesperado en el servidor. Inténtalo de nuevo." }, 500);
    }
  };
}

export async function readBody<T = Record<string, unknown>>(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") throw new HttpError(400, "No se recibió contenido para guardar.");
  return body as T;
}

/** Valida con zod y responde 400 con el primer mensaje de error. */
export function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) throw new HttpError(400, result.error.issues[0]?.message ?? "Datos inválidos.");
  return result.data;
}

// --- Sesión del administrador: token firmado con SESSION_SECRET (8 horas) ---

const sign = (value: string) => createHmac("sha256", env("SESSION_SECRET")).update(value).digest("base64url");
const sameText = (a: string, b: string) =>
  timingSafeEqual(createHmac("sha256", "cmp").update(a).digest(), createHmac("sha256", "cmp").update(b).digest());

export function createSession(username: string) {
  if (env("SESSION_SECRET").length < 32) throw new HttpError(500, "Falta configurar SESSION_SECRET en el servidor.");
  const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isAdmin(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const [payload, signature] = token.split(".");
  if (!payload || !signature || env("SESSION_SECRET").length < 32 || !sameText(signature, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.u === (env("ADMIN_USERNAME") || "admin") && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(request: Request) {
  if (!isAdmin(request)) throw new HttpError(401, "Tu sesión expiró. Vuelve a iniciar sesión.");
}

export function checkCredentials(username: string, password: string) {
  const expectedUser = env("ADMIN_USERNAME") || "admin";
  const expectedPassword = env("ADMIN_PASSWORD");
  // Sin contraseña configurada nadie puede entrar.
  if (!expectedPassword) throw new HttpError(500, "Falta configurar el usuario administrador en el servidor.");
  const userOk = sameText(username, expectedUser);
  const passwordOk = sameText(password, expectedPassword);
  return userOk && passwordOk;
}

const maxLoginAttempts = 5;
const loginWindowSeconds = 60 * 15;

const clientIp = (request: Request) =>
  (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown").split(",")[0].trim().slice(0, 64);

/** Registra un intento de login y lanza 429 si la IP superó el límite. */
export async function registerLoginAttempt(request: Request) {
  const key = redisKeys.loginAttempts(clientIp(request));
  const attempts = await redis.incr(key);
  if (attempts === 1) await redis.expire(key, loginWindowSeconds);
  if (attempts > maxLoginAttempts) {
    throw new HttpError(429, "Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo.");
  }
}

export async function clearLoginAttempts(request: Request) {
  await redis.del(redisKeys.loginAttempts(clientIp(request)));
}

// --- Validaciones del panel ---

const imageUrl = z
  .string()
  .trim()
  .refine(isAllowedImageUrl, "Imagen no válida: súbela con el botón Subir o usa una ruta /images/...");

export const experienceSchema = z.object({
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
  includes: z.union([z.string(), z.array(z.string().trim().max(200)).max(40)]),
  excludes: z.union([z.string(), z.array(z.string().trim().max(200)).max(40)]),
  itinerary: z.union([z.string(), z.array(z.object({ title: z.string().trim().max(140), text: z.string().trim().max(2000) })).max(40)]),
  faqs: z.union([z.string(), z.array(z.object({ title: z.string().trim().max(300), text: z.string().trim().max(2000) })).max(40)]),
  status: z.enum(["ACTIVE", "DRAFT"]),
  featured: z.boolean(),
  order: z.coerce.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const categorySchema = z
  .string()
  .trim()
  .min(2, "El nombre de la categoría debe tener al menos 2 caracteres.")
  .max(60, "El nombre de la categoría es demasiado largo.");

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), `El enlace de ${label} debe empezar con https://`);

export const siteConfigSchema = z.object({
  name: z.string().trim().min(2, "Indica el nombre de la empresa."),
  whatsappDisplay: z.string().trim().min(6, "Indica el número de WhatsApp."),
  email: z.email("El correo no es válido."),
  address: z.string().trim().min(2, "Indica la dirección."),
  heroTitle: z.string().trim().min(5, "El título de la portada es muy corto."),
  heroSubtitle: z.string().trim().min(5, "El subtítulo de la portada es muy corto."),
  heroImage: imageUrl,
  aboutImage: imageUrl,
  logoMark: imageUrl,
  logoFull: imageUrl,
  instagram: optionalUrl("Instagram"),
  facebook: optionalUrl("Facebook"),
  tiktok: optionalUrl("TikTok"),
  youtube: optionalUrl("YouTube"),
  // Opcionales: si no llegan se conserva el valor guardado.
  fxUsdRate: z.coerce.number().min(0).max(20, "El tipo de cambio del dólar no es válido.").optional(),
  fxEurRate: z.coerce.number().min(0).max(20, "El tipo de cambio del euro no es válido.").optional(),
  fxSurcharge: z.coerce.number().min(0).max(100, "El porcentaje adicional debe estar entre 0 y 100.").optional(),
});

export { isAllowedImageUrl };
