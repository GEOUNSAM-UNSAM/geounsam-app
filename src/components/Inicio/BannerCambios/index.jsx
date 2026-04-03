import { AlertTriangle, ArrowRight } from "lucide-react";

export default function BannerCambios({ onClick }) {
    return (
        <section className="flex items-center gap-3 rounded-[20px] border-2 border-data-orange-500 bg-state-yellow px-4 py-4">
            <AlertTriangle
                size={20}
                className="shrink-0 text-data-orange-500"
            />
            <p className="flex-1 font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                Hubo cambios en tu cursada
            </p>
            <button
                type="button"
                onClick={onClick}
                className="flex items-center gap-1 rounded-[10px] bg-data-orange-500 px-3 py-2 font-saira text-xs font-medium leading-3 text-neutral-extra-dark"
            >
                Ver cambios
                <ArrowRight size={14} />
            </button>
        </section>
    );
}
