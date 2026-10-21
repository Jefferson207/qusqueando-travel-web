import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold text-[#021623] sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-[#667085]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminPanel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-[#e4e7ec] bg-white p-5 shadow-sm sm:p-6", className)}>
      {title ? (
        <header className="mb-5">
          <h2 className="text-base font-bold text-[#021623]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[#667085]">{description}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function AdminNotice({ error, saved }: { error?: string; saved?: string }) {
  if (error) {
    return (
      <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        {error}
      </p>
    );
  }

  if (saved) {
    return (
      <p role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-[#d9dfa8] bg-[#f4f6e3] px-4 py-3 text-sm font-medium text-[#5c6312]">
        <CheckCircle2 className="h-4 w-4" />
        Cambios guardados correctamente.
      </p>
    );
  }

  return null;
}

export const adminPrimaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#d4952a] px-5 text-sm font-semibold text-[#021623] shadow-sm transition hover:bg-[#b97a0b] hover:text-white";
export const adminSecondaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d0d5dd] bg-white px-5 text-sm font-semibold text-[#344054] shadow-sm transition hover:bg-[#f6f7f9]";
