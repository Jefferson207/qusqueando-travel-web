"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/components/site-config-provider";
import { whatsappUrl } from "@/lib/site";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/experiencias", label: "Experiencias" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 120], [92, 76]);
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 40));

  // En las páginas con portada fotográfica el menú flota transparente sobre la
  // foto y se vuelve blanco al hacer scroll. En el resto siempre es blanco.
  const hasHero =
    pathname === "/" ||
    pathname === "/nosotros" ||
    pathname === "/contacto" ||
    pathname === "/experiencias" ||
    pathname.startsWith("/experiencias/");
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
        <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          <span
            className={cn(
              "shrink-0 rounded-2xl transition duration-300 group-hover:-translate-y-0.5",
              transparent && "bg-[#fbf6ee]/95 px-1.5 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
            )}
          >
            <Image
              src={siteConfig.logoMark}
              alt=""
              width={225}
              height={160}
              priority
              className={cn("w-auto object-contain transition-all duration-300", transparent ? "h-12 sm:h-14" : "h-14 sm:h-16")}
            />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span
              className={cn(
                "truncate text-lg font-extrabold uppercase tracking-[0.04em] transition-colors sm:text-2xl",
                transparent ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" : "text-[#021623]",
              )}
            >
              Qusqueando
            </span>
            <span
              className={cn(
                "mt-1.5 text-[0.7rem] font-bold uppercase tracking-[0.5em] transition-colors sm:text-xs",
                transparent ? "text-[#f3c77a]" : "text-[#b97a0b]",
              )}
            >
              Travel
            </span>
            <span className="sr-only">{siteConfig.name}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex lg:gap-10" aria-label="Navegación principal">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group/link relative py-2 text-base font-semibold tracking-[0.01em] transition duration-300 lg:text-[1.0625rem]",
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
          <a
            href={whatsappUrl(siteConfig.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName("primary", "hidden h-11 px-6 text-[0.95rem] sm:inline-flex")}
          >
            <WhatsappIcon className="h-[1.15rem] w-[1.15rem]" />
            Reservar ahora
          </a>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition hover:scale-105 md:hidden",
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
          className="border-t border-[#eaecf0] bg-white px-4 py-4 shadow-[0_18px_40px_rgba(2,22,35,0.10)] md:hidden"
          aria-label="Navegación móvil"
        >
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
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
