import type { CSSProperties, ReactNode } from "react";
import { motion, MotionConfig } from "framer-motion";
import { useSeo } from "@/components/seo";
import Image from "@/components/image";
import Link from "@/components/link";
import { HomeSearch } from "@/components/home-search";
import { useCatalog } from "@/components/site-config-provider";
import { homeMetadata } from "@/lib/seo";
import { money } from "@/lib/money";
import { useSiteConfig } from "@/components/site-config-provider";
import { whatsappUrl } from "@/lib/site";
import { ArrowRight, CalendarDays, Camera, Landmark, Moon, Mountain, Star, Telescope, UtensilsCrossed, UsersRound } from "lucide-react";

const destinations = [
  ["Machu Picchu", "Maravilla del mundo", "/images/experiencias/machu-picchu.jpg"],
  ["Valle Sagrado", "Pueblos, ruinas y tradición", "/images/experiencias/valle-sagrado.jpg"],
  ["Vinicunca", "La montaña de 7 colores", "/images/03_montana_siete_colores.jpg"],
  ["Sacsayhuamán", "Fortaleza inca del Cusco", "/images/experiencias/sacsayhuaman.jpg"],
  ["Laguna Humantay", "Naturaleza en estado puro", "/images/destinos/laguna-humantay.jpg"],
] as const;
const heroTags = [[Mountain, "Naturaleza"], [Landmark, "Cultura"], [Telescope, "Astronomía"], [UtensilsCrossed, "Gastronomía"], [Camera, "Experiencias"]] as const;
const outlineButton = "group/btn inline-flex items-center gap-2 rounded-full border border-[#d69620] bg-white px-5 py-2.5 text-sm font-bold text-[#b6780e] transition hover:bg-[#d69620] hover:text-white";
const goldButton = "group/btn inline-flex items-center gap-2 rounded-full bg-[#d69620] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(214,150,32,.35)] transition hover:-translate-y-0.5 hover:bg-[#b9790e]";
const astroFeatures = [[Telescope, "Observación de estrellas"], [Moon, "Guías especializados"], [UsersRound, "Grupos reducidos"], [Mountain, "Lugares exclusivos"]] as const;
const testimonials = [
  ["María López", "Una experiencia increíble en Cusco. Todo muy bien organizado y los paisajes, espectaculares.", "ML"],
  ["Carlos Ramírez", "El tour astronómico fue mágico. Ver el cielo del Perú de esa manera es algo que nunca voy a olvidar.", "CR"],
  ["Ana Torres", "La gastronomía fue un complemento perfecto del viaje. Conocimos sabores únicos.", "AT"],
] as const;

/** Onda crema para los bordes superior e inferior de las bandas oscuras. */
function CreamWave({ flip, className }: { flip?: boolean; className?: string }) {
  return (
    <svg className={`${className ?? ""} ${flip ? "rotate-180" : ""}`} viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#fbf6ea" d="M0 0h1440v18c-170 24-340 26-520 8S560 4 360 18 120 30 0 14Z" />
    </svg>
  );
}

/** Retraso de una animación CSS (.fx-rise, .fx-twinkle). */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** Aparece suavemente al entrar en pantalla al hacer scroll. */
function Reveal({ children, delay: wait = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: wait, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Posiciones fijas (no aleatorias) para que las estrellas no cambien en cada render.
const stars = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 46,
  size: 1 + (i % 3),
  duration: 2.2 + (i % 5) * 0.7,
  wait: (i % 7) * 0.45,
}));

