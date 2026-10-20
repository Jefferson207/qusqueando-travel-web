import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Clock, MapPin, Mountain, ShieldCheck, Users, X } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import { ExperienceGallery } from "@/components/experience-gallery";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { experiences as seedExperiences } from "@/lib/data";
import { getExperience, getPublicExperiences } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { experienceMetadata, experienceSchema } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seedExperiences.map((experience) => ({ slug: experience.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperience(slug);

  if (!experience || experience.status !== "ACTIVE") {
    return { title: "Experiencia no encontrada", robots: { index: false, follow: true } };
  }

  return experienceMetadata(experience);
}

export const dynamic = "force-dynamic";

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const experience = await getExperience(slug);

  // Los borradores solo los ve el administrador (vista previa).
  if (!experience || (experience.status !== "ACTIVE" && !(await isAdminAuthenticated()))) {
    notFound();
  }

  const others = (await getPublicExperiences()).filter((item) => item.slug !== experience.slug);
  const related = [
    ...others.filter((item) => item.category === experience.category),
    ...others.filter((item) => item.category !== experience.category),
  ].slice(0, 3);

  return (
    <article className="bg-[#fbf4ea]">
      {experience.status === "ACTIVE" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(experienceSchema(experience)).replace(/</g, "\\u003c") }} />}
      <section className="relative overflow-hidden pb-12 pt-10">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_8%,rgba(212,149,42,0.16),transparent_30%),radial-gradient(circle_at_86%_22%,rgba(2,22,35,0.10),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97a0b]">
              {experience.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#021623] sm:text-5xl">{experience.name}</h1>
            <p className="mt-5 text-lg leading-8 text-[#667085]">{experience.shortDescription}</p>
          </div>
          <ExperienceGallery images={experience.gallery} title={experience.name} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div>
          <MotionSection>
            <div className="surface-card p-6 sm:p-8">
              <div className="surface-content">
              <h2 className="text-2xl font-bold text-[#021623]">Descripción</h2>
              <p className="mt-4 text-lg leading-8 text-[#667085]">{experience.fullDescription}</p>
              </div>
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
                className="surface-card surface-hover group p-5"
              >
                <div className="surface-content">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fdf0dc] text-[#b97a0b] transition group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#98a2b3]">
                  {String(label)}
                </p>
                <p className="mt-1 font-semibold text-[#021623]">{String(value)}</p>
                </div>
              </div>
            ))}
          </div>

          <DetailSection title="Incluye" items={experience.includes} icon="check" />
          <DetailSection title="No incluye" items={experience.excludes} icon="x" />

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[#021623]">Itinerario</h2>
            <div className="mt-6 grid gap-4">
              {experience.itinerary.map((item, index) => (
                <div
                  key={item.title}
                  className="surface-card p-5"
                >
                  <div className="surface-content">
                  <p className="text-sm font-semibold text-[#b97a0b]">Día {index + 1}</p>
                  <h3 className="mt-1 font-bold text-[#021623]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[#021623]">Preguntas frecuentes</h2>
            <div className="mt-6 grid gap-4">
              {experience.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="surface-card p-5"
                >
                  <summary className="surface-content cursor-pointer font-semibold text-[#021623]">{faq.question}</summary>
                  <p className="surface-content mt-3 text-sm leading-6 text-[#667085]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="surface-card h-fit p-6 backdrop-blur lg:sticky lg:top-24">
          <div className="surface-content">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#021623] text-[#d4952a]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-[#667085]">Precio desde</p>
              <p className="text-3xl font-bold text-[#021623]">
                {formatCurrency(experience.priceFrom, experience.currency)}
              </p>
            </div>
          </div>
          <WhatsAppButton experienceName={experience.name} experienceSlug={experience.slug} className="mt-7 w-full" />
          <p className="mt-4 text-xs leading-5 text-[#667085]">
            Respuesta directa por WhatsApp para confirmar disponibilidad, horarios y modalidad.
          </p>
          </div>
        </aside>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#021623]">Experiencias relacionadas</h2>
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ExperienceCard key={item.id} experience={item} />
            ))}
          </div>
        </div>
      </section>
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
    <section className="surface-card mt-12 p-6 sm:p-8">
      <div className="surface-content">
      <h2 className="text-2xl font-bold text-[#021623]">{title}</h2>
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
