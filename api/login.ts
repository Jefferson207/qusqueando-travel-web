import { HttpError, checkCredentials, clearLoginAttempts, createSession, handle, json, readBody, registerLoginAttempt } from "./_lib.js";
import { seedRedisIfEmpty } from "./_store.js";

export const POST = handle(async (request) => {
  const body = await readBody<{ username?: unknown; password?: unknown }>(request);
  const username = typeof body.username === "string" ? body.username.trim().slice(0, 100) : "";
  const password = typeof body.password === "string" ? body.password.slice(0, 256) : "";
  if (!username || !password) throw new HttpError(400, "Escribe tu usuario y tu contraseña.");

  await registerLoginAttempt(request);
  if (!checkCredentials(username, password)) throw new HttpError(401, "Usuario o contraseña incorrectos.");

  await clearLoginAttempts(request);
  await seedRedisIfEmpty();
  return json({ token: createSession(username) });
});
