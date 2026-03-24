import { MATERIAS } from "../data/materias";
import { DIAS, minutosDelDia } from "../utils/tiempo";

// ── Formato esperado del backend ──
// GET /api/aulas/estado?edificio=tornavias
//
// Response: {
//   "pisos": {
//     "pb": {
//       "2":  "ocupada",
//       "16": "mi-clase",
//       "20": "libre"
//     },
//     "s1": {
//       "3": "ocupada"
//     },
//     "p1": {}
//   }
// }
//
// Una sola consulta trae todos los pisos del edificio.
// Solo incluye aulas con estado conocido (ocupada, libre, mi-clase).
// Las aulas que no aparecen se asumen "sin-info" en el componente.
// El estado "mi-clase" depende del usuario autenticado

// Mapeo de nombre de edificio en materias → edificioId en el sistema
const EDIFICIO_IDS = {
  "Tornavías": "tornavias",
};

// IDs válidos del plano PB de Tornavías
const IDS_VALIDOS_PB = new Set(
  Array.from({ length: 31 }, (_, i) => String(i + 1))
);

// Genera estados dinámicamente a partir de las materias y la hora actual
export function getEstadosEdificio(edificioId) {
  const ahora = new Date();
  const diaHoy = DIAS[ahora.getDay()];
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

  const pisos = { pb: {} };

  MATERIAS.forEach((materia) => {
    materia.comisiones.forEach((comision) => {
      // Solo comisiones del edificio que nos interesa
      const comEdificioId = EDIFICIO_IDS[comision.edificio];
      if (comEdificioId !== edificioId) return;

      // Verificar si la comisión está en curso ahora y obtener el horario activo
      const horarioActivo = comision.horarios.find((h) => {
        if (h.dia !== diaHoy) return false;
        const inicio = minutosDelDia(h.inicio);
        const fin = minutosDelDia(h.fin);
        return minutosAhora >= inicio && minutosAhora < fin;
      });

      if (!horarioActivo) return;

      // Extraer IDs numéricos del campo aula
      const aulasIds = comision.aula
        .split(/\s*[,y]\s*/)
        .map((a) => a.trim())
        .filter((a) => IDS_VALIDOS_PB.has(a));

      aulasIds.forEach((aulaId) => {
        // TODO: cuando haya auth, verificar si es la cursada del usuario → "mi-clase"
        pisos.pb[aulaId] = {
          estado: "ocupada",
          materia: materia.nombre,
          comision: comision.codigo,
          horario: `${horarioActivo.inicio} - ${horarioActivo.fin}`,
        };
      });
    });
  });

  return pisos;
}
