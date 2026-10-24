import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { FloatingWhatsappChat } from "@/components/floating-whatsapp-chat";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { WhatsappDesktopLinks } from "@/components/whatsapp-desktop-links";
import AboutPage from "@/pages/about";
import BookingPage from "@/pages/booking";
import ClaimsBookPage from "@/pages/claims";
import ContactPage from "@/pages/contact";
import EsnnaPage from "@/pages/esnna";
import ExperienceDetailPage from "@/pages/experience-detail";
import ExperiencesPage from "@/pages/experiences";
import Home from "@/pages/home";
import LegalRoute, { legalRoutes } from "@/pages/legal";
import NotFound from "@/pages/not-found";

// El panel se descarga solo al entrar a /admin.
const AdminApp = lazy(() => import("@/pages/admin/admin-app"));

/** Al cambiar de página se vuelve arriba (o al ancla #seccion si la hay). */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function PublicSite() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route index element={<Home />} />
          <Route path="experiencias" element={<ExperiencesPage />} />
          <Route path="experiencias/:slug" element={<ExperienceDetailPage />} />
          <Route path="reservar" element={<BookingPage />} />
          <Route path="reservar/:slug" element={<BookingPage />} />
          <Route path="nosotros" element={<AboutPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="libro-de-reclamaciones" element={<ClaimsBookPage />} />
          <Route path="afiche-esnna-mincetur" element={<EsnnaPage />} />
          {(Object.keys(legalRoutes) as (keyof typeof legalRoutes)[]).map((path) => (
            <Route key={path} path={path.slice(1)} element={<LegalRoute path={path} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsappChat />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<PublicSite />} />
      </Routes>
      <WhatsappDesktopLinks />
    </>
  );
}
