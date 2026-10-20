import { updateSiteConfig } from "@/app/admin/actions";
import { AdminNotice, AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteConfig } from "@/lib/store";

export default async function AdminConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const [{ error, saved }, config] = await Promise.all([searchParams, getSiteConfig()]);

  return (
    <AdminShell>
      <section>
      <h1 className="text-3xl font-bold text-[#021623]">Configuración</h1>
      <AdminNotice error={error} saved={saved} />
      <form action={updateSiteConfig} className="mt-6 grid gap-5 rounded-[24px] border border-[#e4e7ec] bg-white p-6 shadow-sm">
        <Field label="Nombre empresa" name="name" value={config.name} />
        <Field label="WhatsApp visible" name="whatsappDisplay" value={config.whatsappDisplay} />
        <Field label="WhatsApp técnico (solo dígitos con código de país)" name="whatsapp" value={config.whatsapp} pattern="\+?\d{8,15}" />
        <Field label="Correo" name="email" value={config.email} type="email" />
        <Field label="Dirección" name="address" value={config.address} />
        <Field label="Texto Hero" name="heroTitle" value={config.heroTitle} />
        <Field label="Subtítulo Hero" name="heroSubtitle" value={config.heroSubtitle} />
        <Field label="Imagen Hero (URL https de Cloudinary, Unsplash o qusqueandotravel.com)" name="heroImage" value={config.heroImage} type="url" />
        <button className="h-11 w-fit rounded-full bg-[#021623] px-6 text-sm font-semibold text-white">
          Guardar configuración
        </button>
      </form>
      </section>
    </AdminShell>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  pattern,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  pattern?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#344054]">
      {label}
      <input name={name} defaultValue={value} type={type} pattern={pattern} className="field" required />
    </label>
  );
}
