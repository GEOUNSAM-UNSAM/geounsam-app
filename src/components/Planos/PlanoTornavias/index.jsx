import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
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

const CHIP_CLASSES = {
  "mi-clase": "bg-state-blue text-action",
  libre: "bg-state-green text-data-green-800",
  ocupada: "bg-state-red text-error",
  espacios: "bg-neutral-light text-identity",
};

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

function formatRoomLabel(label) {
  if (!label) return "";

  const normalized = String(label).trim();
  const aulaMatch = normalized.match(/^A(?:ula)?\s*(\d+)$/i);

  if (/^\d+$/.test(normalized)) return `Aula ${normalized}`;
  if (aulaMatch) return `Aula ${aulaMatch[1]}`;

  return normalized;
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
export default function PlanoTornavias({ pisoSlug, onOpenDetalleAula }) {
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
          <div className="flex items-center justify-center rounded-[20px] border border-neutral-main bg-neutral-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.15)]">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-col items-start justify-center gap-1 rounded-[30px]">
                <p className="font-saira text-base leading-6 text-neutral-extra-dark">
                  {formatRoomLabel(selectedRoom.path.label || selectedRoom.path.id)}
                </p>
                <span
                  className={`flex h-6 items-center justify-center rounded-full px-2 font-saira text-xs font-medium leading-3 ${
                    CHIP_CLASSES[selectedRoom.estado] || CHIP_CLASSES.libre
                  }`}
                >
                  {ESTADOS[selectedRoom.estado || "libre"]?.label || ESTADOS.libre.label}
                </span>
                {selectedRoom.info?.materia ? (
                  <>
                    <p className="max-w-full truncate font-saira text-lg font-semibold leading-8 text-neutral-extra-dark">
                      {selectedRoom.info.materia}
                    </p>
                    <div className="flex max-w-full items-center gap-2 overflow-hidden font-saira text-sm leading-4 text-neutral-extra-dark">
                      <p className="shrink-0">{selectedRoom.info.comision}</p>
                      <p className="shrink-0">-</p>
                      <p className="truncate">{selectedRoom.info.horario}</p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex self-stretch items-center">
              <div className="flex h-full w-[120px] shrink-0 flex-col items-end justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex h-8 w-6 items-start justify-center text-neutral-main"
                  aria-label="Cerrar detalle de aula"
                >
                  <X size={24} />
                </button>

                {!selectedRoom.isEspacio && onOpenDetalleAula ? (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenDetalleAula({
                        id: selectedRoom.path.id,
                        nombre: selectedRoom.path.label || selectedRoom.path.id,
                        estado: selectedRoom.estado,
                        info: selectedRoom.info,
                        pisoSlug,
                      });
                    }}
                    className="flex w-full items-center justify-center gap-1 rounded-[10px] border border-action px-3 py-1.5 font-saira text-xs font-medium leading-3 text-neutral-extra-dark whitespace-nowrap"
                  >
                    Ver detalle
                    <ArrowRight size={16} className="shrink-0 text-neutral-extra-dark" />
                  </button>
                ) : null}
              </div>
            </div>
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
