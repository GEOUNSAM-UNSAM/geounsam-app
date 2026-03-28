import { supabase } from "../lib/supabase";
import { DIAS } from "../utils/tiempo";

// Consulta Supabase para obtener el estado de las aulas de un edificio
// en el momento actual. Todas las clases activas se marcan "ocupada".
export async function getEstadosEdificio(edificioId, userId) {
  const ahora = new Date();
  const diaHoy = DIAS[ahora.getDay()];
  const horaAhora = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}:00`;

  console.log("[aulas] getEstadosEdificio →", { edificioId, userId, diaHoy, horaAhora });

  const { data, error } = await supabase
    .from("horarios")
    .select(`
      inicio, fin,
      comision:comisiones!inner(
        id, codigo,
        materia:materias!inner(id, nombre),
        aula:aulas!inner(id, piso, edificio_id)
      )
    `)
    .eq("dia", diaHoy)
    .lte("inicio", horaAhora)
    .gt("fin", horaAhora);

  if (error) {
    console.error("[aulas] error en query horarios:", error);
    throw error;
  }

  console.log("[aulas] horarios activos:", data);

  const pisos = {};

  data.forEach(({ inicio, fin, comision }) => {
    if (comision.aula.edificio_id !== edificioId) return;

    const pisoSlug = comision.aula.piso;
    const aulaId = String(comision.aula.id);

    if (!pisos[pisoSlug]) pisos[pisoSlug] = {};

    pisos[pisoSlug][aulaId] = {
      estado: "ocupada",
      materia: comision.materia.nombre,
      comision: comision.codigo,
      horario: `${inicio.slice(0, 5)} - ${fin.slice(0, 5)}`,
    };

    console.log(`[aulas] ✓ ocupada: piso=${pisoSlug} aula=${aulaId} materia="${comision.materia.nombre}"`);
  });

  console.log("[aulas] resultado final pisos:", pisos);

  return pisos;
}
