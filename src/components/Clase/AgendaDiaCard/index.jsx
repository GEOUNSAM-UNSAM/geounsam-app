export default function AgendaDiaCard({ agenda, titulo = "Clases de hoy" }) {
    if (!agenda?.length) return null;

    return (
        <section className="flex w-full flex-col gap-3 rounded-[30px] bg-neutral-white p-5">
            <div>
                <h2 className="text-title-m text-neutral-extra-dark">
                    {titulo}
                </h2>
                <p className="text-body-s text-neutral-main">
                    Materias programadas para esta aula
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {agenda.map((item) => (
                    <div
                        key={`${item.horarioId}-${item.comisionId}`}
                        className="flex items-start justify-between gap-3 border-t border-neutral-light pt-3 first:border-t-0 first:pt-0"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-body-m text-neutral-extra-dark">
                                {item.materia}
                            </p>
                            <p className="text-body-s text-neutral-extra-dark">
                                {item.horario}
                            </p>
                        </div>

                        {item.comision ? (
                            <span className="shrink-0 rounded-full border border-identity px-2 py-1 text-label-caption text-neutral-extra-dark">
                                {item.comision}
                            </span>
                        ) : null}
                    </div>
                ))}
            </div>
        </section>
    );
}
