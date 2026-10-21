// Copia los datos de la web desde el prefijo antiguo "qt:" al prefijo de
// CATALOG_KEY (p. ej. "catalogo:qusquea:"). No borra nada y no sobrescribe
// claves que ya existan en el destino. Las sesiones no se copian.
//
//   node scripts/migrar-prefijo.mjs            -> muestra lo que haría
//   node scripts/migrar-prefijo.mjs --aplicar  -> copia los datos
import { readFileSync } from "node:fs";

const apply = process.argv.includes("--aplicar");

const env = { ...process.env };
for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (match && !env[match[1]]) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
}

const from = "qt";
const to = env.CATALOG_KEY;
if (!to || to === from) {
  console.error("Define CATALOG_KEY en .env con un prefijo distinto de 'qt'.");
  process.exit(1);
}

async function redis(...command) {
  const response = await fetch(env.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
    body: JSON.stringify(command),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

const sets = ["experiences:index", "categories:index"];
const experienceSlugs = (await redis("SMEMBERS", `${from}:experiences:index`)) ?? [];
const categorySlugs = (await redis("SMEMBERS", `${from}:categories:index`)) ?? [];
const strings = [
  "site-config",
  "seeded",
  ...experienceSlugs.map((slug) => `experience:${slug}`),
  ...categorySlugs.map((slug) => `category:${slug}`),
];

let copied = 0;
for (const name of [...sets, ...strings]) {
  const source = `${from}:${name}`;
  const target = `${to}:${name}`;
  if (await redis("EXISTS", target)) {
    console.log(`= ${target} ya existe, se deja como está`);
    continue;
  }
  if (sets.includes(name)) {
    const members = (await redis("SMEMBERS", source)) ?? [];
    if (!members.length) continue;
    console.log(`+ ${source} -> ${target} (${members.length} elementos)`);
    if (apply) await redis("SADD", target, ...members);
  } else {
    const value = await redis("GET", source);
    if (value === null) continue;
    console.log(`+ ${source} -> ${target}`);
    if (apply) await redis("SET", target, value);
  }
  copied += 1;
}

console.log(
  apply
    ? `\nListo: ${copied} claves copiadas a "${to}:". Las claves "qt:" originales siguen intactas.`
    : `\nVista previa: se copiarían ${copied} claves. Usa --aplicar para copiarlas.`,
);
