import { Heart } from "lucide-react";

export default function CardResultado({
  resultado,
  isPinned,
  isPending = false,
  onTogglePin,
}) {
  return (
    <div
      className={`bg-neutral-white flex items-start justify-between gap-2 pl-6 pr-4 py-5 rounded-[30px] w-full transition-all ${
        isPinned ? "border-2 border-action" : "border-l-4 border-identity"
      } ${isPending ? "opacity-70 pointer-events-none" : "hover:shadow-sm"}`}
    >
      <div className="flex-1 flex flex-col gap-1 px-1 min-w-0">
        <span className="inline-flex self-start border border-action rounded-full px-2 py-0.5 text-label-caption text-neutral-extra-dark mb-1">
          {resultado.codigo}
        </span>
        <span className="text-heading-l text-neutral-extra-dark truncate w-full">
          {resultado.nombre}
        </span>
        {resultado.horarios.map((h, i) => (
          <span key={i} className="text-body-s text-neutral-extra-dark flex gap-2">
            {h.dia} {h.inicio} - {h.fin}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onTogglePin(resultado)}
        disabled={isPending}
        aria-label={isPinned ? "Quitar de mi cursada" : "Agregar a mi cursada"}
        className="flex-shrink-0 flex items-start disabled:cursor-wait p-2 rounded-full transition-all active:scale-90 outline-none"
      >
        <Heart
          size={20}
          className={isPinned ? "text-action fill-action hover:text-opacity-50" : "text-neutral-main hover:text-action"}
        />
      </button>
    </div>
  );
}
