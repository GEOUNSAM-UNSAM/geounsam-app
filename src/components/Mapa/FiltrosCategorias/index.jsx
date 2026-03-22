import { ICONOS_SVG } from "../../../data/iconosSvg";

function ChipIcon({ tipo, selected }) {
  const color = selected ? "white" : "#111827";
  const getSvg = ICONOS_SVG[tipo] || ICONOS_SVG["todos"];
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      dangerouslySetInnerHTML={{ __html: getSvg(color) }}
    />
  );
}

export default function FiltrosCategorias({ categorias, categoriaActiva, onCategoriaChange }) {
  return (
    <div className="bg-neutral-white px-4 pb-3 pt-1">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categorias.map((cat) => {
          const isActive = categoriaActiva === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoriaChange(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-saira font-medium text-[13px] whitespace-nowrap transition-all ${
                isActive
                  ? "bg-identity text-white"
                  : "bg-neutral-white border border-neutral-light text-neutral-dark"
              }`}
            >
              <ChipIcon tipo={cat.id} selected={isActive} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
