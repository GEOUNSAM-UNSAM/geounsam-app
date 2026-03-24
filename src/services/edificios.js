import { CATEGORIAS, COLORES_CATEGORIA, SEDES, MARCADORES } from "../data/edificios";

export function getCategorias() {
  return CATEGORIAS;
}

export function getColoresCategoria() {
  return COLORES_CATEGORIA;
}

export function getSedes() {
  return SEDES;
}

export function getMarcadores({ sede, categoria }) {
  const categoriasActivas = CATEGORIAS.filter((c) => c.id !== "todos").map((c) => c.id);

  return MARCADORES.filter((m) => {
    const matchSede = m.sede === sede;
    const matchCategoria =
      categoria === "todos"
        ? categoriasActivas.includes(m.tipo)
        : m.tipo === categoria;
    return matchSede && matchCategoria;
  });
}
