import { removeCategory, upsertCategory } from "@/app/admin/actions";
import { AdminNotice, AdminShell } from "@/components/admin/admin-shell";
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
      <section>
      <h1 className="text-3xl font-bold text-[#021623]">Categorías</h1>
      <AdminNotice error={error} saved={saved} />
      <form action={upsertCategory} className="mt-6 flex flex-col gap-3 rounded-[24px] border border-[#e4e7ec] bg-white p-5 shadow-sm sm:flex-row">
        <input name="name" placeholder="Nueva categoría" className="field" required minLength={2} maxLength={60} />
        <button className="h-11 rounded-full bg-[#021623] px-5 text-sm font-semibold text-white">
          Guardar
        </button>
      </form>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-[24px] border border-[#e4e7ec] bg-white p-5 shadow-sm">
            <p className="font-semibold text-[#021623]">{category.name}</p>
            <p className="mt-1 text-sm text-[#667085]">
              {experiences.filter((experience) => experience.category === category.name).length} experiencia(s)
            </p>
            <form action={removeCategory} className="mt-4">
              <input type="hidden" name="slug" value={category.slug} />
              <button className="text-sm font-semibold text-red-700">Eliminar</button>
            </form>
          </div>
        ))}
      </div>
      </section>
    </AdminShell>
  );
}
