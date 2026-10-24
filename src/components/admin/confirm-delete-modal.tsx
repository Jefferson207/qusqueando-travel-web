import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteModal({
  title,
  onConfirm,
}: {
  title: string;
  onConfirm: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <Trash2 className="mt-0.5 h-5 w-5 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-950">Eliminar {title}</h3>
          <p className="mt-1 text-sm text-red-800">Esta acción debe confirmarse antes de borrar el registro.</p>
          <Button type="button" variant="secondary" className="mt-4 bg-red-700 hover:bg-red-800" onClick={onConfirm}>
            Confirmar eliminación
          </Button>
        </div>
      </div>
    </div>
  );
}
