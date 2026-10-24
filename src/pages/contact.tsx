import { useSeo } from "@/components/seo";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";
import { useSiteConfig } from "@/components/site-config-provider";

const seo = pageMetadata({
  path: "/contacto",
  title: "Contacto",
  description: "Contacta a Qusqueando Travel por WhatsApp, correo o formulario.",
});

export default function ContactPage() {
  useSeo(seo);
  const siteConfig = useSiteConfig();

  const channels = [
    {
      label: "WhatsApp",
      value: siteConfig.whatsappDisplay,
      href: whatsappUrl(siteConfig.whatsapp),
      icon: WhatsappIcon,
      external: true,
    },
    { label: "Correo", value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail, external: false },
    { label: "Ubicación", value: siteConfig.address, href: undefined, icon: MapPin, external: false },
  ];

  return (
    <>
      <PageHero
        image="/images/experiencias/city-tour-cusco.jpg"
        imageAlt="Plaza de Armas del Cusco"
        eyebrow="Contacto"
        title="Planifiquemos"
        accent="tu viaje al Perú"
        description="Escríbenos y te ayudamos a elegir la ruta ideal según tus fechas, ritmo de viaje e intereses."
      />

      <section className="bg-[#fbf6ea] pb-20 pt-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeading eyebrow="Hablemos" title="Estamos para" accent="ayudarte" description="Respondemos por WhatsApp, correo o desde el formulario." />

            <div className="mt-8 grid gap-4">
              {channels.map((channel) => {
                const content = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e9d3a8] bg-[#fdf0dc] text-[#b97a0b] transition group-hover:bg-[#d4952a] group-hover:text-white">
                      <channel.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#98a2b3]">{channel.label}</span>
                      <span className="block font-semibold text-[#021623]">{channel.value}</span>
                    </span>
                  </>
                );
                const className =
                  "group flex items-center gap-4 rounded-2xl border border-[#efe6d6] bg-white p-4 shadow-[0_10px_30px_rgba(2,22,35,0.05)] transition";
                return channel.href ? (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noreferrer" : undefined}
                    className={`${className} hover:-translate-y-0.5 hover:border-[#d4952a]`}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={channel.label} className={className}>
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-[#efe6d6] bg-white p-2 shadow-[0_14px_40px_rgba(2,22,35,0.06)]">
              <iframe
                title="Mapa de Cusco"
                src="https://www.google.com/maps?q=Cusco%2C%20Peru&output=embed"
                className="h-72 w-full rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
