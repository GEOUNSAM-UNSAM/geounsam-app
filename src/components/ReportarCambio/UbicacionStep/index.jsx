import { Search } from "lucide-react";
import ReporteNotice from "../ReporteNotice";

function getPisoCorto(piso) {
  const normalized = String(piso ?? "").toLowerCase();
  if (normalized === "pb") return "PB";
  if (normalized === "p1") return "PP";
  if (normalized === "s1") return "SS";
  return String(piso ?? "").toUpperCase();
}

function ChipEdificio({ item, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`flex h-6 items-center rounded-full px-2 text-label-caption ${
        selected
          ? "bg-action text-neutral-extra-dark"
          : "border border-neutral-light text-neutral-main"
      }`}
    >
      {item.label}
    </button>
  );
}

function AulaRow({ aula, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(aula.id)}
      className={`flex h-10 w-full items-center gap-3 rounded-[15px] px-5 py-2 text-left ${
        selected ? "border border-action bg-state-blue" : "bg-base"
      }`}
    >
      <span
        className={`min-w-0 flex-1 truncate text-body-m ${
          selected ? "text-identity" : "text-neutral-extra-dark"
        }`}
      >
        {aula.nombre}
      </span>
      <span className="shrink-0 text-label-caption text-neutral-main">
        {getPisoCorto(aula.piso)}
      </span>
    </button>
  );
}

export default function UbicacionStep({
  edificios,
  edificioSeleccionado,
  aulas,
  aulaSeleccionadaId,
  queryAula,
  onSelectEdificio,
  onSelectAula,
  onQueryAula,
}) {
  return (
    <>
      <ReporteNotice />

      <section className="flex flex-col gap-3 py-3">
        <div className="flex flex-col gap-2">
          <p className="text-body-m text-identity">
            NUEVA UBICACIÓN
          </p>
          <p className="text-body-s text-neutral-extra-dark">
            ¿A qué edificio y aula cambió?
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] bg-neutral-white p-3">
          <p className="text-body-s text-identity">EDIFICIO</p>
          <div className="flex flex-wrap gap-3">
            {edificios.map((item) => (
              <ChipEdificio
                key={item.id}
                item={item}
                selected={edificioSeleccionado === item.id}
                onSelect={onSelectEdificio}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] bg-neutral-white p-3">
          <p className="text-body-s text-identity">AULA</p>

          <label className="flex h-10 items-center gap-2 rounded-full bg-base px-6 text-neutral-dark">
            <Search size={16} className="shrink-0 text-neutral-extra-dark" />
            <input
              value={queryAula}
              onChange={(event) => onQueryAula(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-body-m outline-none placeholder:text-neutral-dark"
              placeholder="Buscar..."
            />
          </label>

          <div className="flex flex-col gap-3">
            {aulas.slice(0, 6).map((aula) => (
              <AulaRow
                key={aula.id}
                aula={aula}
                selected={aulaSeleccionadaId === aula.id}
                onSelect={onSelectAula}
              />
            ))}
            {aulas.length === 0 ? (
              <p className="rounded-[15px] bg-base px-5 py-3 text-body-s text-neutral-main">
                No encontramos aulas para ese edificio.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
