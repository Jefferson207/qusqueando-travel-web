import Link from "next/link";
import { Save } from "lucide-react";
import { upsertExperience } from "@/app/admin/actions";
import { GalleryField } from "@/components/admin/gallery-field";
import { ImageField } from "@/components/admin/image-field";
import { AdminPanel, adminPrimaryButton, adminSecondaryButton } from "@/components/admin/admin-ui";
import type { Category, Experience } from "@/lib/data";
import { currencies } from "@/lib/utils";

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
}: {
  experience?: Experience;
  categories: Category[];
}) {
  const value = { ...emptyExperience, ...experience };

  return (
    <form action={upsertExperience} className="mt-8 grid gap-6 pb-24">
      <input type="hidden" name="originalSlug" defaultValue={experience?.slug ?? ""} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <AdminPanel title="Información básica" description="Lo que ve el cliente en la tarjeta del paquete.">
          <div className="grid gap-4">
            <Field label="Nombre del paquete">
              <input name="name" defaultValue={value.name} className="field" required minLength={3} placeholder="Ej. Machu Picchu Full Day" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Categoría">
                <select name="category" defaultValue={value.category || categories[0]?.name} className="field">
                  {categories.map((category) => (
                    <option key={category.id}>{category.name}</option>
                  ))}
                </select>
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
                <select name="status" defaultValue={value.status} className="field">
                  <option value="ACTIVE">Publicado (visible en la web)</option>
                  <option value="DRAFT">Borrador (oculto)</option>
                </select>
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
                <select name="currency" defaultValue={value.currency} className="field">
                  {currencies.map((currency) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
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

      <AdminPanel title="Contenido" description="Escribe un elemento por línea.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Incluye">
            <textarea name="includes" defaultValue={value.includes?.join("\n")} rows={5} className="field" placeholder={"Guía especializado\nTransporte turístico"} />
          </Field>
          <Field label="No incluye">
            <textarea name="excludes" defaultValue={value.excludes?.join("\n")} rows={5} className="field" placeholder={"Almuerzo\nPropinas"} />
          </Field>
          <Field label="Itinerario" hint='Formato: "Título: descripción". Cada línea es un día o una etapa.'>
            <textarea
              name="itinerary"
              defaultValue={value.itinerary?.map((item) => `${item.title}: ${item.description}`).join("\n")}
              rows={6}
              className="field"
              placeholder={"Recojo del hotel: Salida a las 5:00 a. m.\nVisita guiada: Recorrido de 2 horas"}
            />
          </Field>
          <Field label="Preguntas frecuentes" hint='Formato: "¿Pregunta? Respuesta".'>
            <textarea
              name="faqs"
              defaultValue={value.faqs?.map((faq) => `${faq.question} ${faq.answer}`).join("\n")}
              rows={6}
              className="field"
              placeholder="¿Incluye entradas? Sí, todas las entradas están incluidas."
            />
          </Field>
        </div>
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
          <button type="submit" className={adminPrimaryButton}>
            <Save className="h-4 w-4" />
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
