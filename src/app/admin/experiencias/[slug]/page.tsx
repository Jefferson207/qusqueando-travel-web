import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice, adminSecondaryButton } from "@/components/admin/admin-ui";
import { ExperienceForm } from "@/components/admin/experience-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getCategories, getExperience } from "@/lib/store";

export default async function EditExperiencePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const [{ slug }, { error }] = await Promise.all([params, searchParams]);
  const [experience, categories] = await Promise.all([getExperience(decodeURIComponent(slug)), getCategories()]);
  if (!experience) notFound();

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
      <AdminNotice error={error} />
      <ExperienceForm key={experience.slug} experience={experience} categories={categories} />
    </AdminShell>
  );
}
