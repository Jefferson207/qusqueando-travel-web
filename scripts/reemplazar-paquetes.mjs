// Reemplaza TODOS los paquetes guardados en Redis por los de src/lib/data.ts.
// Antes de borrar guarda un respaldo en respaldos/paquetes-<fecha>.json.
//
// Ejecutar SOLO después de desplegar (las fotos viven en /public/images):
//   node scripts/reemplazar-paquetes.mjs            -> muestra los cambios
//   node scripts/reemplazar-paquetes.mjs --aplicar  -> respalda y reemplaza en Redis
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

const currentSlugs = (await redis("SMEMBERS", indexKey)) ?? [];
const current = [];
for (const slug of currentSlugs) {
  const raw = await redis("GET", experienceKey(slug));
  if (raw) current.push(typeof raw === "string" ? JSON.parse(raw) : raw);
}

console.log(`Se quitan (${current.length}):`);
for (const item of current) console.log(`  - ${item.name} (${item.slug})`);
console.log(`\nSe agregan (${experiences.length}):`);
for (const item of experiences) console.log(`  + ${item.name} (${item.slug})`);

if (!apply) {
  console.log("\nSolo vista previa. Usa --aplicar para guardar.");
  process.exit(0);
}

mkdirSync(new URL("../respaldos/", import.meta.url), { recursive: true });
const backup = new URL(`../respaldos/paquetes-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, import.meta.url);
writeFileSync(backup, JSON.stringify(current, null, 2));
console.log(`\nRespaldo guardado en ${backup.pathname}`);

for (const slug of currentSlugs) {
  await redis("DEL", experienceKey(slug));
  await redis("SREM", indexKey, slug);
}
for (const experience of experiences) {
  await redis("SET", experienceKey(experience.slug), JSON.stringify(experience));
  await redis("SADD", indexKey, experience.slug);
}
console.log("Listo: paquetes reemplazados en Redis.");
