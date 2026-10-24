import { currentLang } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

// Precios según el idioma: en español se muestran como están cargados en el
// panel (USD o PEN); en inglés se convierten a dólares y en italiano a euros,
// con el tipo de cambio del día (o el manual de /admin) + el % adicional.

export type Rates = { usd: number; eur: number; surcharge: number };

const KEY = "qusqueando-tipo-cambio";
const fx: Rates = { usd: 0, eur: 0, surcharge: 0 };

/** Moneda en la que se muestran los precios con el idioma actual (null = la original). */
export function displayCurrency(): "USD" | "EUR" | null {
  const lang = currentLang();
  return lang === "en" ? "USD" : lang === "it" ? "EUR" : null;
}

const formatAmount = (amount: number, currency: string) => {
  const locale = currency === "EUR" ? "it-IT" : currency === "USD" ? "en-US" : "es-PE";
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

/** Convierte un monto (en USD o PEN) a USD o EUR. Sin tipo de cambio devuelve null. */
export function convert(amount: number, from: string, to: "USD" | "EUR", rates: Rates = fx) {
  if (from === to) return amount;
  if (!rates.usd || (to === "EUR" && !rates.eur)) return null;
  const soles = from === "USD" ? amount * rates.usd : from === "EUR" ? amount * rates.eur : amount;
  const target = to === "USD" ? soles / rates.usd : soles / rates.eur;
  return Math.ceil(target * (1 + rates.surcharge / 100));
}

/** Monto en la moneda que corresponde al idioma de la web. */
export function priceIn(amount: number, currency: string) {
  const target = displayCurrency();
  const converted = target ? convert(amount, currency, target) : null;
  return converted === null ? { amount, currency } : { amount: converted, currency: target! };
}

/** Precio listo para mostrar: «USD 289», «US$ 94», «85 €». */
export function money(amount: number, currency: string) {
  // En español se muestra igual que en el panel: «USD 289», «S/ 150».
  if (!displayCurrency()) return formatCurrency(amount, currency);
  const shown = priceIn(amount, currency);
  return formatAmount(shown.amount, shown.currency);
}

/** Suma de varios precios (por persona × viajeros), agrupada por moneda si no se convierte. */
export function moneyTotal(items: { price: number; currency: string }[], people: number) {
  const totals = new Map<string, number>();
  for (const item of items) {
    if (!item.price) continue;
    const shown = priceIn(item.price * people, item.currency);
    totals.set(shown.currency, (totals.get(shown.currency) ?? 0) + shown.amount);
  }
  const format = displayCurrency() ? formatAmount : formatCurrency;
  return [...totals].map(([currency, amount]) => format(amount, currency)).join(" + ");
}

/** Evita que el traductor de Google cambie «US$ 94» por «94 US dollars». */
export const noTranslate = { translate: "no" as const, className: "notranslate" };

/** Solo en inglés o italiano: trae el tipo de cambio (máx. 2,5 s); si falla usa el último guardado. */
export async function loadRates() {
  if (!displayCurrency()) return;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved?.usd) Object.assign(fx, saved);
  } catch {
    // sin almacenamiento
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const data = (await (await fetch("/api/rate", { signal: controller.signal })).json()) as Partial<Rates>;
    if (Number(data.usd) > 1) {
      Object.assign(fx, { usd: Number(data.usd), eur: Number(data.eur) || 0, surcharge: Number(data.surcharge) || 0 });
      try {
        localStorage.setItem(KEY, JSON.stringify(fx));
      } catch {
        // sin almacenamiento
      }
    }
  } catch {
    // se queda con el último conocido
  } finally {
    clearTimeout(timer);
  }
  // Valores de respaldo si nunca se pudo consultar.
  if (!fx.usd) fx.usd = 3.75;
  if (!fx.eur) fx.eur = 4.05;
}
