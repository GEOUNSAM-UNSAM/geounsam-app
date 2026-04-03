import { ArrowRight } from "lucide-react";

export default function CtaCursada({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-action px-4 font-saira text-lg font-semibold leading-8 text-neutral-extra-dark"
        >
            Ver toda mi cursada
            <ArrowRight size={20} />
        </button>
    );
}
