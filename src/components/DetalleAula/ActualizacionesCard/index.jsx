export default function ActualizacionesCard({ actualizaciones }) {
    if (!actualizaciones.length) return null;

    return (
        <section className="w-full rounded-[30px] bg-neutral-white px-4 py-5">
            <h2 className="px-3 font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                Últimas actualizaciones
            </h2>

            <div className="mt-2">
                {actualizaciones.map((item, index) => (
                    <div key={item.id}>
                        <div className="flex items-center gap-2 px-3 py-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                            <p className="min-w-0 flex-1 truncate font-saira text-base leading-6 text-neutral-extra-dark">
                                {item.texto}
                            </p>
                            <p className="shrink-0 font-saira text-xs font-medium leading-3 text-neutral-main">
                                {item.tiempo}
                            </p>
                        </div>
                        {index < actualizaciones.length - 1 ? (
                            <div className="mx-3 h-px bg-neutral-light" />
                        ) : null}
                    </div>
                ))}
            </div>
        </section>
    );
}
