import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map } from "lucide-react";
import DetalleSeleccion from "../../../components/Mapa/DetalleSeleccion";
import PLANOS from "../../../components/Planos";
import { getDetalleAulaPath } from "../../../utils/edificios";

export default function VistaPlano({ edificio, onBack }) {
  const navigate = useNavigate();
  const pisos = edificio.pisos || [{ nombre: "Planta baja", slug: "pb" }];
  const [pisoActivo, setPisoActivo] = useState(0);

  const Plano = edificio.planoId ? PLANOS[edificio.planoId] : null;
  const piso = pisos[pisoActivo];
  const pisoSlug = piso.slug;

  const openDetalleAula = (aula) => {
    const path = getDetalleAulaPath({ edificio, aula });
    if (!path) return;

    navigate(path, {
      state: {
        aula,
        edificio: {
          id: edificio.id,
          nombre: edificio.nombre,
          planoId: edificio.planoId,
        },
        piso,
      },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-68px-64px)] relative bg-base">
      {/* Header identity */}
      <div className="bg-identity px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-[30px] h-[30px]"
          >
            <ArrowLeft size={24} color="#00bcd4" />
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
          <Plano
            key={pisoSlug}
            pisoSlug={pisoSlug}
            edificio={edificio}
            piso={piso}
            onOpenDetalleAula={openDetalleAula}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 p-6">
            <Map size={64} color="#808285" strokeWidth={1.5} />
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
