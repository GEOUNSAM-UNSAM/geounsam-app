import { Search, X } from "lucide-react";

export default function Buscador({ query, onChange, onClear }) {
  const buscando = query.trim().length > 0;

  return (
    <div className="bg-identity px-4 py-7">
      <div className="bg-base flex items-center h-10 pl-6 pr-4 rounded-full w-full">
        <Search size={12} className="text-neutral-dark flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar..."
          className="bg-transparent flex-1 font-saira text-neutral-dark placeholder:text-neutral-main outline-none ml-3"
        />
        {buscando && (
          <button onClick={onClear} className="flex-shrink-0 ml-2">
            <X size={20} className="text-neutral-dark" />
          </button>
        )}
      </div>
    </div>
  );
}
