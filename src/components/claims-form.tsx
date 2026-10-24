import type { FormEvent } from "react";
import { BookOpen, FileText, Send, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { legalEntity } from "@/lib/legal";
import type { SiteConfig } from "@/lib/site";
import { Select } from "@/components/ui/pickers";

type FormElement = HTMLFormElement & {
  incidentAt: HTMLInputElement;
  consumerName: HTMLInputElement;
  documentType: HTMLSelectElement;
  documentNumber: HTMLInputElement;
  address: HTMLInputElement;
  email: HTMLInputElement;
  phone: HTMLInputElement;
  communicationType: HTMLSelectElement;
  service: HTMLInputElement;
  amount: HTMLInputElement;
  request: HTMLInputElement;
  description: HTMLTextAreaElement;
  accepted: HTMLInputElement;
};

export function ClaimsForm({ siteConfig }: { siteConfig: SiteConfig }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget as FormElement;

    if (!form.reportValidity()) {
      return;
    }

    const body = [
      "Libro de Reclamaciones - Qusqueando Travel",
      "",
      `Fecha y hora del incidente: ${form.incidentAt.value}`,
      `Nombre: ${form.consumerName.value}`,
      `Documento: ${form.documentType.value} ${form.documentNumber.value}`,
      `Dirección: ${form.address.value}`,
      `Correo: ${form.email.value}`,
      `Celular: ${form.phone.value}`,
      "",
      `Tipo de comunicación: ${form.communicationType.value}`,
      `Servicio contratado: ${form.service.value}`,
      `Monto reclamado: ${form.amount.value || "No indicado"}`,
      `Pedido del consumidor: ${form.request.value}`,
      "",
      "Descripción:",
      form.description.value,
    ].join("\n");

    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      `Libro de Reclamaciones - ${form.consumerName.value}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="grid gap-8" onSubmit={handleSubmit}>
      <ClaimsSection
        icon={<FileText className="h-5 w-5" />}
        title="1. Identificación del proveedor"
        description="Datos de la empresa que atiende la comunicación."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <ReadOnlyField label="Razón comercial" value={siteConfig.name} />
          {legalEntity.razonSocial ? <ReadOnlyField label="Razón social" value={legalEntity.razonSocial} /> : null}
          {legalEntity.ruc ? <ReadOnlyField label="RUC" value={legalEntity.ruc} /> : null}
          <ReadOnlyField label="Correo electrónico" value={siteConfig.email} />
          <ReadOnlyField label="Teléfono" value={siteConfig.whatsappDisplay} />
          <ReadOnlyField label="Dirección" value={siteConfig.address} />
        </div>
      </ClaimsSection>

      <ClaimsSection
        icon={<UserRound className="h-5 w-5" />}
        title="2. Datos del reclamo"
        description="Completa los datos del consumidor que presenta la comunicación."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Fecha y hora del incidente">
            <input name="incidentAt" type="datetime-local" className="field rounded-xl" required />
          </Field>
          <Field label="Nombre completo del consumidor">
            <input name="consumerName" placeholder="Nombres y apellidos" className="field rounded-xl" required />
          </Field>
          <Field label="Tipo de documento">
            <Select name="documentType" required placeholder="Seleccionar" options={["DNI", "Carné de extranjería", "Pasaporte"]} buttonClassName="rounded-xl" />
          </Field>
          <Field label="Número de documento">
            <input name="documentNumber" placeholder="Número de documento" className="field rounded-xl" required />
          </Field>
          <Field label="Domicilio fiscal o dirección">
            <input name="address" placeholder="Dirección del consumidor" className="field rounded-xl" required />
          </Field>
          <Field label="Correo electrónico">
            <input name="email" type="email" placeholder="correo@dominio.com" className="field rounded-xl" required />
          </Field>
          <Field label="Celular">
            <input name="phone" placeholder="+51 999 999 999" className="field rounded-xl" required />
          </Field>
        </div>
      </ClaimsSection>

      <ClaimsSection
        icon={<FileText className="h-5 w-5" />}
        title="3. Detalle del reclamo"
        description="Indica el servicio contratado y describe lo ocurrido."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Tipo de comunicación">
            <Select
              name="communicationType"
              defaultValue="Reclamo"
              buttonClassName="rounded-xl"
              options={[
                { value: "Reclamo", label: "Reclamo", hint: "Disconformidad con el servicio contratado" },
                { value: "Queja", label: "Queja", hint: "Malestar por la atención recibida" },
              ]}
            />
          </Field>
          <Field label="Servicio contratado">
            <input name="service" placeholder="Nombre de la experiencia o paquete" className="field rounded-xl" required />
          </Field>
          <Field label="Monto reclamado">
            <input name="amount" placeholder="S/ o USD" className="field rounded-xl" />
          </Field>
          <Field label="Pedido del consumidor">
            <input name="request" placeholder="Solución solicitada" className="field rounded-xl" required />
          </Field>
          <Field label="Descripción" wide>
            <textarea
              name="description"
              rows={6}
              placeholder="Describe los hechos de forma clara"
              className="field rounded-xl"
              required
            />
          </Field>
        </div>
      </ClaimsSection>

      <div className="surface-card p-6">
        <label className="surface-content flex items-start gap-3 text-sm leading-6 text-[#475467]">
          <input name="accepted" type="checkbox" className="mt-1" required />
          Declaro que la información consignada es verdadera y autorizo el uso de mis datos para la atención de esta
          comunicación.
        </label>
        <Button type="submit" className="surface-content mt-6 w-full sm:w-auto">
          <Send className="h-4 w-4" />
          Enviar reclamo
        </Button>
      </div>
    </form>
  );
}

export function ClaimsHeader({ siteName }: { siteName: string }) {
  return (
    <div className="surface-card mb-8 p-6">
      <div className="surface-content flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Legal y seguridad</p>
          <h1 className="mt-2 text-3xl font-bold text-[#021623] sm:text-4xl">Libro de Reclamaciones</h1>
          <p className="mt-3 text-[#667085]">
            Registra una queja o reclamo relacionado con los servicios de {siteName}.
          </p>
        </div>
        <BookOpen className="h-12 w-12 text-[#b97a0b]" />
      </div>
    </div>
  );
}

function ClaimsSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="surface-content mb-6 flex items-start gap-3">
        <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fdf0dc] text-[#b97a0b]">
          {icon}
        </span>
        <div>
          <h2 className="font-serif text-2xl font-bold text-black">{title}</h2>
          <p className="mt-2 text-sm text-black">{description}</p>
        </div>
      </div>
      <div className="surface-content">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
      <span className="text-sm font-bold text-black">{label}</span>
      {children}
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-bold text-black">{label}</span>
      <div className="min-h-12 rounded-xl border border-[#d0d5dd] bg-[#f9fafb] px-4 py-3 text-sm font-medium text-[#475467]">
        {value}
      </div>
    </div>
  );
}
