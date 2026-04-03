import { Info } from "lucide-react";

export default function Tip({ children, icon }) {
    const IconComponent = icon ?? Info;

    return (
        <section className="flex items-start gap-3 rounded-[20px] border-2 border-action bg-state-blue px-4 py-4 text-neutral-extra-dark">
            <IconComponent
                size={20}
                className="mt-0.5 shrink-0 text-action"
            />
            <p className="font-saira text-base leading-6 text-neutral-extra-dark">
                {children}
            </p>
        </section>
    );
}
