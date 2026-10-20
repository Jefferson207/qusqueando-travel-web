import type { Category, Experience } from "@/lib/data";
import { upsertExperience } from "@/app/admin/actions";
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
    <form action={upsertExperience} className="rounded-[24px] border border-[#e4e7ec] bg-white p-6 shadow-sm">
      <input type="hidden" name="originalSlug" defaultValue={experience?.slug ?? ""} />
      <div className="flex flex-col justify-between gap-4 border-b border-[#e4e7ec] pb-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#021623]">
            {experience ? "Editar experiencia" : "Nueva experiencia"}
          </h2>
          <p className="mt-1 text-sm text-[#667085]">Tours, paquetes y servicios usan el mismo formulario.</p>
        </div>
        <button className="h-11 rounded-full bg-[#021623] px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:scale-[1.03]" type="submit">
          Guardar
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Imagen principal">
          <input name="mainImage" type="url" defaultValue={value.mainImage} placeholder="https://res.cloudinary.com/..." className="field" required />
        </Field>
        <Field label="Nombre">
          <input name="name" defaultValue={value.name} className="field" required minLength={3} />
        </Field>
        <Field label="Categoría">
          <select name="category" defaultValue={value.category || categories[0]?.name} className="field">
            {categories.map((category) => (
              <option key={category.id}>{category.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Duración">
          <input name="duration" defaultValue={value.duration} className="field" required />
        </Field>
        <Field label="Ubicación">
          <input name="location" defaultValue={value.location} className="field" required />
        </Field>
        <Field label="Nivel">
          <input name="difficulty" defaultValue={value.difficulty} className="field" required />
        </Field>
        <Field label="Modalidad">
          <input name="modality" defaultValue={value.modality} className="field" required />
        </Field>
        <Field label="Precio desde">
          <input name="priceFrom" type="number" min={0} step="any" defaultValue={value.priceFrom} className="field" required />
        </Field>
        <Field label="Moneda">
          <select name="currency" defaultValue={value.currency} className="field">
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
        </Field>
        <Field label="Orden">
          <input name="order" type="number" step={1} defaultValue={value.order} className="field" />
        </Field>
        <Field label="Estado">
          <select name="status" defaultValue={value.status} className="field">
            <option value="ACTIVE">Activo</option>
            <option value="DRAFT">Borrador</option>
          </select>
        </Field>
        <label className="flex items-center gap-3 rounded-md border border-[#d0d5dd] px-4 py-3 text-sm font-medium text-[#344054]">
          <input name="featured" type="checkbox" defaultChecked={value.featured} />
          Destacado
        </label>
        <Field label="Descripción corta" wide>
          <textarea name="shortDescription" defaultValue={value.shortDescription} rows={3} className="field" required minLength={10} />
        </Field>
        <Field label="Descripción completa" wide>
          <textarea name="fullDescription" defaultValue={value.fullDescription} rows={5} className="field" required minLength={20} />
        </Field>
        <Field label="Galería" wide>
          <textarea name="gallery" defaultValue={value.gallery?.join("\n")} rows={3} className="field" placeholder="Una URL por línea" />
        </Field>
        <Field label="Incluye" wide>
          <textarea name="includes" defaultValue={value.includes?.join("\n")} rows={3} className="field" placeholder="Un ítem por línea" />
        </Field>
        <Field label="No incluye" wide>
          <textarea name="excludes" defaultValue={value.excludes?.join("\n")} rows={3} className="field" placeholder="Un ítem por línea" />
        </Field>
        <Field label="Itinerario" wide>
          <textarea name="itinerary" defaultValue={value.itinerary?.map((item) => `${item.title}: ${item.description}`).join("\n")} rows={4} className="field" placeholder="Título: descripción" />
        </Field>
        <Field label="Preguntas frecuentes" wide>
          <textarea name="faqs" defaultValue={value.faqs?.map((faq) => `${faq.question} ${faq.answer}`).join("\n")} rows={4} className="field" placeholder="Pregunta? Respuesta" />
        </Field>
        <Field label="SEO Title">
          <input name="seoTitle" defaultValue={value.seoTitle} className="field" />
        </Field>
        <Field label="SEO Description">
          <input name="seoDescription" defaultValue={value.seoDescription} className="field" />
        </Field>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
      <span className="text-sm font-medium text-[#344054]">{label}</span>
      {children}
    </label>
  );
}
