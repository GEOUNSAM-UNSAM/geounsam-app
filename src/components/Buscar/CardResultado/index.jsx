import { Heart } from "lucide-react";

export default function CardResultado({ resultado, isFav, onToggleFav }) {
  return (
    <div className={`bg-neutral-white flex items-center gap-1 pl-4 pr-6 py-4 rounded-[30px] w-full ${
      isFav ? "border-2 border-action" : "border-l-4 border-identity"
    }`}>
      <div className="flex-1 flex flex-col gap-1 px-2">
        <span className="inline-flex self-start border border-action rounded-full px-2 py-0.5 font-saira font-medium text-xs text-neutral-dark">
          {resultado.codigo}
        </span>
        <span className="font-saira font-semibold text-[22px] leading-8 text-neutral-dark">
          {resultado.nombre}
        </span>
        {resultado.horarios.map((h, i) => (
          <span key={i} className="font-saira text-sm text-neutral-dark">
            {h.dia} {h.inicio} - {h.fin}
          </span>
        ))}
        <span className="font-saira font-semibold text-lg leading-8 text-action">
          {resultado.aula} - {resultado.edificio}
        </span>
      </div>
      <button
        onClick={() => onToggleFav(resultado)}
        className="flex-shrink-0 self-stretch flex items-center px-1"
      >
        <Heart
          size={20}
          className={isFav ? "text-action fill-action" : "text-neutral-light"}
        />
      </button>
    </div>
  );
}
