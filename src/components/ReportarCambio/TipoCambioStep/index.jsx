import { Check } from "lucide-react";

function getModalidadLabel(modalidad) {
  return modalidad === "virtual" ? "Virtual" : "Presencial";
}

function ClaseResumen({ clase, modalidad }) {
  const horario = clase.fin ? `${clase.inicio} - ${clase.fin}` : clase.inicio;

  return (
    <section className="flex w-full items-end justify-center rounded-[30px] border-2 border-neutral-main p-5 text-neutral-main">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-heading-l">
          {clase.nombre}
        </h2>
        <p className="text-body-m text-neutral-main">
          {horario}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`flex h-6 items-center justify-center rounded-full border px-2 text-label-caption ${
            modalidad === "virtual"
              ? "border-data-purple-500 text-data-purple-900"
              : "border-neutral-main text-neutral-main"
          }`}
        >
          {getModalidadLabel(modalidad)}
        </span>
        {clase.comision ? (
          <span className="flex h-6 items-center justify-center rounded-full border border-neutral-main px-2 text-label-caption">
            {clase.comision}
          </span>
        ) : null}
      </div>
    </section>
  );
}

export function TipoCambioCard({ item, selected, onSelect }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`flex w-full items-center gap-3 rounded-[20px] px-3 py-4 text-left ${
        selected ? "border-2 border-identity bg-state-blue" : "bg-neutral-white"
      }`}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-identity text-neutral-white">
        <Icon size={24} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-heading-l text-neutral-extra-dark">
          {item.titulo}
        </span>
        <span className="block truncate text-body-s text-neutral-dark">
          {item.descripcion}
        </span>
      </span>

      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          selected
            ? "bg-identity text-neutral-white"
            : "border border-neutral-dark text-transparent"
        }`}
      >
        {selected ? <Check size={18} strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

export default function TipoCambioStep({
  clase,
  modalidad,
  tiposCambio,
  tipoSeleccionado,
  onSelect,
}) {
  return (
    <>
      <section className="flex flex-col gap-3">
        <p className="text-body-s text-identity">MATERIA</p>
        <ClaseResumen clase={clase} modalidad={modalidad} />
      </section>

      <section className="flex flex-col gap-3 py-3">
        <div className="flex flex-col gap-2">
          <p className="text-body-m text-identity">
            ¿QUÉ CAMBIÓ?
          </p>
          <p className="text-body-m text-neutral-extra-dark">
            Elegí el tipo de cambio ocurrido
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {tiposCambio.map((item) => (
            <TipoCambioCard
              key={item.id}
              item={item}
              selected={tipoSeleccionado === item.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>
    </>
  );
}
