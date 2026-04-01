import { Navigate, Outlet } from "react-router-dom";
import PantallaCarga from "../components/PantallaCarga/index.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAccess } from "../context/AccessContext.jsx";
import SinConexion from "../pages/SinConexion/index.jsx";

function renderRoute(children) {
    return children ?? <Outlet />;
}

function resolveAuthenticatedDestination({ onboardingSeen, hasCarrera }) {
    if (!onboardingSeen) return "/onboarding";
    if (!hasCarrera) return "/seleccionar-carrera";
    return "/inicio";
}

function AccessLoading() {
    return <PantallaCarga mensaje="Cargando..." />;
}

// Resuelve la landing inicial según sesión, onboarding y carrera.
export function RootRedirect() {
    const { loading: authLoading, isAuthenticated } = useAuth();
    const {
        loading: accessLoading,
        error,
        onboardingSeen,
        hasCarrera,
    } = useAccess();

    if (authLoading) return <AccessLoading />;
    if (!isAuthenticated) return <Navigate to="/onboarding" replace />;
    if (accessLoading) return <AccessLoading />;
    if (error) return <SinConexion />;

    return (
        <Navigate
            to={resolveAuthenticatedDestination({ onboardingSeen, hasCarrera })}
            replace
        />
    );
}

// Bloquea páginas públicas de auth cuando el usuario ya está autenticado.
export function GuestOnlyRoute({ children }) {
    const { loading: authLoading, isAuthenticated } = useAuth();
    const {
        loading: accessLoading,
        error,
        onboardingSeen,
        hasCarrera,
    } = useAccess();

    if (authLoading) return <AccessLoading />;
    if (!isAuthenticated) return renderRoute(children);
    if (accessLoading) return <AccessLoading />;
    if (error) return <SinConexion />;

    return (
        <Navigate
            to={resolveAuthenticatedDestination({ onboardingSeen, hasCarrera })}
            replace
        />
    );
}

// Permite onboarding a invitados y a usuarios logueados que aún no lo completaron.
export function OnboardingRoute({ children }) {
    const { loading: authLoading, isAuthenticated } = useAuth();
    const {
        loading: accessLoading,
        error,
        onboardingSeen,
        hasCarrera,
    } = useAccess();

    if (authLoading) return <AccessLoading />;
    if (!isAuthenticated) return renderRoute(children);
    if (accessLoading) return <AccessLoading />;
    if (error) return <SinConexion />;
    if (onboardingSeen) {
        return (
            <Navigate
                to={hasCarrera ? "/inicio" : "/seleccionar-carrera"}
                replace
            />
        );
    }

    return renderRoute(children);
}

// Exige sesión, pero no fuerza todavía onboarding ni carrera.
export function RequireAuthRoute({ children }) {
    const { loading: authLoading, isAuthenticated } = useAuth();

    if (authLoading) return <AccessLoading />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return renderRoute(children);
}

// Exige sesión, onboarding completo y carrera elegida.
export function RequireCareerRoute({ children }) {
    const { loading: authLoading, isAuthenticated } = useAuth();
    const {
        loading: accessLoading,
        error,
        onboardingSeen,
        hasCarrera,
    } = useAccess();

    if (authLoading) return <AccessLoading />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (accessLoading) return <AccessLoading />;
    if (error) return <SinConexion />;
    if (!onboardingSeen) return <Navigate to="/onboarding" replace />;
    if (!hasCarrera) return <Navigate to="/seleccionar-carrera" replace />;

    return renderRoute(children);
}

// Permite entrar a seleccionar carrera solo a usuarios autenticados sin carrera definida.
export function CareerSelectionRoute({ children }) {
    const { loading: authLoading, isAuthenticated } = useAuth();
    const {
        loading: accessLoading,
        error,
        onboardingSeen,
        hasCarrera,
    } = useAccess();

    if (authLoading) return <AccessLoading />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (accessLoading) return <AccessLoading />;
    if (error) return <SinConexion />;
    if (!onboardingSeen) return <Navigate to="/onboarding" replace />;
    if (hasCarrera) return <Navigate to="/inicio" replace />;

    return renderRoute(children);
}
