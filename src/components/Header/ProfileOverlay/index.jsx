import { useEffect } from "react";
import {
    ChevronRight,
    Flame,
    LogOut,
    Star,
    TableProperties,
    User,
    X,
} from "lucide-react";
import { obtenerInicialesNombre } from "../../../utils/avatar";

function OverlayAction({
    icon,
    title,
    description,
    onClick,
    accentClass = "bg-neutral-extra-dark text-neutral-white",
    textClass = "text-neutral-white",
    descriptionClass = "text-neutral-dark",
    iconStrokeClass = "",
    chevron = true,
    disabled = false,
}) {
    const IconComponent = icon;

    const content = (
        <>
            <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] ${accentClass}`}
            >
                <IconComponent size={24} className={iconStrokeClass} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className={`font-saira text-[22px] font-semibold leading-8 ${textClass}`}>
                    {title}
                </p>
                {description ? (
                    <p className={`font-saira text-sm leading-4 ${descriptionClass}`}>
                        {description}
                    </p>
                ) : null}
            </div>
            {chevron ? (
                <ChevronRight size={22} className="shrink-0 text-neutral-white" />
            ) : null}
        </>
    );

    if (disabled) {
        return (
            <div className="flex w-full items-center gap-3 py-4">
                {content}
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 py-4 text-left"
        >
            {content}
        </button>
    );
}

export default function ProfileOverlay({
    open,
    avatarUrl,
    nombre,
    carrera,
    nivel,
    estadisticas,
    onClose,
    onGoPerfil,
    onLogout,
}) {
    useEffect(() => {
        if (!open) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [open, onClose]);

    if (!open) return null;

    const iniciales = obtenerInicialesNombre(nombre);
    const chipNivel =
        nivel?.nombre && Number.isFinite(nivel?.xpActual)
            ? `${nivel.nombre} - ${nivel.xpActual} XP`
            : null;
    const chipRacha =
        estadisticas?.racha && estadisticas.racha > 0
            ? `${estadisticas.racha} días`
            : null;

    return (
        <div
            className="fixed inset-0 z-[60] bg-identity"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de perfil"
        >
            <div className="relative flex min-h-screen flex-col px-8 pb-8 pt-5">
                <div className="absolute right-4 top-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                        aria-label="Cerrar menú"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center px-4 pb-4 pt-16">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Perfil"
                            className="h-20 w-20 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-main">
                            <span className="font-saira text-2xl font-bold text-neutral-extra-dark">
                                {iniciales}
                            </span>
                        </div>
                    )}

                    <h2 className="mt-0.5 font-saira text-[28px] font-bold leading-10 text-base">
                        {nombre}
                    </h2>

                    {carrera ? (
                        <p className="mt-0.5 font-saira text-sm leading-4 text-base text-center">
                            {carrera}
                        </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                        {chipNivel ? (
                            <div className="flex items-center gap-2 rounded-full bg-action px-3 py-2">
                                <Star
                                    size={16}
                                    className="text-neutral-extra-dark"
                                />
                                <span className="font-saira text-sm leading-4 text-neutral-extra-dark">
                                    {chipNivel}
                                </span>
                            </div>
                        ) : null}

                        {chipRacha ? (
                            <div className="flex items-center gap-1 rounded-full bg-data-pink-400 px-3 py-2">
                                <Flame size={16} className="text-error" />
                                <span className="font-saira text-sm leading-4 text-error">
                                    {chipRacha}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="mt-2 flex flex-col gap-1 border-t border-neutral-dark/60 pt-1">
                    <OverlayAction
                        icon={User}
                        title="Perfil"
                        description="Estadísticas e insignias"
                        onClick={onGoPerfil}
                    />
                    <OverlayAction
                        icon={TableProperties}
                        title="Editar información"
                        description="Nombre, carrera, foto"
                        disabled
                    />
                </div>

                <div className="mt-2 border-t border-neutral-dark/60 pt-3">
                    <OverlayAction
                        icon={LogOut}
                        title="Cerrar sesión"
                        description=""
                        onClick={onLogout}
                        accentClass="bg-data-red-900 text-error"
                        textClass="text-error"
                        descriptionClass="text-error"
                        iconStrokeClass="text-error"
                        chevron={false}
                    />
                </div>
            </div>
        </div>
    );
}
