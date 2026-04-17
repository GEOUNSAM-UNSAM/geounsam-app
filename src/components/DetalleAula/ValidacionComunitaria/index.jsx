export default function ValidacionComunitaria({ validacion }) {
    const confirmaciones = validacion.confirmaciones ?? 0;
    const progress = validacion.total
        ? Math.min(100, Math.round((confirmaciones / validacion.total) * 100))
        : 0;
    const detalle = confirmaciones === 0
        ? "Todavía no hay confirmaciones para esta ubicación"
        : `${confirmaciones} ${confirmaciones === 1 ? "compañero confirmó" : "compañeros confirmaron"} esta ubicación`;

    return (
        <section className="w-full rounded-[30px] bg-neutral-white px-6 pb-5 pt-3">
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                    Validación comunitaria
                </h2>
                <p className="font-saira text-xs font-medium leading-3 text-neutral-dark">
                    {confirmaciones} / {validacion.total}
                </p>
            </div>

            <div className="mt-1 space-y-1">
                <div className="h-1 w-full rounded-full bg-neutral-light">
                    <div
                        className="h-1 rounded-full bg-status-green"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="font-saira text-xs font-medium leading-3 text-neutral-dark">
                    {detalle}
                </p>
            </div>
        </section>
    );
}
