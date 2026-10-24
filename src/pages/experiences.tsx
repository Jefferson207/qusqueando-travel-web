import { useSeo } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";
import { ExperienceFilters } from "@/components/experience-filters";
import { PageHero } from "@/components/page-hero";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "@/components/site-config-provider";

const seo = pageMetadata({
  path: "/experiencias",
  title: "Experiencias",
  description:
    "Explora experiencias culturales, de naturaleza y arqueoastronómicas en Perú.",
});

export default function ExperiencesPage() {
  useSeo(seo);
  const [searchParams] = useSearchParams();
  const { categories, experiences } = useCatalog();
  const categoria = searchParams.get("categoria") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  return (
    <>
      <PageHero
        image="/images/home/paquetes-hero.webp"
        imageAlt="Machu Picchu bajo el resplandor dorado del atardecer"
        imagePosition="60% center"
        eyebrow="Experiencias"
        title="Tours y paquetes"
        accent="para vivir el Perú"
        description="Cultura, arqueoastronomía, naturaleza, caminatas y viajes privados en un solo catálogo."
      />

      <section className="relative bg-[#fbf6ea] pb-20 pt-8 sm:pt-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(212,149,42,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExperienceFilters key={`${categoria}|${q}`} experiences={experiences} categories={categories} initialQuery={q} initialCategory={categoria} />
        </div>
      </section>
    </>
  );
}
