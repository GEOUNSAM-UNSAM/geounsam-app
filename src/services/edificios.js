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
  return MARCADORES.filter((m) => {
    const matchSede = m.sede === sede;
    const matchCategoria = categoria === "todos" || m.tipo === categoria;
    return matchSede && matchCategoria;
  });
}
