export default function AgendaDiaCard({ agenda, titulo = "Clases de hoy" }) {
    if (!agenda?.length) return null;

    return (
        <section className="flex w-full flex-col gap-3 rounded-[30px] bg-neutral-white p-5">
            <div>
                <h2 className="font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                    {titulo}
                </h2>
                <p className="font-saira text-sm leading-4 text-neutral-main">
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
                            <p className="truncate font-saira text-base font-semibold leading-6 text-neutral-extra-dark">
                                {item.materia}
                            </p>
                            <p className="font-saira text-sm leading-4 text-neutral-extra-dark">
                                {item.horario}
                            </p>
                        </div>

                        {item.comision ? (
                            <span className="shrink-0 rounded-full border border-identity px-2 py-1 font-saira text-xs font-medium leading-3 text-neutral-extra-dark">
                                {item.comision}
                            </span>
                        ) : null}
                    </div>
                ))}
            </div>
        </section>
    );
}
