import { useState, useCallback, useMemo } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Map } from "lucide-react";
import { ESTRUCTURA, PISOS } from "./pisos";
import { getEstadosEdificio } from "../../../services/aulas";

// ── Constantes ──
const { centro, rotacion: ROT, radios: R, entradas } = ESTRUCTURA;
const CX = centro.cx;
const CY = centro.cy;
const ENTRANCE_COLOR = "#00205b";

// ── Colores por estado de sala ──
const ESTADOS = {
  "mi-clase":    { color: "#00bcd4", label: "Mi clase" },
  "cambio":      { color: "#F97316", label: "Cambio" },
  "libre":       { color: "#22C55E", label: "Libre" },
  "ocupada":     { color: "#EF4444", label: "Ocupada" },
  "espacios":    { color: "#00205b", label: "Espacios" },
};

// ── Matemáticas SVG ──
const toRad = (d) => ((d - 90) * Math.PI) / 180;
const polar = (r, d) => ({
  x: +(CX + r * Math.cos(toRad(d))).toFixed(2),
  y: +(CY + r * Math.sin(toRad(d))).toFixed(2),
});
const rv = (a) => a + ROT;

function arcPath(ri, ro, a1, a2, gap = 0.5) {
  const A1 = a1 + gap;
  const A2 = (a2 <= a1 ? a2 + 360 : a2) - gap;
  const s1 = polar(ro, A1),
    s2 = polar(ro, A2),
    e2 = polar(ri, A2),
    e1 = polar(ri, A1);
  const lg = A2 - A1 > 180 ? 1 : 0;
  return `M${s1.x},${s1.y} A${ro},${ro} 0 ${lg},1 ${s2.x},${s2.y} L${e2.x},${e2.y} A${ri},${ri} 0 ${lg},0 ${e1.x},${e1.y}Z`;
}

function sectorPath(ri, ro, a1, a2) {
  const s1 = polar(ro, a1),
    s2 = polar(ro, a2),
    e2 = polar(ri, a2),
    e1 = polar(ri, a1);
  const e = a2 <= a1 ? a2 + 360 : a2;
  const lg = e - a1 > 180 ? 1 : 0;
  return `M${s1.x},${s1.y} A${ro},${ro} 0 ${lg},1 ${s2.x},${s2.y} L${e2.x},${e2.y} A${ri},${ri} 0 ${lg},0 ${e1.x},${e1.y}Z`;
}

function midPoint(ri, ro, a1, a2) {
  const e = a2 <= a1 ? a2 + 360 : a2;
  const m = (a1 + e) / 2;
  return {
    pos: polar((ri + ro) / 2, m),
    rot: m > 90 && m < 270 ? m + 90 : m - 90,
  };
}

// ── Helpers de salas ──
function roomName(room) {
  const nombres = {
    lab: "Lab",
    deposito: "Dep.",
    biblioteca: "Biblioteca",
    "aula-grande": "Aula",
    aula: "Aula",
    sala: "Sala",
  };
  if (room.tipo === "biblioteca") return "Biblioteca";
  return `${nombres[room.tipo] || room.tipo} ${room.id}`;
}

function getRoomStyle(estado, active) {
  const c = ESTADOS[estado]?.color || ESTADOS["espacios"].color;
  if (active) {
    return { fill: c, stroke: c, strokeWidth: 2, textFill: "#fff" };
  }
  return { fill: c + "22", stroke: c + "AA", strokeWidth: 0.75, textFill: c };
}

