import { useEffect, useState } from "react";
import { Siren } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ActionToast from "../../components/ActionToast";
import ActionButtons from "../../components/Clase/ActionButtons";
import ActualizacionesCard from "../../components/Clase/ActualizacionesCard";
import AgendaDiaCard from "../../components/Clase/AgendaDiaCard";
import CambioReportadoTip from "../../components/Clase/CambioReportadoTip";
import ClaseCard from "../../components/Clase/ClaseCard";
import DetalleHeader from "../../components/Clase/DetalleHeader";
import UbicacionActions from "../../components/Clase/UbicacionActions";
import ValidacionComunitaria from "../../components/Clase/ValidacionComunitaria";
import PantallaCarga from "../../components/PantallaCarga";
import Tip from "../../components/Tip";
import { useAuth } from "../../context/AuthContext";
import { useDetalleLogic } from "../../hooks/useDetalleLogic";
import { getHorarioClase } from "../../services/comisiones";
import {
  buildClaseDetalleFromHorario,
  buildDetalleClase,
} from "../../utils/detalleClase";
import { getDetalleAulaPath, getEdificioSlug } from "../../utils/edificios";

export default function DetalleClase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { horarioId } = useParams();
  const [claseState, setClaseState] = useState(location.state?.clase ?? null);
  const [loading, setLoading] = useState(!location.state?.clase);

  const detalle = buildDetalleClase(claseState);

  const {
    confirmando,
    confirmado,
    validacion,
    actualizaciones,
    reporteCambio,
    feedback,
    actionToast,
    setActionToast,
    validandoCambio,
    puedeConfirmar,
    puedeReportar,
    detalleVista,
    handleConfirmar,
    handleValidarCambio,
  } = useDetalleLogic({ detalle, user });

  useEffect(() => {
    if (location.state?.clase) {
      setClaseState(location.state.clase);
      setLoading(false);
      return undefined;
    }

    if (!user?.id || !horarioId) return undefined;

    let ignore = false;
    setLoading(true);

    getHorarioClase(horarioId, user.id)
      .then((horario) => {
        if (ignore) return;
        setClaseState(horario ? buildClaseDetalleFromHorario(horario) : null);
      })
      .catch((error) => {
        console.error(error);
        if (!ignore) setClaseState(null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [location.state, user?.id, horarioId]);

  const volver = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/cursada");
    }
  };

  const puedeVerUbicacion = Boolean(!detalle.esVirtual && claseState?.edificio);
  const puedeVerAula = Boolean(!detalle.esVirtual && claseState?.aulaDetalle);

  const verUbicacionEdificio = () => {
    if (!puedeVerUbicacion) return;
    const edificioSlug = getEdificioSlug(claseState.edificio);
    navigate("/mapa", {
      state: {
        mapFocus: "edificio",
        edificioSlug,
        edificio: claseState.edificio,
      },
    });
  };

  const verUbicacionAula = () => {
    if (!puedeVerAula) return;
    const path = getDetalleAulaPath({
      edificio: claseState.edificio,
      aula: claseState.aulaDetalle,
    });
    if (!path) return;
    navigate(path, {
      state: {
        aula: claseState.aulaDetalle,
        edificio: claseState.edificio,
        piso: claseState.piso,
      },
    });
  };

  const abrirReporte = () => {
    if (!puedeReportar) return;
    navigate("/reportar-cambio", {
      state: {
        detalle,
        detalleState: claseState,
        edificioSlug: getEdificioSlug(claseState?.edificio),
      },
    });
  };

  if (loading) return <PantallaCarga mensaje="Cargando clase..." compact />;

  if (!claseState) {
    return (
      <div className="flex h-full flex-col bg-base pb-20">
        <DetalleHeader
          detalle={{ aula: "Clase no encontrada", estado: null }}
          onBack={volver}
        />
        <main className="px-8 py-5">
          <Tip
            icon={Siren}
            title="No encontramos esta clase"
            description="Volvé a tu cursada e intentá abrirla nuevamente."
            actionLabel="Ver mi cursada"
            actionTo="/cursada"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-base">
      <DetalleHeader detalle={detalleVista} onBack={volver} />

      <main className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-8 pb-4 pt-5">
        <div className="flex flex-col gap-4">
          <UbicacionActions
            onVerEdificio={verUbicacionEdificio}
            onVerAula={verUbicacionAula}
            puedeVerEdificio={puedeVerUbicacion}
            puedeVerAula={puedeVerAula}
          />
          {detalle.clase ? <ClaseCard clase={detalle.clase} /> : null}
          <AgendaDiaCard agenda={detalle.agendaDia} titulo={detalle.agendaTitulo} />
          {validacion ? <ValidacionComunitaria validacion={validacion} /> : null}
          <ActualizacionesCard actualizaciones={actualizaciones} />
        </div>

        <CambioReportadoTip reporte={reporteCambio} />

        {detalle.tieneClase && !detalle.enCursada ? (
          <Tip
            icon={Siren}
            title="Esta materia no está en tu cursada"
            description="Agregala a tu cursada para poder confirmar asistencia o reportar cambios"
            actionLabel="Agregar a mi cursada"
            actionTo={claseState?.comisionId ? `/materias/${claseState.comisionId}` : "/buscar"}
          />
        ) : null}

        {feedback ? (
          <p
            className={`rounded-[20px] px-4 py-3 text-center text-body-s ${
              feedback.tipo === "success"
                ? "bg-state-green text-data-green-800"
                : "bg-state-red text-error"
            }`}
          >
            {feedback.mensaje}
          </p>
        ) : null}
      </main>

      <ActionButtons
        canConfirm={puedeConfirmar}
        confirming={confirmando}
        confirmed={confirmado}
        canReport={puedeReportar}
        changeMode={Boolean(reporteCambio)}
        canConfirmChange={Boolean(reporteCambio && !reporteCambio.yaReporto && !validandoCambio)}
        canDenyChange={Boolean(reporteCambio && !validandoCambio)}
        onConfirm={handleConfirmar}
        onReport={abrirReporte}
        onConfirmChange={() => handleValidarCambio("confirmar")}
        onDenyChange={() => handleValidarCambio("denegar")}
      />
      <ActionToast toast={actionToast} onClose={() => setActionToast(null)} />
    </div>
  );
}
