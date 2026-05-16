import { ArrowLeft, Star } from "lucide-react";
import logotipoWhite from "../../../assets/logotipo_white.svg";

export default function ReporteHeader({ onBack }) {
  return (
    <header className="bg-identity text-base">
      <div className="flex h-16 items-center px-8">
        <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
      </div>
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
          <h1 className="font-saira text-[28px] font-bold leading-10">
            Reportar cambio
          </h1>
          <p className="font-saira text-base leading-6">
            Ayudá a toda la comunidad
          </p>
        </div>

        <div className="flex h-6 shrink-0 items-center gap-1 rounded-full bg-action px-2 text-neutral-extra-dark">
          <Star size={16} />
          <span className="font-saira text-xs font-medium leading-3">+25 XP</span>
        </div>
      </div>
    </header>
  );
}
