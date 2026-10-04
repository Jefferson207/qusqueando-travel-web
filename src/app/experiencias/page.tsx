import { pageMetadata } from "@/lib/seo";
import { ExperienceFilters } from "@/components/experience-filters";
import { getCategories, getExperiences } from "@/lib/store";

export const metadata = pageMetadata({
  path: "/experiencias",
  title: "Experiencias",
  description:
    "Explora experiencias culturales, de naturaleza y arqueoastronómicas en Perú.",
});

export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  const [categories, experiences] = await Promise.all([getCategories(), getExperiences()]);

  return (
    <section className="relative overflow-hidden bg-[#f6f3ed] py-16 sm:py-20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_8%,rgba(214,168,79,0.16),transparent_28%),radial-gradient(circle_at_86%_26%,rgba(16,24,40,0.10),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(135deg,#8a621e_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b8872d]">
            Experiencias
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#101828] sm:text-5xl">
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
