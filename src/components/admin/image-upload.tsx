"use client";

import { ImagePlus } from "lucide-react";

export function ImageUpload({
  label = "Imagen",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#344054]">
      {label}
      <span className="flex items-center gap-3">
        <ImagePlus className="h-5 w-5 text-[#b97a0b]" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="URL de Cloudinary"
          className="field"
        />
      </span>
    </label>
  );
}
