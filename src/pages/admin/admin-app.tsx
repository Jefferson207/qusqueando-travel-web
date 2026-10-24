import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSeo } from "@/components/seo";
import { ApiError, api, getToken, setToken } from "@/lib/admin-api";
import { AdminContext, errorMessage, type AdminData } from "@/pages/admin/admin-context";
import AdminBookingsPage from "@/pages/admin/bookings";
import AdminCategoriesPage from "@/pages/admin/categories";
import AdminConfigPage from "@/pages/admin/config";
import AdminPage from "@/pages/admin/dashboard";
import EditExperiencePage from "@/pages/admin/edit-experience";
import AdminExperiencesPage from "@/pages/admin/experiences";
import AdminLoginPage from "@/pages/admin/login";
import NewExperiencePage from "@/pages/admin/new-experience";

function AdminArea() {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    setToken("");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const reload = useCallback(async () => {
    try {
      setData(await api<AdminData>("/api/admin"));
      setError("");
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) logout();
      else setError(errorMessage(loadError));
    }
  }, [logout]);

  useEffect(() => {
    void reload();
  }, [reload]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4 text-sm font-medium text-[#475467]">
        {error ? (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-red-700">
            {error}{" "}
            <button className="font-semibold underline" onClick={() => void reload()}>
              Reintentar
            </button>
          </p>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Cargando panel...
          </span>
        )}
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ ...data, reload, logout }}>
      <Routes>
        <Route index element={<AdminPage />} />
        <Route path="experiencias" element={<AdminExperiencesPage />} />
        <Route path="experiencias/nueva" element={<NewExperiencePage />} />
        <Route path="experiencias/:slug" element={<EditExperiencePage />} />
        <Route path="reservas" element={<AdminBookingsPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
        <Route path="configuracion" element={<AdminConfigPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminContext.Provider>
  );
}

export default function AdminApp() {
  const { pathname } = useLocation();
  useSeo({ path: pathname, title: "Admin", description: "Panel de administración.", noindex: true });

  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="*" element={getToken() ? <AdminArea /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
