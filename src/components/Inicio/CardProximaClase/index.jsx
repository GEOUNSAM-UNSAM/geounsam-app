import { ChevronRight } from "lucide-react";

const ESTADOS = {
    pending: {
        chip: "Pendiente",
        badgeClass: "bg-neutral-light text-neutral-extra-dark",
        borderClass: "border-neutral-main",
        cardClass: "bg-neutral-white",
        progressClass: "bg-status-green",
        progressWidth: "w-1/4",
        helper: "Esperando confirmaciones de la comunidad",
    },
    confirmed: {
        chip: "Confirmada",
        badgeClass: "bg-status-green text-neutral-extra-dark",
        borderClass: "border-status-green",
        cardClass: "bg-neutral-white",
        progressClass: "bg-status-green",
        progressWidth: "w-full",
        helper: "Ubicación validada por la comunidad",
    },
    changed: {
        chip: "Cambio",
        badgeClass: "bg-data-orange-500 text-neutral-extra-dark",
        borderClass: "border-data-orange-500",
        cardClass: "bg-state-yellow",
        progressClass: "bg-data-orange-500",
        progressWidth: "w-1/3",
        helper: "Se detectó un cambio en esta clase",
    },
};

export default function CardProximaClase({ clase, onOpen }) {
    const estilos = clase.estado ? ESTADOS[clase.estado] : null;
    const borderClass = clase.esVirtual
        ? "border-data-purple-500"
        : estilos?.borderClass ?? "border-action";
    const cardClass = estilos?.cardClass ?? "bg-neutral-white";

    return (
        <button
            type="button"
            onClick={onOpen}
            className={`w-full rounded-[30px] border-l-4 px-6 py-4 text-left ${cardClass} ${borderClass}`}
        >
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                    <p className="font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                        {clase.nombre}
                    </p>
                    <ChevronRight
                        size={22}
                        className="shrink-0 text-neutral-main"
                    />
                </div>
                <p className="font-saira text-xs font-medium leading-3 text-neutral-extra-dark">
                    {clase.inicio} - {clase.fin}
                </p>
                <div className="flex items-center justify-between gap-3">
                    <p className="font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                        {clase.ubicacion}
                    </p>
                    {estilos ? (
                        <span
                            className={`rounded-full px-3 py-1 font-saira text-xs font-medium leading-3 ${estilos.badgeClass}`}
                        >
                            {estilos.chip}
                        </span>
                    ) : null}
                </div>
                {estilos ? (
                    <div className="space-y-1">
                        <div className="h-1 w-full rounded-full bg-neutral-light">
                            <div
                                className={`h-1 rounded-full ${estilos.progressClass} ${estilos.progressWidth}`}
                            />
                        </div>
                        <p className="font-saira text-xs font-medium leading-3 text-neutral-dark">
                            {estilos.helper}
                        </p>
                    </div>
                ) : null}
            </div>
        </button>
    );
}
