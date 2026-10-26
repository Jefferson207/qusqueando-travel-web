import Image from "@/components/image";
import Link from "@/components/link";
import { ArrowRight, Clock, Flame, Mountain, Users } from "lucide-react";
import { IntiSun } from "@/components/icons/inti-sun";
import { AddToTripButton } from "@/components/trip-drawer";
import type { Experience } from "@/lib/data";
import { money, PRICE_ON_REQUEST } from "@/lib/money";
import { cn } from "@/lib/utils";

export function ExperienceCard({ experience, className }: { experience: Experience; className?: string }) {
  return (
    // El botón "+" va fuera del enlace (no puede haber un botón dentro de un <a>).
    <div className={cn("relative h-full", className)}>
    <Link
      href={`/experiencias/${experience.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-[#efe6d6] bg-white shadow-[0_14px_40px_rgba(2,22,35,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(2,22,35,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4952a]",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={experience.mainImage}
          alt={experience.name}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021623]/40 via-transparent to-transparent" />
        <span className="fx-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#021623]/80 px-3 py-1 text-xs font-semibold text-white shadow backdrop-blur">
          <IntiSun className="h-3.5 w-3.5 text-[#f3c77a]" />
          {experience.category}
        </span>
        {experience.featured ? (
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#c4512b] text-white shadow" title="Destacado">
            <Flame className="h-3.5 w-3.5" />
            <span className="sr-only">Destacado</span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-[#021623]">{experience.name}</h3>
        <p className="mt-1.5 line-clamp-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#b97a0b]">
          {experience.location}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667085]">{experience.shortDescription}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[#475467]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#b97a0b]" /> {experience.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#b97a0b]" /> {experience.modality}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mountain className="h-3.5 w-3.5 text-[#b97a0b]" /> {experience.difficulty}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-[#667085]">{experience.priceFrom ? "Desde" : "Precio"}</p>
            <p className="text-xl font-bold text-[#021623]">
              {experience.priceFrom ? <span translate="no" className="notranslate">{money(experience.priceFrom, experience.currency)}</span> : <span className="text-base">A consultar</span>}
            </p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4952a] text-[#021623] shadow-[0_10px_24px_rgba(212,149,42,0.35)] transition duration-300 group-hover:translate-x-0.5 group-hover:bg-[#b97a0b] group-hover:text-white">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">Ver {experience.name}</span>
          </span>
        </div>
      </div>
    </Link>
    {experience.status === "ACTIVE" ? <AddToTripButton slug={experience.slug} name={experience.name} className="absolute bottom-5 right-[4.25rem] h-11 w-11" /> : null}
    </div>
  );
}
