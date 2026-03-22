import { ICONOS_SVG } from "../../../data/iconosSvg";
import { COLORES_CATEGORIA } from "../../../data/edificios";

export default function DetalleSeleccion({ marcadorSeleccionado, onVerPlano, mostrarBoton = true }) {
  return (
    <div className="bg-neutral-white border-b border-neutral-main px-5 py-3">
      {marcadorSeleccionado ? (
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: COLORES_CATEGORIA[marcadorSeleccionado.tipo] || "#16325c" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              dangerouslySetInnerHTML={{
                __html: (ICONOS_SVG[marcadorSeleccionado.tipo] || ICONOS_SVG["Edificios"])("white"),
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-saira font-semibold text-lg text-identity leading-7 truncate">
              {marcadorSeleccionado.nombre}
            </h3>
            <p className="font-saira text-sm text-neutral-main">
              {marcadorSeleccionado.horario || "Campus Miguelete, San Martín"}
            </p>
          </div>

          {mostrarBoton && marcadorSeleccionado.tipo === "Edificios" && (
            <button
              onClick={() => onVerPlano(marcadorSeleccionado)}
              className="flex-shrink-0 bg-identity px-4 py-2 rounded-xl"
            >
              <span className="font-saira font-semibold text-sm text-neutral-white whitespace-nowrap">
                Ver plano
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 py-1">
          <div className="w-12 h-12 rounded-2xl bg-base flex items-center justify-center flex-shrink-0">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <p className="font-saira font-semibold text-base text-neutral-dark">
              Elegí un edificio
            </p>
            <p className="font-saira text-sm text-neutral-main">
              Seleccioná un edificio para ver el plano de sus aulas
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
