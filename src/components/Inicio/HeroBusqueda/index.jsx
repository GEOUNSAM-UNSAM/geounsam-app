import { Search } from "lucide-react";
import Buscador from "../../Buscar/Buscador/index.jsx";

export default function HeroBusqueda({ query, onChange, onSubmit, onClear }) {
    return (
        <section className="rounded-[30px] bg-identity px-6 py-6 text-neutral-white">
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base text-identity">
                    <Search size={22} strokeWidth={2.2} />
                </div>
                <div className="space-y-2">
                    <h2 className="font-saira text-[28px] font-bold leading-10 text-neutral-white">
                        ¿Dónde es tu clase?
                    </h2>
                    <p className="font-saira text-sm leading-4 text-neutral-white">
                        Buscá tu materia, guardala en tu cursada y recibí
                        alertas si cambia de aula.
                    </p>
                </div>
                <Buscador
                    query={query}
                    onChange={onChange}
                    onClear={onClear}
                    onSubmit={onSubmit}
                    placeholder="Buscar mi materia"
                    variant="inline"
                    fieldClassName="justify-center"
                    inputClassName="flex-none w-[150px] text-left placeholder:text-neutral-extra-dark"
                    showClearButton={false}
                />
            </div>
        </section>
    );
}
