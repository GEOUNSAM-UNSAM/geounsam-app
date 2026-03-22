// Estado hardcodeado de las aulas por edificio
// Estructura: { [edificioId]: { [pisoSlug]: { [salaId]: estado } } }
// Solo se incluyen las aulas con estado conocido.
// Las que no aparecen se asumen "sin-info" en el componente.
export const ESTADOS_AULAS = {
  tornavias: {
    pb: {
      "1": "libre",
      "2": "ocupada",
      "7": "ocupada",
      "9": "libre",
      "11": "ocupada",
      "15": "libre",
      "16": "mi-clase",
      "18": "ocupada",
      "20": "libre",
      "24": "ocupada",
      "27": "libre",
      "29": "ocupada",
      "BIB": "libre",
    },
    // s1: {},  ← Subsuelo (cuando se agregue)
    // p1: {},  ← Primer piso (cuando se agregue)
  },
};
