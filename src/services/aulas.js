import { supabase } from "../lib/supabase";
import { getAlumnoComisionIds } from "./comisiones";
import { DIAS } from "../utils/tiempo";

// Consulta Supabase para obtener el estado de las aulas de un edificio
// en el momento actual. Las clases del usuario se marcan "mi-clase"
// a partir de alumno_comisiones; el resto se marcan "ocupada".
export async function getEstadosEdificio(edificioId, userId) {
  const ahora = new Date();
  const diaHoy = DIAS[ahora.getDay()];
  const horaAhora = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}:00`;

  const [{ data, error }, misComisionIds] = await Promise.all([
    supabase
      .from("horarios")
      .select(`
        inicio, fin,
        comision:comisiones!inner(
          id, codigo,
          materia:materias!inner(id, nombre),
          aula:aulas!inner(id, nombre, piso, edificio_id)
        )
      `)
      .eq("dia", diaHoy)
      .lte("inicio", horaAhora)
      .gt("fin", horaAhora),
    userId ? getAlumnoComisionIds(userId) : Promise.resolve([]),
  ]);

  if (error) throw error;

  const misComisionesSet = new Set(misComisionIds);
  const pisos = {};

  data.forEach(({ inicio, fin, comision }) => {
    if (comision.aula.edificio_id !== edificioId) return;

    const pisoSlug = comision.aula.piso;
    const aulaNombre = comision.aula.nombre;

    if (!pisos[pisoSlug]) pisos[pisoSlug] = {};

    pisos[pisoSlug][aulaNombre] = {
      estado: misComisionesSet.has(comision.id) ? "mi-clase" : "ocupada",
      materia: comision.materia.nombre,
      comision: comision.codigo,
      horario: `${inicio.slice(0, 5)} - ${fin.slice(0, 5)}`,
    };
  });

  return pisos;
}
