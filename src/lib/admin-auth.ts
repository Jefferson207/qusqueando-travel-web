import "server-only";

import { cookies, headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { redis, redisKeys } from "@/lib/redis";

export const adminCookieName = "qt_admin_session";

const maxLoginAttempts = 5;
const loginWindowSeconds = 60 * 15;

export async function createAdminSession() {
  const token = randomBytes(32).toString("hex");
  await redis.set(redisKeys.adminSession(token), { createdAt: Date.now() }, { ex: 60 * 60 * 8 });

  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  if (token) {
    await redis.del(redisKeys.adminSession(token));
  }
  cookieStore.delete(adminCookieName);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  if (!token) return false;

  try {
    return Boolean(await redis.get(redisKeys.adminSession(token)));
  } catch (error) {
    unstable_rethrow(error);
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

function safeEqual(a: string, b: string) {
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function checkAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;
  // Sin contraseña configurada nadie puede entrar.
  if (!expectedPassword) return false;

  const userOk = safeEqual(username, expectedUser);
  const passwordOk = safeEqual(password, expectedPassword);
  return userOk && passwordOk;
}

async function clientIp() {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

/** Registra un intento de login y devuelve false si la IP superó el límite. */
export async function registerLoginAttempt() {
  const key = redisKeys.loginAttempts(await clientIp());
  const attempts = await redis.incr(key);
  if (attempts === 1) {
    await redis.expire(key, loginWindowSeconds);
  }
  return attempts <= maxLoginAttempts;
}

export async function clearLoginAttempts() {
  await redis.del(redisKeys.loginAttempts(await clientIp()));
}
