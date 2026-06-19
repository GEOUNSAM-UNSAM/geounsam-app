import { supabase } from "../lib/supabase";
import { DIAS, minutosDelDia } from "../utils/tiempo";
import { getMateriasCarreraConHorarios, getAlumnoCarreras } from "./alumnos";

const normalizar = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const formatAulaLabel = (nombreAula) =>
  nombreAula
    ? /^\d+$/.test(nombreAula) ? `Aula ${nombreAula}` : nombreAula
    : "";

let _materiasCache = null;

async function _cargarMaterias() {
  if (_materiasCache) return _materiasCache;
  const { data, error } = await supabase
    .from("materias")
    .select(`
      id, nombre,
      comisiones(
        id, codigo,
        aula:aulas(id, nombre, piso, edificio_id, edificio:edificios(id, nombre)),
        horarios(id, dia, inicio, fin, modalidad)
      )
    `);
  if (error) throw error;
  _materiasCache = data;
  return _materiasCache;
}

export async function buscarMaterias(query) {
  if (!query || query.trim().length === 0) return [];

  const q = normalizar(query.trim());
  const materias = await _cargarMaterias();

  const resultados = [];
  materias.forEach((materia) => {
    if (normalizar(materia.nombre).includes(q)) {
      materia.comisiones?.forEach((comision) => {
        resultados.push({
          ...buildComisionDetalle(materia, comision),
          // Horarios en formato display (HH:MM) para la card de resultado
          horariosResumen: (comision.horarios ?? []).map((h) => ({
            dia: h.dia,
            inicio: h.inicio.slice(0, 5),
            fin: h.fin.slice(0, 5),
          })),
        });
      });
    }
  });

  return resultados;
}

// Construye el objeto de detalle de una comisión (consumido por /materias/:comisionId).
// `horarios` queda en el shape que espera buildClaseDetalleFromHorario para poder
// navegar a /cursada/clases/:horarioId desde cada franja.
function buildComisionDetalle(materia, comision) {
  const comisionRef = {
    id: comision.id,
    codigo: comision.codigo,
    aula: comision.aula ?? null,
    materia: { id: materia.id, nombre: materia.nombre },
  };
  return {
    comisionId: comision.id,
    materiaId: materia.id,
    nombre: materia.nombre,
    codigo: comision.codigo,
    aula: formatAulaLabel(comision.aula?.nombre),
    edificio: comision.aula?.edificio?.nombre ?? "",
    horarios: (comision.horarios ?? []).map((h) => ({
      id: h.id,
      dia: h.dia,
      inicio: h.inicio,
      fin: h.fin,
      modalidad: h.modalidad ?? "presencial",
      aula: comision.aula ?? null,
      comision: comisionRef,
    })),
  };
}

export async function getComisionDetalle(comisionId) {
  if (!comisionId) return null;

  const { data, error } = await supabase
    .from("comisiones")
    .select(`
      id, codigo,
      aula:aulas(id, nombre, piso, edificio_id, edificio:edificios(id, nombre)),
      horarios(id, dia, inicio, fin, modalidad),
      materia:materias!inner(id, nombre)
    `)
    .eq("id", comisionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return buildComisionDetalle(data.materia, data);
}

export async function getMateriasSugeridasDeCarrera(userId) {
  const [materias, carreraData] = await Promise.all([
    getMateriasCarreraConHorarios(userId),
    getAlumnoCarreras(userId),
  ]);

  const carreraNombre = carreraData[0]?.carreras?.nombre ?? "";

  const ahora = new Date();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const diaIdx = ahora.getDay();
  const diasOrdenados = Array.from({ length: 7 }, (_, i) => DIAS[(diaIdx + i) % 7]);

  const proximas = [];

  materias.forEach((m) => {
    let mejorPrioridad = Infinity;
    let mejorComision = null;

    m.comisiones?.forEach((com) => {
      com.horarios?.forEach((h) => {
        const indiceDia = diasOrdenados.indexOf(h.dia);
        if (indiceDia === -1) return;
        const minInicio = minutosDelDia(h.inicio);
        if (indiceDia === 0 && minInicio <= minutosAhora) return;
        const prioridad = indiceDia * 1440 + minInicio;
        if (prioridad < mejorPrioridad) {
          mejorPrioridad = prioridad;
          mejorComision = com;
        }
      });
    });

    if (mejorComision) {
      const cantidadComisiones = m.comisiones?.length ?? 0;
      const edificioNombre =
        mejorComision.aula?.edificio?.nombre ??
        m.comisiones?.find((comision) => comision.aula?.edificio?.nombre)?.aula
          ?.edificio?.nombre ??
        "Sin sede";
      const detalle = `${cantidadComisiones} ${
        cantidadComisiones === 1 ? "comisión" : "comisiones"
      } - ${edificioNombre}`;

      proximas.push({
        id: m.id,
        nombre: m.nombre,
        detalle,
        cantidadComisiones,
        edificio: edificioNombre,
        prioridad: mejorPrioridad,
      });
    }
  });

  return {
    materias: proximas.sort((a, b) => a.prioridad - b.prioridad).slice(0, 4),
    carreraNombre,
  };
}
