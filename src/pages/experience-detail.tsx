import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, Clock, MapPin, Mountain, ShieldCheck, Users, X } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import { ExperienceGallery } from "@/components/experience-gallery";
import { MotionSection } from "@/components/motion-section";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { JsonLd, useSeo } from "@/components/seo";
import { useCatalog } from "@/components/site-config-provider";
import { BookingActions } from "@/components/booking-actions";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { api, getToken } from "@/lib/admin-api";
import type { Experience } from "@/lib/data";
import { money } from "@/lib/money";
import { experienceMetadata, experienceSchema } from "@/lib/seo";
import NotFound from "@/pages/not-found";

export default function ExperienceDetailPage() {
  const slug = useParams().slug ?? "";
  const { experiences } = useCatalog();
  const published = experiences.find((item) => item.slug === slug);
  // Los borradores solo los ve el administrador (vista previa).
  const [draft, setDraft] = useState<Experience | null | undefined>(published || !getToken() ? null : undefined);

  useEffect(() => {
    if (published || !getToken()) return;
    let active = true;
    api<{ experience: Experience }>(`/api/experience?slug=${encodeURIComponent(slug)}`)
      .then((data) => active && setDraft(data.experience))
      .catch(() => active && setDraft(null));
    return () => {
      active = false;
    };
  }, [published, slug]);

  const experience = published ?? draft;
  if (draft === undefined && !published) return <div className="min-h-[70vh] bg-[#021623]" />;
  if (!experience) return <NotFound />;
  return <ExperienceView key={experience.slug} experience={experience} experiences={experiences} />;
}

function ExperienceView({ experience, experiences }: { experience: Experience; experiences: Experience[] }) {
  useSeo(experienceMetadata(experience));

  const others = experiences.filter((item) => item.slug !== experience.slug);
  const related = [
    ...others.filter((item) => item.category === experience.category),
    ...others.filter((item) => item.category !== experience.category),
  ].slice(0, 3);

  return (
    <article className="bg-[#fbf6ea]">
      {experience.status === "ACTIVE" && <JsonLd data={experienceSchema(experience)} />}
      <PageHero
        image={experience.mainImage}
        imageAlt={experience.name}
        eyebrow={experience.category}
        title={experience.name}
        description={experience.shortDescription}
      >
        <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
          {[
            [Clock, experience.duration],
            [MapPin, experience.location],
            [Users, experience.modality],
          ].map(([Icon, value]) => (
            <span key={String(value)} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur">
              <Icon className="h-4 w-4 text-[#f3c77a]" />
              {String(value)}
            </span>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <BookingActions experience={experience} dark />
          <p className="text-white/85">
            Desde{" "}
            <span className="font-display text-3xl font-semibold text-white">
              <span translate="no" className="notranslate">{money(experience.priceFrom, experience.currency)}</span>
            </span>{" "}
            <span className="text-sm">por persona</span>
          </p>
        </div>
      </PageHero>

      <section className="relative pb-6 pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExperienceGallery images={experience.gallery} title={experience.name} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-6 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div>
          <MotionSection>
            <div className="rounded-3xl border border-[#efe6d6] bg-white p-6 shadow-[0_14px_40px_rgba(2,22,35,0.06)] sm:p-8">
              <SectionHeading eyebrow="La experiencia" title="Descripción" />
              <p className="mt-4 text-lg leading-8 text-[#475467]">{experience.fullDescription}</p>
            </div>
          </MotionSection>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              [Clock, "Duración", experience.duration],
              [MapPin, "Ubicación", experience.location],
              [Mountain, "Nivel", experience.difficulty],
              [Users, "Modalidad", experience.modality],
            ].map(([Icon, label, value]) => (
              <div
                key={String(label)}
                className="group flex items-center gap-4 rounded-2xl border border-[#efe6d6] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#d4952a]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e9d3a8] bg-[#fdf0dc] text-[#b97a0b] transition group-hover:bg-[#d4952a] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#98a2b3]">{String(label)}</span>
                  <span className="mt-0.5 block font-semibold text-[#021623]">{String(value)}</span>
                </span>
              </div>
            ))}
          </div>

          <DetailSection title="Incluye" items={experience.includes} icon="check" />
          <DetailSection title="No incluye" items={experience.excludes} icon="x" />

          <section className="mt-12">
            <SectionHeading eyebrow="Paso a paso" title="Itinerario" />
            <ol className="relative mt-6 grid gap-4 border-l-2 border-dashed border-[#e9d3a8] pl-6">
              {experience.itinerary.map((item, index) => (
                <li key={`${item.title}-${index}`} className="relative rounded-2xl border border-[#efe6d6] bg-white p-5">
                  <span className="absolute -left-[2.35rem] top-5 flex h-7 w-7 items-center justify-center rounded-full bg-[#d4952a] text-xs font-bold text-[#021623] ring-4 ring-[#fbf6ea]">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-[#021623]">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#667085]">{item.description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12">
            <SectionHeading eyebrow="Dudas" title="Preguntas frecuentes" />
            <div className="mt-6 grid gap-3">
              {experience.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-[#efe6d6] bg-white p-5 open:border-[#d4952a]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#021623]">
                    {faq.question}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fdf0dc] text-[#b97a0b] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#667085]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-[#efe6d6] bg-white p-6 shadow-[0_24px_60px_rgba(2,22,35,0.1)] lg:sticky lg:top-28">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#021623] text-[#e6a93e]">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-[#667085]">Precio desde</p>
              <p className="font-display text-3xl font-semibold text-[#021623]">
                <span translate="no" className="notranslate">{money(experience.priceFrom, experience.currency)}</span>
              </p>
            </div>
          </div>
          <BookingActions experience={experience} className="mt-7 [&>*]:w-full [&>*]:flex-none" />
          {experience.status === "ACTIVE" ? <WhatsAppButton experienceName={experience.name} experienceSlug={experience.slug} className="mt-3 h-11 w-full bg-white text-[#067647] ring-1 ring-[#b7e4c7] hover:bg-[#f0fdf4]" /> : null}
          <p className="mt-4 text-xs leading-5 text-[#667085]">
            Respuesta directa por WhatsApp para confirmar disponibilidad, horarios y modalidad.
          </p>
        </aside>
      </section>

      {related.length ? (
        <section className="relative border-t border-[#efe6d6] bg-[#f6ecdc]/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Sigue explorando" title="Experiencias" accent="relacionadas" />
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ExperienceCard key={item.id} experience={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}

function DetailSection({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: "check" | "x";
}) {
  const Icon = icon === "check" ? Check : X;

  return (
    <section className="mt-8 rounded-3xl border border-[#efe6d6] bg-white p-6 sm:p-8">
      <div>
      <h2 className="font-display text-2xl font-semibold text-[#021623]">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm text-[#475467]">
            <span
              className={
                icon === "check"
                  ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f4f6e3] text-[#6b7316]"
                  : "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fdf0dc] text-[#b97a0b]"
              }
            >
              <Icon className="h-4 w-4" />
            </span>
            {item}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
