import Link from "next/link";
import { Eye, Flame, Pencil, Plus } from "lucide-react";
import { removeExperience } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice, adminPrimaryButton } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { requireAdmin } from "@/lib/admin-auth";
import { getExperiences } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const [{ error, saved }, experiences] = await Promise.all([searchParams, getExperiences()]);

  return (
    <AdminShell>
      <AdminHeader
        title="Paquetes"
        description={`${experiences.length} paquetes · tours, paquetes y servicios turísticos.`}
        actions={
          <Link href="/admin/experiencias/nueva" className={adminPrimaryButton}>
            <Plus className="h-4 w-4" /> Nuevo paquete
          </Link>
        }
      />
      <AdminNotice error={error} saved={saved} />

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#e4e7ec] bg-white shadow-sm">
        {experiences.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-[#021623]">Aún no hay paquetes</p>
            <p className="mt-1 text-sm text-[#667085]">Crea el primero para mostrarlo en la web.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#eaecf0]">
            {experiences.map((experience) => (
              <li key={experience.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de URL configurable */}
                  <img src={experience.mainImage} alt="" className="h-16 w-24 shrink-0 rounded-xl bg-[#f2f4f7] object-cover" />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate font-semibold text-[#021623]">
                      {experience.name}
                      {experience.featured ? <Flame className="h-4 w-4 shrink-0 text-[#c4512b]" aria-label="Destacado" /> : null}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-[#667085]">
                      {experience.category} · {experience.duration} · {formatCurrency(experience.priceFrom, experience.currency)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      experience.status === "ACTIVE"
                        ? "rounded-full bg-[#ecfdf3] px-2.5 py-1 text-xs font-semibold text-[#067647]"
                        : "rounded-full bg-[#f2f4f7] px-2.5 py-1 text-xs font-semibold text-[#475467]"
                    }
                  >
                    {experience.status === "ACTIVE" ? "Publicado" : "Borrador"}
                  </span>
                  <Link
                    href={`/admin/experiencias/${encodeURIComponent(experience.slug)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0d5dd] px-3 py-1.5 text-xs font-semibold text-[#344054] transition hover:bg-[#f6f7f9]"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                  <a
                    href={`/experiencias/${encodeURIComponent(experience.slug)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0d5dd] px-3 py-1.5 text-xs font-semibold text-[#344054] transition hover:bg-[#f6f7f9]"
                  >
                    <Eye className="h-3.5 w-3.5" /> {experience.status === "ACTIVE" ? "Ver" : "Vista previa"}
                  </a>
                  <DeleteButton
                    action={removeExperience}
                    name="slug"
                    value={experience.slug}
                    confirmText={`¿Eliminar "${experience.name}"? Esta acción no se puede deshacer.`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
