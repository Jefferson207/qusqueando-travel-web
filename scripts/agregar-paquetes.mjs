// Agrega a Redis los paquetes de src/lib/data.ts que todavía no existen allí.
// No modifica ni borra los paquetes ya guardados (ni lo editado desde el admin).
//
// Ejecutar después de desplegar (las fotos viven en /public/images):
//   node scripts/agregar-paquetes.mjs            -> muestra qué se agregaría
//   node scripts/agregar-paquetes.mjs --aplicar  -> los guarda en Redis
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const apply = process.argv.includes("--aplicar");

function loadEnv() {
  const env = {};
  for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = { ...loadEnv(), ...process.env };
const url = env.UPSTASH_REDIS_REST_URL;
const token = env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error("Faltan UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN en .env");
  process.exit(1);
}

async function redis(...command) {
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// data.ts es TypeScript: Vite lo carga sin compilar el proyecto.
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const { experiences } = await vite.ssrLoadModule("/src/lib/data.ts");
await vite.close();

const prefix = env.CATALOG_KEY || "qt";
const indexKey = `${prefix}:experiences:index`;
const experienceKey = (slug) => `${prefix}:experience:${slug}`;

const currentSlugs = new Set((await redis("SMEMBERS", indexKey)) ?? []);
const missing = experiences.filter((item) => !currentSlugs.has(item.slug));

console.log(`Ya están en Redis: ${currentSlugs.size}`);
console.log(`Se agregan (${missing.length}):`);
for (const item of missing) console.log(`  + ${item.name} (${item.slug})`);

if (!apply || !missing.length) {
  if (!apply) console.log("\nSolo vista previa. Usa --aplicar para guardar.");
  process.exit(0);
}

for (const experience of missing) {
  await redis("SET", experienceKey(experience.slug), JSON.stringify(experience));
  await redis("SADD", indexKey, experience.slug);
}
console.log("Listo: paquetes agregados en Redis.");
