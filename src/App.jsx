import { Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';
import Buscar from './pages/Buscar/index.jsx';
import Mapa from './pages/Mapa/index.jsx';
import Cursada from './pages/Cursada/index.jsx';
import Perfil from './pages/Perfil/index.jsx';
import Inicio from './pages/Inicio/index.jsx';
import DetalleAula from './pages/DetalleAula/index.jsx';
import DetalleClase from './pages/DetalleClase/index.jsx';
import ReportarCambio from './pages/ReportarCambio/index.jsx';
import Notificaciones from './pages/Notificaciones/index.jsx';
import Onboarding from './pages/Onboarding/index.jsx';
import Bienvenida from './pages/Bienvenida/index.jsx';
import Registro from './pages/Registro/index.jsx';
import Login from './pages/Login/index.jsx';
import AuthCallback from './pages/AuthCallback/index.jsx';
import SeleccionCarrera from './pages/SeleccionCarrera/index.jsx';
import Logout from './pages/Logout/index.jsx';
import NotFound from './pages/NotFound/index.jsx';
import Navbar from './components/Navbar/index.jsx';
import Header from './components/Header/index.jsx';
import SidebarNav, { TopNavbar } from './components/Sidebar/index.jsx';
import NotificationDrawer from './components/NotificationDrawer/index.jsx';
import PantallaCarga from './components/PantallaCarga/index.jsx';
import {
  CareerSelectionRoute,
  GuestOnlyRoute,
  OnboardingRoute,
  RequireAuthRoute,
  RequireCareerRoute,
  RootRedirect,
  WelcomeRoute,
} from './guards/RouteGuard.jsx';

function AppLayout() {
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-base">
      
      {/* --- SIDEBAR LATERAL (Desktop) --- */}
      <SidebarNav />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* --- TOP HEADER (Mobile) --- */}
        <div className="lg:hidden">
          <Header />
        </div>

        {/* --- FRANJA SUPERIOR (Desktop) --- */}
        <TopNavbar toggleNotifs={() => setShowNotifs(!showNotifs)} showNotifs={showNotifs} />

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="flex-1 overflow-y-auto relative bg-neutral-white">
          <Outlet />
        </main>

        {/* --- PANEL LATERAL DE NOTIFICACIONES (Desktop) --- */}
        {showNotifs && (
          <NotificationDrawer onClose={() => setShowNotifs(false)} />
        )}

        {/* --- BOTTOM NAVBAR (Mobile) --- */}
        <div className="lg:hidden">
          <Navbar />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="w-full min-h-screen bg-base relative">
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/loading"
          element={<PantallaCarga mensaje="Cargando..." />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/404" element={<NotFound />} />

        <Route element={<OnboardingRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        <Route element={<WelcomeRoute />}>
          <Route path="/bienvenida" element={<Bienvenida />} />
        </Route>

        <Route element={<GuestOnlyRoute />}>
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<RequireAuthRoute />}>
          <Route path="/logout" element={<Logout />} />
        </Route>

        <Route element={<CareerSelectionRoute />}>
          <Route path="/seleccionar-carrera" element={<SeleccionCarrera />} />
        </Route>

        <Route element={<RequireCareerRoute />}>
          {/* no usan el layout compartido */}
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/reportar-cambio" element={<ReportarCambio />} />

          {/* sí usan el layout principal con Header + Navbar */}
          <Route element={<AppLayout />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/cursada" element={<Cursada />} />
            <Route path="/cursada/clases/:horarioId" element={<DetalleClase />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route
              path="/:edificioSlug/aulas/:aulaId"
              element={<DetalleAula />}
            />
            <Route path="/aulas/:aulaId" element={<DetalleAula />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
