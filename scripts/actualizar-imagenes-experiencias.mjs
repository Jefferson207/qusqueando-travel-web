// Actualiza mainImage y gallery de las experiencias guardadas en Redis con las
// fotos de src/lib/experience-images.json.
//
// Ejecutar SOLO después de desplegar (las fotos viven en /public/images/experiencias):
//   node scripts/actualizar-imagenes-experiencias.mjs            -> muestra los cambios
//   node scripts/actualizar-imagenes-experiencias.mjs --aplicar  -> los guarda en Redis
import { readFileSync } from "node:fs";

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

const images = JSON.parse(readFileSync(new URL("../src/lib/experience-images.json", import.meta.url), "utf8"));

for (const [slug, gallery] of Object.entries(images)) {
  const key = `qt:experience:${slug}`;
  const raw = await redis("GET", key);
  if (!raw) {
    console.log(`- ${slug}: no está en Redis, se omite`);
    continue;
  }
  const experience = typeof raw === "string" ? JSON.parse(raw) : raw;
  console.log(`- ${slug}: ${experience.mainImage} -> ${gallery[0]}`);
  if (apply) {
    await redis("SET", key, JSON.stringify({ ...experience, mainImage: gallery[0], gallery }));
  }
}

console.log(apply ? "\nListo: imágenes actualizadas en Redis." : "\nSolo vista previa. Usa --aplicar para guardar.");
