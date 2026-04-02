import { Heart } from "lucide-react";

export default function CardResultado({
  resultado,
  isPinned,
  isPending = false,
  onTogglePin,
}) {
  return (
    <div
      className={`bg-neutral-white flex items-start gap-1 pl-4 pr-6 py-4 rounded-[30px] w-full ${
        isPinned ? "border-2 border-action" : "border-l-4 border-identity"
      } ${isPending ? "opacity-70" : ""}`}
    >
      <div className="flex-1 flex flex-col gap-1 px-2">
        <span className="inline-flex self-start border border-action rounded-full px-2 py-0.5 font-saira font-medium text-xs text-neutral-extra-dark">
          {resultado.codigo}
        </span>
        <span className="font-saira font-semibold text-[22px] leading-8 text-neutral-extra-dark">
          {resultado.nombre}
        </span>
        {resultado.horarios.map((h, i) => (
          <span key={i} className="font-saira text-sm text-neutral-extra-dark">
            {h.dia} {h.inicio} - {h.fin}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onTogglePin(resultado)}
        disabled={isPending}
        aria-label={isPinned ? "Quitar de mi cursada" : "Agregar a mi cursada"}
        className="flex-shrink-0 self-stretch flex items-start px-1 pt-1 disabled:cursor-wait"
      >
        <Heart
          size={20}
          className={isPinned ? "text-action fill-action" : "text-neutral-main"}
        />
      </button>
    </div>
  );
}
