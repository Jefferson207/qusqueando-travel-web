import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/admin-ui";
import { convert, type Rates } from "@/lib/money";
import type { SiteConfig } from "@/lib/site";
import { cn, formatCurrency } from "@/lib/utils";

type Live = { usd: number; eur: number; date: string; source: string };

/** Tipo de cambio del día (el mismo que usa la web). */
function useLiveRates() {
  const [live, setLive] = useState<Live | null>(null);
  useEffect(() => {
    fetch("/api/rate")
      .then((response) => response.json())
      .then((data: { live?: Live }) => setLive(data.live ?? null))
      .catch(() => setLive(null));
  }, []);
  return live;
}

/**
 * Precios en inglés (dólares) e italiano (euros), como en Cia Travel:
 * precio convertido con el tipo de cambio del día o uno manual + % adicional.
 * Los valores viajan en el formulario de configuración (campos fxUsdRate, fxEurRate y fxSurcharge).
 */
export function CurrencySettings({ config, sample }: { config: SiteConfig; sample: { price: number; currency: string } }) {
  const live = useLiveRates();
  const [surcharge, setSurcharge] = useState(config.fxSurcharge ?? 0);
  const [usdRate, setUsdRate] = useState(config.fxUsdRate ?? 0);
  const [eurRate, setEurRate] = useState(config.fxEurRate ?? 0);

  const rates: Rates = { usd: usdRate || live?.usd || 0, eur: eurRate || live?.eur || 0, surcharge };
  const usd = convert(sample.price, sample.currency, "USD", rates);
  const eur = convert(sample.price, sample.currency, "EUR", rates);

  const rateField = (label: string, symbol: string, value: number, setValue: (n: number) => void, liveValue?: number, fallback = 3.75) => {
    const manual = value > 0;
    return (
      <div className="grid content-start gap-2">
        <span className="text-sm font-semibold text-[#344054]">{label}</span>
        <div className="inline-flex w-fit rounded-xl border border-[#e4e7ec] bg-[#f9fafb] p-1 text-sm font-semibold">
          {[
            ["Automático del día", !manual, () => setValue(0)],
            ["Manual", manual, () => setValue(liveValue || fallback)],
          ].map(([text, active, onClick]) => (
            <button
              key={String(text)}
              type="button"
              onClick={onClick as () => void}
              className={cn("rounded-lg px-3 py-1.5 transition", active ? "bg-white text-[#021623] shadow-sm" : "text-[#667085] hover:text-[#021623]")}
            >
              {String(text)}
            </button>
          ))}
        </div>
        {manual ? (
          <label className="grid gap-1 text-xs text-[#667085]">
            Soles por 1 {symbol}
            <input type="number" min={1} max={20} step="0.001" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} className="field" />
          </label>
        ) : (
          <span className="text-xs text-[#667085]">
            {liveValue ? `Hoy: S/ ${liveValue.toFixed(3)} por ${symbol} (se actualiza solo varias veces al día).` : "Consultando el tipo de cambio…"}
          </span>
        )}
      </div>
    );
  };

  return (
    <AdminPanel
      title="Precios en dólares y euros"
      description="Cuando un visitante cambia la web a inglés (EN) los precios se muestran en dólares, y en italiano (IT) en euros. En español se muestran en soles (los que cargas en dólares se convierten con el tipo de cambio)."
    >
      <input type="hidden" name="fxUsdRate" value={usdRate} />
      <input type="hidden" name="fxEurRate" value={eurRate} />
      <input type="hidden" name="fxSurcharge" value={surcharge} />
      <div className="grid gap-6 md:grid-cols-3">
        <label className="grid content-start gap-2">
          <span className="text-sm font-semibold text-[#344054]">Porcentaje adicional (%)</span>
          <input type="number" min={0} max={100} step="0.5" value={surcharge} onChange={(e) => setSurcharge(e.target.value === "" ? 0 : Number(e.target.value))} className="field" />
          <span className="text-xs text-[#667085]">Se suma al precio convertido. Ej.: 15 = 15 % más.</span>
        </label>
        {rateField("Tipo de cambio del dólar", "dólar", usdRate, setUsdRate, live?.usd)}
        {rateField("Tipo de cambio del euro", "euro", eurRate, setEurRate, live?.eur, 4.05)}
      </div>
      {rates.usd ? (
        <div className="mt-6 grid gap-2 rounded-2xl border border-dashed border-[#e9c98a] bg-[#fdf6e7] p-4 text-sm text-[#475467] sm:grid-cols-3">
          <span>Ejemplo con un paquete de <b className="text-[#021623]">{formatCurrency(sample.price, sample.currency)}</b></span>
          <span>En inglés: <b className="text-[#067647]">{usd !== null ? formatCurrency(usd, "USD") : "—"}</b></span>
          <span>En italiano: <b className="text-[#175cd3]">{eur !== null ? formatCurrency(eur, "EUR") : "—"}</b> <small>(se redondea hacia arriba)</small></span>
        </div>
      ) : null}
    </AdminPanel>
  );
}
