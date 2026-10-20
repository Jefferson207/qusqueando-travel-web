"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Stars } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buttonClassName } from "@/components/ui/button";
import type { StoredSiteConfig } from "@/lib/store";

export function HomeHero({ config }: { config: StoredSiteConfig }) {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 120]);
  const contentY = useTransform(scrollY, [0, 700], [0, 42]);

  return (
    <section className="relative min-h-[calc(100vh-92px)] overflow-hidden bg-[#021623]">
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <Image
          src={config.heroImage}
          alt="Machu Picchu al amanecer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(212,149,42,0.24),transparent_30%),linear-gradient(90deg,rgba(2,22,35,0.96),rgba(2,22,35,0.74)_44%,rgba(2,22,35,0.22))]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(120deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(60deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:54px_54px]" />

      <motion.div
        style={{ y: contentY }}
        className="relative mx-auto flex min-h-[calc(100vh-92px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f3c77a] shadow-[0_12px_34px_rgba(0,0,0,0.18)] backdrop-blur"
          >
            <Stars className="h-4 w-4" />
            Cultura, naturaleza y astronomía andina
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            {config.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-lg leading-8 text-[#eaecf0]"
          >
            {config.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36, ease: "easeOut" }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <WhatsAppButton className="sm:w-auto" />
            <Link
              href="/experiencias"
              className={buttonClassName(
                "outline",
                "border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20",
              )}
            >
              Ver experiencias
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-white/80 sm:block">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
      <div className="absolute -bottom-14 left-1/2 h-28 w-[120%] -translate-x-1/2 rounded-[50%] bg-white" />
    </section>
  );
}
