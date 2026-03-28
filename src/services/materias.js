import { supabase } from "../lib/supabase";
import { DIAS, minutosDelDia } from "../utils/tiempo";
import { getMateriasCarreraConHorarios, getAlumnoCarreras } from "./alumnos";

const normalizar = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

let _materiasCache = null;

async function _cargarMaterias() {
  if (_materiasCache) return _materiasCache;
  const { data, error } = await supabase
    .from("materias")
    .select(`
      id, nombre,
      comisiones(
        id, codigo,
        aula:aulas(id, nombre, edificio:edificios(nombre)),
        horarios(dia, inicio, fin)
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
        const nombreAula = comision.aula?.nombre;
        const aulaLabel = nombreAula
          ? /^\d+$/.test(nombreAula) ? `Aula ${nombreAula}` : nombreAula
          : "";
        resultados.push({
          materiaId: materia.id,
          nombre: materia.nombre,
          codigo: comision.codigo,
          horarios: (comision.horarios ?? []).map((h) => ({
            dia: h.dia,
            inicio: h.inicio.slice(0, 5),
            fin: h.fin.slice(0, 5),
          })),
          aula: aulaLabel,
          edificio: comision.aula?.edificio?.nombre ?? "",
        });
      });
    }
  });

  return resultados;
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
      const nombreAula = mejorComision.aula?.nombre;
      const aulaLabel = nombreAula
        ? /^\d+$/.test(nombreAula) ? `Aula ${nombreAula}` : nombreAula
        : null;
      const edificioNombre = mejorComision.aula?.edificio?.nombre ?? "";
      const detalle = aulaLabel
        ? `${aulaLabel}${edificioNombre ? ` · ${edificioNombre}` : ""}`
        : edificioNombre || "Sin aula";

      proximas.push({
        id: m.id,
        nombre: m.nombre,
        detalle,
        prioridad: mejorPrioridad,
      });
    }
  });

  return {
    materias: proximas.sort((a, b) => a.prioridad - b.prioridad).slice(0, 4),
    carreraNombre,
  };
}
