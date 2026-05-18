import { ChevronRight } from "lucide-react";

export default function CardSugerida({ materia, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(materia)}
      className="bg-neutral-white border-l-4 border-action flex items-center justify-between pl-4 pr-3 py-4 rounded-[30px] w-full text-left transition-colors hover:bg-neutral-light/40 focus:ring-2 focus:ring-action/30 outline-none"
    >
      <div className="flex flex-col gap-1 pl-2">
        <span className="text-title-m text-neutral-extra-dark">
          {materia.nombre}
        </span>
        <span className="text-body-s text-neutral-extra-dark">
          {materia.detalle}
        </span>
      </div>
      <ChevronRight size={24} className="text-neutral-main flex-shrink-0" />
    </button>
  );
}
