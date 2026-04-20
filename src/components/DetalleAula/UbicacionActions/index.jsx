import { DoorOpen, MapPin } from "lucide-react";

export default function UbicacionActions({
    onVerEdificio,
    onVerAula,
    puedeVerAula,
}) {
    return (
        <div className="flex justify-end gap-2">
            <button
                type="button"
                onClick={onVerEdificio}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-identity px-3 font-saira text-sm font-medium leading-4 text-neutral-extra-dark"
            >
                <MapPin size={16} className="text-identity" />
                Edificio
            </button>

            <button
                type="button"
                onClick={onVerAula}
                disabled={!puedeVerAula}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-identity px-3 font-saira text-sm font-medium leading-4 text-neutral-extra-dark disabled:opacity-50"
            >
                <DoorOpen size={16} className="text-identity" />
                Aula
            </button>
        </div>
    );
}
