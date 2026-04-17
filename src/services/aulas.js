import { supabase } from "../lib/supabase";
import { getAlumnoComisionIds } from "./comisiones";
import { DIAS } from "../utils/tiempo";
import { getEdificioSlug } from "../utils/edificios";

// Consulta Supabase para obtener el estado de las aulas de un edificio.
// Las clases del usuario se incluyen desde 1 h antes para poder confirmar;
// el resto solo se muestran ocupadas cuando ya están en curso.
export async function getEstadosEdificio(edificioSlug, userId) {
  const ahora = new Date();
  const diaHoy = DIAS[ahora.getDay()];
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
      .eq("dia", diaHoy)
      .lte("inicio", horaLimiteConfirmacion)
      .gt("fin", horaAhora),
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
    const estaEnCurso = inicio <= horaAhora;

    if (!estaEnCurso && !esMiComision) return;

    const pisoSlug = comision.aula.piso;
    const aulaNombre = comision.aula.nombre;

    if (!pisos[pisoSlug]) pisos[pisoSlug] = {};

    pisos[pisoSlug][aulaNombre] = {
      estado: esMiComision ? "mi-clase" : "ocupada",
      materia: comision.materia.nombre,
      comision: comision.codigo,
      horario: `${inicio.slice(0, 5)} - ${fin.slice(0, 5)}`,
      horarioId: id,
      comisionId: comision.id,
      aulaId: comision.aula.id,
      dia,
      inicio,
      fin,
    };
  });

  return pisos;
}
