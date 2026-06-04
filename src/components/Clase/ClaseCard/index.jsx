function getModalidadLabel(modalidad) {
    return modalidad === "virtual" ? "Virtual" : "Presencial";
}

function getModalidadClass(modalidad) {
    return modalidad === "virtual"
        ? "border-data-purple-500 bg-state-purple text-data-purple-900"
        : "border-identity text-neutral-extra-dark";
}

export default function ClaseCard({ clase }) {
    const modalidad = clase.modalidad ?? (clase.esVirtual ? "virtual" : "presencial");

    return (
        <section className="flex w-full items-end gap-3 rounded-[30px] border-l-2 border-identity bg-neutral-white p-5">
            <div className="min-w-0 flex-1">
                <h2 className="text-title-m text-neutral-extra-dark">
                    {clase.nombre}
                </h2>
                <p className="text-body-m text-neutral-extra-dark">
                    {clase.fin ? `${clase.inicio} - ${clase.fin}` : clase.inicio}
                </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
                {clase.comision ? (
                    <span className="rounded-full border border-identity px-2 py-1 text-label-caption text-neutral-extra-dark">
                        {clase.comision}
                    </span>
                ) : null}
                <span
                    className={`rounded-full border px-2 py-1 text-label-caption ${getModalidadClass(modalidad)}`}
                >
                    {getModalidadLabel(modalidad)}
                </span>
            </div>
        </section>
    );
}
