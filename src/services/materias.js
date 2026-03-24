import { MATERIAS } from "../data/materias";
import { DIAS, minutosDelDia } from "../utils/tiempo";

export function getMaterias() {
  return MATERIAS;
}

export function buscarMaterias(query) {
  if (!query || query.trim().length === 0) return [];

  const normalizar = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const q = normalizar(query.trim());

  const resultados = [];
  MATERIAS.forEach((materia) => {
    if (normalizar(materia.nombre).includes(q)) {
      materia.comisiones.forEach((comision) => {
        resultados.push({
          materiaId: materia.id,
          nombre: materia.nombre,
          ...comision,
        });
      });
    }
  });

  return resultados;
}

// TO DO: esto tendria que venir del backend
export function getMateriasSugeridas() {
  const ahora = new Date();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  // Orden de días a partir de hoy (hoy primero, luego los siguientes)
  const diaIdx = ahora.getDay();
  const diasOrdenados = [];
  for (let i = 0; i < 7; i++) {
    diasOrdenados.push(DIAS[(diaIdx + i) % 7]);
  }

  // Para cada materia, encontrar la próxima comisión con horario más cercano
  const proximas = [];

  MATERIAS.forEach((m) => {
    let mejorPrioridad = Infinity;
    let mejorComision = null;

    m.comisiones.forEach((com) => {
      com.horarios.forEach((h) => {
        const indiceDia = diasOrdenados.indexOf(h.dia);
        const minInicio = minutosDelDia(h.inicio);

        // Si es hoy, solo contar si aún no empezó
        if (indiceDia === 0 && minInicio <= minutosAhora) return;

        // Prioridad: día más cercano, luego hora más temprana
        const prioridad = indiceDia * 1440 + minInicio;
        if (prioridad < mejorPrioridad) {
          mejorPrioridad = prioridad;
          mejorComision = com;
        }
      });
    });

    if (mejorComision) {
      proximas.push({
        id: m.id,
        nombre: m.nombre,
        detalle: `${m.comisiones.length} ${m.comisiones.length === 1 ? "comisión" : "comisiones"} - ${mejorComision.edificio}`,
        prioridad: mejorPrioridad,
      });
    }
  });

  return proximas
    .sort((a, b) => a.prioridad - b.prioridad)
    .slice(0, 4);
}
