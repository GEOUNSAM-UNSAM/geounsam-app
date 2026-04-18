export default function ClaseCard({ clase }) {
    return (
        <section className="flex w-full items-end rounded-[30px] border-l-2 border-identity bg-neutral-white p-5">
            <div className="min-w-0 flex-1">
                <h2 className="font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                    {clase.nombre}
                </h2>
                <p className="font-saira text-base leading-6 text-neutral-extra-dark">
                    {clase.fin ? `${clase.inicio} - ${clase.fin}` : clase.inicio}
                </p>
            </div>

            {clase.comision ? (
                <span className="shrink-0 rounded-full border border-identity px-2 py-1 font-saira text-xs font-medium leading-3 text-neutral-extra-dark">
                    {clase.comision}
                </span>
            ) : null}
        </section>
    );
}
