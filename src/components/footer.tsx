import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { whatsappUrl } from "@/lib/site";
import { getSiteConfig } from "@/lib/store";

const legalLinks = [
  { href: "/politica-de-privacidad", label: "Política de Privacidad" },
  {
    href: "/politica-de-proteccion-de-datos-personales",
    label: "Política de Protección de Datos Personales",
  },
  { href: "/terminos-y-condiciones", label: "Términos y Condiciones" },
  { href: "/medios-de-pago", label: "Medios de Pago" },
  { href: "/politica-de-cookies", label: "Política de Cookies" },
  { href: "/afiche-esnna-mincetur", label: "Afiche ESNNA MINCETUR" },
  { href: "/libro-de-reclamaciones", label: "Libro de Reclamaciones" },
];

export async function Footer() {
  const siteConfig = await getSiteConfig();

  return (
    <footer className="relative overflow-hidden bg-[#021623] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(212,149,42,0.18),transparent_30%),linear-gradient(135deg,#021623,#03111b_58%,#01090f)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(135deg,rgba(255,255,255,0.26)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_1fr_1fr] lg:px-8">
        <div>
          <div className="w-fit rounded-2xl bg-[#fef6e8] p-3 shadow-[0_18px_40px_rgba(212,149,42,0.18)]">
            <Image src="/logo.png" alt={siteConfig.name} width={160} height={163} className="h-auto w-36" />
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#d0d5dd]">
            Experiencias culturales, arqueoastronómicas y de naturaleza en Perú,
            diseñadas con rigor, calidez y respeto por el territorio.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={siteConfig.socials.instagram}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/18"
              aria-label="Instagram"
            >
              <Share2 className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.socials.facebook}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/18"
              aria-label="Facebook"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#d4952a]">Navegación</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#d0d5dd]">
            <Link className="transition hover:text-white" href="/experiencias">Experiencias</Link>
            <Link className="transition hover:text-white" href="/nosotros">Nosotros</Link>
            <Link className="transition hover:text-white" href="/contacto">Contacto</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#d4952a]">Legal y seguridad</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#d0d5dd]">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="leading-5 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#d4952a]">Contacto</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#d0d5dd]">
            <a href={whatsappUrl(siteConfig.whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-white">
              <Phone className="h-4 w-4 text-[#d4952a]" /> {siteConfig.whatsappDisplay}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 transition hover:text-white">
              <Mail className="h-4 w-4 text-[#d4952a]" /> {siteConfig.email}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#d4952a]" /> {siteConfig.address}
            </span>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 px-4 py-5 text-center text-xs text-[#98a2b3]">
        © {new Date().getFullYear()} {siteConfig.name}. Turismo cultural en Perú.
      </div>
    </footer>
  );
}
