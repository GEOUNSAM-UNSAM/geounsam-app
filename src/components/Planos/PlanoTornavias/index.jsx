import { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getEstadosEdificio } from "../../../services/aulas";
import { useAuth } from "../../../context/AuthContext";

import * as dataPb from "./svgData_pb";
import * as dataP1 from "./svgData_p1";
import * as dataS1 from "./svgData_s1";

const PISOS_DATA = {
  pb: dataPb,
  p1: dataP1,
  s1: dataS1,
};

// ── Colores por estado ──
const ESTADOS = {
  "mi-clase": { color: "#00bcd4", label: "Mi clase" },
  "libre":    { color: "#22C55E", label: "Libre" },
  "ocupada":  { color: "#EF4444", label: "Ocupada" },
  "espacios": { color: "#00205b", label: "Espacios" },
};

const ENTRANCE_COLOR = "#00205b";
const STAIR_COLOR = "#b0b0b0";

// Labels que representan espacios de servicio (color sólido "espacios")
const ESPACIOS_LABELS = new Set([
  "biblioteca", "bathroom", "buffet", "banco", "bedelia",
  "bienestar", "punto", "deposito", "limpieza", "fotocopiadora",
  "patio", "informacion",
]);

function esEspacio(label) {
  if (!label) return false;
  const lower = label.toLowerCase();
  return [...ESPACIOS_LABELS].some((k) => lower.includes(k));
}

// ── Normalizar nombre para match SVG ↔ Supabase ──
const ROMAN = { I: "1", II: "2", III: "3", IV: "4", V: "5", VI: "6" };

function normalize(name) {
  if (!name) return "";
  return name
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // quitar acentos
    .replace(/^A(\d)/i, "$1")                           // A10 → 10
    .replace(/laboratorio/gi, "lab")                    // Laboratorio → lab
    .replace(/_/g, " ")
    .replace(/\b(VI|IV|V?I{1,3})\b/g, (m) => ROMAN[m] || m) // romanos → arábigos
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

// ── Room interactivo ──
function SvgRoom({ pathData, estado, isEspacio, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const c = ESTADOS[estado]?.color || ESTADOS["libre"].color;

  let fill, stroke, strokeWidth;
  if (selected) {
    fill = c; stroke = c; strokeWidth = 1;
  } else if (hovered) {
    fill = isEspacio ? c : c + "44";
    stroke = c; strokeWidth = 0.6;
  } else if (isEspacio) {
    fill = c; stroke = c; strokeWidth = 0.3;
  } else {
    fill = c + "22"; stroke = c + "AA"; strokeWidth = 0.3;
  }

  const textFill = (selected || isEspacio) ? "#fff" : c;

  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(pathData.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <path
        d={pathData.d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {pathData.label && (
        <text
          x={pathData.labelX}
          y={pathData.labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={3.5}
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
          fill={textFill}
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {pathData.label.includes("\n") ? (
            pathData.label.split("\n").map((line, i) => (
              <tspan key={i} x={pathData.labelX} dy={i === 0 ? 0 : "1.2em"}>
                {line}
              </tspan>
            ))
          ) : (
            pathData.label
          )}
        </text>
      )}
    </g>
  );
}

// ── Componente principal ──
export default function PlanoTornavias({ pisoSlug }) {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [todosEstados, setTodosEstados] = useState({});

  const data = PISOS_DATA[pisoSlug];

  useEffect(() => {
    getEstadosEdificio("tornavias", user?.id)
      .then(setTodosEstados)
      .catch(console.error);
  }, [user?.id]);

  const estadosRaw = todosEstados[pisoSlug] || {};

  // Pre-computar mapa normalizado de estados del backend
  const estadosNorm = {};
  for (const [nombre, info] of Object.entries(estadosRaw)) {
    estadosNorm[normalize(nombre)] = info;
  }

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  if (!data) return null;

  const rooms = data.ROOM_PATHS.map((p) => {
    const key = normalize(p.label);
    const info = estadosNorm[key] || null;
    const esp = esEspacio(p.label);
    const estado = info ? info.estado : esp ? "espacios" : "libre";
    return { path: p, estado, info, isEspacio: esp };
  });

  const entrances = data.ENTRANCE_PATHS.map((p) => ({
    path: p, estado: "espacios", info: null, isEspacio: true,
  }));

  const allRooms = [...rooms, ...entrances];
  const selectedRoom = allRooms.find((r) => r.path.id === selectedId);

  return (
    <div className="flex flex-col w-full h-full">
      <TransformWrapper
        initialScale={0.8}
        initialPositionX={80}
        initialPositionY={-20}
        minScale={0.5}
        maxScale={6}
        centerOnInit={false}
        limitToBounds={false}
        wheel={{ step: 0.08 }}
        pinch={{ step: 5 }}
        doubleClick={{ mode: "reset" }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", flex: 1, minHeight: 0 }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          <svg viewBox={data.SVG_VIEWBOX} className="w-full" fill="none">
            {/* Salas interactivas (dentro de layer transform) */}
            <g transform={data.LAYER_TRANSFORM || undefined}>
              {rooms.map((r) => (
                <SvgRoom
                  key={r.path.id}
                  pathData={r.path}
                  estado={r.estado}
                  isEspacio={r.isEspacio}
                  selected={selectedId === r.path.id}
                  onSelect={handleSelect}
                />
              ))}
            </g>

            {/* Escaleras (decorativas, fuera de layer, con sus propios transforms) */}
            {data.STAIR_GROUPS.map((group) => (
              <g key={group.id} transform={group.transform || undefined}>
                {group.paths.map((p) => (
                  <path
                    key={p.id}
                    d={p.d}
                    stroke={STAIR_COLOR}
                    strokeWidth="0.26"
                    fill="none"
                  />
                ))}
              </g>
            ))}

            {/* Entradas (fuera de layer) */}
            {data.ENTRANCE_PATHS.map((p) => (
              <SvgRoom
                key={p.id}
                pathData={p}
                estado="espacios"
                isEspacio={true}
                selected={selectedId === p.id}
                onSelect={handleSelect}
              />
            ))}
          </svg>
        </TransformComponent>
      </TransformWrapper>

      {/* Panel inferior: info + leyenda */}
      <div className="w-full px-4 py-2 flex flex-col gap-2">
        {selectedRoom && (
          <div className="rounded-xl p-3 bg-neutral-white border border-neutral-light shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-saira font-semibold text-base text-neutral-dark">
                {selectedRoom.path.label || selectedRoom.path.id}
              </p>
              <button
                onClick={() => setSelectedId(null)}
                className="text-neutral-main text-lg leading-none px-1"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  backgroundColor: ESTADOS[selectedRoom.estado || "libre"].color + "22",
                  color: ESTADOS[selectedRoom.estado || "libre"].color,
                }}
              >
                {ESTADOS[selectedRoom.estado || "libre"].label}
              </span>
            </div>
            {selectedRoom.info?.materia && (
              <div className="mt-2 flex flex-col gap-0.5">
                <p className="font-saira font-semibold text-sm text-neutral-dark">
                  {selectedRoom.info.materia}
                </p>
                <p className="font-saira text-xs text-neutral-main">
                  {selectedRoom.info.comision} · {selectedRoom.info.horario}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leyenda */}
        <div className="flex items-center justify-center gap-3 py-1">
          {Object.values(ESTADOS).map((est) => (
            <div key={est.label} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: est.color }}
              />
              <span className="font-saira text-xs text-neutral-main">{est.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
