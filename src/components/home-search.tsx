"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { useSiteConfig } from "@/components/site-config-provider";
import { buttonClassName } from "@/components/ui/button";
import { whatsappMessages, whatsappMessageUrl } from "@/lib/site";

const travelerOptions = ["1 viajero", "2 viajeros", "3 viajeros", "4 viajeros", "5 viajeros", "6 o más viajeros"];

function formatDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

// Buscador del hero: arma una consulta de disponibilidad por WhatsApp con el
// destino, la fecha y la cantidad de viajeros elegidos.
export function HomeSearch({ destinations }: { destinations: string[] }) {
  const siteConfig = useSiteConfig();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState(travelerOptions[1]);
  const today = new Date().toISOString().slice(0, 10);

  const href = whatsappMessageUrl(
    siteConfig.whatsapp,
    whatsappMessages.availability(destination, formatDate(date), travelers),
  );

  const fieldClass =
    "w-full bg-transparent text-sm font-semibold text-[#021623] outline-none placeholder:text-[#98a2b3]";

  return (
    <div className="rounded-3xl border border-white/70 bg-white/95 p-3 shadow-[0_30px_80px_rgba(2,22,35,0.18)] backdrop-blur">
      <div className="grid gap-2 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-center">
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-[#faf2e6] md:border-r md:border-[#eaecf0] md:rounded-none">
          <MapPin className="h-5 w-5 shrink-0 text-[#b97a0b]" />
          <span className="grid w-full gap-0.5">
            <span className="text-xs font-medium text-[#667085]">¿A dónde quieres ir?</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)} className={fieldClass}>
              <option value="">Destinos en Perú</option>
              {destinations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-[#faf2e6] md:border-r md:border-[#eaecf0] md:rounded-none">
          <CalendarDays className="h-5 w-5 shrink-0 text-[#b97a0b]" />
          <span className="grid w-full gap-0.5">
            <span className="text-xs font-medium text-[#667085]">¿Cuándo?</span>
            <input type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass} />
          </span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-[#faf2e6]">
          <Users className="h-5 w-5 shrink-0 text-[#b97a0b]" />
          <span className="grid w-full gap-0.5">
            <span className="text-xs font-medium text-[#667085]">¿Cuántos viajeros?</span>
            <select value={travelers} onChange={(event) => setTravelers(event.target.value)} className={fieldClass}>
              {travelerOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </span>
        </label>
        <a href={href} target="_blank" rel="noreferrer" className={buttonClassName("primary", "h-14 rounded-2xl px-7")}>
          Consultar disponibilidad
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
