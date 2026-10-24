import Link from "@/components/link";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice } from "@/components/admin/admin-ui";
import { ExperienceForm } from "@/components/admin/experience-form";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/admin-api";
import { experienceValues, useAdmin, useAdminForm } from "@/pages/admin/admin-context";

export default function NewExperiencePage() {
  const { categories, reload } = useAdmin();
  const navigate = useNavigate();
  const { error, saving, onSubmit } = useAdminForm(async (values) => {
    await api("/api/experience", { method: "PUT", body: experienceValues(values) });
    await reload();
    navigate("/admin/experiencias?saved=1");
  });

  return (
    <AdminShell>
      <Link href="/admin/experiencias" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#667085] hover:text-[#021623]">
        <ArrowLeft className="h-4 w-4" /> Volver a paquetes
      </Link>
      <AdminHeader title="Nuevo paquete" description="Completa los datos y sube las fotos del tour." />
      <AdminNotice error={error || undefined} />
      <ExperienceForm categories={categories} onSubmit={onSubmit} saving={saving} />
    </AdminShell>
  );
}
