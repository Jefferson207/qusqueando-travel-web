"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { useSiteConfig } from "@/components/site-config-provider";
import { siteDomain, whatsappMessageUrl } from "@/lib/site";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm() {
  const siteConfig = useSiteConfig();
  const [form, setForm] = useState(initialForm);

  const whatsappHref = useMemo(() => {
    const name = form.name.trim();
    const lines = [
      `¡Hola, *Qusqueando Travel*! 👋 Soy *${name || "un viajero"}*.`,
      "",
      "Quiero *planificar una experiencia* con ustedes 🏔️",
      "",
      "📝 *Mis datos de contacto:*",
      `👤 Nombre: ${name || "—"}`,
      form.phone.trim() ? `📱 Teléfono: ${form.phone.trim()}` : null,
      form.email.trim() ? `✉️ Correo: ${form.email.trim()}` : null,
      ...(form.message.trim() ? ["", "💬 *Mensaje:*", form.message.trim()] : []),
      "",
      `🌐 _Enviado desde el formulario de contacto de ${siteDomain}_`,
    ].filter((line) => line !== null);

    return whatsappMessageUrl(siteConfig.whatsapp, lines.join("\n"));
  }, [form, siteConfig.whatsapp]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="surface-card p-6 sm:p-7">
      <div className="surface-content grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-[#344054]">
          Nombre
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="field"
            autoComplete="name"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#344054]">
          Correo
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="field"
            autoComplete="email"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#344054]">
          Teléfono
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="field"
            autoComplete="tel"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#344054]">
          Mensaje
          <textarea
            rows={6}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            className="field"
          />
        </label>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className={buttonClassName("primary", "w-full")}>
          <MessageCircle className="h-4 w-4" />
          Enviar por WhatsApp
        </a>
      </div>
    </form>
  );
}
