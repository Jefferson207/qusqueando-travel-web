import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FolderTree, Loader2, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice, AdminPanel, adminPrimaryButton } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { api } from "@/lib/admin-api";
import { errorMessage, useAdmin, useAdminForm } from "@/pages/admin/admin-context";

export default function AdminCategoriesPage() {
  const { categories, experiences, reload } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [removeError, setRemoveError] = useState("");
  const saved = searchParams.get("saved") ?? undefined;
  const { error, saving, onSubmit } = useAdminForm(async ({ name }) => {
    setRemoveError("");
    await api("/api/category", { method: "POST", body: { name } });
    await reload();
    setSearchParams({ saved: "1" });
  });

  async function remove(slug: string) {
    setRemoveError("");
    try {
      await api(`/api/category?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      await reload();
      setSearchParams({ saved: "1" });
    } catch (deleteError) {
      setRemoveError(errorMessage(deleteError));
    }
  }

  return (
    <AdminShell>
      <AdminHeader title="Categorías" description="Agrupan los paquetes en el catálogo y en los filtros de la web." />
      <AdminNotice error={error || removeError || undefined} saved={saved} />

      <AdminPanel title="Nueva categoría" className="mt-8">
        <form key={categories.length} onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input name="name" placeholder="Ej. Aventura" className="field" required minLength={2} maxLength={60} />
          <button disabled={saving} className={`${adminPrimaryButton} disabled:opacity-60`}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Agregar
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
                onConfirm={() => remove(category.slug)}
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
