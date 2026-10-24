import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

// Botón de eliminar que pide confirmación antes de ejecutar la acción.
export function DeleteButton({
  onConfirm,
  label,
  confirmText,
}: {
  onConfirm: () => Promise<void>;
  label?: string;
  confirmText: string;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!window.confirm(confirmText)) return;
        setBusy(true);
        try {
          await onConfirm();
        } finally {
          setBusy(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
      aria-label={label ?? "Eliminar"}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {label ?? "Eliminar"}
    </button>
  );
}
