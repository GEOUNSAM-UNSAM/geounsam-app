import { ArrowLeft } from "lucide-react";

export default function DetalleHeader({ detalle, onBack }) {
    const chipClass = detalle.estado === "Cambio"
        ? "bg-data-orange-500"
        : "bg-neutral-light";

    return (
        <header className="bg-identity px-6 pb-3 pt-2">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Volver"
                    className="flex h-[30px] w-[30px] shrink-0 items-center justify-center text-action"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-heading-xl text-base">
                            {detalle.aula}
                        </h1>
                        {detalle.edificio || detalle.piso ? (
                            <p className="text-body-m text-base">
                                {[detalle.edificio, detalle.piso].filter(Boolean).join(" - ")}
                            </p>
                        ) : null}
                    </div>

                    {detalle.estado ? (
                        <span className={`shrink-0 rounded-full px-5 py-1 text-label-caption text-neutral-extra-dark ${chipClass}`}>
                            {detalle.estado}
                        </span>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
