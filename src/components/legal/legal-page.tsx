import { Building2, CalendarDays } from "lucide-react";
import { legalEntity, type LegalDocument } from "@/lib/legal";
import type { SiteConfig } from "@/lib/site";
import { useSiteConfig } from "@/components/site-config-provider";
import { slugify } from "@/lib/utils";

function fill(text: string, config: SiteConfig) {
  return text
    .replaceAll("{email}", config.email)
    .replaceAll("{whatsapp}", config.whatsappDisplay)
    .replaceAll("{address}", config.address);
}

export function LegalPage({ title, description, sections }: LegalDocument) {
  const config = useSiteConfig();

  const identity = [
    ["Nombre comercial", config.name],
    ["Razón social", legalEntity.razonSocial],
    ["RUC", legalEntity.ruc],
    ["Domicilio", legalEntity.direccionFiscal || config.address],
    ["Registro de agencia (GERCETUR Cusco)", legalEntity.registroGercetur],
    ["Correo", config.email],
    ["WhatsApp", config.whatsappDisplay],
  ].filter(([, value]) => value);

  const numbered = sections.map((section, index) => ({
    ...section,
    id: `${index + 1}-${slugify(section.title)}`,
    number: index + 1,
  }));

  return (
    <section className="bg-[#f6f7f9] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-6 sm:p-10">
          <div className="surface-content">
            <p className="eyebrow">Legal y seguridad</p>
            <h1 className="mt-3 text-3xl font-bold text-[#021623] sm:text-4xl">{title}</h1>
            <p className="mt-4 leading-7 text-[#667085]">{description}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fdf0dc] px-3 py-1.5 text-xs font-semibold text-[#8a5a08]">
              <CalendarDays className="h-3.5 w-3.5" />
              Última actualización: {legalEntity.updatedAt}
            </p>

            <div className="mt-8 rounded-2xl border border-[#eaecf0] bg-white p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#021623]">
                <Building2 className="h-4 w-4 text-[#b97a0b]" />
                Datos de la empresa
              </h2>
              <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {identity.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#98a2b3]">{label}</dt>
                    <dd className="mt-0.5 font-medium text-[#344054]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {numbered.length > 3 ? (
              <nav aria-label="Contenido" className="mt-8 rounded-2xl bg-[#faf2e6] p-5">
                <p className="text-sm font-bold text-[#021623]">Contenido</p>
                <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  {numbered.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="text-[#475467] transition hover:text-[#b97a0b]">
                        {section.number}. {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            <div className="mt-10 grid gap-6">
              {numbered.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 rounded-2xl border border-[#eaecf0] bg-[#fbfcfe] p-5 sm:p-6"
                >
                  <h2 className="flex gap-3 text-xl font-bold text-[#021623]">
                    <span className="text-[#b97a0b]">{section.number}.</span>
                    {section.title}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mt-3 leading-7 text-[#475467]">
                      {fill(paragraph, config)}
                    </p>
                  ))}
                  {section.items?.length ? (
                    <ul className="mt-3 grid gap-2.5">
                      {section.items.map((item) => (
                        <li key={item.slice(0, 40)} className="flex gap-3 leading-7 text-[#475467]">
                          <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b97a0b]" />
                          <span>{fill(item, config)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
