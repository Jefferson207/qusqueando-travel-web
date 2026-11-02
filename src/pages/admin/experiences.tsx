import Link from "@/components/link";
import { Eye, EyeOff, Flame, Loader2, Pencil, Plus, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminHeader, AdminNotice, adminPrimaryButton } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/admin-api";
import { errorMessage, useAdmin } from "@/pages/admin/admin-context";
import { formatCurrency } from "@/lib/utils";
import type { Experience } from "@/lib/data";

export default function AdminExperiencesPage() {
  const { experiences, reload } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState("");
  const saved = searchParams.get("saved") ?? undefined;
  const term = query.trim().toLowerCase();
  const visible = term
    ? experiences.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(term))
    : experiences;

  // Cambio rápido desde la lista (publicar / destacar) sin abrir el formulario.
  async function quickUpdate(experience: Experience, patch: Partial<Experience>) {
    setError("");
    setBusy(experience.slug);
    try {
      const next = { ...experience, ...patch };
      await api("/api/experience", {
        method: "PUT",
        body: {
          ...next,
          originalSlug: experience.slug,
          gallery: next.gallery.join("\n"),
          itinerary: next.itinerary.map((step) => ({ title: step.title, text: step.description })),
          faqs: next.faqs.map((faq) => ({ title: faq.question, text: faq.answer })),
        },
      });
      await reload();
    } catch (updateError) {
      setError(errorMessage(updateError));
    } finally {
      setBusy("");
    }
  }

  async function remove(slug: string) {
    setError("");
    try {
      await api(`/api/experience?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      await reload();
      setSearchParams({ saved: "1" });
    } catch (removeError) {
      setError(errorMessage(removeError));
    }
  }

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
      <AdminNotice error={error || undefined} saved={saved} />

      {experiences.length > 4 ? (
        <label className="mt-6 flex items-center gap-2 rounded-xl border border-[#d0d5dd] bg-white px-3 shadow-sm focus-within:border-[#d4952a]">
          <Search className="h-4 w-4 text-[#98a2b3]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar paquete por nombre o categoría" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </label>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#e4e7ec] bg-white shadow-sm">
        {experiences.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-[#021623]">Aún no hay paquetes</p>
            <p className="mt-1 text-sm text-[#667085]">Crea el primero para mostrarlo en la web.</p>
          </div>
        ) : !visible.length ? (
          <p className="p-10 text-center text-sm text-[#667085]">Ningún paquete coincide con «{query}».</p>
        ) : (
          <ul className="divide-y divide-[#eaecf0]">
            {visible.map((experience) => (
              <li key={experience.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <img src={experience.mainImage} alt="" className="h-16 w-24 shrink-0 rounded-xl bg-[#f2f4f7] object-cover" />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate font-semibold text-[#021623]">
                      {experience.name}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-[#667085]">
                      {experience.category} · {experience.duration} · {experience.priceFrom ? formatCurrency(experience.priceFrom, experience.currency) : "A consultar"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {busy === experience.slug ? <Loader2 className="h-4 w-4 animate-spin text-[#98a2b3]" /> : null}
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => quickUpdate(experience, { status: experience.status === "ACTIVE" ? "DRAFT" : "ACTIVE" })}
                    title={experience.status === "ACTIVE" ? "Clic para ocultarlo de la web" : "Clic para publicarlo en la web"}
                    className={
                      experience.status === "ACTIVE"
                        ? "inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-3 py-1.5 text-xs font-semibold text-[#067647] transition hover:bg-[#d1fadf] disabled:opacity-60"
                        : "inline-flex items-center gap-1.5 rounded-full bg-[#f2f4f7] px-3 py-1.5 text-xs font-semibold text-[#475467] transition hover:bg-[#e4e7ec] disabled:opacity-60"
                    }
                  >
                    {experience.status === "ACTIVE" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {experience.status === "ACTIVE" ? "Publicado" : "Oculto"}
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => quickUpdate(experience, { featured: !experience.featured })}
                    title={experience.featured ? "Clic para quitarlo de la página de inicio" : "Clic para mostrarlo en la página de inicio"}
                    className={
                      experience.featured
                        ? "inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-3 py-1.5 text-xs font-semibold text-[#c4512b] transition hover:bg-[#fde3d3] disabled:opacity-60"
                        : "inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#d0d5dd] px-3 py-1.5 text-xs font-semibold text-[#667085] transition hover:bg-[#f6f7f9] disabled:opacity-60"
                    }
                  >
                    <Flame className="h-3.5 w-3.5" />
                    {experience.featured ? "En inicio" : "No en inicio"}
                  </button>
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
                    onConfirm={() => remove(experience.slug)}
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
