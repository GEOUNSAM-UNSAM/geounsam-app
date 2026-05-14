import BotonOutline from "../../BotonOutline";
import BotonPrincipal from "../../BotonPrincipal";

export default function ActionButtons({
    canConfirm = false,
    confirming = false,
    confirmed = false,
    canReport = false,
    changeMode = false,
    canConfirmChange = false,
    canDenyChange = false,
    onConfirm,
    onReport,
    onConfirmChange,
    onDenyChange,
}) {
    if (changeMode) {
        return (
            <div className="grid w-full grid-cols-2 gap-4 px-4 py-4">
                <BotonPrincipal
                    texto="Confirmar cambio"
                    disabled={!canConfirmChange}
                    onClick={onConfirmChange}
                    className="min-h-0 !bg-data-orange-500 px-3 py-2 !text-identity disabled:!bg-neutral-light disabled:!text-neutral-dark [&>span]:text-lg [&>span]:font-semibold [&>span]:leading-8"
                />
                <BotonOutline
                    texto="Denegar cambio"
                    disabled={!canDenyChange}
                    onClick={onDenyChange}
                    className="h-auto !border-error px-3 py-1.5 !text-error disabled:!border-neutral-light disabled:!text-neutral-dark [&>span]:text-lg [&>span]:font-semibold [&>span]:leading-8"
                />
            </div>
        );
    }

    const confirmDisabled = !canConfirm || confirming || confirmed;
    const reportDisabled = !canReport;
    const confirmLabel = confirming
        ? "Confirmando..."
        : confirmed
            ? "Confirmado"
            : "Confirmar";
    const confirmClass = confirmDisabled
        ? "bg-neutral-light text-neutral-dark disabled:cursor-not-allowed"
        : "bg-action text-identity";
    const reportClass = reportDisabled
        ? "bg-neutral-light text-neutral-dark disabled:cursor-not-allowed"
        : "border border-identity bg-base text-identity";

    return (
        <div className="grid w-full grid-cols-2 gap-4 px-4 py-4">
            <BotonPrincipal
                texto={confirmLabel}
                disabled={confirmDisabled}
                onClick={onConfirm}
                className={`min-h-0 px-3 py-2 [&>span]:text-lg [&>span]:font-semibold [&>span]:leading-8 ${confirmClass}`}
            />
            <BotonOutline
                texto="Reportar cambio"
                disabled={reportDisabled}
                onClick={onReport}
                className={`h-auto px-3 py-1.5 [&>span]:text-lg [&>span]:font-semibold [&>span]:leading-8 ${reportClass}`}
            />
        </div>
    );
}
