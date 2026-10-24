import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Check, ChevronDown, MapPin, Search, Users } from "lucide-react";
import { useCatalog } from "@/components/site-config-provider";
import { buttonClassName } from "@/components/ui/button";
import { Calendar, Counter, Popover, useDismiss } from "@/components/ui/pickers";
import { formatDate, travelersLabel, tripQuery, useTripParams } from "@/lib/trip";
import { cn } from "@/lib/utils";

type Panel = "destination" | "date" | "people" | null;

// Buscador del hero (como en Cia Travel): destino con fotos, calendario y
// viajeros. Lleva al catálogo con los filtros, y la fecha y los viajeros
// pasan luego a la reserva.
export function HomeSearch() {
  const navigate = useNavigate();
  const { experiences, categories } = useCatalog();
  const initial = useTripParams();
  const [destination, setDestination] = useState(initial.destination);
  const [date, setDate] = useState(initial.date);
  const [adults, setAdults] = useState(initial.adults);
  const [kids, setKids] = useState(initial.kids);
  const [panel, setPanel] = useState<Panel>(null);
  const ref = useDismiss<HTMLDivElement>(() => setPanel(null));
  const toggle = (next: Panel) => setPanel(panel === next ? null : next);

  // Solo destinos que tienen paquetes publicados, con su foto.
  const places = categories
    .map((category) => {
      const list = experiences.filter((experience) => experience.category === category.name);
      return { name: category.name, count: list.length, image: list[0]?.mainImage };
    })
    .filter((place) => place.count > 0);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setPanel(null);
    navigate(`/experiencias${tripQuery({ destination, date, adults, kids })}`);
  }

  const trigger = (active: boolean) =>
    cn(
      "flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition md:rounded-full md:px-5",
      active ? "bg-[#fbf3e3]" : "hover:bg-[#faf6ef]",
    );
  const label = "block text-sm font-bold text-[#021623]";
  const value = "block truncate text-xs text-[#667085]";
  const chevron = (active: boolean) => cn("ml-auto h-4 w-4 shrink-0 text-[#b97a0b] transition-transform", active && "rotate-180");

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-2 shadow-[0_24px_60px_rgba(2,22,35,0.28)] md:rounded-full">
      <div ref={ref} className="grid gap-1 md:grid-cols-[1.25fr_1fr_1fr_auto] md:items-center">
        {/* Destino */}
        <div className="relative md:border-r md:border-[#eaecf0]">
          <button type="button" className={trigger(panel === "destination")} onClick={() => toggle("destination")} aria-expanded={panel === "destination"}>
            <MapPin className="h-6 w-6 shrink-0 text-[#c8891a]" />
            <span className="min-w-0"><span className={label}>¿A dónde viajas?</span><span className={value}>{destination || "Todos los destinos"}</span></span>
            <ChevronDown className={chevron(panel === "destination")} />
          </button>
          <Popover open={panel === "destination"} className="left-0 w-[min(22rem,calc(100vw-2.5rem))]">
            <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#b97a0b]">¿A dónde quieres ir?</p>
            <div className="max-h-80 overflow-y-auto">
              {[{ name: "", count: experiences.length, image: undefined as string | undefined }, ...places].map((place) => {
                const selected = destination === place.name;
                return (
                  <button
                    type="button"
                    key={place.name || "todos"}
                    onClick={() => {
                      setDestination(place.name);
                      setPanel("date");
                    }}
                    className={cn("flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#fbf3e3]", selected && "bg-[#fbf3e3]")}
                  >
                    {place.image ? (
                      <img src={place.image} alt="" className="h-11 w-14 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg bg-[#021623] text-[#e9a93a]"><MapPin className="h-5 w-5" /></span>
                    )}
                    <span className="min-w-0 flex-1">
                      <b className="block truncate text-sm">{place.name || "Todos los destinos"}</b>
                      <small className="text-xs text-[#98a2b3]">{place.count} {place.count === 1 ? "experiencia" : "experiencias"}</small>
                    </span>
                    {selected ? <Check className="h-4 w-4 shrink-0 text-[#d4952a]" /> : null}
                  </button>
                );
              })}
            </div>
          </Popover>
        </div>

        {/* Fecha */}
        <div className="relative md:border-r md:border-[#eaecf0]">
          <button type="button" className={trigger(panel === "date")} onClick={() => toggle("date")} aria-expanded={panel === "date"}>
            <CalendarDays className="h-6 w-6 shrink-0 text-[#c8891a]" />
            <span className="min-w-0"><span className={label}>Fecha de viaje</span><span className={value}>{date ? formatDate(date) : "¿Cuándo viajas?"}</span></span>
            <ChevronDown className={chevron(panel === "date")} />
          </button>
          <Popover open={panel === "date"} className="left-0 w-[min(20rem,calc(100vw-2.5rem))] md:left-1/2 md:-translate-x-1/2">
            <Calendar value={date} onChange={(next) => { setDate(next); setPanel("people"); }} />
            <div className="mt-1 flex justify-between border-t border-[#f0e6d3] px-2 pt-2">
              <button type="button" className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#667085] hover:bg-[#faf6ef]" onClick={() => setDate("")}>Fechas flexibles</button>
              <button type="button" className="rounded-full px-3 py-1.5 text-xs font-bold text-[#b97a0b] hover:bg-[#fbf3e3]" onClick={() => setPanel("people")}>Listo</button>
            </div>
          </Popover>
        </div>

        {/* Viajeros */}
        <div className="relative">
          <button type="button" className={trigger(panel === "people")} onClick={() => toggle("people")} aria-expanded={panel === "people"}>
            <Users className="h-6 w-6 shrink-0 text-[#c8891a]" />
            <span className="min-w-0"><span className={label}>Personas</span><span className={value}>{travelersLabel(adults, kids)}</span></span>
            <ChevronDown className={chevron(panel === "people")} />
          </button>
          <Popover open={panel === "people"} className="left-0 w-[min(19rem,calc(100vw-2.5rem))] md:left-auto md:right-0">
            <Counter label="Adultos" hint="13 años o más" value={adults} min={1} max={20} onChange={setAdults} />
            <Counter label="Niños" hint="De 2 a 12 años" value={kids} min={0} max={10} onChange={setKids} />
            <div className="flex justify-end border-t border-[#f0e6d3] px-2 pt-2">
              <button type="button" className="rounded-full px-3 py-1.5 text-xs font-bold text-[#b97a0b] hover:bg-[#fbf3e3]" onClick={() => setPanel(null)}>Listo</button>
            </div>
          </Popover>
        </div>

        <button type="submit" className={buttonClassName("primary", "h-12 rounded-full px-9 text-base")}>
          <Search className="h-5 w-5" />
          Buscar
        </button>
      </div>
    </form>
  );
}
