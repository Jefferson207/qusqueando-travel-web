import { pageMetadata } from "@/lib/seo";
import { ExperienceFilters } from "@/components/experience-filters";
import { PageHero } from "@/components/page-hero";
import { getCategories, getPublicExperiences } from "@/lib/store";

export const metadata = pageMetadata({
  path: "/experiencias",
  title: "Experiencias",
  description:
    "Explora experiencias culturales, de naturaleza y arqueoastronómicas en Perú.",
});

export const dynamic = "force-dynamic";

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const [{ categoria, q }, categories, experiences] = await Promise.all([
    searchParams,
    getCategories(),
    getPublicExperiences(),
  ]);

  return (
    <>
      <PageHero
        image="/images/experiencias/valle-sagrado.jpg"
        imageAlt="Valle Sagrado de los Incas"
        eyebrow="Experiencias"
        title="Tours y paquetes"
        accent="para vivir el Perú"
        description="Cultura, arqueoastronomía, naturaleza, caminatas y viajes privados en un solo catálogo."
      />

      <section className="relative bg-[#fbf6ee] pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(212,149,42,0.10),transparent_30%)]" />
        <div className="relative mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExperienceFilters experiences={experiences} categories={categories} initialQuery={q} initialCategory={categoria} />
        </div>
      </section>
    </>
  );
}
