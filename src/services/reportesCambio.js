import { supabase } from "../lib/supabase";

const OBJETIVO_VALIDACIONES_CAMBIO = 10;

function getTiempoRelativo(value) {
  const date = new Date(value);
  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));

  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.round(diffHours / 24);
  return `Hace ${diffDays} d`;
}

function mapActualizaciones(actualizaciones) {
  return actualizaciones.map((item) => ({
    id: `${item.tipo ?? "reporte"}-cambio-${item.id}`,
    texto: item.texto ?? `${item.nombre ?? "Una persona"} reportó cambio`,
    tiempo: getTiempoRelativo(item.created_at),
    color: item.color ?? "bg-data-orange-500",
  }));
}

function normalizeResumenReporte(resumen, tipo, values) {
  const totalReportes = Number(resumen.total_reportes ?? 0);

  if (!resumen.reporte_id && !totalReportes) return null;

  const actualizaciones = Array.isArray(resumen.actualizaciones)
    ? resumen.actualizaciones
    : [];

  return {
    id: resumen.reporte_id,
    tipo,
    totalReportes,
    total: OBJETIVO_VALIDACIONES_CAMBIO,
    yaReporto: Boolean(resumen.ya_reporto),
    createdAt: resumen.created_at,
    tiempo: getTiempoRelativo(resumen.created_at),
    actualizaciones: mapActualizaciones(actualizaciones),
    ...values,
  };
}

function formatModalidad(value) {
  if (value === "virtual") return "Virtual";
  if (value === "presencial") return "Presencial";
  return value ?? "Modalidad";
}

export async function getPermisoReporteCambio() {
  const { data, error } = await supabase.rpc("get_permiso_reporte_cambio");

  if (error) throw error;

  return data?.[0] ?? {
    total_confirmaciones: 0,
    puede_reportar: false,
  };
}

export async function reportarCambioAula({
  horarioId,
  aulaReportadaId,
  motivo = null,
}) {
  if (!horarioId || !aulaReportadaId) {
    throw new Error("Faltan datos para reportar el cambio de aula");
  }

  const { data, error } = await supabase.rpc("reportar_cambio_aula", {
    p_horario_id: horarioId,
    p_aula_reportada_id: aulaReportadaId,
    p_motivo: motivo,
  });

  if (error) throw error;

  return data?.[0] ?? null;
}

export async function reportarCambioHorario({
  horarioId,
  inicioReportado,
  finReportado,
  motivo = null,
}) {
  if (!horarioId || !inicioReportado || !finReportado) {
    throw new Error("Faltan datos para reportar el cambio de horario");
  }

  const { data, error } = await supabase.rpc("reportar_cambio_horario", {
    p_horario_id: horarioId,
    p_inicio_reportado: inicioReportado,
    p_fin_reportado: finReportado,
    p_motivo: motivo,
  });

  if (error) throw error;

  return data?.[0] ?? null;
}

export async function reportarCambioModalidad({
  horarioId,
  modalidadReportada,
  aulaReportadaId = null,
  motivo = null,
}) {
  if (!horarioId || !modalidadReportada) {
    throw new Error("Faltan datos para reportar el cambio de modalidad");
  }

  const { data, error } = await supabase.rpc("reportar_cambio_modalidad", {
    p_horario_id: horarioId,
    p_modalidad_reportada: modalidadReportada,
    p_aula_reportada_id: aulaReportadaId,
    p_motivo: motivo,
  });

  if (error) throw error;

  return data?.[0] ?? null;
}

export async function getResumenReporteCambioAula({ horarioId }) {
  if (!horarioId) return null;

  const { data, error } = await supabase.rpc("get_resumen_reporte_cambio_aula", {
    p_horario_id: horarioId,
  });

  if (error) throw error;

  const resumen = data?.[0] ?? {};

  return normalizeResumenReporte(resumen, "aula", {
    valorOriginal: resumen.aula_original ?? "Aula actual",
    valorReportado: resumen.aula_reportada ?? "Aula reportada",
  });
}

export async function getResumenReporteCambioHorario({ horarioId }) {
  if (!horarioId) return null;

  const { data, error } = await supabase.rpc("get_resumen_reporte_cambio_horario", {
    p_horario_id: horarioId,
  });

  if (error) throw error;

  const resumen = data?.[0] ?? {};

  return normalizeResumenReporte(resumen, "horario", {
    valorOriginal: `${String(resumen.inicio_original ?? "").slice(0, 5)} - ${String(resumen.fin_original ?? "").slice(0, 5)}`,
    valorReportado: `${String(resumen.inicio_reportado ?? "").slice(0, 5)} - ${String(resumen.fin_reportado ?? "").slice(0, 5)}`,
  });
}

export async function getResumenReporteCambioModalidad({ horarioId }) {
  if (!horarioId) return null;

  const { data, error } = await supabase.rpc("get_resumen_reporte_cambio_modalidad", {
    p_horario_id: horarioId,
  });

  if (error) throw error;

  const resumen = data?.[0] ?? {};

  return normalizeResumenReporte(resumen, "modalidad", {
    valorOriginal: formatModalidad(resumen.modalidad_original),
    valorReportado: formatModalidad(resumen.modalidad_reportada),
  });
}

export async function getResumenReporteCambioClase({ horarioId }) {
  const [aula, horario, modalidad] = await Promise.all([
    getResumenReporteCambioAula({ horarioId }).catch((error) => {
      console.error(error);
      return null;
    }),
    getResumenReporteCambioHorario({ horarioId }).catch((error) => {
      console.error(error);
      return null;
    }),
    getResumenReporteCambioModalidad({ horarioId }).catch((error) => {
      console.error(error);
      return null;
    }),
  ]);

  return [aula, horario, modalidad]
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))[0] ?? null;
}

export async function validarReporteCambioAula({ reporteId, decision }) {
  if (!reporteId || !decision) {
    throw new Error("Faltan datos para validar el cambio");
  }

  const { data, error } = await supabase.rpc("validar_reporte_cambio_aula", {
    p_reporte_id: reporteId,
    p_decision: decision,
  });

  if (error) throw error;

  return data?.[0] ?? null;
}

export async function validarReporteCambioHorario({ reporteId, decision }) {
  if (!reporteId || !decision) {
    throw new Error("Faltan datos para validar el cambio");
  }

  const { data, error } = await supabase.rpc("validar_reporte_cambio_horario", {
    p_reporte_id: reporteId,
    p_decision: decision,
  });

  if (error) throw error;

  return data?.[0] ?? null;
}

export async function validarReporteCambioModalidad({ reporteId, decision }) {
  if (!reporteId || !decision) {
    throw new Error("Faltan datos para validar el cambio");
  }

  const { data, error } = await supabase.rpc("validar_reporte_cambio_modalidad", {
    p_reporte_id: reporteId,
    p_decision: decision,
  });

  if (error) throw error;

  return data?.[0] ?? null;
}

export async function validarReporteCambioClase({ reporte, decision }) {
  if (reporte?.tipo === "horario") {
    return validarReporteCambioHorario({ reporteId: reporte.id, decision });
  }

  if (reporte?.tipo === "modalidad") {
    return validarReporteCambioModalidad({ reporteId: reporte.id, decision });
  }

  return validarReporteCambioAula({ reporteId: reporte.id, decision });
}
