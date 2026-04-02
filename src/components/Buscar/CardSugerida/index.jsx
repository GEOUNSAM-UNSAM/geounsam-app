import { ChevronRight } from "lucide-react";

export default function CardSugerida({ materia, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(materia)}
      className="bg-neutral-white border-l-4 border-action flex items-center justify-between px-6 py-4 rounded-[30px] w-full text-left"
    >
      <div className="flex flex-col gap-1">
        <span className="font-saira font-semibold text-lg leading-8 text-neutral-extra-dark">
          {materia.nombre}
        </span>
        <span className="font-saira font-medium text-xs text-neutral-extra-dark">
          {materia.detalle}
        </span>
      </div>
      <ChevronRight size={24} className="text-neutral-main flex-shrink-0" />
    </button>
  );
}
