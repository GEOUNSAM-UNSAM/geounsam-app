import { useState } from "react";
import DetalleSeleccion from "../../../components/Mapa/DetalleSeleccion";
import PLANOS from "../../../components/Planos";

export default function VistaPlano({ edificio, onBack }) {
  const pisos = edificio.pisos || [{ nombre: "Planta baja", slug: "pb" }];
  const [pisoActivo, setPisoActivo] = useState(0);

  const Plano = edificio.planoId ? PLANOS[edificio.planoId] : null;
  const pisoSlug = pisos[pisoActivo].slug;

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] relative bg-base">
      {/* Header identity */}
      <div className="bg-identity px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-[30px] h-[30px]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00bcd4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-saira font-semibold text-[22px] text-base leading-8">
            {edificio.nombre}
          </h2>
        </div>
      </div>

      {/* Tabs de pisos */}
      <div className="bg-identity px-4 pb-4 pt-1">
        <div className="flex gap-3">
          {pisos.map((piso, idx) => (
            <button
              key={piso.slug}
              onClick={() => setPisoActivo(idx)}
              className={`h-11 px-3 py-1.5 rounded-xl font-saira font-semibold text-lg whitespace-nowrap transition-all ${
                pisoActivo === idx
                  ? "bg-action text-identity"
                  : "border border-base text-base"
              }`}
            >
              {piso.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del plano */}
      <div className={`flex-1 min-h-0 ${!Plano ? "flex items-center justify-center overflow-auto" : ""}`}>
        {Plano ? (
          <Plano key={pisoSlug} pisoSlug={pisoSlug} />
        ) : (
          <div className="flex flex-col items-center gap-4 p-6">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#808285"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="font-saira font-semibold text-neutral-main text-center">
              {pisos[pisoActivo].nombre}
            </p>
            <p className="font-saira text-sm text-neutral-main text-center">
              Plano próximamente disponible
            </p>
          </div>
        )}
      </div>

      <DetalleSeleccion marcadorSeleccionado={edificio} mostrarBoton={false} />
    </div>
  );
}
