import { createContext, useContext, useEffect, useState } from "react";
import { getAlumnoCarreras, getOnboardingVisto } from "../services/alumnos";
import { useAuth } from "./AuthContext.jsx";

const AccessContext = createContext();

function getGuestState() {
    return {
        onboardingSeen: null,
        hasCarrera: false,
        loading: false,
        error: null,
    };
}

function getErrorMessage(error) {
    if (typeof error === "string") return error;
    if (error instanceof Error && error.message) return error.message;
    if (error?.message) return error.message;
    return "No se pudo validar el acceso del usuario.";
}

export function useAccess() {
    const context = useContext(AccessContext);
    if (!context)
        throw new Error("useAccess debe usarse dentro de AccessProvider");
    return context;
}

export function AccessProvider({ children }) {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const [state, setState] = useState({
        onboardingSeen: null,
        hasCarrera: false,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let active = true;

        async function syncAccessState() {
            if (authLoading) return;

            if (!isAuthenticated || !user?.id) {
                if (!active) return;
                setState(getGuestState());
                return;
            }

            if (active) {
                setState((prev) => ({ ...prev, loading: true, error: null }));
            }

            try {
                const [onboardingSeen, carreras] = await Promise.all([
                    getOnboardingVisto(user.id),
                    getAlumnoCarreras(user.id),
                ]);

                if (!active) return;

                setState({
                    onboardingSeen,
                    hasCarrera: carreras.length > 0,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                if (!active) return;

                setState({
                    onboardingSeen: null,
                    hasCarrera: false,
                    loading: false,
                    error: getErrorMessage(error),
                });
            }
        }

        syncAccessState();

        return () => {
            active = false;
        };
    }, [authLoading, isAuthenticated, user]);

    async function refresh() {
        if (!user?.id) {
            setState(getGuestState());
            return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const [onboardingSeen, carreras] = await Promise.all([
                getOnboardingVisto(user.id),
                getAlumnoCarreras(user.id),
            ]);

            setState({
                onboardingSeen,
                hasCarrera: carreras.length > 0,
                loading: false,
                error: null,
            });
        } catch (error) {
            setState({
                onboardingSeen: null,
                hasCarrera: false,
                loading: false,
                error: getErrorMessage(error),
            });
            throw new Error("No se pudo refrescar el acceso del usuario");
        }
    }

    return (
        <AccessContext.Provider value={{ ...state, refresh }}>
            {children}
        </AccessContext.Provider>
    );
}
