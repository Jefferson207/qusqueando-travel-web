import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Check, Luggage } from "lucide-react";
import Link from "@/components/link";
import { buttonClassName } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import type { Experience } from "@/lib/data";
import { toggleInCart, useCart, useTripParams } from "@/lib/trip";
import { cn } from "@/lib/utils";

/** Botones de la ficha: reservar ahora, guardar en "Mi viaje" y consultar por WhatsApp. */
export function BookingActions({ experience, dark = false, className }: { experience: Experience; dark?: boolean; className?: string }) {
  const cart = useCart();
  const { query } = useTripParams();
  // Los borradores (vista previa del administrador) no se pueden reservar.
  if (experience.status !== "ACTIVE") return <WhatsAppButton experienceName={experience.name} experienceSlug={experience.slug} className={cn("h-12 px-7", className)} />;

  const saved = cart.includes(experience.slug);
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Link href={`/reservar/${encodeURIComponent(experience.slug)}${query}`} className={buttonClassName("primary", "fx-glow h-12 w-full whitespace-nowrap px-7 sm:w-auto")}>
        <CalendarCheck className="h-4 w-4" />
        Reservar ahora
      </Link>
      <button
        type="button"
        onClick={() => toggleInCart(experience.slug)}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border px-6 text-sm font-semibold transition hover:-translate-y-0.5 sm:w-auto",
          dark
            ? saved ? "border-[#e9a93a] bg-[#e9a93a]/20 text-white" : "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            : saved ? "border-[#d4952a] bg-[#fdf6e7] text-[#8a5a08]" : "border-[#e4d5b8] text-[#021623] hover:border-[#d4952a] hover:bg-[#fdf6e7]",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={String(saved)} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="inline-flex">
            {saved ? <Check className="h-4 w-4" /> : <Luggage className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
        {saved ? "En mi viaje" : "Agregar a mi viaje"}
      </button>
    </div>
  );
}
