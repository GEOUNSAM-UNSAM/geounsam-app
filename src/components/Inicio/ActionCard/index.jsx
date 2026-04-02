export default function ActionCard({ icon, titulo, detalle, onClick }) {
    const Icon = icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex min-h-[120px] flex-1 flex-col items-start justify-center rounded-[30px] bg-action px-6 py-4 text-left text-neutral-extra-dark"
        >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-base">
                <Icon size={20} />
            </div>
            <span className="font-saira text-lg font-semibold leading-8">
                {titulo}
            </span>
            <span className="font-saira text-xs font-medium leading-3">
                {detalle}
            </span>
        </button>
    );
}
