import { useCallback, useEffect, useRef } from "react";
import Link from "@/components/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import type { Experience } from "@/lib/data";

const AUTOPLAY_MS = 3500;

// Carrusel tipo cinta giratoria: avanza solo de una tarjeta en una y vuelve a
// empezar sin saltos (la lista se renderiza dos veces). Se pausa al pasar el
// mouse, al enfocar con teclado o al tocarlo, y respeta "reducir movimiento".
export function FeaturedCarousel({ experiences }: { experiences: Experience[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<number | undefined>(undefined);
  const loop = experiences.length > 1;

  const metrics = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return null;
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;
    const step = second.offsetLeft - first.offsetLeft;
    const half = loop ? (track.children[experiences.length] as HTMLElement).offsetLeft - first.offsetLeft : Infinity;
    return { track, step, half };
  }, [experiences.length, loop]);

  const move = useCallback(
    (direction: 1 | -1) => {
      const m = metrics();
      if (!m) return;
      const { track, step, half } = m;
      // Salto invisible a la copia equivalente para que el bucle no tenga fin.
      if (direction === 1 && track.scrollLeft + step >= half) {
        track.scrollTo({ left: track.scrollLeft - half, behavior: "instant" });
      } else if (direction === -1 && track.scrollLeft - step < 0 && Number.isFinite(half)) {
        track.scrollTo({ left: track.scrollLeft + half, behavior: "instant" });
      }
      track.scrollBy({ left: direction * step, behavior: "smooth" });
    },
    [metrics],
  );

  useEffect(() => {
    if (!loop || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current && document.visibilityState === "visible") move(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [loop, move]);

  function pause() {
    window.clearTimeout(resumeTimer.current);
    pausedRef.current = true;
  }

  function resume(delay = 0) {
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  }

  function manual(direction: 1 | -1) {
    move(direction);
    pause();
    resume(AUTOPLAY_MS * 2);
  }

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#e4d7c0] bg-white text-[#021623] shadow-sm transition hover:border-[#d4952a] hover:text-[#b97a0b]";

  const items = loop ? [...experiences, ...experiences] : experiences;

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b97a0b]">Experiencias destacadas</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-[#021623] sm:text-5xl">Viajes que dejan huella</h2>
          <p className="mt-4 text-lg leading-8 text-[#667085]">
            Descubre nuestras experiencias más populares, diseñadas para que vivas el Perú en su máxima expresión.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => manual(-1)} className={arrowClass} aria-label="Experiencias anteriores">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => manual(1)} className={arrowClass} aria-label="Más experiencias">
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/experiencias"
            className="ml-2 inline-flex h-11 items-center gap-2 rounded-full border border-[#d4952a] px-5 text-sm font-semibold text-[#8a5a08] transition hover:bg-[#d4952a] hover:text-[#021623]"
          >
            Ver todas las experiencias
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={pause}
        onMouseLeave={() => resume()}
        onFocus={pause}
        onBlur={() => resume()}
        onTouchStart={pause}
        onTouchEnd={() => resume(AUTOPLAY_MS * 2)}
        className="-mx-4 mt-10 flex gap-6 overflow-x-auto px-4 pb-6 [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((experience, index) => {
          const duplicate = index >= experiences.length;
          return (
            <div
              key={`${experience.id}-${duplicate ? "b" : "a"}`}
              aria-hidden={duplicate || undefined}
              inert={duplicate || undefined}
              className="w-[82%] shrink-0 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <ExperienceCard experience={experience} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
