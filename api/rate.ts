import { handle, json } from "./_lib.js";
import { keyPrefix, redis } from "./_redis.js";
import { getSiteConfig } from "./_store.js";

type Live = { usd: number; eur: number; date: string };
const key = `${keyPrefix}:tipo-cambio`;

/** Soles por 1 dólar y por 1 euro del día (se guarda 6 horas; si la consulta falla se usa el último). */
async function liveRates(): Promise<Live & { source: "automatico" | "respaldo" }> {
  const cached = await redis.get<Live>(key).catch(() => null);
  if (cached?.usd) return { ...cached, source: "automatico" };
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(5000) });
    const rates = ((await response.json()) as { rates?: Record<string, number> }).rates ?? {};
    const usd = Number(rates.PEN);
    const eur = usd / Number(rates.EUR);
    if (!(usd > 1 && usd < 10 && eur > 1 && eur < 10)) throw new Error("tipo de cambio fuera de rango");
    const value: Live = { usd: Math.round(usd * 1000) / 1000, eur: Math.round(eur * 1000) / 1000, date: new Date().toISOString() };
    await redis.set(key, value, { ex: 6 * 3600 });
    await redis.set(`${key}:ultimo`, value);
    return { ...value, source: "automatico" };
  } catch (error) {
    console.error("Tipo de cambio", error);
    const last = await redis.get<Live>(`${key}:ultimo`).catch(() => null);
    return { ...(last ?? { usd: 3.75, eur: 4.05, date: new Date().toISOString() }), source: "respaldo" };
  }
}

// Tipo de cambio y % adicional para mostrar precios en dólares (inglés) y euros (italiano).
// Si en /admin se escribió un valor manual, se usa ese.
export const GET = handle(async () => {
  const config = await getSiteConfig();
  const live = await liveRates();
  return json(
    {
      usd: config.fxUsdRate || live.usd,
      eur: config.fxEurRate || live.eur,
      surcharge: config.fxSurcharge || 0,
      live: { usd: live.usd, eur: live.eur, date: live.date, source: live.source },
      manual: { usd: config.fxUsdRate > 0, eur: config.fxEurRate > 0 },
    },
    200,
    { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  );
});
