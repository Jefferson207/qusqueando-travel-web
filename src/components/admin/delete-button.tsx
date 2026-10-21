"use client";

import { Trash2 } from "lucide-react";

// Botón de eliminar que pide confirmación antes de enviar la acción.
export function DeleteButton({
  action,
  name,
  value,
  label,
  confirmText,
}: {
  action: (formData: FormData) => void | Promise<void>;
  name: string;
  value: string;
  label?: string;
  confirmText: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      }}
    >
      <input type="hidden" name={name} value={value} />
      <button
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
        aria-label={label ?? "Eliminar"}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {label ?? "Eliminar"}
      </button>
    </form>
  );
}
