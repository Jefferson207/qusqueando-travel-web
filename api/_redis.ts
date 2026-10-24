import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

// Prefijo de todas las claves de este proyecto en la base compartida de
// Upstash (cada proyecto usa el suyo). Se define con CATALOG_KEY en .env.
export const keyPrefix = process.env.CATALOG_KEY || "qt";

const key = (...parts: string[]) => [keyPrefix, ...parts].join(":");

export const redisKeys = {
  // Se marca al sembrar Redis: desde ahí Redis es la única fuente de verdad
  // y los datos de ejemplo de src/lib/data.ts ya no se usan como respaldo.
  seeded: key("seeded"),
  experiencesIndex: key("experiences", "index"),
  experience: (slug: string) => key("experience", slug),
  categoriesIndex: key("categories", "index"),
  category: (slug: string) => key("category", slug),
  siteConfig: key("site-config"),
  loginAttempts: (ip: string) => key("login-attempts", ip),
  // Solicitudes de reserva (hash código → reserva) y límite de envíos por IP.
  bookings: key("bookings"),
  bookingAttempts: (ip: string) => key("booking-attempts", ip),
};
