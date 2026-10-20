import { requireAdmin } from "@/lib/admin-auth";
import { getExperiences, seedRedisIfEmpty } from "@/lib/store";
import { logoutAdmin } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminPage() {
  await requireAdmin();
  await seedRedisIfEmpty();
  const experiences = await getExperiences();
  const active = experiences.filter((experience) => experience.status === "ACTIVE").length;
  const featured = experiences.filter((experience) => experience.featured).length;

  return (
    <AdminShell>
      <section>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#021623]">Dashboard</h1>
        <form action={logoutAdmin}>
          <button className="rounded-full border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-semibold text-[#344054] shadow-sm transition hover:bg-[#f6f7f9]">
            Cerrar sesión
          </button>
        </form>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Total experiencias" value={experiences.length} />
        <Metric label="Experiencias activas" value={active} />
        <Metric label="Experiencias destacadas" value={featured} />
      </div>
      </section>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-[#e4e7ec] bg-white p-6 shadow-sm">
      <p className="text-sm text-[#667085]">{label}</p>
      <p className="mt-3 text-4xl font-bold text-[#021623]">{value}</p>
    </div>
  );
}
