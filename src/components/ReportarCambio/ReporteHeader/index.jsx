import { ArrowLeft, Star } from "lucide-react";
import logotipoWhite from "../../../assets/logotipo_white.svg";

export default function ReporteHeader({ onBack }) {
  return (
    <header className="bg-identity text-base">
      <div className="flex items-center gap-3 px-6 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center text-action"
          aria-label="Volver"
        >
          <ArrowLeft size={30} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-heading-xl">
            Reportar cambio
          </h1>
          <p className="text-body-m">
            Ayudá a toda la comunidad
          </p>
        </div>
      </div>
    </header>
  );
}
