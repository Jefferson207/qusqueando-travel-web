import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice } from "@/components/admin/admin-ui";
import { ExperienceForm } from "@/components/admin/experience-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getCategories } from "@/lib/store";

export default async function NewExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const [{ error }, categories] = await Promise.all([searchParams, getCategories()]);

  return (
    <AdminShell>
      <Link href="/admin/experiencias" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#667085] hover:text-[#021623]">
        <ArrowLeft className="h-4 w-4" /> Volver a paquetes
      </Link>
      <AdminHeader title="Nuevo paquete" description="Completa los datos y sube las fotos del tour." />
      <AdminNotice error={error} />
      <ExperienceForm categories={categories} />
    </AdminShell>
  );
}
