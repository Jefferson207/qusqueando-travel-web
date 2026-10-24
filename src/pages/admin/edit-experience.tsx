import Link from "@/components/link";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice, adminSecondaryButton } from "@/components/admin/admin-ui";
import { ExperienceForm } from "@/components/admin/experience-form";
import { api } from "@/lib/admin-api";
import { experienceValues, useAdmin, useAdminForm } from "@/pages/admin/admin-context";

export default function EditExperiencePage() {
  const slug = useParams().slug ?? "";
  const { experiences, categories, reload } = useAdmin();
  const navigate = useNavigate();
  const experience = experiences.find((item) => item.slug === slug);
  const { error, saving, onSubmit } = useAdminForm(async (values) => {
    await api("/api/experience", { method: "PUT", body: experienceValues(values) });
    await reload();
    navigate("/admin/experiencias?saved=1");
  });
  if (!experience) return <Navigate to="/admin/experiencias" replace />;

  return (
    <AdminShell>
      <Link href="/admin/experiencias" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#667085] hover:text-[#021623]">
        <ArrowLeft className="h-4 w-4" /> Volver a paquetes
      </Link>
      <AdminHeader
        title={experience.name}
        description="Edita los datos, precios e imágenes del paquete."
        actions={
          <a href={`/experiencias/${encodeURIComponent(experience.slug)}`} target="_blank" rel="noreferrer" className={adminSecondaryButton}>
            <Eye className="h-4 w-4" /> Ver en la web
          </a>
        }
      />
      <AdminNotice error={error || undefined} />
      <ExperienceForm key={experience.slug} experience={experience} categories={categories} onSubmit={onSubmit} saving={saving} />
    </AdminShell>
  );
}
