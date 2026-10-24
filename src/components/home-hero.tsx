import Image from "@/components/image";
import Link from "@/components/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { useSiteConfig } from "@/components/site-config-provider";
import { buttonClassName } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/site";
import type { SiteConfig } from "@/lib/site";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

export function HomeHero({ config }: { config: SiteConfig }) {
  const siteConfig = useSiteConfig();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 110]);
  const [titleMain, titleAccent] = config.heroTitle.split("|").map((part) => part.trim());

  return (
    <section className="relative isolate overflow-hidden bg-[#021623]">
      <motion.div style={{ y: imageY }} className="absolute inset-0 -z-10 scale-[1.02]">
        <Image
          src={config.heroImage}
          alt="Machu Picchu bañado por la luz dorada del amanecer"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="fx-kenburns object-cover object-[55%_center]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,22,35,0.7)_0%,rgba(2,22,35,0.38)_32%,rgba(2,22,35,0)_58%)]" />

      <div className="mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 pb-40 pt-[calc(92px+3rem)] sm:px-6 sm:pb-48 lg:px-8">
        <div className="max-w-2xl text-white">
          <motion.p
            {...fadeUp(0)}
            className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f3c77a]"
          >
            Cultura · Naturaleza · Aventura · Astronomía
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-5 font-display text-5xl font-semibold leading-[1.02] [text-shadow:0_4px_24px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl"
          >
            {titleMain}
            {titleAccent ? (
              <span className="block italic text-[#e6a93e]">{titleAccent}</span>
            ) : null}
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 max-w-xl text-lg leading-8 text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]"
          >
            {config.heroSubtitle}
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/experiencias" className={buttonClassName("primary", "h-12 px-7")}>
              Explorar experiencias
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappUrl(siteConfig.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className={buttonClassName(
                "outline",
                "h-12 border-white/40 bg-white/10 px-7 text-white backdrop-blur hover:bg-white/20",
              )}
            >
              <WhatsappIcon className="h-4 w-4" />
              Reservar por WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      <p className="absolute bottom-40 right-8 hidden items-center gap-1.5 font-display text-sm italic text-white/85 lg:flex">
        <MapPin className="h-4 w-4 text-[#f3c77a]" />
        Machu Picchu, Cusco · Perú
      </p>

      {/* Silueta andina que une el hero con la sección siguiente (mismo color crema). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#021623]/20 to-transparent" />
      <svg
        className="pointer-events-none absolute inset-x-0 -bottom-px h-16 w-full sm:h-24 lg:h-32"
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="#fbf6ea"
          fillOpacity="0.45"
          d="M0 128V72l90-26 80 18 120-50 110 42 90-22 130 46 140-60 120 44 100-20 140 38 150-52 100 30 70-14v82Z"
        />
        <path
          fill="#fbf6ea"
          d="M0 128V96c120-18 210-30 330-14s200 22 320 2 230-44 360-26 270 34 430 10v60Z"
        />
      </svg>
    </section>
  );
}