// ── Componente Sala ──
function Room({ room, ri, ro, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const ra1 = rv(room.s);
  const ra2 = rv(room.e);
  const span = room.e < room.s ? room.e + 360 - room.s : room.e - room.s;
  const gap = span < 10 ? 0.2 : span < 16 ? 0.35 : 0.6;
  const { pos } = midPoint(ri, ro, ra1, ra2);
  const showLabel = ro - ri >= 18 && span >= 9;
  const estado = room.estado || "libre";
  const c = ESTADOS[estado]?.color || ESTADOS["espacios"].color;

  const isBiblio = room.tipo === "biblioteca";
  const style = selected
    ? getRoomStyle(estado, true)
    : hovered
      ? { ...getRoomStyle(estado, false), fill: isBiblio ? c : c + "44", stroke: c, strokeWidth: 1.5 }
      : isBiblio
        ? { fill: c, stroke: c, strokeWidth: 0.75, textFill: "#fff" }
        : getRoomStyle(estado, false);

  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(room)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <path
        d={arcPath(ri, ro, ra1, ra2, gap)}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />
      {showLabel && (
        <text
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={room.tipo === "biblioteca" ? 7 : 5.6}
          fontFamily={room.tipo === "biblioteca" ? "system-ui, sans-serif" : "monospace"}
          fontWeight="bold"
          fill={style.textFill}
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {room.tipo === "biblioteca" ? "Biblioteca" : room.id}
        </text>
      )}
    </g>
  );
}