/** Estrellas que titilan sobre el cielo de las fotos. */
function Stars({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {stars.map((star, i) => (
        <span
          key={i}
          className="fx-twinkle absolute rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,.55)]"
          style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, "--t": `${star.duration}s`, "--d": `${star.wait}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** Destello que cruza la tarjeta al pasar el mouse (usa .fx-shine de styles.css). */
const shine = <span className="fx-shine pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/35 to-transparent" />;

/** Fondo ilustrado de una sección (public/images/home). */
function SectionBg({ src, className = "object-cover lg:object-fill" }: { src: string; className?: string }) {
  return <>
    <Image src={`/images/home/${src}.webp`} alt="" fill sizes="100vw" className={`pointer-events-none -z-20 ${className}`} />
    {/* Funde los bordes superior e inferior con el crema de las secciones vecinas */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#fbf6ea,transparent_14%,transparent_86%,#fbf6ea)]" />
  </>;
}

function Title({ eyebrow, title, accent, copy }: { eyebrow: string; title: string; accent?: string; copy?: string }) {
  return <div className="text-center"><p className="eyebrow">— {eyebrow} —</p><h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#06213b] sm:text-4xl">{title} {accent && <span className="text-[#cf8d16]">{accent}</span>}</h2>{copy && <p className="mt-2 text-sm text-slate-500 sm:text-base">{copy}</p>}</div>;
}

export default function Home() {
  useSeo(homeMetadata);
  const { experiences } = useCatalog();
  const config = useSiteConfig();
  const packages = (experiences.filter((e) => e.featured).length ? experiences.filter((e) => e.featured) : experiences).slice(0, 4);
  return <MotionConfig reducedMotion="user">
    {/* Sin overflow-hidden en la sección: los paneles del buscador pueden salir por debajo del hero */}
    <section className="relative isolate z-20 bg-[#0b1426] text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <Image src="/images/home/hero.webp" alt="Viajera contemplando Machu Picchu al atardecer bajo la Vía Láctea" fill priority sizes="100vw" className="fx-kenburns object-cover object-[70%_center]" />
        <Stars className="[mask-image:linear-gradient(to_bottom,#000_40%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,14,32,.78),rgba(6,14,32,.45)_40%,rgba(6,14,32,0)_70%)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 pb-32 pt-40 sm:px-8 sm:pt-44 lg:px-10">
        <div className="max-w-2xl">
          <p style={delay(0.1)} className="fx-rise mb-4 text-xs font-bold uppercase tracking-[.25em] text-[#efb23c] [text-shadow:0_2px_10px_rgba(0,0,0,.5)]">Cusco · Astronomía · Cultura · Naturaleza</p>
          <h1 style={delay(0.25)} className="fx-rise font-display text-5xl font-bold leading-[1.02] [text-shadow:0_4px_24px_rgba(0,0,0,.5)] sm:text-6xl lg:text-7xl">
            Vive <span className="text-[#e9a93a]">Cusco</span>
            <span style={delay(0.45)} className="fx-rise mt-1 block text-4xl sm:text-5xl lg:text-6xl">bajo un cielo mágico</span>
          </h1>
          <p style={delay(0.6)} className="fx-rise mt-5 max-w-xl text-base leading-7 text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,.5)] sm:text-lg">Experiencias únicas de naturaleza, cultura, gastronomía y cielos estrellados en el corazón de los Andes.</p>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-white/95">
            {heroTags.map(([Icon, label], i) => <span key={label} style={delay(0.75 + i * 0.08)} className="fx-rise group/tag flex items-center gap-2"><Icon className="h-6 w-6 text-[#e9a93a] transition duration-300 group-hover/tag:-translate-y-1 group-hover/tag:scale-110" strokeWidth={1.6} />{label}</span>)}
          </div>
        </div>
        <div style={delay(1.1)} className="fx-rise relative z-30 mt-9 max-w-4xl">
          <HomeSearch />
        </div>
      </div>
      <CreamWave flip className="absolute inset-x-0 bottom-0 h-10 w-full sm:h-14" />
    </section>
    <section className="relative isolate overflow-hidden bg-[#fbf6ea] px-4 pb-16 pt-12 sm:px-8"><SectionBg src="destinos" /><div className="relative mx-auto max-w-7xl">
      <Reveal className="relative"><Title eyebrow="Destinos destacados" title="Lugares que te conectan con la" accent="esencia de Cusco" copy="Descubre paisajes sagrados, pueblos ancestrales y maravillas naturales en el corazón de los Andes." /><div className="mt-5 text-center lg:absolute lg:right-0 lg:top-8 lg:mt-0"><Link href="/experiencias" className={outlineButton}>Ver todos los destinos <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" /></Link></div></Reveal>
      <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1">{destinations.map(([name, subtitle, image], i) => <Reveal key={name} delay={i * 0.08}><Link href="/experiencias" className="group relative block h-56 overflow-hidden rounded-2xl shadow-[0_12px_28px_rgba(2,22,35,.18)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_40px_rgba(2,22,35,.28)]">{shine}<Image src={image} alt={name} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover transition duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white"><span><strong className="block font-display text-xl font-bold leading-tight">{name}</strong><small className="text-xs text-white/85">{subtitle}</small></span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/80 transition group-hover:bg-[#d69620] group-hover:border-[#d69620]"><ArrowRight className="h-4 w-4" /></span></div></Link></Reveal>)}</div>
    </div></section>
    {/* Paquetes */}
    <section className="relative isolate overflow-hidden bg-[#fbf6ea] px-4 pb-24 pt-2 sm:px-8"><SectionBg src="paquetes" /><div className="relative mx-auto max-w-7xl">
      <Reveal className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="eyebrow">— Paquetes turísticos —</p><h2 className="mt-1 font-display text-3xl font-bold text-[#06213b] sm:text-4xl">Experiencias únicas en <span className="text-[#cf8d16]">Cusco</span></h2><p className="mt-2 text-slate-500">Viajes organizados con los mejores servicios, guías locales y momentos inolvidables.</p></div>
        <Link href="/experiencias" className={outlineButton}>Ver todos los paquetes <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" /></Link>
      </Reveal>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{packages.map((item, i) => (
        <Reveal key={item.id} delay={i * 0.1} className="h-full"><Link href={`/experiencias/${item.slug}`} className="group block h-full overflow-hidden rounded-2xl bg-white shadow-[0_14px_34px_rgba(4,29,49,.12)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_44px_rgba(4,29,49,.2)]">
          <div className="relative h-48 overflow-hidden">{shine}<Image src={item.mainImage} alt={item.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />{i === 0 && <span className="fx-float absolute left-3 top-3 rounded-full bg-[#d69620] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Más vendido</span>}</div>
          <div className="p-5"><h3 className="font-bold text-[#06213b]">{item.name}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5 text-[#cf8d16]" />{item.duration}</p><div className="mt-4 flex items-center justify-between"><span className="text-sm text-slate-500">Desde <b translate="no" className="notranslate text-base text-[#06213b]">{money(item.priceFrom, item.currency)}</b></span><span className="grid h-10 w-10 place-items-center rounded-full bg-[#d69620] text-white transition duration-300 group-hover:rotate-[-45deg] group-hover:bg-[#b9790e]"><ArrowRight className="h-4 w-4" /></span></div></div>
        </Link></Reveal>
      ))}</div>
    </div></section>

    {/* Turismo astronómico */}
    <section className="relative isolate overflow-hidden bg-[#071a33] text-white">
      <Image src="/images/home/astronomia.webp" alt="Viajero observando la Vía Láctea con un telescopio en los Andes" fill sizes="100vw" className="fx-kenburns -z-20 object-cover object-[80%_center]" />
      <Stars className="-z-10 [mask-image:linear-gradient(to_bottom,#000_30%,transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,26,51,.75),rgba(7,26,51,.35)_45%,transparent_70%)]" />
      <CreamWave className="absolute inset-x-0 top-0 h-8 w-full sm:h-12" />
      <CreamWave flip className="absolute inset-x-0 bottom-0 h-8 w-full sm:h-12" />
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-16"><Reveal className="max-w-xl">
        <p className="eyebrow text-[#edb343]">— Turismo astronómico —</p>
        <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Bajo el mismo cielo <span className="text-[#e9a93a]">del Perú</span></h2>
        <p className="mt-4 leading-7 text-white/90">Vive la magia de observar las estrellas en uno de los cielos más claros del mundo. Experiencias únicas en destinos especiales.</p>
        <Link href="/experiencias?categoria=Arqueoastronom%C3%ADa" className={`${goldButton} mt-7`}>Descubre nuestras experiencias <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" /></Link>
        <div className="mt-10 grid grid-cols-2 gap-5 text-xs font-semibold sm:grid-cols-4">{astroFeatures.map(([Icon, label], i) => <span key={label} style={delay(i * 0.6)} className="group/feat flex items-center gap-2"><Icon style={delay(i * 0.6)} className="fx-float h-7 w-7 shrink-0 text-[#f2b73e]" strokeWidth={1.5} />{label}</span>)}</div>
      </Reveal></div>
    </section>

    {/* Gastronomía y cultura: el fondo ya trae las fotos a la derecha */}
    <section className="relative isolate overflow-hidden bg-[#fbf6ea] lg:aspect-[1942/809] lg:max-h-[780px] lg:w-full">
      <SectionBg src="gastronomia-cultura" className="hidden object-cover object-right lg:block" />
      <div className="mx-auto flex h-full max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-16 lg:py-0">
        <Reveal className="max-w-md"><p className="eyebrow">— Gastronomía y cultura —</p><h2 className="mt-2 font-display text-4xl font-bold text-[#06213b]">Sabores que <span className="text-[#cf8d16]">cuentan historias</span></h2><p className="mt-4 leading-7 text-slate-600">Disfruta de la auténtica gastronomía cusqueña y vive experiencias culturales que mantienen viva la tradición andina.</p><Link href="/nosotros" className={`${outlineButton} mt-7`}>Conoce nuestra cultura <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" /></Link></Reveal>
      </div>
      {/* En móvil se muestran las fotos debajo del texto */}
      <div className="relative aspect-[16/10] lg:hidden"><Image src="/images/home/gastronomia-cultura.webp" alt="Gastronomía cusqueña, mujer andina con llama y danzas en la Plaza de Armas" fill sizes="100vw" className="object-cover object-right" /></div>
    </section>

    {/* Testimonios */}
    <section className="relative isolate overflow-hidden bg-[#fbf6ea] px-4 py-20 sm:px-8"><SectionBg src="testimonios" /><div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.8fr_2.2fr]">
      <Reveal><p className="eyebrow">— Testimonios —</p><h2 className="mt-2 font-display text-4xl font-bold leading-tight text-[#06213b]">Lo que dicen <span className="text-[#cf8d16]">nuestros viajeros</span></h2><p className="mt-3 text-sm text-slate-500">Experiencias reales que inspiran nuevos viajes.</p></Reveal>
      <div className="grid gap-4 md:grid-cols-3">{testimonials.map(([name, text, initials], i) => <Reveal key={name} delay={i * 0.12} className="h-full"><article className="h-full rounded-2xl border border-[#f0e6d3] bg-white p-5 shadow-[0_10px_26px_rgba(2,22,35,.06)] transition duration-300 hover:-translate-y-1 hover:border-[#e9c98a] hover:shadow-[0_18px_36px_rgba(2,22,35,.12)]"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#07304a] text-xs font-bold text-white">{initials}</span><div><strong className="text-sm text-[#06213b]">{name}</strong><div className="flex text-[#d69620]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div></div></div><p className="mt-4 text-sm leading-6 text-slate-600">“{text}”</p></article></Reveal>)}</div>
    </div></section>

    {/* Llamado final */}
    <section className="relative isolate overflow-hidden text-white">
      <Image src="/images/atardecer-machu-picchu.jpg" alt="Machu Picchu al atardecer" fill sizes="100vw" className="fx-kenburns -z-20 object-cover object-[center_60%]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,26,48,.55),rgba(6,26,48,.78)_50%,rgba(6,26,48,.55))]" />
      <CreamWave className="absolute inset-x-0 top-0 h-6 w-full sm:h-10" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-16 text-center sm:px-8 sm:py-20 md:flex-row md:text-left">
        <Reveal><h2 className="font-display text-3xl font-bold sm:text-4xl">Tu próxima historia comienza aquí</h2><p className="mt-2 text-white/90">Cusco te espera con paisajes, cultura y cielos llenos de estrellas.</p></Reveal>
        <a href={whatsappUrl(config.whatsapp)} target="_blank" rel="noreferrer" className={`${goldButton} fx-glow shrink-0 px-7 py-3.5 text-base`}>¡Reserva tu viaje ahora! <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" /></a>
      </div>
    </section>
  </MotionConfig>;
}
