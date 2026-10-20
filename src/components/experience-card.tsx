"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Tag } from "lucide-react";
import { IntiSun } from "@/components/icons/inti-sun";
import { motion } from "framer-motion";
import type { Experience } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="surface-card group p-3 transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(2,22,35,0.16)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -left-24 top-10 h-40 w-40 rotate-12 bg-white/40 blur-2xl" />
        <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#d4952a]/70 to-transparent" />
      </div>

      <div className="surface-content relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={experience.mainImage}
          alt={experience.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021623]/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#021623] shadow-sm backdrop-blur">
          <IntiSun className="h-3.5 w-3.5 text-[#b97a0b]" />
          {experience.category}
        </span>
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#021623]/82 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <Clock className="h-3.5 w-3.5 text-[#d4952a]" />
          {experience.duration}
        </span>
      </div>

      <div className="surface-content p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold leading-tight text-[#021623]">{experience.name}</h3>
          <span className="shrink-0 rounded-full bg-[#fdf0dc] px-3 py-1 text-sm font-bold text-[#8a5a08]">
            {formatCurrency(experience.priceFrom, experience.currency)}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667085]">
          {experience.shortDescription}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[#475467]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f4f7] px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-[#b97a0b]" /> {experience.location}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f4f7] px-3 py-2">
            <Tag className="h-3.5 w-3.5 text-[#b97a0b]" /> Desde
          </span>
        </div>
        <Link
          href={`/experiencias/${experience.slug}`}
          className={buttonClassName("secondary", "mt-6 w-full justify-between rounded-2xl")}
        >
          Ver detalle
          <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
