import type { Metadata } from "next";
import { loginAdmin } from "@/app/admin/actions";

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
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-[24px] border border-[#e4e7ec] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#021623]">Acceso administrador</h1>
        <p className="mt-2 text-sm text-[#667085]">
          Ingresa con el usuario administrador configurado en el servidor.
        </p>
        {error ? (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error === "bloqueado"
              ? "Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo."
              : "Usuario o contraseña incorrectos."}
          </p>
        ) : null}
        <form action={loginAdmin} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-[#344054]">
            Usuario
            <input name="username" autoComplete="username" className="field" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#344054]">
            Contraseña
            <input name="password" type="password" autoComplete="current-password" className="field" required />
          </label>
          <button className="h-11 rounded-full bg-[#021623] px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:scale-[1.03]" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </section>
  );
}
