import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map } from "lucide-react";
import DetalleSeleccion from "../../../components/Mapa/DetalleSeleccion";
import PLANOS from "../../../components/Planos";
import { getDetalleAulaPath } from "../../../utils/edificios";

export default function VistaPlano({
  edificio,
  onBack,
  initialAulaId = null,
  initialPisoSlug = null,
}) {
  const navigate = useNavigate();
  const pisos = edificio.pisos || [{ nombre: "Planta baja", slug: "pb" }];
  const initialPisoIndex = Math.max(
    0,
    pisos.findIndex((item) => item.slug === initialPisoSlug),
  );
  const [pisoActivo, setPisoActivo] = useState(initialPisoIndex);

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
    <div className="flex flex-col h-full bg-base overflow-hidden">
      
      {/* Header identity */}
      <div className="bg-identity px-5 py-4 lg:px-8 shrink-0 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-action" />
        </button>
        <h2 className="text-heading-l text-neutral-white truncate">
          {edificio.nombre}
        </h2>
      </div>
      <div className="bg-identity px-4 h-[76px] flex items-center shrink-0">
        <div className="flex gap-3 overflow-x-auto no-scrollbar w-full">
          {pisos.map((piso, idx) => (
            <button
              key={piso.slug}
              onClick={() => setPisoActivo(idx)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 h-11 rounded-xl transition-all ${
                pisoActivo === idx
                  ? "bg-action text-identity"
                  : "bg-identity text-base border border-base hover:bg-white/10"
              }`}
            >
              <span className="text-title-m whitespace-nowrap mt-0.5">
                {piso.nombre}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del plano */}
      <div className="flex-1 min-h-0 bg-base overflow-hidden relative">
        {Plano ? (
          <div className="h-full w-full overflow-auto flex items-center justify-center p-4">
             <Plano
              key={pisoSlug}
              pisoSlug={pisoSlug}
              edificio={edificio}
              piso={piso}
              initialAulaId={initialAulaId}
              onOpenDetalleAula={openDetalleAula}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
            <Map size={64} className="text-neutral-main" strokeWidth={1.5} />
            <p className="text-body-m text-neutral-main text-center">
              Plano de {pisos[pisoActivo].nombre} próximamente disponible
            </p>
          </div>
        )}
      </div>

      {/* Detalle inferior */}
      <div className="shrink-0">
        <DetalleSeleccion marcadorSeleccionado={edificio} mostrarBoton={false} />
      </div>
    </div>
  );
}
