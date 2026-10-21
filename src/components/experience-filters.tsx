"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import type { Category, Experience } from "@/lib/data";

export function ExperienceFilters({
  experiences,
  categories,
  initialQuery = "",
  initialCategory = "Todas",
}: {
  experiences: Experience[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    categories.some((item) => item.name === initialCategory) ? initialCategory : "Todas",
  );

  const filtered = useMemo(() => {
    return experiences.filter((experience) => {
      const matchesQuery = `${experience.name} ${experience.location} ${experience.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = category === "Todas" || experience.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, experiences, query]);

  const hasFilters = query.trim().length > 0 || category !== "Todas";

  function clearFilters() {
    setQuery("");
    setCategory("Todas");
  }

  return (
    <div>
      <div className="relative z-10 grid gap-3 rounded-3xl border border-white/70 bg-white/95 p-3 shadow-[0_30px_80px_rgba(2,22,35,0.16)] backdrop-blur md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, ubicación o categoría"
            className="field h-12 border-transparent bg-[#faf6ef] pl-11"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="field h-12 border-transparent bg-[#faf6ef] font-semibold"
          >
            <option>Todas</option>
            {categories.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d0d5dd] bg-white px-4 text-sm font-semibold text-[#344054] transition hover:bg-[#f6f7f9]"
            >
              <X className="h-4 w-4" />
              Limpiar
            </button>
          ) : null}
        </div>
      </div>
      <p className="mt-10 text-sm text-[#667085]">
        {filtered.length} {filtered.length === 1 ? "experiencia encontrada" : "experiencias encontradas"}
      </p>
      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-[#efe6d6] bg-white p-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-[#021623]">No encontramos experiencias con esos filtros</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#667085]">
            Prueba con otra ubicación, categoría o deja que un asesor te recomiende una ruta disponible.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#021623] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b2a3c]"
          >
            Ver todas las experiencias
          </button>
        </div>
      )}
    </div>
  );
}
