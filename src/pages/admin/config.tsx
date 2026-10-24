import { useSearchParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice, AdminPanel, adminPrimaryButton } from "@/components/admin/admin-ui";
import { ImageField } from "@/components/admin/image-field";
import { socialNetworks } from "@/components/icons/social-icons";
import { api } from "@/lib/admin-api";
import { useAdmin, useAdminForm } from "@/pages/admin/admin-context";
import { CurrencySettings } from "@/components/admin/currency-settings";

export default function AdminConfigPage() {
  const { config, experiences, reload } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const saved = searchParams.get("saved") ?? undefined;
  const { error, saving, onSubmit } = useAdminForm(async (values) => {
    await api("/api/config", { method: "PUT", body: values });
    await reload();
    setSearchParams({ saved: "1" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return (
    <AdminShell>
      <AdminHeader title="Configuración del sitio" description="Logos, portadas, contacto y redes sociales de la web." />
      <AdminNotice error={error || undefined} saved={error ? undefined : saved} />

      <form onSubmit={onSubmit} className="mt-8 grid gap-6 pb-24">
        <AdminPanel title="Marca" description="Logos que se muestran en el menú superior y en el pie de página.">
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageField
              name="logoMark"
              label="Logo del menú (ícono)"
              defaultValue={config.logoMark}
              previewClassName="aspect-[3/2] bg-[#fbf6ea]"
              previewFit="contain"
              hint="PNG con fondo transparente. Se muestra junto al nombre."
              required
            />
            <ImageField
              name="logoFull"
              label="Logo completo (pie de página)"
              defaultValue={config.logoFull}
              previewClassName="aspect-[3/2] bg-[#fbf6ea]"
              previewFit="contain"
              hint="Logo con el nombre de la agencia."
              required
            />
          </div>
          <label className="mt-6 grid gap-1.5">
            <span className="text-sm font-semibold text-[#344054]">Nombre de la agencia</span>
            <input name="name" defaultValue={config.name} className="field" required />
          </label>
        </AdminPanel>

        <AdminPanel title="Portada principal" description="La primera pantalla de la página de inicio.">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <ImageField
              name="heroImage"
              label="Imagen de portada"
              defaultValue={config.heroImage}
              previewClassName="aspect-[21/9]"
              hint="Foto horizontal grande: mínimo 2000 px de ancho para que se vea nítida."
              required
            />
            <div className="grid content-start gap-4">
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-[#344054]">Título</span>
                <input name="heroTitle" defaultValue={config.heroTitle} className="field" required />
                <span className="text-xs text-[#667085]">
                  Lo que escribas después de <strong>|</strong> aparece en dorado cursiva. Ej.: Vive el Perú | como nunca antes
                </span>
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-[#344054]">Subtítulo</span>
                <textarea name="heroSubtitle" defaultValue={config.heroSubtitle} rows={4} className="field" required />
              </label>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Sección «¿Por qué elegir Qusqueando?»" description="Imagen de fondo de la sección oscura de la página de inicio.">
          <div className="max-w-xl">
            <ImageField
              name="aboutImage"
              label="Imagen de fondo"
              defaultValue={config.aboutImage}
              previewClassName="aspect-[21/9]"
              hint="El texto va a la derecha: usa una foto con el motivo principal a la izquierda."
              required
            />
          </div>
        </AdminPanel>

        <AdminPanel title="Contacto" description="Se usa en los botones de WhatsApp, el pie de página y las páginas legales.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-[#344054]">Número de WhatsApp</span>
              <input name="whatsappDisplay" defaultValue={config.whatsappDisplay} className="field" required placeholder="+51 916 788 768" />
              <span className="text-xs text-[#667085]">
                Escríbelo como quieres que se vea. Si no pones código de país se asume Perú (+51).
              </span>
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-[#344054]">Correo electrónico</span>
              <input name="email" type="email" defaultValue={config.email} className="field" required />
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="text-sm font-semibold text-[#344054]">Dirección</span>
              <input name="address" defaultValue={config.address} className="field" required />
            </label>
          </div>
        </AdminPanel>

        <CurrencySettings config={config} sample={{ price: experiences.find((item) => item.priceFrom)?.priceFrom ?? 289, currency: experiences.find((item) => item.priceFrom)?.currency ?? "USD" }} />

        <AdminPanel title="Redes sociales" description="Deja vacío el campo de una red para ocultarla en la web.">
          <div className="grid gap-4 sm:grid-cols-2">
            {socialNetworks.map(({ key, label, Icon }) => (
              <label key={key} className="grid gap-1.5">
                <span className="flex items-center gap-2 text-sm font-semibold text-[#344054]">
                  <Icon className="h-4 w-4 text-[#b97a0b]" /> {label}
                </span>
                <input
                  name={key}
                  type="url"
                  defaultValue={config.socials[key]}
                  className="field"
                  placeholder={`https://${key === "youtube" ? "youtube.com/@" : `${key}.com/`}tuagencia`}
                />
              </label>
            ))}
          </div>
        </AdminPanel>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e4e7ec] bg-white/95 backdrop-blur lg:left-[260px]">
          <div className="mx-auto flex max-w-6xl justify-end px-4 py-3 sm:px-6 lg:px-10">
            <button type="submit" disabled={saving} className={`${adminPrimaryButton} disabled:opacity-60`}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar configuración
            </button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
