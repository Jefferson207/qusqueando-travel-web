import { useNavigate } from "react-router-dom";
import { Loader2, LockKeyhole } from "lucide-react";
import { useSiteConfig } from "@/components/site-config-provider";
import { api, setToken } from "@/lib/admin-api";
import { useAdminForm } from "@/pages/admin/admin-context";

export default function AdminLoginPage() {
  const config = useSiteConfig();
  const navigate = useNavigate();
  const { error, saving, onSubmit } = useAdminForm(async ({ username, password }) => {
    const { token } = await api<{ token: string }>("/api/login", { method: "POST", body: { username, password } });
    setToken(token);
    navigate("/admin", { replace: true });
  });

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#021623] bg-[radial-gradient(circle_at_20%_10%,rgba(212,149,42,0.22),transparent_40%)] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center text-white">
          <img src={config.logoMark} alt="" className="h-16 w-auto rounded-2xl bg-[#fbf6ea] p-2" />
          <p className="mt-4 text-lg font-bold">{config.name}</p>
          <p className="text-sm text-white/60">Panel de administración</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <h1 className="flex items-center gap-2 text-xl font-bold text-[#021623]">
            <LockKeyhole className="h-5 w-5 text-[#b97a0b]" /> Iniciar sesión
          </h1>
          {error ? (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}
          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
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
              disabled={saving}
            >
              {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
