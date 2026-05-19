import { ICONOS_SVG } from "../../../data/iconosSvg";

function ChipIcon({ tipo, selected }) {
  const color = selected ? "#00205B" : "#EFEFEF";
  const getSvg = ICONOS_SVG[tipo] || ICONOS_SVG["todos"];
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      dangerouslySetInnerHTML={{ __html: getSvg(color) }}
    />
  );
}

export default function FiltrosCategorias({ categorias, categoriaActiva, onCategoriaChange }) {
  return (
    <div className="bg-identity px-4 h-[76px] flex items-center shrink-0">
      <div className="flex gap-3 overflow-x-auto no-scrollbar w-full">
        {categorias.map((cat) => {
          const isActive = categoriaActiva === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoriaChange(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 h-11 rounded-xl transition-all ${
                isActive
                  ? "bg-action text-identity"
                  : "bg-identity text-base border border-base hover:bg-white/10"
              }`}
            >
              <ChipIcon tipo={cat.id} selected={isActive} />
              <span className="text-title-m whitespace-nowrap mt-0.5">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
