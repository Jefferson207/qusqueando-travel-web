import { z } from "zod";
import { validEmail, validPhone } from "../src/lib/fields.js";
import { HttpError, parse } from "./_lib.js";
import { redis, redisKeys } from "./_redis.js";
import { getExperience } from "./_store.js";

export const bookingStatuses = ["nueva", "contactado", "confirmada", "cancelada"] as const;

export type BookingItem = { slug: string; name: string; location: string; duration: string; price: number; currency: string };
export type Booking = {
  code: string;
  createdAt: number;
  status: (typeof bookingStatuses)[number];
  experiences: BookingItem[];
  date: string;
  adults: number;
  kids: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
  adminNotes: string;
};

const requestSchema = z.object({
  code: z.string().regex(/^QT-[A-Z0-9]{4,10}$/, "Código de solicitud no válido."),
  experiences: z.array(z.object({ slug: z.string().max(120) })).min(1, "Elige al menos una experiencia.").max(12),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige la fecha de inicio."),
  adults: z.coerce.number().int().min(1).max(20),
  kids: z.coerce.number().int().min(0).max(10),
  name: z.string().trim().min(2, "Escribe tu nombre.").max(120),
  email: z.string().trim().max(160).refine(validEmail, "Escribe un correo válido."),
  phone: z.string().trim().max(30).refine(validPhone, "Escribe un número de WhatsApp válido."),
  country: z.string().trim().max(80).default(""),
  notes: z.string().trim().max(1500).default(""),
});

/** Valida la solicitud y toma nombre y precio de cada paquete del catálogo (no del navegador). */
export async function buildBooking(body: unknown): Promise<Booking> {
  const data = parse(requestSchema, body);
  const experiences: BookingItem[] = [];
  for (const { slug } of data.experiences) {
    const experience = await getExperience(slug);
    if (!experience || experience.status !== "ACTIVE") throw new HttpError(400, "Una de las experiencias elegidas ya no está disponible.");
    experiences.push({
      slug: experience.slug,
      name: experience.name,
      location: experience.location,
      duration: experience.duration,
      price: experience.priceFrom,
      currency: experience.currency,
    });
  }
  const { experiences: _ignored, ...rest } = data;
  return { ...rest, experiences, createdAt: Date.now(), status: "nueva", adminNotes: "" };
}

/** Guarda la reserva; si el código ya existe, le agrega un sufijo. */
export async function saveBooking(booking: Booking) {
  let code = booking.code;
  while (await redis.hexists(redisKeys.bookings, code)) code = `${booking.code}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
  const saved = { ...booking, code };
  await redis.hset(redisKeys.bookings, { [code]: saved });
  return saved;
}

export async function listBookings() {
  const all = (await redis.hgetall<Record<string, Booking>>(redisKeys.bookings)) ?? {};
  return Object.values(all).sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateBooking(body: unknown) {
  const { code, status, adminNotes } = parse(
    z.object({ code: z.string().max(20), status: z.enum(bookingStatuses).optional(), adminNotes: z.string().max(2000).optional() }),
    body,
  );
  const current = await redis.hget<Booking>(redisKeys.bookings, code);
  if (!current) throw new HttpError(404, "La reserva no existe.");
  const updated = { ...current, ...(status ? { status } : {}), ...(adminNotes !== undefined ? { adminNotes } : {}) };
  await redis.hset(redisKeys.bookings, { [code]: updated });
  return updated;
}

export async function deleteBooking(code: string) {
  await redis.hdel(redisKeys.bookings, code);
}

/** Máximo 6 solicitudes por hora desde la misma IP. */
export async function limitBookings(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim().slice(0, 64);
  const key = redisKeys.bookingAttempts(ip);
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 3600);
  if (count > 6) throw new HttpError(429, "Se enviaron varias solicitudes. Inténtalo en una hora o escríbenos por WhatsApp.");
}
