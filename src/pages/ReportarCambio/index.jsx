import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClockAlert, House, MapPinPen, TvMinimal } from "lucide-react";
import {
  ConfirmacionStep,
  FooterActions,
  HorarioStep,
  ReporteEnviadoModal,
  ReporteHeader,
  Stepper,
  TipoCambioStep,
  UbicacionStep,
  VirtualStep,
} from "../../components/ReportarCambio";
import { getAulasEdificio } from "../../services/aulas";
import {
  reportarCambioAula,
  reportarCambioHorario,
  reportarCambioModalidad,
} from "../../services/reportesCambio";

const TIPOS_PRESENCIAL = [
  {
    id: "aula",
    titulo: "Cambio de aula",
    descripcion: "La clase está en otro lugar",
    icon: MapPinPen,
  },
  {
    id: "horario",
    titulo: "Cambio de horario",
    descripcion: "El horario de la clase cambió",
    icon: ClockAlert,
  },
  {
    id: "virtual",
    titulo: "Pasa a virtual",
    descripcion: "La clase presencial pasa a virtual",
    icon: TvMinimal,
  },
];

const TIPOS_VIRTUAL = [
  TIPOS_PRESENCIAL[0],
  TIPOS_PRESENCIAL[1],
  {
    id: "presencial",
    titulo: "Pasa a presencial",
    descripcion: "La clase pasa a ser presencial",
    icon: House,
  },
];

const EDIFICIOS_REPORTE = [
  { id: "tornavias", label: "TORNAVIAS" },
  { id: "eeyn", label: "EEYN" },
  { id: "aulario", label: "AULARIO" },
  { id: "its", label: "ITS" },
  { id: "dan-beninson", label: "DAN BENINSON" },
  { id: "cs-sociales", label: "CS SOCIALES" },
];

const HORAS_REPORTE = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

const CLASE_FALLBACK = {
  nombre: "Materia",
  inicio: "--:--",
  fin: "--:--",
  comision: null,
};

function getTipoLabel(tiposCambio, tipoSeleccionado) {
  return (
    tiposCambio.find((item) => item.id === tipoSeleccionado)?.titulo ?? "Cambio"
  );
}

function getResumenRows({
  tipoSeleccionado,
  tipoSeleccionadoLabel,
  clase,
  detalle,
  edificio,
  aulaSeleccionada,
  nuevoInicio,
  nuevoFin,
}) {
  if (tipoSeleccionado === "horario") {
    return [
      { label: "Materia", value: clase.nombre },
      { label: "Tipo", value: tipoSeleccionadoLabel },
      { label: "Antes", value: `${clase.inicio} - ${clase.fin}`, strike: true },
      { label: "Ahora", value: `${nuevoInicio} - ${nuevoFin}`, accent: true },
    ];
  }

  if (tipoSeleccionado === "virtual") {
    return [
      { label: "Materia", value: clase.nombre },
      { label: "Tipo", value: "Cambio de modalidad" },
      { label: "Modalidad", value: "Virtual" },
    ];
  }

  if (tipoSeleccionado === "presencial") {
    return [
      { label: "Materia", value: clase.nombre },
      { label: "Tipo", value: "Cambio de modalidad" },
      { label: "Edificio", value: edificio },
      { label: "Modalidad", value: "Presencial" },
      { label: "Aula", value: aulaSeleccionada?.nombre ?? "Aula nueva" },
    ];
  }

  return [
    { label: "Materia", value: clase.nombre },
    { label: "Tipo", value: tipoSeleccionadoLabel },
    { label: "Edificio", value: edificio },
    { label: "Antes", value: detalle?.aula ?? "Aula anterior", strike: true },
    { label: "Ahora", value: aulaSeleccionada?.nombre ?? "Aula nueva" },
  ];
}

