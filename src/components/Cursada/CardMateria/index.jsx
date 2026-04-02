import { ChevronRight } from "lucide-react";

const ESTADOS = {
    normal: {
        borderClass: "border-action",
        cardClass: "bg-neutral-white",
    },
    virtual: {
        borderClass: "border-data-purple-500",
        cardClass: "bg-neutral-white",
    },
    changed: {
        borderClass: "border-data-orange-500",
        cardClass: "bg-state-yellow",
    },
};

export default function CardMateria({ clase, onOpen }) {
    const estilos = ESTADOS[clase.estado] ?? ESTADOS.normal;
    const detalle = clase.ubicacion ?? clase.aula ?? "Sin aula asignada";

    if (onOpen) {
        return (
            <button
                type="button"
                onClick={onOpen}
                className={`flex w-full items-stretch gap-3 rounded-[30px] border-l-4 px-4 py-4 text-left ${estilos.cardClass} ${estilos.borderClass}`}
            >
                <div className="flex w-12 shrink-0 flex-col justify-center text-right font-saira text-sm leading-4 text-neutral-extra-dark">
                    <span>{clase.inicio}</span>
                    <span>{clase.fin}</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-center justify-between gap-3">
                        <p className="truncate font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                            {clase.nombre}
                        </p>
                        <ChevronRight
                            size={20}
                            className="shrink-0 text-neutral-main"
                        />
                    </div>
                    <p className="truncate font-saira text-sm leading-4 text-neutral-extra-dark">
                        {detalle}
                    </p>
                </div>
            </button>
        );
    }

    return (
        <div
            className={`flex w-full items-stretch gap-3 rounded-[30px] border-l-4 px-4 py-4 ${estilos.cardClass} ${estilos.borderClass}`}
        >
            <div className="flex w-12 shrink-0 flex-col justify-center text-right font-saira text-sm leading-4 text-neutral-extra-dark">
                <span>{clase.inicio}</span>
                <span>{clase.fin}</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                        {clase.nombre}
                    </p>
                    <ChevronRight
                        size={20}
                        className="shrink-0 text-neutral-main"
                    />
                </div>
                <p className="truncate font-saira text-sm leading-4 text-neutral-extra-dark">
                    {detalle}
                </p>
            </div>
        </div>
    );
}
