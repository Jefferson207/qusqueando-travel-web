import { useSeo } from "@/components/seo";
import Image from "@/components/image";
import Link from "@/components/link";
import { ArrowRight, Compass, Eye, HeartHandshake, Leaf, ShieldCheck, Telescope } from "lucide-react";
import { IntiSun } from "@/components/icons/inti-sun";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { MotionSection } from "@/components/motion-section";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { buttonClassName } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";
import { useSiteConfig } from "@/components/site-config-provider";

const seo = pageMetadata({
  path: "/nosotros",
  title: "Nosotros",
  description: "Historia, misión y visión de Qusqueando Travel.",
});

const blocks = [
  {
    title: "Historia",
    icon: Compass,
    content:
      "Qusqueando Travel nació con el propósito de acercar a viajeros nacionales y extranjeros a la cosmovisión andina mediante experiencias que integran conocimiento ancestral, observación del cielo y exploración de sitios arqueológicos.",
  },
  {
    title: "Misión",
    icon: IntiSun,
    content:
      "Ofrecer experiencias auténticas que conecten a las personas con la cultura andina, el patrimonio arqueológico y la observación de fenómenos astronómicos, promoviendo un turismo responsable y de calidad.",
  },
  {
    title: "Visión",
    icon: Eye,
    content: "Ser una agencia líder en turismo arqueoastronómico en el Perú.",
  },
];

const values = [
  { title: "Respeto por el territorio", text: "Cuidamos el patrimonio y las comunidades que nos reciben.", icon: Leaf },
  { title: "Conocimiento ancestral", text: "Interpretamos la historia y el cielo andino con rigor.", icon: Telescope },
  { title: "Atención cercana", text: "Te acompañamos desde la planificación hasta el regreso.", icon: HeartHandshake },
  { title: "Seguridad y confianza", text: "Operamos de forma formal y transparente.", icon: ShieldCheck },
];

export default function AboutPage() {
  useSeo(seo);
  const config = useSiteConfig();

  return (
    <>
      <PageHero
        image="/images/atardecer-machu-picchu.jpg"
        imageAlt="Machu Picchu al atardecer"
        eyebrow="Nosotros"
        title="Turismo cultural"
        accent="con mirada andina"
        description="Somos una agencia cusqueña que diseña experiencias para conectar con la historia, la naturaleza y el cielo del Perú."
      />

      <section className="bg-[#fbf6ea] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <SectionHeading eyebrow="Quiénes somos" title="Más que una agencia," accent="anfitriones del Cusco" />
            <div className="mt-10 grid gap-5">
              {blocks.map((block, index) => (
                <MotionSection key={block.title} delay={index * 0.1}>
                  <div className="group flex gap-5 rounded-3xl border border-[#efe6d6] bg-white p-6 shadow-[0_14px_40px_rgba(2,22,35,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(2,22,35,0.1)]">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#e9d3a8] bg-[#fdf0dc] text-[#b97a0b] transition group-hover:rotate-6 group-hover:bg-[#d4952a] group-hover:text-white">
                      <block.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-[#021623]">{block.title}</h3>
                      <p className="mt-2 leading-7 text-[#475467]">{block.content}</p>
                    </div>
                  </div>
                </MotionSection>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 -z-0 rounded-[2rem] bg-gradient-to-br from-[#e6a93e]/35 via-transparent to-[#9ca42c]/25 blur-xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white shadow-[0_30px_80px_rgba(2,22,35,0.2)]">
              <Image
                src="/images/experiencias/valle-sagrado.jpg"
                alt="Valle Sagrado de los Incas"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="fx-kenburns object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#021623] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Nuestros valores" title="Lo que nos" accent="mueve" className="max-w-2xl" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <MotionSection key={value.title} delay={index * 0.1}>
                <div className="h-full rounded-2xl border border-white/12 bg-white/[0.04] p-6 transition hover:border-[#d4952a]/50 hover:bg-white/[0.07]">
                  <value.icon className="h-8 w-8 text-[#e6a93e]" strokeWidth={1.5} />
                  <h3 className="mt-4 font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{value.text}</p>
                </div>
              </MotionSection>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-[#d4952a]/20 to-transparent p-8 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-2xl font-semibold sm:text-3xl">¿Listo para tu próxima aventura?</p>
              <p className="mt-2 text-white/75">Cuéntanos tus fechas y te armamos una ruta a tu medida.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappUrl(config.whatsapp)} target="_blank" rel="noreferrer" className={buttonClassName("primary", "h-12 px-6")}>
                <WhatsappIcon className="h-4 w-4" /> Escríbenos
              </a>
              <Link
                href="/experiencias"
                className={buttonClassName("outline", "h-12 border-white/30 bg-white/10 px-6 text-white hover:bg-white/20")}
              >
                Ver experiencias <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
