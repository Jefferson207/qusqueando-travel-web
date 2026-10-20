import { pageMetadata } from "@/lib/seo";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { whatsappUrl } from "@/lib/site";
import { getSiteConfig } from "@/lib/store";

export const metadata = pageMetadata({
  path: "/contacto",
  title: "Contacto",
  description: "Contacta a Qusqueando Travel por WhatsApp, correo o formulario.",
});

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const siteConfig = await getSiteConfig();

  return (
    <section className="bg-[#f6f7f9] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97a0b]">Contacto</p>
          <h1 className="mt-3 text-4xl font-bold text-[#021623] sm:text-5xl">
            Planifiquemos tu próxima experiencia en Perú.
          </h1>
          <div className="mt-8 grid gap-4 text-[#475467]">
            <a
              href={whatsappUrl(siteConfig.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 transition hover:text-[#021623]"
            >
              <Phone className="h-5 w-5 text-[#b97a0b]" /> {siteConfig.whatsappDisplay}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 transition hover:text-[#021623]">
              <Mail className="h-5 w-5 text-[#b97a0b]" /> {siteConfig.email}
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#b97a0b]" /> {siteConfig.address}
            </span>
          </div>
          <div className="surface-card mt-8 p-2">
            <iframe
              title="Mapa de Cusco"
              src="https://www.google.com/maps?q=Cusco%2C%20Peru&output=embed"
              className="surface-content h-72 w-full rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
