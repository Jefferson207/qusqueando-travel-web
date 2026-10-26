import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Clock, Luggage, Plus, Trash2, X } from "lucide-react";
import Image from "@/components/image";
import Link from "@/components/link";
import { useCatalog } from "@/components/site-config-provider";
import { buttonClassName } from "@/components/ui/button";
import type { Experience } from "@/lib/data";
import { money, PRICE_ON_REQUEST } from "@/lib/money";
import { clearCart, removeFromCart, toggleInCart, tripTotals, useCart, useTripOpener } from "@/lib/trip";
import { cn } from "@/lib/utils";

/** Botón "+" de las tarjetas: agrega el paquete a "Mi viaje" (o lo quita si ya está). */
export function AddToTripButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const saved = useCart().includes(slug);
  return (
    <button
      type="button"
      onClick={() => toggleInCart(slug)}
      aria-pressed={saved}
      aria-label={saved ? `Quitar ${name} de mi viaje` : `Agregar ${name} a mi viaje`}
      title={saved ? "En mi viaje" : "Agregar a mi viaje"}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border-2 shadow-sm transition duration-300 hover:-translate-y-0.5",
        saved ? "border-[#3f7d4e] bg-[#3f7d4e] text-white" : "border-[#d69620] bg-white text-[#b6780e] hover:bg-[#d69620] hover:text-white",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={String(saved)} initial={{ scale: 0.4, rotate: -90, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} className="inline-flex">
          {saved ? <Check className="h-5 w-5" strokeWidth={2.5} /> : <Plus className="h-5 w-5" strokeWidth={2.5} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** Panel lateral con los paquetes guardados, el total por persona y el paso a la reserva. */
export function TripDrawer() {
  const [open, setOpen] = useState(false);
  const { experiences } = useCatalog();
  const slugs = useCart();
  const items = slugs.map((slug) => experiences.find((item) => item.slug === slug)).filter((item): item is Experience => !!item);
  const total = tripTotals(items, 1);
  const close = () => setOpen(false);

  useTripOpener(useCallback(() => setOpen(true), []));

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Mi viaje">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-[#021623]/50 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#fbf6ea] shadow-[-20px_0_60px_rgba(2,22,35,.25)]"
          >
            <header className="flex items-center justify-between border-b border-[#efe2c8] bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fdf0dc] text-[#b97a0b]"><Luggage className="h-5 w-5" /></span>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#021623]">Mi viaje</h2>
                  <p className="text-xs text-[#667085]">{items.length ? `${items.length} paquete${items.length !== 1 ? "s" : ""} seleccionado${items.length !== 1 ? "s" : ""}` : "Aún no agregas paquetes"}</p>
                </div>
              </div>
              <button type="button" onClick={close} aria-label="Cerrar" className="grid h-10 w-10 place-items-center rounded-full text-[#475467] transition hover:bg-[#f2ead9]"><X className="h-5 w-5" /></button>
            </header>

            {items.length ? (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto p-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li key={item.slug} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }} className="flex gap-3 rounded-2xl border border-[#efe2c8] bg-white p-2.5 shadow-sm">
                        <Link href={`/experiencias/${item.slug}`} onClick={close} className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                          <Image src={item.mainImage} alt={item.name} fill sizes="96px" className="object-cover" />
                        </Link>
                        <div className="min-w-0 flex-1 py-0.5">
                          <Link href={`/experiencias/${item.slug}`} onClick={close} className="block truncate font-bold text-[#021623] hover:text-[#b97a0b]">{item.name}</Link>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#667085]"><Clock className="h-3 w-3" /> {item.duration}</p>
                          <p className="mt-1.5 text-sm text-[#475467]">
                            {item.priceFrom ? <><b translate="no" className="notranslate text-[#021623]">{money(item.priceFrom, item.currency)}</b> <small>por persona</small></> : <small>{PRICE_ON_REQUEST}</small>}
                          </p>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.slug)} aria-label={`Quitar ${item.name}`} className="grid h-8 w-8 shrink-0 place-items-center self-start rounded-full text-[#98a2b3] transition hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  <li>
                    <Link href="/experiencias" onClick={close} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e9c98a] p-4 text-sm font-semibold text-[#b97a0b] transition hover:bg-white">
                      <Plus className="h-4 w-4" /> Agregar más paquetes
                    </Link>
                  </li>
                </ul>

                <footer className="border-t border-[#efe2c8] bg-white p-5">
                  {total ? (
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-[#475467]">Total por persona<br /><small className="text-xs text-[#98a2b3]">Eliges fecha y viajeros en el siguiente paso</small></span>
                      <b translate="no" className="notranslate font-display text-2xl text-[#021623]">{total}</b>
                    </div>
                  ) : null}
                  <Link href="/reservar?carrito=1" onClick={close} className={buttonClassName("primary", "fx-glow mt-4 h-12 w-full text-base")}>
                    Reservar mi viaje <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <button type="button" onClick={close} className="font-semibold text-[#475467] hover:text-[#021623]">Seguir explorando</button>
                    <button type="button" onClick={clearCart} className="text-[#98a2b3] hover:text-red-600">Vaciar</button>
                  </div>
                </footer>
              </>
            ) : (
              <div className="grid flex-1 place-content-center gap-4 p-8 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fdf0dc] text-[#b97a0b]"><Luggage className="h-8 w-8" /></span>
                <p className="text-[#475467]">Agrega paquetes con el botón <b className="inline-grid h-6 w-6 place-items-center rounded-full border-2 border-[#d69620] align-middle text-[#b6780e]"><Plus className="h-3.5 w-3.5" /></b> y resérvalos todos juntos.</p>
                <Link href="/experiencias" onClick={close} className={buttonClassName("primary", "mx-auto h-11 px-6")}>Ver paquetes <ArrowRight className="h-4 w-4" /></Link>
              </div>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
