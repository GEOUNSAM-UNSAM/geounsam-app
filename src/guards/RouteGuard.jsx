import { Navigate, Outlet } from "react-router-dom";
import PantallaCarga from "../components/PantallaCarga/index.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAccess } from "../context/AccessContext.jsx";

function renderRoute(children) {
    return children ?? <Outlet />;
}

function AccessErrorNotice({ message }) {
    return (
        <div className="fixed left-4 right-4 top-4 z-[60] rounded-xl border border-error bg-state-red px-4 py-3 shadow-md">
            <p className="font-saira text-sm leading-5 text-neutral-extra-dark">
                Error de acceso: {message}
            </p>
        </div>
    );
}

function renderRouteWithAccessError(children, message) {
    return (
        <>
            {renderRoute(children)}
            <AccessErrorNotice message={message} />
        </>
    );
}

function hasGuestCompletedOnboarding() {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("onboarding_completado") === "1";
}

function resolveGuestDestination() {
    return hasGuestCompletedOnboarding() ? "/bienvenida" : "/onboarding";
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
    if (!isAuthenticated) return <Navigate to={resolveGuestDestination()} replace />;
    if (accessLoading) return <AccessLoading />;
    if (error) {
        return (
            <>
                <AccessLoading />
                <AccessErrorNotice message={error} />
            </>
        );
    }

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
    if (error) return renderRouteWithAccessError(children, error);

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
    if (!isAuthenticated) {
        if (hasGuestCompletedOnboarding()) {
            return <Navigate to="/bienvenida" replace />;
        }

        return renderRoute(children);
    }
    if (accessLoading) return <AccessLoading />;
    if (error) return renderRouteWithAccessError(children, error);
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

export function WelcomeRoute({ children }) {
    const { loading: authLoading, isAuthenticated } = useAuth();
    const {
        loading: accessLoading,
        error,
        onboardingSeen,
        hasCarrera,
    } = useAccess();

    if (authLoading) return <AccessLoading />;
    if (!isAuthenticated) {
        if (!hasGuestCompletedOnboarding()) {
            return <Navigate to="/onboarding" replace />;
        }

        return renderRoute(children);
    }
    if (accessLoading) return <AccessLoading />;
    if (error) return renderRouteWithAccessError(children, error);

    return (
        <Navigate
            to={resolveAuthenticatedDestination({ onboardingSeen, hasCarrera })}
            replace
        />
    );
}

// Exige sesión, pero no fuerza todavía onboarding ni carrera.
export function RequireAuthRoute({ children }) {
    const { loading: authLoading, isAuthenticated } = useAuth();

    if (authLoading) return <AccessLoading />;
    if (!isAuthenticated) return <Navigate to={resolveGuestDestination()} replace />;

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
    if (!isAuthenticated) return <Navigate to={resolveGuestDestination()} replace />;
    if (accessLoading) return <AccessLoading />;
    if (error) return renderRouteWithAccessError(children, error);
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
    if (!isAuthenticated) return <Navigate to={resolveGuestDestination()} replace />;
    if (accessLoading) return <AccessLoading />;
    if (error) return renderRouteWithAccessError(children, error);
    if (!onboardingSeen) return <Navigate to="/onboarding" replace />;
    if (hasCarrera) return <Navigate to="/inicio" replace />;

    return renderRoute(children);
}
