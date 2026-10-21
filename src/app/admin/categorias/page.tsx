import { FolderTree, Plus } from "lucide-react";
import { removeCategory, upsertCategory } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice, AdminPanel, adminPrimaryButton } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { requireAdmin } from "@/lib/admin-auth";
import { getCategories, getExperiences } from "@/lib/store";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const [{ error, saved }, categories, experiences] = await Promise.all([
    searchParams,
    getCategories(),
    getExperiences(),
  ]);

  return (
    <AdminShell>
      <AdminHeader title="Categorías" description="Agrupan los paquetes en el catálogo y en los filtros de la web." />
      <AdminNotice error={error} saved={saved} />

      <AdminPanel title="Nueva categoría" className="mt-8">
        <form action={upsertCategory} className="flex flex-col gap-3 sm:flex-row">
          <input name="name" placeholder="Ej. Aventura" className="field" required minLength={2} maxLength={60} />
          <button className={adminPrimaryButton}>
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </form>
      </AdminPanel>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = experiences.filter((experience) => experience.category === category.name).length;
          return (
            <div key={category.id} className="flex items-center gap-4 rounded-2xl border border-[#e4e7ec] bg-white p-4 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fdf0dc] text-[#8a5a08]">
                <FolderTree className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-[#021623]">{category.name}</span>
                <span className="block text-xs text-[#667085]">
                  {count} {count === 1 ? "paquete" : "paquetes"}
                </span>
              </span>
              <DeleteButton
                action={removeCategory}
                name="slug"
                value={category.slug}
                label="Quitar"
                confirmText={`¿Eliminar la categoría "${category.name}"?`}
              />
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
