import { ArrowLeft } from "lucide-react";

export default function DetalleHeader({ detalle, onBack }) {
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
                        <h1 className="font-saira text-[28px] font-bold leading-10 text-[#EFEFEF]">
                            {detalle.aula}
                        </h1>
                        {detalle.edificio || detalle.piso ? (
                            <p className="font-saira text-base leading-6 text-[#EFEFEF]">
                                {[detalle.edificio, detalle.piso].filter(Boolean).join(" - ")}
                            </p>
                        ) : null}
                    </div>

                    {detalle.estado ? (
                        <span className="shrink-0 rounded-full bg-neutral-light px-5 py-1 font-saira text-xs font-medium leading-3 text-neutral-extra-dark">
                            {detalle.estado}
                        </span>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
