export default function ActionButtons({
    canConfirm = false,
    confirming = false,
    confirmed = false,
    onConfirm,
}) {
    const confirmDisabled = !canConfirm || confirming || confirmed;
    const confirmLabel = confirming
        ? "Confirmando..."
        : confirmed
            ? "Confirmado"
            : "Confirmar";
    const confirmClass = confirmDisabled
        ? "bg-neutral-light text-neutral-dark disabled:cursor-not-allowed"
        : "bg-action text-identity";

    return (
        <div className="grid w-full grid-cols-2 gap-4 px-4 py-4">
            <button
                type="button"
                disabled={confirmDisabled}
                onClick={onConfirm}
                className={`rounded-xl px-3 py-2 font-saira text-lg font-semibold leading-8 ${confirmClass}`}
            >
                {confirmLabel}
            </button>
            <button
                type="button"
                disabled
                className="rounded-xl bg-neutral-light px-3 py-2 font-saira text-lg font-semibold leading-8 text-neutral-dark disabled:cursor-not-allowed"
            >
                Reportar cambio
            </button>
        </div>
    );
}
