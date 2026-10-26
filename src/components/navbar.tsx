import Image from "@/components/image";
import Link from "@/components/link";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Luggage, Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/components/site-config-provider";
import { whatsappUrl } from "@/lib/site";
import { openTrip, useCart } from "@/lib/trip";
import { LangSwitch } from "@/components/lang-switch";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/experiencias", label: "Paquetes" },
  { href: "/experiencias?categoria=Arqueoastronom%C3%ADa", label: "Astronomía" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const siteConfig = useSiteConfig();
  const cartCount = useCart().length;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 120], [132, 84]);
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 40));

  // En las páginas con portada fotográfica el menú flota transparente sobre la
  // foto y se vuelve blanco al hacer scroll. En el resto siempre es blanco.
  // Páginas sin portada fotográfica; todas las demás (incluida la 404) la tienen.
  const plainPages = ["/reservar", "/libro-de-reclamaciones", "/afiche-esnna-mincetur", "/politica-de-privacidad", "/politica-de-proteccion-de-datos-personales", "/terminos-y-condiciones", "/medios-de-pago", "/politica-de-cookies"];
  const hasHero = !plainPages.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const transparent = hasHero && !scrolled && !isOpen;

  return (
    <header
      className={cn(
        "top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        hasHero ? "fixed inset-x-0" : "sticky",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[#eee3cf] bg-white/92 shadow-[0_14px_34px_rgba(2,22,35,0.08)] backdrop-blur-xl",
      )}
    >
      {transparent ? (
        <div className="pointer-events-none absolute inset-0 -z-10 h-[140%] bg-gradient-to-b from-[#021623]/55 via-[#021623]/15 to-transparent" />
      ) : null}
      <motion.div
        style={{ height }}
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="group flex min-w-0 items-center" onClick={() => setIsOpen(false)}>
          {/* Logo blanco sobre la foto; a color cuando el menú se vuelve blanco. */}
          <span
            className={cn(
              "relative block shrink-0 transition-all duration-300 group-hover:-translate-y-0.5",
              transparent ? "mt-4 h-24 w-36 sm:h-28 sm:w-44" : "h-16 w-24 sm:w-28",
            )}
          >
            <Image
              src="/logo-blanco.png"
              alt=""
              width={508}
              height={400}
              priority
              className={cn(
                "absolute inset-0 h-full w-full object-contain object-center drop-shadow-[0_3px_10px_rgba(0,0,0,0.48)] transition-opacity duration-300",
                transparent ? "opacity-100" : "opacity-0",
              )}
            />
            <Image
              src="/logo-color.png"
              alt=""
              width={508}
              height={400}
              priority
              className={cn(
                "absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300",
                transparent ? "opacity-0" : "opacity-100",
              )}
            />
          </span>
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Navegación principal">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group/link relative py-2 text-sm font-semibold tracking-[0.01em] transition duration-300",
                  transparent
                    ? cn(
                        "[text-shadow:0_1px_10px_rgba(0,0,0,0.6)]",
                        active ? "text-white" : "text-white/90 hover:text-white",
                      )
                    : active
                      ? "text-[#021623]"
                      : "text-[#475467] hover:text-[#021623]",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-[#d4952a] transition-transform duration-300 group-hover/link:scale-x-100",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch dark={transparent} className="hidden md:inline-flex" />
          {/* "Mi viaje": experiencias guardadas para reservar juntas */}
          <AnimatePresence>
            {cartCount > 0 ? (
              <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                <button
                  type="button"
                  onClick={openTrip}
                  aria-label={`Mi viaje: ${cartCount} ${cartCount === 1 ? "experiencia" : "experiencias"}`}
                  className={cn(
                    "relative inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition hover:-translate-y-0.5",
                    transparent ? "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20" : "border-[#e9c98a] bg-white text-[#021623] hover:bg-[#fdf6e7]",
                  )}
                >
                  <Luggage className="h-[1.15rem] w-[1.15rem]" />
                  <span className="hidden sm:inline">Mi viaje</span>
                  <motion.span key={cartCount} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="grid h-5 min-w-5 place-items-center rounded-full bg-[#d4952a] px-1 text-[11px] font-bold text-[#021623]">
                    {cartCount}
                  </motion.span>
                </button>
              </motion.span>
            ) : null}
          </AnimatePresence>
          <a
            href={whatsappUrl(siteConfig.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName("primary", "hidden h-11 px-6 text-[0.95rem] sm:inline-flex")}
          >
            <WhatsappIcon className="h-[1.15rem] w-[1.15rem]" />
            Contáctanos
          </a>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition hover:scale-105 lg:hidden",
              transparent
                ? "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                : "border-[#e4e7ec] bg-white/90 text-[#021623] hover:bg-white",
            )}
            aria-label={isOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          className="border-t border-[#eaecf0] bg-white px-4 py-4 shadow-[0_18px_40px_rgba(2,22,35,0.10)] lg:hidden"
          aria-label="Navegación móvil"
        >
          <div className="mx-auto grid max-w-7xl gap-2">
            <LangSwitch className="mb-2 w-fit md:hidden" />
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-semibold transition",
                  pathname === item.href
                    ? "bg-[#fdf0dc] text-[#8a5a08]"
                    : "text-[#344054] hover:bg-[#f6f7f9] hover:text-[#021623]",
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappUrl(siteConfig.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className={buttonClassName("primary", "mt-2 w-full")}
              onClick={() => setIsOpen(false)}
            >
              <WhatsappIcon className="h-4 w-4" />
              Reservar ahora
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
