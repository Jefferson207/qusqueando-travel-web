"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 120], [92, 76]);
  const shadow = useTransform(
    scrollY,
    [0, 120],
    ["0 1px 0 rgba(255,255,255,0.60)", "0 14px 34px rgba(2,22,35,0.08)"],
  );

  return (
    <motion.header
      style={{ boxShadow: shadow }}
      className="sticky top-0 z-50 border-b border-white/55 bg-white/90 backdrop-blur-xl"
    >
      <motion.div
        style={{ height }}
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          <Image
            src="/logo-emblem.png"
            alt=""
            width={225}
            height={160}
            priority
            className="h-14 w-auto shrink-0 object-contain sm:h-16 transition duration-300 group-hover:-translate-y-0.5"
          />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-lg font-extrabold uppercase tracking-[0.04em] text-[#021623] sm:text-2xl">
              Qusqueando
            </span>
            <span className="mt-1.5 text-[0.7rem] font-bold uppercase tracking-[0.5em] sm:text-xs text-[#b97a0b]">
              Travel
            </span>
            <span className="sr-only">{siteConfig.name}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group/link relative py-2 text-sm font-semibold transition duration-300 hover:text-[#021623]",
                  active ? "text-[#021623]" : "text-[#475467]",
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
            className={buttonClassName("primary", "hidden h-10 px-6 sm:inline-flex")}
          >
            Reservar ahora
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e7ec] bg-white/90 shadow-sm transition hover:scale-105 hover:bg-white md:hidden"
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
              Reservar ahora
            </a>
          </div>
        </nav>
      ) : null}
    </motion.header>
  );
}
