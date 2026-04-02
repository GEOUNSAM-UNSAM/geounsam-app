import samuSaludando from "../../../assets/samu_saludo_inicio.png";

export default function SaludoInicio({ nombre }) {
    return (
        <section className="rounded-[20px] bg-neutral-light px-5 py-3">
            <div className="flex items-center gap-3">
                <img
                    src={samuSaludando}
                    alt=""
                    className="h-[72px] w-[92px] shrink-0 object-contain"
                />
                <h1 className="min-w-0 flex-1 font-saira text-[22px] font-semibold leading-8 text-neutral-extra-dark">
                    ¡Hola, {nombre}!
                </h1>
            </div>
        </section>
    );
}
