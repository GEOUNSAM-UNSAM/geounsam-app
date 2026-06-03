import { MoveRight, Siren } from "lucide-react";

export default function CambioReportadoTip({ reporte }) {
    if (!reporte) return null;

    const valorOriginal = reporte.valorOriginal ?? reporte.aulaOriginal;
    const valorReportado = reporte.valorReportado ?? reporte.aulaReportada;

    return (
        <section className="flex w-full items-center gap-2 rounded-[20px] border-2 border-data-orange-500 bg-state-yellow p-4">
            <div className="flex self-stretch px-1 py-2 text-data-orange-500">
                <Siren size={20} />
            </div>

            <div className="min-w-0 flex-1 text-body-m text-neutral-extra-dark">
                <p>Cambio reportado {reporte.tiempo.toLowerCase()}</p>
                <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate">{valorOriginal}</span>
                    <MoveRight size={24} className="shrink-0" />
                    <span className="truncate">{valorReportado}</span>
                </div>
            </div>
        </section>
    );
}
