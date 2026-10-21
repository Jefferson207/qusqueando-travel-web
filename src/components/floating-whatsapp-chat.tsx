"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Headphones, Info, MapPinned, UserRound, X } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { useSiteConfig } from "@/components/site-config-provider";
import { whatsappMessages, whatsappMessageUrl } from "@/lib/site";

const options = [
  {
    label: "Deseo información",
    description: "Conocer tours, precios y disponibilidad.",
    icon: Info,
    message: whatsappMessages.general(),
  },
  {
    label: "Planear mi viaje a Cusco",
    description: "Armar una ruta según mis fechas e intereses.",
    icon: MapPinned,
    message: whatsappMessages.planTrip(),
  },
];

export function FloatingWhatsappChat() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="w-[min(calc(100vw-2rem),370px)] overflow-hidden rounded-2xl border border-[#dfe4ec] bg-white shadow-[0_24px_70px_rgba(2,22,35,0.22)]">
          <div className="relative overflow-hidden bg-[#021623] px-5 py-5 text-white">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#25d366]/20" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#021623] shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
                  <UserRound className="h-6 w-6" />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#021623] bg-[#25d366]" />
                </span>
                <div>
                  <p className="text-sm font-bold">Asesora de viajes</p>
                  <p className="mt-1 text-xs leading-5 text-[#d0d5dd]">
                    Hola, soy de Qusqueando Travel. ¿Qué te gustaría organizar hoy?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Cerrar chat de WhatsApp"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid gap-3 p-4">
            <div className="rounded-xl bg-[#f6f7f9] px-4 py-3 text-sm leading-6 text-[#344054]">
              Cuéntanos si quieres información rápida o si prefieres que te ayudemos a diseñar tu viaje a Cusco.
            </div>
            {options.map((option) => {
              const Icon = option.icon;

              return (
                <a
                  key={option.label}
                  href={whatsappMessageUrl(siteConfig.whatsapp, option.message)}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-[#eaecf0] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#25d366] hover:shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8fff1] text-[#128c4a] transition group-hover:bg-[#25d366] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#021623]">{option.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#667085]">{option.description}</span>
                  </span>
                </a>
              );
            })}
            <div className="flex items-center gap-2 px-1 pt-1 text-xs font-medium text-[#667085]">
              <Headphones className="h-4 w-4 text-[#25d366]" />
              Atención personalizada por WhatsApp
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.34)] transition hover:-translate-y-1 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]"
        aria-label={isOpen ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <WhatsappIcon className="h-8 w-8" />}
      </button>
    </div>
  );
}
