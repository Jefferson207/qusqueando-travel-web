import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Trash2, Upload } from "lucide-react";
import { uploadImage } from "@/components/admin/image-field";

// Galería del admin: varias imágenes ordenables. Se envía como texto con una
// URL por línea en el campo `name`.
export function GalleryField({ name, defaultValue = [] }: { name: string; defaultValue?: string[] }) {
  const [images, setImages] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadImage(file);
        setImages((current) => [...current, uploaded]);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function move(index: number, direction: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={images.join("\n")} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#e4e7ec] bg-[#f9fafb]">
            <img src={image} alt="" className="h-full w-full object-cover" />
            <span className="absolute left-2 top-2 rounded-full bg-[#021623]/80 px-2 py-0.5 text-[0.65rem] font-semibold text-white">
              {index + 1}
            </span>
            <div className="absolute inset-x-2 bottom-2 flex justify-between gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <span className="flex gap-1">
                <button type="button" onClick={() => move(index, -1)} className="rounded-lg bg-white/90 p-1.5 text-[#344054] shadow" aria-label="Mover a la izquierda">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => move(index, 1)} className="rounded-lg bg-white/90 p-1.5 text-[#344054] shadow" aria-label="Mover a la derecha">
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </span>
              <button
                type="button"
                onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                className="rounded-lg bg-red-600 p-1.5 text-white shadow"
                aria-label="Quitar imagen"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#d0d5dd] bg-[#f9fafb] text-sm font-semibold text-[#475467] transition hover:border-[#d4952a] hover:text-[#8a5a08] disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
          {uploading ? "Subiendo..." : "Subir fotos"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      <p className="text-xs text-[#667085]">
        Se muestran en la página del paquete en este orden. Si la dejas vacía se usa la imagen principal.
      </p>
    </div>
  );
}
