import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BellDot, Bolt, Flame } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEstadisticas } from '../../services/perfil'
import { obtenerInicialesNombre } from '../../utils/avatar.js'
import logotipoWhite from '../../assets/logotipo_white.svg'
import ProfileOverlay from './ProfileOverlay/index.jsx'
import usePerfilResumen from '../../hooks/usePerfilResumen'

function AvatarButton({ avatarUrl, nombre, onClick, className = 'h-8 w-8' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-center rounded-full ${className}`}
            aria-label="Abrir menú de perfil"
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Perfil"
                    className="h-full w-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-main">
                    <span className="font-saira text-xs font-bold text-neutral-extra-dark">
                        {obtenerInicialesNombre(nombre)}
                    </span>
                </div>
            )}
        </button>
    );
}

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
    const { carrera, nivel, estadisticas } = usePerfilResumen(user?.id, menuAbierto);

    const abrirMenu = () => setMenuAbierto(true);
    const cerrarMenu = () => setMenuAbierto(false);
    const irAPerfil = () => {
        setMenuAbierto(false);
        navigate('/perfil');
    };
    const irALogout = () => {
        setMenuAbierto(false);
        navigate('/logout');
    };

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

    const header = esInicio ? (
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

                    <AvatarButton
                        avatarUrl={avatarUrl}
                        nombre={nombre}
                        onClick={abrirMenu}
                    />
                </div>
            </header>
    ) : (
        <header className="bg-identity px-5 h-16 flex items-center justify-between relative">
            {!esPerfil ? (
                <AvatarButton
                    avatarUrl={avatarUrl}
                    nombre={nombre}
                    onClick={abrirMenu}
                />
            ) : (
                <div className="w-8 h-8" />
            )}
            <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
            {esPerfil ? (
                <button
                    type="button"
                    onClick={abrirMenu}
                    aria-label="Abrir menú de perfil"
                >
                    <Bolt size={24} className="text-neutral-main" />
                </button>
            ) : (
                <div className="w-8 h-8" />
            )}
        </header>
    );

    return (
        <>
            {header}
            <ProfileOverlay
                open={menuAbierto}
                avatarUrl={avatarUrl}
                nombre={nombre}
                carrera={carrera}
                nivel={nivel}
                estadisticas={estadisticas}
                onClose={cerrarMenu}
                onGoPerfil={irAPerfil}
                onLogout={irALogout}
            />
        </>
    );
}
