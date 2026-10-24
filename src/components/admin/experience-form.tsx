import Link from "@/components/link";
import { Loader2, Save } from "lucide-react";
import { GalleryField } from "@/components/admin/gallery-field";
import { ImageField } from "@/components/admin/image-field";
import { AdminPanel, adminPrimaryButton, adminSecondaryButton } from "@/components/admin/admin-ui";
import type { Category, Experience } from "@/lib/data";
import { currencies } from "@/lib/utils";
import { Select } from "@/components/ui/pickers";
import { PairListField, TextListField } from "@/components/admin/list-editors";

const emptyExperience: Partial<Experience> = {
  name: "",
  category: "",
  shortDescription: "",
  fullDescription: "",
  duration: "",
  location: "",
  difficulty: "Fácil",
  modality: "Privado o compartido",
  priceFrom: 0,
  currency: "USD",
  mainImage: "",
  gallery: [],
  includes: [],
  excludes: [],
  itinerary: [],
  faqs: [],
  status: "ACTIVE",
  featured: false,
  order: 0,
  seoTitle: "",
  seoDescription: "",
};

export function ExperienceForm({
  experience,
  categories,
  onSubmit,
  saving,
}: {
  experience?: Experience;
  categories: Category[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}) {
  const value = { ...emptyExperience, ...experience };

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-6 pb-24">
      <input type="hidden" name="originalSlug" defaultValue={experience?.slug ?? ""} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <AdminPanel title="Información básica" description="Lo que ve el cliente en la tarjeta del paquete.">
          <div className="grid gap-4">
            <Field label="Nombre del paquete">
              <input name="name" defaultValue={value.name} className="field" required minLength={3} placeholder="Ej. Machu Picchu Full Day" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Categoría">
                <Select name="category" defaultValue={value.category || categories[0]?.name} options={categories.map((category) => category.name)} />
              </Field>
              <Field label="Ubicación">
                <input name="location" defaultValue={value.location} className="field" required placeholder="Ej. Cusco y Machu Picchu" />
              </Field>
            </div>
            <Field label="Descripción corta" hint="Se muestra en las tarjetas (1 o 2 líneas).">
              <textarea name="shortDescription" defaultValue={value.shortDescription} rows={2} className="field" required minLength={10} />
            </Field>
            <Field label="Descripción completa">
              <textarea name="fullDescription" defaultValue={value.fullDescription} rows={6} className="field" required minLength={20} />
            </Field>
          </div>
        </AdminPanel>

        <div className="grid content-start gap-6">
          <AdminPanel title="Publicación">
            <div className="grid gap-4">
              <Field label="Estado">
                <Select
                  name="status"
                  defaultValue={value.status}
                  options={[
                    { value: "ACTIVE", label: "Publicado", hint: "Visible en la web" },
                    { value: "DRAFT", label: "Borrador", hint: "Oculto" },
                  ]}
                />
              </Field>
              <label className="flex items-center gap-3 rounded-xl border border-[#e4e7ec] px-4 py-3 text-sm font-medium text-[#344054]">
                <input name="featured" type="checkbox" defaultChecked={value.featured} className="h-4 w-4 accent-[#d4952a]" />
                Destacado en la página de inicio
              </label>
              <Field label="Orden" hint="Los números menores aparecen primero.">
                <input name="order" type="number" step={1} defaultValue={value.order} className="field" />
              </Field>
            </div>
          </AdminPanel>

          <AdminPanel title="Precio">
            <div className="grid grid-cols-[1fr_110px] gap-3">
              <Field label="Precio desde (por persona)">
                <input name="priceFrom" type="number" min={0} step="any" defaultValue={value.priceFrom} className="field" required />
              </Field>
              <Field label="Moneda">
                <Select name="currency" defaultValue={value.currency} options={[...currencies]} />
              </Field>
            </div>
          </AdminPanel>
        </div>
      </div>

      <AdminPanel title="Imágenes" description="Sube fotos horizontales (ideal 1600 × 1200 px, máx. 5 MB, JPG/PNG/WebP).">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <ImageField
            name="mainImage"
            label="Imagen principal"
            defaultValue={value.mainImage}
            previewClassName="aspect-[4/3]"
            hint="Se usa en las tarjetas y al compartir en redes."
            required
          />
          <div className="grid content-start gap-2">
            <span className="text-sm font-semibold text-[#344054]">Galería</span>
            <GalleryField name="gallery" defaultValue={value.gallery} />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Detalles del viaje">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Duración">
            <input name="duration" defaultValue={value.duration} className="field" required placeholder="Ej. Full day, 2 días" />
          </Field>
          <Field label="Nivel de dificultad">
            <input name="difficulty" defaultValue={value.difficulty} className="field" required list="niveles" />
            <datalist id="niveles">
              <option value="Fácil" />
              <option value="Moderado" />
              <option value="Exigente" />
            </datalist>
          </Field>
          <Field label="Modalidad">
            <input name="modality" defaultValue={value.modality} className="field" required list="modalidades" />
            <datalist id="modalidades">
              <option value="Privado" />
              <option value="Compartido" />
              <option value="Privado o compartido" />
            </datalist>
          </Field>
        </div>
      </AdminPanel>

      <AdminPanel title="Qué incluye" description="Lo que el cliente recibe y lo que debe pagar aparte.">
        <div className="grid gap-6 lg:grid-cols-2">
          <Field label="✅ Incluye">
            <TextListField name="includes" defaultValue={value.includes} placeholder="Ej.: Transporte turístico ida y vuelta" addLabel="Agregar lo que incluye" />
          </Field>
          <Field label="❌ No incluye">
            <TextListField name="excludes" defaultValue={value.excludes} placeholder="Ej.: Almuerzo" addLabel="Agregar lo que no incluye" />
          </Field>
        </div>
      </AdminPanel>

      <AdminPanel title="Itinerario" description="Cada paso aparece en la ficha como una línea de tiempo. Usa las flechas para ordenarlos.">
        <PairListField
          name="itinerary"
          numbered
          defaultValue={value.itinerary?.map((item) => ({ title: item.title, text: item.description }))}
          titlePlaceholder="Ej.: Día 1 · Llegada a Cusco  /  5:00 a. m. · Recojo del hotel"
          textPlaceholder="Qué se hace en este momento del viaje"
          addLabel="Agregar paso al itinerario"
        />
      </AdminPanel>

      <AdminPanel title="Preguntas frecuentes" description="Dudas comunes de los viajeros sobre este paquete.">
        <PairListField
          name="faqs"
          defaultValue={value.faqs?.map((faq) => ({ title: faq.question, text: faq.answer }))}
          titlePlaceholder="Ej.: ¿Incluye las entradas?"
          textPlaceholder="Respuesta"
          addLabel="Agregar pregunta"
        />
      </AdminPanel>

      <AdminPanel title="SEO (opcional)" description="Cómo aparece el paquete en Google. Si lo dejas vacío se genera automáticamente.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título SEO">
            <input name="seoTitle" defaultValue={value.seoTitle} className="field" maxLength={70} />
          </Field>
          <Field label="Descripción SEO">
            <input name="seoDescription" defaultValue={value.seoDescription} className="field" maxLength={160} />
          </Field>
        </div>
      </AdminPanel>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e4e7ec] bg-white/95 backdrop-blur lg:left-[260px]">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <Link href="/admin/experiencias" className={adminSecondaryButton}>
            Cancelar
          </Link>
          <button type="submit" disabled={saving} className={`${adminPrimaryButton} disabled:opacity-60`}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {experience ? "Guardar cambios" : "Crear paquete"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-[#344054]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[#667085]">{hint}</span> : null}
    </label>
  );
}
