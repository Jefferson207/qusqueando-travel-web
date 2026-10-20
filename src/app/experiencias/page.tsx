import { pageMetadata } from "@/lib/seo";
import { ExperienceFilters } from "@/components/experience-filters";
import { getCategories, getPublicExperiences } from "@/lib/store";

export const metadata = pageMetadata({
  path: "/experiencias",
  title: "Experiencias",
  description:
    "Explora experiencias culturales, de naturaleza y arqueoastronómicas en Perú.",
});

export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  const [categories, experiences] = await Promise.all([getCategories(), getPublicExperiences()]);

  return (
    <section className="relative overflow-hidden bg-[#faf2e6] py-16 sm:py-20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_8%,rgba(212,149,42,0.16),transparent_28%),radial-gradient(circle_at_86%_26%,rgba(2,22,35,0.10),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(135deg,#8a5a08_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97a0b]">
            Experiencias
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#021623] sm:text-5xl">
            Tours, paquetes y rutas en un solo catálogo.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#667085]">
            Elige entre cultura, arqueoastronomía, naturaleza, caminatas y viajes privados administrados desde un único formulario.
          </p>
        </div>
        <div className="mt-10">
          <ExperienceFilters experiences={experiences} categories={categories} />
        </div>
      </div>
    </section>
  );
}
