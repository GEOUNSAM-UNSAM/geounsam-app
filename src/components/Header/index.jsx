import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BellDot, Bolt, Flame, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEstadisticas } from '../../services/perfil'
import { obtenerInicialesNombre } from '../../utils/avatar.js'
import logotipoWhite from '../../assets/logotipo_white.svg'

export default function Header() {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const avatarUrl = user?.user_metadata?.avatar_url;
    const nombre =
        user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        user?.email ??
        "Usuario";
    const esPerfil = pathname === "/perfil";
    const esInicio = pathname === "/inicio";
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [racha, setRacha] = useState(0);

    useEffect(() => {
        if (!user || !esInicio) return;

        let mounted = true;

        getEstadisticas(user.id)
            .then((estadisticas) => {
                if (mounted) setRacha(estadisticas?.racha ?? 0);
            })
            .catch((error) => {
                console.error(error);
                if (mounted) setRacha(0);
            });

        return () => {
            mounted = false;
        };
    }, [esInicio, user]);

    if (esInicio) {
        return (
            <header className="bg-identity px-4 h-16 flex items-center justify-between gap-3">
                <img
                    src={logotipoWhite}
                    alt="GEOUNSAM"
                    className="h-5 shrink-0"
                />

                <div className="flex items-center gap-3 ml-auto">
                    {racha > 0 ? (
                        <div className="hidden min-[360px]:flex items-center gap-1 rounded-full bg-data-pink-400 px-3 py-2">
                            <Flame size={14} className="text-error" />
                            <span className="font-saira text-sm leading-4 text-error">
                                {racha} días
                            </span>
                        </div>
                    ) : null}

                    <button
                        type="button"
                        className="text-neutral-white"
                        aria-label="Notificaciones"
                    >
                        <BellDot size={22} />
                    </button>

                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Perfil"
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-main">
                            <span className="font-saira text-xs font-bold text-neutral-extra-dark">
                                {obtenerInicialesNombre(nombre)}
                            </span>
                        </div>
                    )}
                </div>
            </header>
        );
    }

    return (
        <header className="bg-identity px-5 h-16 flex items-center justify-between relative">
            {!esPerfil && avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="w-8 h-8" />
            )}
            <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
            {esPerfil ? (
                <button onClick={() => setMenuAbierto(!menuAbierto)}>
                    <Bolt size={24} className="text-neutral-main" />
                </button>
            ) : (
                <div className="w-8 h-8" />
            )}

            {/* Menú desplegable */}
            {menuAbierto && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuAbierto(false)}
                    />
                    <div className="absolute right-5 top-14 z-50 bg-neutral-white rounded-xl shadow-lg py-2 min-w-[180px]">
                        <button
                            onClick={() => {
                                setMenuAbierto(false);
                                navigate("/logout");
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 font-saira text-sm text-red-500"
                        >
                            <LogOut size={18} />
                            Cerrar sesión
                        </button>
                    </div>
                </>
            )}
        </header>
    );
}
