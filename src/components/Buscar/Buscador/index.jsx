import { Search, X } from "lucide-react";

const VARIANT_STYLES = {
    footer: {
        outer: "bg-identity px-4 py-7",
        field: "bg-base flex items-center h-10 pl-6 pr-4 rounded-full w-full",
    },
    inline: {
        outer: "w-full",
        field: "bg-base flex items-center h-10 pl-6 pr-4 rounded-full w-full",
    },
};

export default function Buscador({
    query,
    onChange,
    onClear,
    onSubmit,
    onFocus,
    readOnly = false,
    placeholder = "Buscar...",
    variant = "footer",
    inputClassName = "",
    fieldClassName = "",
    showClearButton = true,
}) {
    const buscando = query.trim().length > 0;
    const estilos = VARIANT_STYLES[variant] ?? VARIANT_STYLES.footer;
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit?.(query);
    };

    return (
        <form className={estilos.outer} onSubmit={handleSubmit}>
            <div className={`${estilos.field} ${fieldClassName}`}>
                <Search
                    size={12}
                    className="text-neutral-extra-dark flex-shrink-0"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className={`bg-transparent flex-1 font-saira text-neutral-extra-dark placeholder:text-neutral-main outline-none ml-3 ${inputClassName}`}
                />
                {showClearButton && buscando && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="flex-shrink-0 ml-2"
                    >
                        <X size={20} className="text-neutral-extra-dark" />
                    </button>
                )}
            </div>
        </form>
    );
}
