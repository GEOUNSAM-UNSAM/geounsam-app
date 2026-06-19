import { Map } from "lucide-react";
import { ICONOS_SVG } from "../../../data/iconosSvg";
import { COLORES_CATEGORIA, SEDES } from "../../../data/edificios";

export default function DetalleSeleccion({
  marcadorSeleccionado,
  onVerPlano,
  mostrarBoton = true,
  puedeVerPlano,
}) {
  const mostrarVerPlano = Boolean(
    mostrarBoton &&
      marcadorSeleccionado &&
      onVerPlano &&
      (puedeVerPlano ? puedeVerPlano(marcadorSeleccionado) : marcadorSeleccionado.planoId),
  );

  return (
    <div className="bg-base border-y border-neutral-dark px-5 lg:px-8 h-[100px] lg:h-[89px] flex items-center">
      {marcadorSeleccionado ? (
        <div className="flex items-center gap-3 w-full">
          <div
            className="w-14 h-14 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: COLORES_CATEGORIA[marcadorSeleccionado.tipo] || "#808285" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              dangerouslySetInnerHTML={{
                __html: (ICONOS_SVG[marcadorSeleccionado.tipo] || ICONOS_SVG["Edificios"])("white"),
              }}
            />
          </div>

          {/* Textos */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-heading-l text-neutral-extra-dark truncate leading-tight">
              {marcadorSeleccionado.nombre}
            </h3>
            <p className="text-body-s text-neutral-dark truncate mt-1">
              {marcadorSeleccionado.horario ||
                SEDES[marcadorSeleccionado.sede]?.ubicacion ||
                "Campus Miguelete, San Martín"}
            </p>
          </div>

          {/* Botón Ver Plano */}
          {mostrarVerPlano ? (
            <button
              onClick={() => onVerPlano(marcadorSeleccionado)}
              className="flex-shrink-0 bg-identity px-4 h-11 flex items-center justify-center rounded-xl transition-transform active:scale-95 hover:bg-identity/90"
            >
              <span className="text-title-m text-neutral-white whitespace-nowrap mt-0.5">
                Ver plano
              </span>
            </button>
          ) : null}
        </div>
      ) : (
        
        /* ESTADO VACÍO */
        <div className="flex items-center gap-3 py-1 w-full max-w-7xl">
          <div className="w-14 h-14 rounded-[10px] bg-neutral-dark flex items-center justify-center flex-shrink-0 shadow-sm">
            <Map size={24} color="#EFEFEF" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-heading-l text-neutral-extra-dark leading-tight truncate">
              Elegí un edificio
            </p>
            <p className="text-body-s text-neutral-dark mt-1 text-wrap">
              Seleccioná un edificio para ver el plano de sus aulas
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
