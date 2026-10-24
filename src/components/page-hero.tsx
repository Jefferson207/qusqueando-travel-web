import Image from "@/components/image";

// Onda crema que une la portada con la sección siguiente (igual que en el inicio).
export function AndeanDivider({ className = "h-10 sm:h-14" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-x-0 -bottom-px w-full ${className}`}
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path fill="#fbf6ea" d="M0 48V30c120 16 240 18 360 4s200-30 320-20 230 26 360 16 260-24 400-10v28Z" />
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
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,22,35,0.85)_0%,rgba(2,22,35,0.55)_45%,rgba(2,22,35,0.2)_100%)]" />
      {/* Oscurece arriba para que el menú y el logo se lean sobre cualquier foto */}
      <div className="absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-[#021623]/70 to-transparent" />

      <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-5 pb-24 pt-44 sm:min-h-[600px] sm:px-8 sm:pb-28 sm:pt-52 lg:px-10">
        <div className="max-w-3xl">
          <p style={{ "--d": "0.1s" } as React.CSSProperties} className="fx-rise text-xs font-bold uppercase tracking-[0.3em] text-[#f3c77a] [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">{eyebrow}</p>
          <h1 style={{ "--d": "0.25s" } as React.CSSProperties} className="fx-rise mt-4 font-display text-4xl font-bold leading-[1.05] [text-shadow:0_4px_24px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
            {title}
            {accent ? <span className="block italic text-[#e6a93e]">{accent}</span> : null}
          </h1>
          {description ? (
            <p style={{ "--d": "0.45s" } as React.CSSProperties} className="fx-rise mt-5 max-w-2xl text-lg leading-8 text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
              {description}
            </p>
          ) : null}
          {children ? <div style={{ "--d": "0.6s" } as React.CSSProperties} className="fx-rise">{children}</div> : null}
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
