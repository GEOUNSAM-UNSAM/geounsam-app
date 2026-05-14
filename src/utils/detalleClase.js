import { getPisoLabel } from "./pisos";

function formatAulaLabel(nombreAula) {
  if (!nombreAula) return null;
  return /^\d+$/.test(nombreAula) ? `Aula ${nombreAula}` : nombreAula;
}

export function buildClaseDetalleFromHorario(horario) {
  const comision = horario?.comision;
  const materia = comision?.materia;
  const aula = horario?.aula ?? comision?.aula ?? null;
  const modalidad = horario?.modalidad ?? "presencial";
  const esVirtual = modalidad === "virtual";
  const aulaLabel = formatAulaLabel(aula?.nombre);
  const edificio = aula?.edificio
    ? {
        id: aula.edificio_id ?? aula.edificio.id,
        nombre: aula.edificio.nombre,
        slug: aula.edificio.slug,
        planoId: aula.edificio.plano_id,
      }
    : null;
  const piso = aula?.piso
    ? {
        slug: aula.piso,
        nombre: getPisoLabel(aula.piso),
      }
    : null;

  return {
    id: `${materia?.id ?? "materia"}-${comision?.id ?? "comision"}-${horario.id}`,
    nombre: materia?.nombre ?? "Materia",
    comision: comision?.codigo ?? null,
    inicio: String(horario.inicio ?? "").slice(0, 5),
    fin: String(horario.fin ?? "").slice(0, 5),
    horarioId: horario.id,
    comisionId: comision?.id ?? null,
    aulaId: aula?.id ?? null,
    modalidad,
    esVirtual,
    aula: esVirtual
      ? "Clase virtual"
      : aulaLabel
        ? `${aulaLabel}${edificio?.nombre ? ` · ${edificio.nombre}` : ""}`
        : "Sin aula asignada",
    aulaDetalle: aula
      ? {
          id: aula.nombre ?? aula.id,
          nombre: aulaLabel,
          estado: "mi-clase",
          info: {
            materia: materia?.nombre,
            comision: comision?.codigo,
            horario: `${String(horario.inicio ?? "").slice(0, 5)} - ${String(horario.fin ?? "").slice(0, 5)}`,
            horarioId: horario.id,
            comisionId: comision?.id,
            aulaId: aula.id,
            dia: horario.dia,
            inicio: horario.inicio,
            fin: horario.fin,
            modalidad,
            esVirtual,
          },
          pisoSlug: aula.piso,
        }
      : null,
    edificio,
    piso,
  };
}

export function buildDetalleClase(clase) {
  return {
    aula: clase?.esVirtual
      ? "Clase virtual"
      : clase?.aulaDetalle?.nombre ?? clase?.aula ?? "Clase",
    edificio: clase?.esVirtual ? null : clase?.edificio?.nombre ?? null,
    piso: clase?.esVirtual ? null : clase?.piso?.nombre ?? null,
    estado: clase?.esVirtual ? "Virtual" : "Mi clase",
    clase: clase
      ? {
          nombre: clase.nombre,
          inicio: clase.inicio,
          fin: clase.fin,
          comision: clase.comision,
          modalidad: clase.modalidad,
          esVirtual: clase.esVirtual,
        }
      : null,
    agendaDia: [],
    agendaTitulo: "Clases de hoy",
    validacion: null,
    actualizaciones: [],
    enCursada: true,
    esVirtual: Boolean(clase?.esVirtual),
    tieneClase: Boolean(clase),
    confirmacion: {
      horarioId: clase?.horarioId ?? null,
      aulaId: clase?.aulaId ?? null,
      comisionId: clase?.comisionId ?? null,
      modalidad: clase?.modalidad ?? "presencial",
      puedeConfirmar: Boolean(clase?.horarioId),
    },
  };
}
