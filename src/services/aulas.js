import { ESTADOS_AULAS } from "../data/estadoAulas";

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

export function getEstadosEdificio(edificioId) {
  return ESTADOS_AULAS[edificioId] || {};
}