function getModalValues({
  tipoSeleccionado,
  clase,
  detalle,
  edificio,
  aulaSeleccionada,
  nuevoInicio,
  nuevoFin,
}) {
  if (tipoSeleccionado === "horario") {
    return {
      anterior: `${clase.inicio} - ${clase.fin}`,
      nuevo: `${nuevoInicio} - ${nuevoFin}`,
    };
  }

  if (tipoSeleccionado === "virtual") {
    return {
      anterior: "Presencial",
      nuevo: "Virtual",
    };
  }

  if (tipoSeleccionado === "presencial") {
    return {
      anterior: "Virtual",
      nuevo: `${aulaSeleccionada?.nombre ?? "Aula nueva"} - ${edificio}`,
    };
  }

  return {
    anterior: `${detalle?.aula ?? "Aula anterior"} - ${edificio}`,
    nuevo: `${aulaSeleccionada?.nombre ?? "Aula nueva"} - ${edificio}`,
  };
}

function getMinutos(hora) {
  const [hours, minutes] = String(hora ?? "").split(":").map(Number);
  return (hours * 60) + minutes;
}

export default function ReportarCambio() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const detalle = state?.detalle;
  const clase = detalle?.clase ?? CLASE_FALLBACK;
  const modalidadClase =
    detalle?.confirmacion?.modalidad ?? (detalle?.esVirtual ? "virtual" : "presencial");
  const tiposCambio = detalle?.esVirtual ? TIPOS_VIRTUAL : TIPOS_PRESENCIAL;

  const [step, setStep] = useState(1);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(
    detalle?.esVirtual ? "presencial" : "aula",
  );
  const [edificioSeleccionado, setEdificioSeleccionado] = useState(
    state?.edificioSlug ?? "tornavias",
  );
  const [aulas, setAulas] = useState([]);
  const [aulaSeleccionadaId, setAulaSeleccionadaId] = useState("");
  const [queryAula, setQueryAula] = useState("");
  const [comentario, setComentario] = useState("");
  const [nuevoInicio, setNuevoInicio] = useState("08:00");
  const [nuevoFin, setNuevoFin] = useState("09:00");
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [reporteEnviado, setReporteEnviado] = useState(false);

  const aulasFiltradas = aulas
    .filter((aula) => aula.id !== detalle?.confirmacion?.aulaId)
    .filter((aula) =>
      aula.nombre.toLowerCase().includes(queryAula.trim().toLowerCase()),
    );
  const aulaSeleccionada = aulas.find((aula) => aula.id === aulaSeleccionadaId);
  const edificioSeleccionadoLabel =
    EDIFICIOS_REPORTE.find((item) => item.id === edificioSeleccionado)?.label ??
    edificioSeleccionado;
  const tipoSeleccionadoLabel = getTipoLabel(tiposCambio, tipoSeleccionado);
  const requiereNuevaAula =
    tipoSeleccionado === "aula" || tipoSeleccionado === "presencial";
  const horarioValido =
    getMinutos(nuevoInicio) < getMinutos(nuevoFin) &&
    (nuevoInicio !== clase.inicio || nuevoFin !== clase.fin);
  const puedeEnviarReporte =
    tipoSeleccionado === "aula" ||
    tipoSeleccionado === "virtual" ||
    (tipoSeleccionado === "presencial" && Boolean(aulaSeleccionadaId)) ||
    (tipoSeleccionado === "horario" && horarioValido);
  const resumenRows = getResumenRows({
    tipoSeleccionado,
    tipoSeleccionadoLabel,
    clase,
    detalle,
    edificio: edificioSeleccionadoLabel,
    aulaSeleccionada,
    nuevoInicio,
    nuevoFin,
  });
  const modalValues = getModalValues({
    tipoSeleccionado,
    clase,
    detalle,
    edificio: edificioSeleccionadoLabel,
    aulaSeleccionada,
    nuevoInicio,
    nuevoFin,
  });
  const accionDeshabilitada =
    (step === 2 && requiereNuevaAula && !aulaSeleccionadaId) ||
    (step === 2 && tipoSeleccionado === "horario" && !horarioValido) ||
    (step === 3 && !puedeEnviarReporte);

  useEffect(() => {
    let ignore = false;

    getAulasEdificio(edificioSeleccionado)
      .then((data) => {
        if (ignore) return;
        setAulas(data);
        setAulaSeleccionadaId("");
      })
      .catch((error) => {
        console.error(error);
        if (!ignore) setAulas([]);
      });

    return () => {
      ignore = true;
    };
  }, [edificioSeleccionado]);

  const volver = () => {
    if (step > 1) {
      setStep((current) => current - 1);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/inicio");
    }
  };

  const continuar = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2 && !accionDeshabilitada) {
      setStep(3);
    }
  };

  const enviarReporte = async () => {
    if (
      !detalle?.confirmacion?.horarioId ||
      !puedeEnviarReporte ||
      enviando
    ) return;

    setEnviando(true);
    setFeedback(null);

    try {
      if (tipoSeleccionado === "aula") {
        await reportarCambioAula({
          horarioId: detalle.confirmacion.horarioId,
          aulaReportadaId: Number(aulaSeleccionadaId),
          motivo: comentario,
        });
      }

      if (tipoSeleccionado === "horario") {
        await reportarCambioHorario({
          horarioId: detalle.confirmacion.horarioId,
          inicioReportado: nuevoInicio,
          finReportado: nuevoFin,
          motivo: comentario,
        });
      }

      if (tipoSeleccionado === "virtual") {
        await reportarCambioModalidad({
          horarioId: detalle.confirmacion.horarioId,
          modalidadReportada: "virtual",
          motivo: comentario,
        });
      }

      if (tipoSeleccionado === "presencial") {
        await reportarCambioModalidad({
          horarioId: detalle.confirmacion.horarioId,
          modalidadReportada: "presencial",
          aulaReportadaId: Number(aulaSeleccionadaId),
          motivo: comentario,
        });
      }

      setFeedback({
        tipo: "success",
        mensaje: "Reporte enviado. Queda pendiente de validación",
      });
      setReporteEnviado(true);
    } catch (error) {
      console.error(error);
      setFeedback({
        tipo: "error",
        mensaje: error?.message ?? "No pudimos enviar el reporte",
      });
    } finally {
      setEnviando(false);
    }
  };

  if (!detalle) {
    return (
      <div className="flex min-h-screen flex-col bg-base">
        <ReporteHeader onBack={() => navigate(-1)} />
        <main className="flex flex-1 items-center justify-center px-8">
          <p className="text-center font-saira text-sm text-neutral-main">
            No hay información de clase disponible. Volvé a tu cursada e intentá nuevamente.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-base">
      <ReporteHeader onBack={volver} />

      <main className="flex min-h-0 flex-1 flex-col gap-3 px-8 pt-3">
        <Stepper activeStep={step} />

        {step === 1 ? (
          <TipoCambioStep
            clase={clase}
            modalidad={modalidadClase}
            tiposCambio={tiposCambio}
            tipoSeleccionado={tipoSeleccionado}
            onSelect={setTipoSeleccionado}
          />
        ) : step === 2 && requiereNuevaAula ? (
          <UbicacionStep
            edificios={EDIFICIOS_REPORTE}
            edificioSeleccionado={edificioSeleccionado}
            aulas={aulasFiltradas}
            aulaSeleccionadaId={aulaSeleccionadaId}
            queryAula={queryAula}
            onSelectEdificio={setEdificioSeleccionado}
            onSelectAula={setAulaSeleccionadaId}
            onQueryAula={setQueryAula}
          />
        ) : step === 2 && tipoSeleccionado === "horario" ? (
          <HorarioStep
            clase={clase}
            horas={HORAS_REPORTE}
            nuevoInicio={nuevoInicio}
            nuevoFin={nuevoFin}
            onInicio={setNuevoInicio}
            onFin={setNuevoFin}
          />
        ) : step === 2 && tipoSeleccionado === "virtual" ? (
          <VirtualStep />
        ) : (
          <ConfirmacionStep
            rows={resumenRows}
            comentario={comentario}
            enviando={enviando}
            feedback={feedback}
            onComentario={setComentario}
          />
        )}
      </main>

      <FooterActions
        step={step}
        disabled={accionDeshabilitada}
        enviando={enviando}
        onBack={volver}
        onContinue={continuar}
        onSend={enviarReporte}
      />

      {reporteEnviado ? (
        <ReporteEnviadoModal
          clase={clase}
          tipo={tipoSeleccionado}
          valorAnterior={modalValues.anterior}
          valorNuevo={modalValues.nuevo}
          onVerCursada={() => navigate("/cursada")}
          onVolverInicio={() => navigate("/inicio")}
        />
      ) : null}
    </div>
  );
}
