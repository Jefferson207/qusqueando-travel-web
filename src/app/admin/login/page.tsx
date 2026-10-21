import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { loginAdmin } from "@/app/admin/actions";
import { getSiteConfig } from "@/lib/store";

export const metadata: Metadata = {
  title: "Login admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, config] = await Promise.all([searchParams, getSiteConfig()]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#021623] bg-[radial-gradient(circle_at_20%_10%,rgba(212,149,42,0.22),transparent_40%)] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center text-white">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo configurable */}
          <img src={config.logoMark} alt="" className="h-16 w-auto rounded-2xl bg-[#fbf6ee] p-2" />
          <p className="mt-4 text-lg font-bold">{config.name}</p>
          <p className="text-sm text-white/60">Panel de administración</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <h1 className="flex items-center gap-2 text-xl font-bold text-[#021623]">
            <LockKeyhole className="h-5 w-5 text-[#b97a0b]" /> Iniciar sesión
          </h1>
          {error ? (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error === "bloqueado"
                ? "Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo."
                : "Usuario o contraseña incorrectos."}
            </p>
          ) : null}
          <form action={loginAdmin} className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold text-[#344054]">
              Usuario
              <input name="username" autoComplete="username" className="field" required />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-[#344054]">
              Contraseña
              <input name="password" type="password" autoComplete="current-password" className="field" required />
            </label>
            <button
              className="mt-2 h-11 rounded-xl bg-[#d4952a] px-5 text-sm font-semibold text-[#021623] shadow transition hover:bg-[#b97a0b] hover:text-white"
              type="submit"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
