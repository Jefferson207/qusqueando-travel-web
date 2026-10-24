import Link from "@/components/link";
import Image from "@/components/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { socialNetworks } from "@/components/icons/social-icons";
import { EsnnaModalLink } from "@/components/esnna-modal-link";
import { legalEntity } from "@/lib/legal";
import { whatsappUrl } from "@/lib/site";
import { useSiteConfig } from "@/components/site-config-provider";

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

export function Footer() {
  const siteConfig = useSiteConfig();

  return (
    <footer className="relative overflow-hidden bg-[#06152a] text-white">
      {/* Cielo nocturno con montañas y chakanas doradas */}
      <Image src="/images/home/footer.webp" alt="" fill sizes="100vw" className="pointer-events-none object-cover object-bottom" />
      <div className="absolute inset-0 bg-[#06152a]/35" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_1fr_1fr] lg:px-8">
        <div>
          <div className="w-fit">
            <Image src="/logo-blanco.png" alt={siteConfig.name} width={508} height={400} className="h-auto w-40" />
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#d0d5dd]">
            Experiencias culturales, arqueoastronómicas y de naturaleza en Perú,
            diseñadas con rigor, calidez y respeto por el territorio.
          </p>
          <div className="mt-6 flex gap-3">
            {socialNetworks.map(({ key, label, Icon }) =>
              siteConfig.socials[key] ? (
                <a
                  key={key}
                  href={siteConfig.socials[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-[#d4952a] hover:text-[#021623]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : null,
            )}
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
            {legalLinks.map((link) =>
              link.href === "/afiche-esnna-mincetur" ? (
                <EsnnaModalLink key={link.href} label={link.label} className="leading-5 transition hover:text-white" />
              ) : (
                <Link key={link.href} href={link.href} className="leading-5 transition hover:text-white">
                  {link.label}
                </Link>
              ),
            )}
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
        {legalEntity.ruc ? ` · RUC ${legalEntity.ruc}` : null}
      </div>
    </footer>
  );
}
