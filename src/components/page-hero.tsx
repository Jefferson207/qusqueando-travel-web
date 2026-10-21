import Image from "next/image";

// Silueta andina que une una sección con la siguiente (color crema #fbf6ee).
export function AndeanDivider({ className = "h-14 sm:h-20 lg:h-24" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-x-0 -bottom-px w-full ${className}`}
      viewBox="0 0 1440 128"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill="#fbf6ee"
        fillOpacity="0.45"
        d="M0 128V72l90-26 80 18 120-50 110 42 90-22 130 46 140-60 120 44 100-20 140 38 150-52 100 30 70-14v82Z"
      />
      <path fill="#fbf6ee" d="M0 128V96c120-18 210-30 330-14s200 22 320 2 230-44 360-26 270 34 430 10v60Z" />
    </svg>
  );
}

// Portada fotográfica de las páginas interiores, con el mismo estilo que la
// página de inicio. El menú superior se vuelve transparente encima de ella.
export function PageHero({
  image,
  imageAlt = "",
  eyebrow,
  title,
  accent,
  description,
  children,
  imagePosition = "center",
}: {
  image: string;
  imageAlt?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children?: React.ReactNode;
  imagePosition?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#021623] text-white">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        quality={90}
        className="fx-kenburns -z-10 object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,22,35,0.82)_0%,rgba(2,22,35,0.5)_45%,rgba(2,22,35,0.15)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#021623]/40 to-transparent" />

      <div className="mx-auto flex min-h-[460px] max-w-7xl items-end px-4 pb-28 pt-[calc(92px+4rem)] sm:min-h-[520px] sm:px-6 sm:pb-32 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f3c77a]">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] [text-shadow:0_4px_24px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
            {title}
            {accent ? <span className="block italic text-[#e6a93e]">{accent}</span> : null}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </div>

      <AndeanDivider />
    </section>
  );
}

// Encabezado de sección con el estilo de la portada (antetítulo dorado,
// título serif y acento en cursiva).
export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  className = "",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${dark ? "text-[#f3c77a]" : "text-[#b97a0b]"}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl ${dark ? "text-white" : "text-[#021623]"}`}>
        {title}
        {accent ? <span className={`italic ${dark ? "text-[#e6a93e]" : "text-[#b97a0b]"}`}> {accent}</span> : null}
      </h2>
      {description ? (
        <p className={`mt-4 text-lg leading-8 ${dark ? "text-white/80" : "text-[#667085]"}`}>{description}</p>
      ) : null}
    </div>
  );
}
