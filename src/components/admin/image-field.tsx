"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "No se pudo subir la imagen.");
  }
  return data.url;
}

// Campo de imagen del admin: vista previa, botón para subir desde la
// computadora y, opcionalmente, pegar una URL o ruta /images/... a mano.
export function ImageField({
  name,
  label,
  defaultValue = "",
  hint,
  previewClassName = "aspect-[16/9]",
  previewFit = "cover",
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  previewClassName?: string;
  previewFit?: "cover" | "contain";
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      setValue(await uploadImage(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold text-[#344054]">{label}</span>
      <div
        className={`relative overflow-hidden rounded-2xl border border-dashed border-[#d0d5dd] bg-[#f9fafb] ${previewClassName}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- vista previa de URLs arbitrarias
          <img
            src={value}
            alt=""
            className={`h-full w-full ${previewFit === "contain" ? "object-contain p-3" : "object-cover"}`}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-[#98a2b3]">
            <ImagePlus className="h-7 w-7" />
            Sin imagen
          </div>
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-[#344054]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Subiendo...
          </div>
        ) : null}
      </div>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="/images/... o https://..."
          className="field min-w-0 flex-1 text-xs"
          required={required}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#021623] px-4 text-sm font-semibold text-white transition hover:bg-[#0b2a3c] disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          Subir
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-[#667085]">{hint}</p> : null}
    </div>
  );
}
