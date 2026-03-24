import { ChevronRight } from "lucide-react";

export default function CardSugerida({ materia }) {
  return (
    <button className="bg-neutral-white border-l-8 border-action flex items-center justify-between px-7 py-4 rounded-[30px] w-full text-left">
      <div className="flex flex-col gap-1">
        <span className="font-saira font-semibold text-lg leading-8 text-neutral-dark">
          {materia.nombre}
        </span>
        <span className="font-saira font-medium text-xs text-neutral-dark">
          {materia.detalle}
        </span>
      </div>
      <ChevronRight size={24} className="text-neutral-light flex-shrink-0" />
    </button>
  );
}