// ── Componente principal ──
export default function PlanoTornavias({ pisoSlug }) {
  const [selectedId, setSelectedId] = useState(null);
  const datoPiso = PISOS[pisoSlug];

  const handleSelect = useCallback((room) => {
    setSelectedId((prev) => (prev === room.id ? null : room.id));
  }, []);

  // Estados de todas las salas del edificio (una sola consulta)
  // Cada valor puede ser un objeto { estado, materia, comision, horario } o undefined
  const todosEstados = useMemo(() => getEstadosEdificio("tornavias"), []);
  const estadosRaw = todosEstados[pisoSlug] || {};

  // Lista plana de todas las salas con su estado e info de materia
  const allRooms = useMemo(() => {
    if (!datoPiso) return [];
    const rooms = [];
    const resolveEstado = (rm) => {
      const data = estadosRaw[rm.id];
      if (data) return { estado: data.estado, materia: data.materia, comision: data.comision, horario: data.horario };
      return { estado: rm.tipo === "biblioteca" ? "espacios" : "libre" };
    };
    datoPiso.secciones.forEach((s) => {
      s.outer.forEach((rm) => rooms.push({ ...rm, ...resolveEstado(rm) }));
      s.inner.forEach((rm) => rooms.push({ ...rm, ...resolveEstado(rm) }));
    });
    return rooms;
  }, [datoPiso, estadosRaw]);

  const selectedRoom = allRooms.find((r) => r.id === selectedId);

  // Placeholder si no hay datos para este piso
  if (!datoPiso) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <Map size={64} color="#808285" strokeWidth={1.5} />
        <p className="font-saira text-sm text-neutral-main text-center">
          Plano próximamente disponible
        </p>
      </div>
    );
  }

  const { secciones } = datoPiso;

  return (
    <div className="flex flex-col w-full h-full">
      <TransformWrapper
        initialScale={1.15}
        minScale={0.6}
        maxScale={4}
        centerOnInit
        wheel={{ step: 0.08 }}
        pinch={{ step: 5 }}
        doubleClick={{ mode: "reset" }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", flex: 1, minHeight: 0 }}
          contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
      <svg viewBox="-25 -20 580 580" className="w-full">
        <defs>
          <pattern id="obra" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="#bbb" strokeWidth="2" />
          </pattern>
        </defs>

        {/* 1. Base */}
        <circle cx={CX} cy={CY} r={R.outerWall} fill="#F2F0E8" stroke="#999" strokeWidth="2" />

        {/* 2. Pasillo */}
        <circle cx={CX} cy={CY} r={R.corridor + 1} fill="#C5C2B8" />
        <circle cx={CX} cy={CY} r={R.corridorIn} fill="#EAE8E0" />
        <circle cx={CX} cy={CY} r={R.corridor} fill="none" stroke="#aaa" strokeWidth="0.75" />
        <circle cx={CX} cy={CY} r={R.corridorIn} fill="none" stroke="#aaa" strokeWidth="0.75" />

        {/* Patio central */}
        <circle cx={CX} cy={CY} r={R.patio} fill="#D4D1C6" stroke="#bbb" strokeWidth="0.5" />

        {/* 8. Entradas */}
        {entradas.map((ent, idx) => {
          const angle = rv(ent.angle);
          const a1 = angle - ent.halfSpan;
          const a2 = angle + ent.halfSpan;
          const j1i = polar(R.iRoomIn, a1), j1o = polar(R.outerWall, a1);
          const j2i = polar(R.iRoomIn, a2), j2o = polar(R.outerWall, a2);
          const midPt = polar((R.iRoomIn + R.outerWall) / 2, angle);

          return (
            <g key={`ent-${idx}`}>
              <path d={sectorPath(R.iRoomIn, R.outerWall + 2, a1, a2)} fill="#F2F0E8" />
              <path d={sectorPath(R.iRoomIn, R.outerWall, a1, a2)} fill={ENTRANCE_COLOR} />
              <line x1={j1i.x} y1={j1i.y} x2={j1o.x} y2={j1o.y} stroke={ENTRANCE_COLOR} strokeWidth="2" strokeLinecap="round" />
              <line x1={j2i.x} y1={j2i.y} x2={j2o.x} y2={j2o.y} stroke={ENTRANCE_COLOR} strokeWidth="2" strokeLinecap="round" />
              <text x={midPt.x} y={midPt.y} textAnchor="middle" dominantBaseline="central"
                fontSize="5" fontWeight="bold" fill="#fff"
                style={{ userSelect: "none", pointerEvents: "none" }}
              >
                {Array.isArray(ent.label) ? ent.label.map((line, i) => (
                  <tspan key={i} x={midPt.x} dy={i === 0 ? "-0.5em" : "1.1em"}>{line}</tspan>
                )) : ent.label}
              </text>
            </g>
          );
        })}

        {/* 9. Salas (interactivas) */}
        {secciones.map((s) => (
          <g key={`rooms-${s.id}`}>
            {s.outer.map((rm) => {
              const info = estadosRaw[rm.id];
              const estado = info ? info.estado : (rm.tipo === "biblioteca" ? "espacios" : "libre");
              return (
                <Room key={rm.id} room={{ ...rm, estado }}
                  ri={R.oRoomIn} ro={R.oRoomOut}
                  selected={selectedId === rm.id} onSelect={handleSelect}
                />
              );
            })}
            {s.inner.map((rm) => {
              const info = estadosRaw[rm.id];
              const estado = info ? info.estado : (rm.tipo === "biblioteca" ? "espacios" : "libre");
              return (
                <Room key={rm.id} room={{ ...rm, estado }}
                  ri={R.iRoomIn} ro={R.iRoomOut}
                  selected={selectedId === rm.id} onSelect={handleSelect}
                />
              );
            })}
          </g>
        ))}

        {/* 10. Contornos */}
        <circle cx={CX} cy={CY} r={R.outerWall} fill="none" stroke="#888" strokeWidth="2" />
      </svg>
        </TransformComponent>
      </TransformWrapper>

      {/* Panel inferior: info de sala + leyenda */}
      <div className="w-full px-4 py-2 flex flex-col gap-2">
        {selectedRoom && (
          <div className="rounded-xl p-3 bg-neutral-white border border-neutral-light shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-saira font-semibold text-base text-neutral-dark">
                {roomName(selectedRoom)}
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
            {selectedRoom.materia && (
              <div className="mt-2 flex flex-col gap-0.5">
                <p className="font-saira font-semibold text-sm text-neutral-dark">
                  {selectedRoom.materia}
                </p>
                <p className="font-saira text-xs text-neutral-main">
                  {selectedRoom.comision} · {selectedRoom.horario}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leyenda de estados */}
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
