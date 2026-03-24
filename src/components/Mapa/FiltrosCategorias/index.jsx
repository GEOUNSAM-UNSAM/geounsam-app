import { ICONOS_SVG } from "../../../data/iconosSvg";

function ChipIcon({ tipo, selected }) {
  const color = selected ? "#00205b" : "white";
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
    <div className="bg-identity px-4 h-[76px] flex items-center">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categorias.map((cat) => {
          const isActive = categoriaActiva === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoriaChange(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-saira font-medium text-lg leading-8 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-action text-identity"
                  : "bg-identity text-white"
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
