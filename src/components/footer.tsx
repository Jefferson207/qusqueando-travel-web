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

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/experiencias", label: "Paquetes" },
  { href: "/experiencias", label: "Destinos" },
  { href: "/experiencias?categoria=Arqueoastronom%C3%ADa", label: "Astronomía" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

// Título de columna con una rayita dorada debajo
const heading = "text-sm font-bold uppercase tracking-wider text-[#f3c77a] after:mt-3 after:block after:h-0.5 after:w-6 after:rounded-full after:bg-[#e9a93a]";

export function Footer() {
  const siteConfig = useSiteConfig();

  return (
    <footer className="relative overflow-hidden bg-[#22301f] text-white">
      {/* Cusco al atardecer arriba, fundido con el verde andino */}
      <Image src="/images/home/cusco-atardecer.webp" alt="" width={1672} height={941} sizes="100vw" className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] w-full object-cover object-[center_62%] sm:h-[28rem]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[linear-gradient(to_bottom,rgba(34,48,31,0)_0%,rgba(34,48,31,.25)_35%,rgba(34,48,31,.85)_75%,#22301f_100%)] sm:h-[28rem]" />
      {/* Montañas en línea fina y una chacana */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-[#e9a93a]/20 sm:h-52" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M0 170 80 120 130 145 210 70 270 120 320 95 400 160" />
        <path d="M150 200 210 130 240 150 300 90 360 140 420 200" />
        <path d="M1040 200 1110 120 1150 150 1230 60 1290 115 1340 90 1440 165" />
        <path d="M1150 200 1220 140 1260 160 1320 110 1390 200" />
        <path d="M230 98 245 112M1250 85 1265 100" />
      </svg>
      <svg aria-hidden="true" className="pointer-events-none absolute -right-12 bottom-16 hidden h-40 w-40 text-[#e9a93a]/25 lg:block" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M45 5H75V25H95V45H115V75H95V95H75V115H45V95H25V75H5V45H25V25H45Z" />
        <path d="M50 15H70V30H85V50H105V70H85V85H70V105H50V85H35V70H15V50H35V30H50Z" />
        <circle cx="60" cy="60" r="14" />
        <circle cx="60" cy="60" r="6" />
      </svg>
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 pb-14 pt-52 sm:px-6 sm:pt-64 lg:grid-cols-[1.35fr_0.85fr_1fr_1fr] lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <div className="w-fit drop-shadow-[0_4px_14px_rgba(0,0,0,.45)]">
            <Image src="/logo-blanco.png" alt={siteConfig.name} width={508} height={400} className="h-auto w-40" />
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#f5e9dc]">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:-translate-y-0.5 hover:border-[#d4952a] hover:bg-[#d4952a]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : null,
            )}
          </div>
        </div>
        <div>
          <h2 className={heading}>Navegación</h2>
          <div className="mt-4 grid gap-2.5 text-sm text-[#f5e9dc]">
            {navLinks.map((link) => (
              <Link key={link.label} className="transition hover:text-[#f3c77a]" href={link.href}>{link.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className={heading}>Legal y seguridad</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#f5e9dc]">
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
        <div className="col-span-2 md:col-span-1">
          <h2 className={heading}>Contacto</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#f5e9dc]">
            <a href={whatsappUrl(siteConfig.whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-[#f3c77a]">
              <Phone className="h-5 w-5 shrink-0 text-[#e9a93a]" /> {siteConfig.whatsappDisplay}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 transition hover:text-[#f3c77a]">
              <Mail className="h-5 w-5 shrink-0 text-[#e9a93a]" /> {siteConfig.email}
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-[#e9a93a]" /> {siteConfig.address}
            </span>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/15 bg-black/15 px-4 py-5 text-center text-xs text-[#e8d6c4]">
        © {new Date().getFullYear()} {siteConfig.name}. Turismo cultural en Perú.
        {legalEntity.ruc ? ` · RUC ${legalEntity.ruc}` : null}
      </div>
    </footer>
  );
}
