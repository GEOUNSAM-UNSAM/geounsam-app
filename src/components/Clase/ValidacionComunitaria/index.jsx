export default function ValidacionComunitaria({ validacion }) {
    const confirmaciones = validacion.confirmaciones ?? 0;
    const progress = validacion.total
        ? Math.min(100, Math.round((confirmaciones / validacion.total) * 100))
        : 0;
    const esCambio = validacion.tipo === "cambio";
    const detalle = confirmaciones === 0
        ? esCambio
            ? "Todavía no hay validaciones para este cambio"
            : "Todavía no hay confirmaciones para esta clase"
        : esCambio
            ? `${confirmaciones} ${confirmaciones === 1 ? "compañero validó" : "compañeros validaron"} este cambio`
            : `${confirmaciones} ${confirmaciones === 1 ? "compañero confirmó" : "compañeros confirmaron"} esta clase`;
    const color = esCambio ? "bg-data-orange-500" : "bg-status-green";
    const counterColor = esCambio ? "text-data-orange-500" : "text-neutral-dark";

    return (
        <section className="w-full rounded-[30px] bg-neutral-white px-6 pb-5 pt-3">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-title-m text-neutral-extra-dark">
                    Validación comunitaria
                </h2>
                <p className={`text-label-caption ${counterColor}`}>
                    {confirmaciones} / {validacion.total}
                </p>
            </div>

            <div className="mt-1 space-y-1">
                <div className="h-1 w-full rounded-full bg-neutral-light">
                    <div
                        className={`h-1 rounded-full ${color}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-label-caption text-neutral-dark">
                    {detalle}
                </p>
            </div>
        </section>
    );
}
