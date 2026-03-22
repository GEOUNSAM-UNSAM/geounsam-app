import L from "leaflet";
import { ICONOS_SVG } from "../data/iconosSvg";
import { COLORES_CATEGORIA } from "../data/edificios";

const cache = new Map();

export function crearIcono(tipo, seleccionado = false) {
  const key = `${tipo}-${seleccionado}`;
  if (cache.has(key)) return cache.get(key);

  const color = COLORES_CATEGORIA[tipo] || "#16325c";
  const svgIcon = (ICONOS_SVG[tipo] || ICONOS_SVG["Edificios"])("white");
  const size = seleccionado ? 36 : 30;
  const border = seleccionado ? "3px solid #00bcd4" : "2px solid white";
  const shadow = seleccionado
    ? "0 2px 8px rgba(0,188,212,0.5)"
    : "0 2px 6px rgba(0,0,0,0.35)";

  const html = `<div style="
    width:${size}px; height:${size}px;
    background:${color};
    border-radius:8px;
    border:${border};
    box-shadow:${shadow};
    display:flex; align-items:center; justify-content:center;
  ">
    <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none">${svgIcon}</svg>
  </div>`;

  const icon = L.divIcon({
    className: "custom-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });

  cache.set(key, icon);
  return icon;
}
