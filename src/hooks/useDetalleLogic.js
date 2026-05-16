import { useEffect, useState } from "react";
import {
  confirmarClase,
  getResumenConfirmacionesClase,
} from "../services/confirmaciones";
import {
  getPermisoReporteCambio,
  getResumenReporteCambioClase,
  validarReporteCambioClase,
} from "../services/reportesCambio";

export function useDetalleLogic({
  detalle,
  user,
  mensajeErrorConfirmacion = "No pudimos confirmar esta clase",
}) {
  const [confirmando, setConfirmando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [validacion, setValidacion] = useState(null);
  const [actualizaciones, setActualizaciones] = useState([]);
  const [reporteCambio, setReporteCambio] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [actionToast, setActionToast] = useState(null);
  const [validandoCambio, setValidandoCambio] = useState(false);
  const [permisoReporte, setPermisoReporte] = useState({
    totalConfirmaciones: 0,
    puedeReportar: false,
  });

  const horarioId = detalle.confirmacion.horarioId;

  useEffect(() => {
    let ignore = false;

    setConfirmando(false);
    setConfirmado(false);
    setValidacion(null);
    setActualizaciones([]);
    setReporteCambio(null);
    setFeedback(null);
    setActionToast(null);
    setValidandoCambio(false);

    if (!horarioId) return undefined;

    Promise.all([
      getResumenConfirmacionesClase({ horarioId }),
      getResumenReporteCambioClase({ horarioId }).catch((error) => {
        console.error(error);
        return null;
      }),
    ])
      .then(([resumen, reporte]) => {
        if (ignore) return;
        setConfirmado(resumen.yaConfirmo);
        setReporteCambio(reporte);

        if (reporte) {
          setValidacion({
            confirmaciones: reporte.totalReportes,
            total: reporte.total,
            tipo: "cambio",
          });
          setActualizaciones(
            [...reporte.actualizaciones, ...resumen.actualizaciones].slice(0, 3),
          );
          return;
        }

        setValidacion({
          confirmaciones: resumen.confirmaciones,
          total: resumen.total,
        });
        setActualizaciones(resumen.actualizaciones);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [horarioId]);

  useEffect(() => {
    let ignore = false;

    if (!user?.id) {
      setPermisoReporte({ totalConfirmaciones: 0, puedeReportar: false });
      return undefined;
    }

    getPermisoReporteCambio()
      .then((permiso) => {
        if (ignore) return;
        setPermisoReporte({
          totalConfirmaciones: Number(permiso.total_confirmaciones ?? 0),
          puedeReportar: Boolean(permiso.puede_reportar),
        });
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const puedeConfirmar = Boolean(user && detalle.confirmacion.puedeConfirmar);
  const puedeReportar = Boolean(
    user &&
      horarioId &&
      permisoReporte.puedeReportar &&
      detalle.enCursada &&
      !reporteCambio,
  );
  const detalleVista = reporteCambio ? { ...detalle, estado: "Cambio" } : detalle;

  const refrescarReporteCambio = async () => {
    if (!horarioId) return;

    try {
      const [resumen, reporte] = await Promise.all([
        getResumenConfirmacionesClase({ horarioId }),
        getResumenReporteCambioClase({ horarioId }).catch((error) => {
          console.error(error);
          return null;
        }),
      ]);

      setReporteCambio(reporte);
      if (reporte) {
        setValidacion({
          confirmaciones: reporte.totalReportes,
          total: reporte.total,
          tipo: "cambio",
        });
        setActualizaciones(
          [...reporte.actualizaciones, ...resumen.actualizaciones].slice(0, 3),
        );
        return;
      }

      setValidacion({
        confirmaciones: resumen.confirmaciones,
        total: resumen.total,
      });
      setActualizaciones(resumen.actualizaciones);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmar = async () => {
    if (!puedeConfirmar || confirmando || confirmado) return;

    setConfirmando(true);
    setFeedback(null);

    try {
      const resultado = await confirmarClase({ horarioId });
      const resumen = await getResumenConfirmacionesClase({ horarioId });

      setConfirmado(true);
      setValidacion({
        confirmaciones: Number(
          resumen.confirmaciones ?? resultado?.total_confirmaciones ?? 0,
        ),
        total: resumen.total,
      });
      setActualizaciones(resumen.actualizaciones);
      setFeedback({ tipo: "success", mensaje: "Clase confirmada" });
    } catch (error) {
      console.error(error);
      setFeedback({
        tipo: "error",
        mensaje: error?.message ?? mensajeErrorConfirmacion,
      });
    } finally {
      setConfirmando(false);
    }
  };

  const handleValidarCambio = async (decision) => {
    if (!reporteCambio?.id || validandoCambio) return;

    setValidandoCambio(true);

    try {
      await validarReporteCambioClase({ reporte: reporteCambio, decision });
      await refrescarReporteCambio();

      setActionToast(
        decision === "confirmar"
          ? {
              variant: "success",
              title: "¡Cambio confirmado!",
              description: "Gracias por verificar",
              xp: "+10 XP",
            }
          : {
              variant: "warning",
              title: "¡Cambio denegado!",
              description: "Gracias por verificar",
              xp: "+5 XP",
            },
      );
    } catch (error) {
      console.error(error);
      setActionToast({
        variant: "error",
        title: error?.message ?? "No pudimos validar el cambio",
        description: "Intentá nuevamente",
      });
    } finally {
      setValidandoCambio(false);
    }
  };

  return {
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
    refrescarReporteCambio,
  };
}
