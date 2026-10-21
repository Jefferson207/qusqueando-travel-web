import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { HomeHero } from "@/components/home-hero";
import { HomeSearch } from "@/components/home-search";
import { MotionSection } from "@/components/motion-section";
import { getCategories, getPublicExperiences, getSiteConfig } from "@/lib/store";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata;

export const dynamic = "force-dynamic";

const benefits = [
  { title: "Experiencias auténticas", text: "Conecta con la cultura viva", icon: Leaf },
  { title: "Guías locales expertos", text: "Pasión y conocimiento del territorio", icon: UsersRound },
  { title: "Turismo responsable", text: "Respeto por las comunidades", icon: ShieldCheck },
  { title: "Experiencias únicas", text: "Diseñadas a tu medida", icon: Sparkles },
];

export default async function Home() {
  const [experiences, categories, config] = await Promise.all([
    getPublicExperiences(),
    getCategories(),
    getSiteConfig(),
  ]);

  const featured = experiences.filter((experience) => experience.featured);
  const carousel = (featured.length >= 4 ? featured : experiences).slice(0, 10);
  const locations = [...new Set(experiences.map((experience) => experience.location))];

  return (
    <>
      <HomeHero config={config} />

      <div className="bg-[#fbf6ee]">
        <div className="relative z-10 mx-auto -mt-10 max-w-5xl px-4 sm:-mt-16 sm:px-6 lg:-mt-20 lg:px-8">
          <HomeSearch destinations={[...new Set([...categories.map((category) => category.name), ...locations])]} />
        </div>

        <section aria-label="Por qué viajar con nosotros" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <MotionSection key={benefit.title} delay={index * 0.12}>
              <div className="group flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#e9d3a8] bg-white text-[#b97a0b] shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:rotate-6 group-hover:border-[#d4952a] group-hover:bg-[#d4952a] group-hover:text-white">
                  <benefit.icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="block font-semibold text-[#021623]">{benefit.title}</span>
                  <span className="block text-sm text-[#667085]">{benefit.text}</span>
                </span>
              </div>
              </MotionSection>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden pb-20 pt-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_40%,rgba(212,149,42,0.10),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FeaturedCarousel experiences={carousel} />
          </div>
        </section>
      </div>

      <section className="relative isolate overflow-hidden bg-[#06201f] text-white">
        <div className="relative isolate flex min-h-[640px] items-center lg:min-h-[78vh]">
          <Image
            src={config.aboutImage}
            alt="Viajera con poncho andino contemplando Machu Picchu al amanecer"
            fill
            sizes="100vw"
            quality={90}
            className="fx-kenburns -z-10 object-cover object-[30%_center]"
          />
          {/* Oscurece solo el lado del texto para que la viajera se vea limpia. */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(270deg,rgba(4,22,24,0.88)_0%,rgba(4,22,24,0.62)_34%,rgba(4,22,24,0.1)_62%,rgba(4,22,24,0)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[#041618]/45 lg:hidden" />
          <svg className="absolute inset-x-0 -top-px h-10 w-full sm:h-14" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true">
            <path fill="#fbf6ee" d="M0 0h1440v20c-220 30-460 36-720 20S220 8 0 34Z" />
          </svg>

          <div className="mx-auto w-full max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
            <div className="max-w-xl lg:ml-auto">
              <MotionSection>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f3c77a]">¿Por qué elegir Qusqueando?</p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight [text-shadow:0_4px_24px_rgba(0,0,0,0.45)] sm:text-6xl">
                  Más que viajes,
                  <span className="block italic text-[#e6a93e]">conexiones reales</span>
                </h2>
                <p className="mt-6 text-lg leading-8 text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                  Creamos experiencias que transforman, uniendo cultura, naturaleza y personas en viajes con propósito.
                  Diseñamos cada ruta según tus intereses, con guías locales apasionados y respeto por las comunidades
                  que nos reciben.
                </p>
                <Link
                  href="/nosotros"
                  className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-[#d4952a] px-7 text-sm font-semibold text-[#021623] shadow-[0_14px_32px_rgba(212,149,42,0.3)] transition hover:-translate-y-0.5 hover:bg-[#e6a93e]"
                >
                  Conoce nuestra historia
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MotionSection>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
