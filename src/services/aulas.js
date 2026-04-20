import { supabase } from "../lib/supabase";
import { getAlumnoComisionIds } from "./comisiones";
import { DIAS } from "../utils/tiempo";
import { getEdificioSlug } from "../utils/edificios";

const DIA_LABELS = {
  Dom: "domingo",
  Lun: "lunes",
  Mar: "martes",
  Mie: "miércoles",
  Jue: "jueves",
  Vie: "viernes",
  Sab: "sábado",
};

function getDiaSiguiente(diaHoy) {
  if (diaHoy === "Sab" || diaHoy === "Dom") return "Lun";

  const idx = DIAS.indexOf(diaHoy);
  return DIAS[idx + 1] ?? "Lun";
}

// Consulta Supabase para obtener el estado de las aulas de un edificio.
// Las clases del usuario se incluyen desde 1 h antes para poder confirmar;
// el resto solo se muestran ocupadas cuando ya están en curso.
export async function getEstadosEdificio(edificioSlug, userId) {
  const ahora = new Date();
  const diaHoy = DIAS[ahora.getDay()];
  const diaSiguiente = getDiaSiguiente(diaHoy);
  const diasConsulta = diaHoy === diaSiguiente ? [diaHoy] : [diaHoy, diaSiguiente];
  const horaAhora = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}:00`;
  const limiteConfirmacion = new Date(ahora.getTime() + 60 * 60 * 1000);
  const horaLimiteConfirmacion = `${String(limiteConfirmacion.getHours()).padStart(2, "0")}:${String(limiteConfirmacion.getMinutes()).padStart(2, "0")}:00`;

  const [{ data, error }, misComisionIds] = await Promise.all([
    supabase
      .from("horarios")
      .select(`
        id, dia, inicio, fin,
        comision:comisiones!inner(
          id, codigo,
          materia:materias!inner(id, nombre),
          aula:aulas!inner(
            id,
            nombre,
            piso,
            edificio_id,
            edificio:edificios(id, nombre)
          )
        )
      `)
      .in("dia", diasConsulta),
    userId ? getAlumnoComisionIds(userId) : Promise.resolve([]),
  ]);

  if (error) throw error;

  const misComisionesSet = new Set(misComisionIds);
  const pisos = {};

  data.forEach(({ id, dia, inicio, fin, comision }) => {
    const aulaEdificioSlug = getEdificioSlug({
      id: comision.aula.edificio_id,
      nombre: comision.aula.edificio?.nombre,
    });

    if (
      comision.aula.edificio_id !== edificioSlug &&
      aulaEdificioSlug !== edificioSlug
    ) {
      return;
    }

    const esMiComision = misComisionesSet.has(comision.id);
    const esHoy = dia === diaHoy;
    const estaEnCurso = esHoy && inicio <= horaAhora && fin > horaAhora;
    const estaPorConfirmar =
      esHoy && esMiComision && inicio <= horaLimiteConfirmacion && fin > horaAhora;

    const pisoSlug = comision.aula.piso;
    const aulaNombre = comision.aula.nombre;

    if (!pisos[pisoSlug]) pisos[pisoSlug] = {};
    if (!pisos[pisoSlug][aulaNombre]) {
      pisos[pisoSlug][aulaNombre] = {
        estado: "libre",
        aulaId: comision.aula.id,
        dia,
        agendaDia: [],
        agendaTitulo: "Clases de hoy",
        agendaHoy: [],
        agendaSiguiente: [],
      };
    }

    const itemAgenda = {
      materia: comision.materia.nombre,
      comision: comision.codigo,
      horario: `${inicio.slice(0, 5)} - ${fin.slice(0, 5)}`,
      horarioId: id,
      comisionId: comision.id,
      aulaId: comision.aula.id,
      esMiComision,
      dia,
      inicio,
      fin,
    };

    if (dia === diaHoy && fin > horaAhora) {
      pisos[pisoSlug][aulaNombre].agendaHoy.push(itemAgenda);
    } else if (dia === diaSiguiente) {
      pisos[pisoSlug][aulaNombre].agendaSiguiente.push(itemAgenda);
    }

    if (!estaEnCurso && !estaPorConfirmar) return;

    const estadoActual = esMiComision ? "mi-clase" : "ocupada";
    if (
      pisos[pisoSlug][aulaNombre].estado === "mi-clase" &&
      estadoActual !== "mi-clase"
    ) {
      return;
    }

    pisos[pisoSlug][aulaNombre] = {
      ...pisos[pisoSlug][aulaNombre],
      ...itemAgenda,
      estado: estadoActual,
    };
  });

  Object.values(pisos).forEach((aulas) => {
    Object.values(aulas).forEach((info) => {
      info.agendaHoy.sort((a, b) => a.inicio.localeCompare(b.inicio));
      info.agendaSiguiente.sort((a, b) => a.inicio.localeCompare(b.inicio));

      if (info.agendaHoy.length > 0) {
        info.agendaDia = info.agendaHoy;
        info.agendaTitulo = "Clases de hoy";
      } else {
        info.agendaDia = info.agendaSiguiente;
        info.agendaTitulo = `Clases del ${DIA_LABELS[diaSiguiente] ?? "próximo día"}`;
      }

      delete info.agendaHoy;
      delete info.agendaSiguiente;
    });
  });

  return pisos;
}
