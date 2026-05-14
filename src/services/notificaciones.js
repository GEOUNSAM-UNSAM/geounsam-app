import { supabase } from '../lib/supabase';
import { getAlumnoComisionIds } from './comisiones';

const MAX_REALTIME_FILTER_VALUES = 100;

const REPORTES_CONFIG = [
  {
    tipo: 'aula',
    table: 'aula_reportes_cambio',
    select: `
      id,
      alumno_id,
      comision_id,
      horario_id,
      estado,
      created_at,
      aula_original:aulas!aula_reportes_cambio_aula_original_id_fkey(nombre),
      aula_reportada:aulas!aula_reportes_cambio_aula_reportada_id_fkey(nombre),
      comision:comisiones!inner(
        id,
        codigo,
        materia:materias!inner(id, nombre)
      )
    `,
  },
  {
    tipo: 'horario',
    table: 'horario_reportes_cambio',
    select: `
      id,
      alumno_id,
      comision_id,
      horario_id,
      estado,
      created_at,
      inicio_original,
      fin_original,
      inicio_reportado,
      fin_reportado,
      comision:comisiones!inner(
        id,
        codigo,
        materia:materias!inner(id, nombre)
      )
    `,
  },
  {
    tipo: 'modalidad',
    table: 'modalidad_reportes_cambio',
    select: `
      id,
      alumno_id,
      comision_id,
      horario_id,
      estado,
      created_at,
      modalidad_original,
      modalidad_reportada,
      aula_original:aulas!modalidad_reportes_cambio_aula_original_id_fkey(nombre),
      aula_reportada:aulas!modalidad_reportes_cambio_aula_reportada_id_fkey(nombre),
      comision:comisiones!inner(
        id,
        codigo,
        materia:materias!inner(id, nombre)
      )
    `,
  },
];

function getTiempoRelativo(value) {
  const date = new Date(value);
  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - date.getTime()) / 60000)
  );

  if (diffMinutes < 1) return 'Ahora';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.round(diffHours / 24);
  return `Hace ${diffDays} d`;
}

function formatTime(value) {
  return String(value ?? '').slice(0, 5);
}

function formatModalidad(value) {
  if (value === 'virtual') return 'Virtual';
  if (value === 'presencial') return 'Presencial';
  return value ?? 'Modalidad';
}

function getMateriaNombre(reporte) {
  return reporte.comision?.materia?.nombre ?? 'tu materia';
}

function getCambioDetalle(tipo, reporte) {
  if (tipo === 'aula') {
    return {
      anterior: reporte.aula_original?.nombre ?? 'Aula actual',
      nuevo: reporte.aula_reportada?.nombre ?? 'Aula reportada',
    };
  }

  if (tipo === 'horario') {
    return {
      anterior: `${formatTime(reporte.inicio_original)} - ${formatTime(reporte.fin_original)}`,
      nuevo: `${formatTime(reporte.inicio_reportado)} - ${formatTime(reporte.fin_reportado)}`,
    };
  }

  return {
    anterior: formatModalidad(reporte.modalidad_original),
    nuevo: formatModalidad(reporte.modalidad_reportada),
  };
}

function mapReporteToNotificacion(tipo, reporte, userId) {
  const materia = getMateriaNombre(reporte);
  const esReportePropioConfirmado =
    reporte.estado === 'confirmado' && reporte.alumno_id === userId;
  const sourceTable = REPORTES_CONFIG.find((config) => config.tipo === tipo)?.table;

  if (esReportePropioConfirmado) {
    return {
      id: `${tipo}-${reporte.id}-confirmado`,
      sourceId: reporte.id,
      sourceTable,
      horarioId: reporte.horario_id,
      tipo: 'confirmado',
      titulo: 'Tu reporte fue confirmado',
      descripcion: `La comunidad validó el cambio en ${materia}`,
      tiempo: getTiempoRelativo(reporte.created_at),
      createdAt: reporte.created_at,
      read: false,
    };
  }

  return {
    id: `${tipo}-${reporte.id}-cambio`,
    sourceId: reporte.id,
    sourceTable,
    horarioId: reporte.horario_id,
    tipo: 'cambio',
    titulo: `Cambio en ${materia}`,
    detalle: getCambioDetalle(tipo, reporte),
    tiempo: getTiempoRelativo(reporte.created_at),
    createdAt: reporte.created_at,
    read: false,
  };
}

async function getReportesPorTabla(config, comisionIds) {
  const { data, error } = await supabase
    .from(config.table)
    .select(config.select)
    .in('comision_id', comisionIds)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  return (data ?? []).map((reporte) => ({
    tipo: config.tipo,
    reporte,
  }));
}

export async function getNotificacionesReportesFavoritos(userId) {
  if (!userId) {
    return {
      comisionIds: [],
      notificaciones: [],
    };
  }

  const comisionIds = await getAlumnoComisionIds(userId);

  if (comisionIds.length === 0) {
    return {
      comisionIds,
      notificaciones: [],
    };
  }

  const reportesPorTipo = await Promise.all(
    REPORTES_CONFIG.map((config) => getReportesPorTabla(config, comisionIds))
  );

  const notificaciones = reportesPorTipo
    .flat()
    .map(({ tipo, reporte }) => mapReporteToNotificacion(tipo, reporte, userId))
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
    .slice(0, 30);

  return {
    comisionIds,
    notificaciones,
  };
}

export function subscribeReportesFavoritos({ userId, comisionIds, onChange }) {
  if (!userId || !comisionIds?.length) return null;

  const filterIds = comisionIds.slice(0, MAX_REALTIME_FILTER_VALUES);
  const filter = `comision_id=in.(${filterIds.join(',')})`;
  let channel = supabase.channel(`reportes-favoritos-${userId}`);

  REPORTES_CONFIG.forEach((config) => {
    ['INSERT', 'UPDATE'].forEach((event) => {
      channel = channel.on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table: config.table,
          filter,
        },
        onChange
      );
    });
  });

  channel.subscribe((status, error) => {
    if (error) {
      console.error('[Realtime notificaciones]', error);
      return;
    }

    if (status === 'CHANNEL_ERROR') {
      console.error('[Realtime notificaciones] No se pudo abrir el canal');
    }
  });

  return channel;
}
