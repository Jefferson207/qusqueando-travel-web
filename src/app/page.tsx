import Image from "next/image";
import Link from "next/link";
import { Award, Handshake, Leaf, Telescope } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import { HomeHero } from "@/components/home-hero";
import { MotionSection } from "@/components/motion-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonClassName } from "@/components/ui/button";
import { getPublicExperiences, getSiteConfig } from "@/lib/store";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata;

const benefits = [
  { title: "Guías especializados", icon: Telescope },
  { title: "Experiencias auténticas", icon: Award },
  { title: "Turismo responsable", icon: Leaf },
  { title: "Atención personalizada", icon: Handshake },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [experiences, config] = await Promise.all([getPublicExperiences(), getSiteConfig()]);
  const featured = experiences.filter((experience) => experience.featured).slice(0, 6);

  return (
    <>
      <HomeHero config={config} />

      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_10%,rgba(212,149,42,0.10),transparent_28%),radial-gradient(circle_at_85%_38%,rgba(2,22,35,0.08),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97a0b]">
                  Experiencias destacadas
                </p>
                <h2 className="mt-3 max-w-3xl text-3xl font-bold text-[#021623] sm:text-4xl">
                  Viajes curados para descubrir el Perú profundo
                </h2>
              </div>
              <Link href="/experiencias" className={buttonClassName("outline")}>
                Ver todas
              </Link>
            </div>
          </MotionSection>
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f6ecdc] py-24">
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(135deg,#8a5a08_1px,transparent_1px),linear-gradient(45deg,#021623_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-4">
            {benefits.map((benefit) => (
              <MotionSection key={benefit.title}>
                <div className="surface-card surface-hover group h-full p-6 backdrop-blur">
                  <div className="surface-content">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#021623] text-[#d4952a] shadow-[0_14px_34px_rgba(2,22,35,0.18)] transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                    <benefit.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-[#021623]">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    Servicio cuidado desde la planificación hasta el cierre de cada recorrido.
                  </p>
                  </div>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#021623] py-24">
        <Image
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1800&auto=format&fit=crop"
          alt="Cielo estrellado sobre paisaje andino"
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(212,149,42,0.28),transparent_30%),linear-gradient(180deg,rgba(2,22,35,0.4),rgba(2,22,35,0.92))]" />
        <MotionSection>
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Reserva una experiencia hecha para mirar el Perú con otros ojos.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#d0d5dd]">
              Te ayudamos a elegir la ruta ideal según tus fechas, ritmo de viaje e intereses culturales.
            </p>
            <WhatsAppButton className="mt-8" />
          </div>
        </MotionSection>
      </section>
    </>
  );
}
