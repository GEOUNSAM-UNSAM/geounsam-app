// Espesores: se calculan los radios de afuera hacia adentro.
// Para agrandar el pasillo, solo cambiar corridorWidth.
const ESPESORES = {
  outerWall: 228,       // radio total del edificio
  wallGap: 5,           // pared exterior → salas exteriores
  outerRoom: 49,        // profundidad salas exteriores
  outerGap: 5,          // salas exteriores → pasillo
  corridorWidth: 25,    // ancho del pasillo (← ajustar acá)
  innerGap: 4,          // pasillo → salas interiores
  innerRoom: 45,        // profundidad salas interiores
  patioGap: 4,          // salas interiores → patio central
};

// Cálculo automático de radios de afuera hacia adentro
function calcRadios(e) {
  const oRoomOut = e.outerWall - e.wallGap;
  const oRoomIn = oRoomOut - e.outerRoom;
  const corridor = oRoomIn - e.outerGap;
  const corridorIn = corridor - e.corridorWidth;
  const iRoomOut = corridorIn - e.innerGap;
  const iRoomIn = iRoomOut - e.innerRoom;
  const patio = iRoomIn - e.patioGap;
  return {
    outerWall: e.outerWall,
    oRoomOut, oRoomIn,
    corridor, corridorIn,
    iRoomOut, iRoomIn,
    patio,
  };
}

export const ESTRUCTURA = {
  centro: { cx: 265, cy: 268 },
  rotacion: 98,    // grados de rotación del plano completo (ajustar para orientar)
  radios: calcRadios(ESPESORES),
  entradas: [
    { angle: 39, halfSpan: 7, nombre: "25 DE MAYO", label: ["Entrada", "Av. 25 Mayo"] },
    { angle: 287, halfSpan: 9, nombre: "MARTÍN IRIGOYEN", label: "Entrada Irigoyen" },
  ],
}

// Datos de salas por piso
export const PISOS = {
  pb: {
    secciones: [
      // ── T4 (biblioteca) ──
      {
        id: "T4", name: "Tornavias 4", etapa: "En obra", color: "#00205b",
        start: 178, end: 222, obra: true,
        outer: [
          { id: "BIB", s: 179, e: 221, tipo: "biblioteca" },
        ],
        inner: [],
      },
      // ── BL (abajo izquierda) ──
      {
        id: "BL", name: "Sector BL", color: "#166534",
        start: 108, end: 178,
        outer: [
          { id: "D1", s: 109, e: 116, tipo: "deposito" },
          { id: "4", s: 118, e: 130, tipo: "aula" },
          { id: "3", s: 132, e: 144, tipo: "aula" },
          { id: "2", s: 146, e: 158, tipo: "aula" },
          { id: "1", s: 160, e: 172, tipo: "aula" },
        ],
        inner: [
          { id: "7", s: 109, e: 130, tipo: "lab" },
          { id: "6", s: 132, e: 154, tipo: "sala" },
          { id: "5", s: 156, e: 177, tipo: "sala" },
        ],
      },
      // ── BR (abajo derecha) ──
      {
        id: "BR", name: "Sector BR", color: "#B45309",
        start: 33, end: 108,
        outer: [
          { id: "12", s: 48, e: 58, tipo: "aula" },
          { id: "11", s: 60, e: 70, tipo: "aula" },
          { id: "10", s: 72, e: 82, tipo: "aula" },
          { id: "9", s: 84, e: 94, tipo: "aula" },
          { id: "8", s: 96, e: 106, tipo: "aula" },
        ],
        inner: [
          { id: "15", s: 48, e: 67, tipo: "sala" },
          { id: "14", s: 69, e: 87, tipo: "lab" },
          { id: "13", s: 89, e: 107, tipo: "sala" },
        ],
      },
      // ── TR (arriba derecha) ──
      {
        id: "TR", name: "Sector TR", color: "#1A56DB",
        start: 297, end: 33,
        outer: [
          { id: "21", s: 307, e: 318, tipo: "aula" },
          { id: "20", s: 320, e: 331, tipo: "aula" },
          { id: "19", s: 333, e: 344, tipo: "aula" },
          { id: "18", s: 346, e: 357, tipo: "aula" },
          { id: "17", s: 359, e: 10, tipo: "aula" },
          { id: "16", s: 12, e: 31, tipo: "aula-grande" },
        ],
        inner: [
          { id: "D6", s: 298, e: 306, tipo: "deposito" },
          { id: "25", s: 308, e: 326, tipo: "sala" },
          { id: "24", s: 328, e: 346, tipo: "lab" },
          { id: "23", s: 348, e: 6, tipo: "sala" },
          { id: "22", s: 8, e: 29, tipo: "sala" },
        ],
      },
      // ── TL (arriba izquierda) ──
      {
        id: "TL", name: "Sector TL", color: "#991B1B",
        start: 222, end: 297,
        outer: [
          { id: "29", s: 231, e: 242, tipo: "aula" },
          { id: "28", s: 244, e: 255, tipo: "aula" },
          { id: "27", s: 257, e: 268, tipo: "aula" },
          { id: "26", s: 270, e: 277, tipo: "aula" },
        ],
        inner: [
          { id: "31", s: 232, e: 254, tipo: "lab" },
          { id: "30", s: 256, e: 277, tipo: "sala" },
        ],
      },
    ],
  },
  // s1: { secciones: [...] },  ← Subsuelo
  // p1: { secciones: [...] },  ← Primer piso
}
