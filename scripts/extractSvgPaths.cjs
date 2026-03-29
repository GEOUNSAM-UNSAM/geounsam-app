/**
 * Extrae paths de los SVGs de planos Tornavías (Inkscape SVG) y genera
 * archivos JS con geometría, labels y centroides pre-calculados.
 *
 * Estructura SVG de Inkscape:
 *   <svg>
 *     <g id="layer1" transform="...">  ← salas (rooms)
 *     </g>
 *     <g id="gXX" inkscape:label="escalera_N">  ← escaleras
 *     </g>
 *     <path inkscape:label="entrada-*">  ← entradas
 *   </svg>
 *
 * Uso:
 *   node scripts/extractSvgPaths.cjs          # Todos los pisos
 *   node scripts/extractSvgPaths.cjs pb       # Solo planta baja
 *   node scripts/extractSvgPaths.cjs p1       # Solo piso 1
 *   node scripts/extractSvgPaths.cjs s1       # Solo subsuelo
 */
const fs = require("fs");
const path = require("path");

const ASSETS = path.resolve(__dirname, "../src/assets");
const OUT_DIR = path.resolve(__dirname, "../src/components/Planos/PlanoTornavias");

const PISOS = {
  pb: { svg: "tornavias_pb.svg", out: "svgData_pb.js" },
  p1: { svg: "tornavias_p1.svg", out: "svgData_p1.js" },
  s1: { svg: "tornavias_subsuelo.svg", out: "svgData_s1.js" },
};

// ── SVG path parser (M/m, L/l, C/c, Z/z) ──

function tokenize(d) {
  return d.match(/[MLCZmlcz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
}

function parsePath(d) {
  const tokens = tokenize(d);
  const points = [];
  let cx = 0, cy = 0, sx = 0, sy = 0, i = 0;

  function num() { return parseFloat(tokens[i++]); }
  function isNum() { return i < tokens.length && /^[-+.\d]/.test(tokens[i]); }

  while (i < tokens.length) {
    const cmd = tokens[i++];
    switch (cmd) {
      case "M":
        cx = num(); cy = num(); sx = cx; sy = cy; points.push({ x: cx, y: cy });
        while (isNum()) { cx = num(); cy = num(); points.push({ x: cx, y: cy }); }
        break;
      case "m":
        cx += num(); cy += num(); sx = cx; sy = cy; points.push({ x: cx, y: cy });
        while (isNum()) { cx += num(); cy += num(); points.push({ x: cx, y: cy }); }
        break;
      case "L":
        while (isNum()) { cx = num(); cy = num(); points.push({ x: cx, y: cy }); }
        break;
      case "l":
        while (isNum()) { cx += num(); cy += num(); points.push({ x: cx, y: cy }); }
        break;
      case "C":
        while (isNum()) { num(); num(); num(); num(); cx = num(); cy = num(); points.push({ x: cx, y: cy }); }
        break;
      case "c":
        while (isNum()) { num(); num(); num(); num(); cx += num(); cy += num(); points.push({ x: cx, y: cy }); }
        break;
      case "Z": case "z":
        cx = sx; cy = sy;
        break;
    }
  }
  return points;
}

function centroid(points) {
  if (!points.length) return { x: 0, y: 0 };
  const x = +(points.reduce((s, p) => s + p.x, 0) / points.length).toFixed(2);
  const y = +(points.reduce((s, p) => s + p.y, 0) / points.length).toFixed(2);
  return { x, y };
}

// ── Formatear label para mostrar ──

// Nombres especiales para entradas
const ENTRADA_NOMBRES = {
  "entrada-25-mayo": "Entrada\nAv. 25 de Mayo",
  "entrada-irigoyen": "Entrada\nIrigoyen",
};

function formatLabel(raw) {
  if (ENTRADA_NOMBRES[raw]) return ENTRADA_NOMBRES[raw];
  return raw
    .replace(/_/g, " ")
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

// ── SVG parsing ──

function extractPathAttrs(fragment) {
  const paths = [];
  const re = /<path\b([\s\S]*?)\/>/g;
  let m;
  while ((m = re.exec(fragment)) !== null) {
    const attrs = m[1];
    const idM = attrs.match(/\bid="([^"]+)"/);
    const dM = attrs.match(/\bd="([^"]+)"/);
    const labelM = attrs.match(/inkscape:label="([^"]+)"/);
    if (idM && dM) {
      paths.push({
        id: idM[1],
        d: dM[1],
        label: labelM ? labelM[1] : null,
      });
    }
  }
  return paths;
}

/** Encuentra el </g> que cierra layer1 contando depth de <g>...</g> */
function findLayer1End(svg, contentStart) {
  let depth = 1;
  let pos = contentStart;
  while (depth > 0 && pos < svg.length) {
    const nextOpen = svg.indexOf("<g", pos);
    const nextClose = svg.indexOf("</g>", pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose && /^<g[\s>]/.test(svg.substring(nextOpen, nextOpen + 10))) {
      depth++;
      pos = nextOpen + 2;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      pos = nextClose + 4;
    }
  }
  return svg.lastIndexOf("</g>");
}

function processPiso(pisoKey) {
  const cfg = PISOS[pisoKey];
  const svgPath = path.join(ASSETS, cfg.svg);
  const svg = fs.readFileSync(svgPath, "utf8");

  // viewBox
  const vbM = svg.match(/viewBox="([^"]+)"/);
  const viewBox = vbM ? vbM[1] : "0 0 100 100";

  // layer1 tag and transform
  const layerTagM = svg.match(/<g[^>]*id="layer1"[^>]*>/);
  const layerTag = layerTagM ? layerTagM[0] : "";
  const tfM = layerTag.match(/transform="([^"]+)"/);
  const transform = tfM ? tfM[1] : "";

  // Layer1 boundaries
  const layerStart = svg.indexOf('id="layer1"');
  const layerContentStart = svg.indexOf(">", layerStart) + 1;
  const layerEnd = findLayer1End(svg, layerContentStart);
  const layerContent = svg.substring(layerContentStart, layerEnd);

  // Content outside layer1 (escaleras, entradas, etc.)
  const svgEnd = svg.lastIndexOf("</svg>");
  const outsideContent = svg.substring(layerEnd + 4, svgEnd);

  // ── Extract rooms from layer1 ──
  const roomPaths = extractPathAttrs(layerContent).map((p) => {
    const pts = parsePath(p.d);
    const c = centroid(pts);
    return {
      id: p.id,
      label: p.label ? formatLabel(p.label) : null,
      d: p.d,
      labelX: c.x,
      labelY: c.y,
    };
  });

  // ── Extract escalera groups from outside layer1 ──
  const stairGroups = [];
  const groupRe = /<g\s+([^>]*)>([\s\S]*?)<\/g>/g;
  let gm;
  while ((gm = groupRe.exec(outsideContent)) !== null) {
    const gAttrs = gm[1];
    const gContent = gm[2];
    const labelM = gAttrs.match(/inkscape:label="([^"]+)"/);
    const gLabel = labelM ? labelM[1] : "";
    if (!gLabel.startsWith("escalera")) continue;

    const idM = gAttrs.match(/\bid="([^"]+)"/);
    const gId = idM ? idM[1] : gLabel;
    const tfM2 = gAttrs.match(/transform="([^"]+)"/);
    const gTransform = tfM2 ? tfM2[1] : "";
    const gPaths = extractPathAttrs(gContent);
    stairGroups.push({ id: gId, transform: gTransform, paths: gPaths });
  }

  // ── Extract entrance paths from outside layer1 (not in groups) ──
  // Remove all <g>...</g> blocks from outside content to get standalone paths
  const outsideStandalone = outsideContent.replace(/<g\s+[^>]*>[\s\S]*?<\/g>/g, "");
  const entrancePaths = extractPathAttrs(outsideStandalone).filter(
    (p) => p.label && p.label.startsWith("entrada")
  ).map((p) => {
    const pts = parsePath(p.d);
    const c = centroid(pts);
    return { id: p.id, label: formatLabel(p.label), d: p.d, labelX: c.x, labelY: c.y };
  });

  // ── Generate JS ──
  let js = "// GENERADO por scripts/extractSvgPaths.cjs — NO editar a mano\n\n";
  js += `export const SVG_VIEWBOX = ${JSON.stringify(viewBox)};\n\n`;
  js += `export const LAYER_TRANSFORM = ${JSON.stringify(transform)};\n\n`;

  js += "export const ROOM_PATHS = [\n";
  roomPaths.forEach((p) => {
    js += `  { id: ${JSON.stringify(p.id)}, label: ${JSON.stringify(p.label)}, d: ${JSON.stringify(p.d)}, labelX: ${p.labelX}, labelY: ${p.labelY} },\n`;
  });
  js += "];\n\n";

  js += "export const ENTRANCE_PATHS = [\n";
  entrancePaths.forEach((p) => {
    js += `  { id: ${JSON.stringify(p.id)}, label: ${JSON.stringify(p.label)}, d: ${JSON.stringify(p.d)}, labelX: ${p.labelX}, labelY: ${p.labelY} },\n`;
  });
  js += "];\n\n";

  js += "export const STAIR_GROUPS = [\n";
  stairGroups.forEach((g) => {
    js += "  {\n";
    js += `    id: ${JSON.stringify(g.id)},\n`;
    js += `    transform: ${JSON.stringify(g.transform)},\n`;
    js += "    paths: [\n";
    g.paths.forEach((p) => {
      js += `      { id: ${JSON.stringify(p.id)}, d: ${JSON.stringify(p.d)} },\n`;
    });
    js += "    ],\n";
    js += "  },\n";
  });
  js += "];\n";

  const outPath = path.join(OUT_DIR, cfg.out);
  fs.writeFileSync(outPath, js);
  console.log(`✓ ${pisoKey}: ${outPath}`);
  console.log(`  ${roomPaths.length} salas + ${entrancePaths.length} entradas + ${stairGroups.length} escaleras`);
  if (roomPaths.length > 0) {
    const labeled = roomPaths.filter((p) => p.label);
    console.log(`  ${labeled.length}/${roomPaths.length} salas con label`);
  }
}

// ── Main ──
const arg = process.argv[2];
const pisos = arg ? [arg] : Object.keys(PISOS);

for (const piso of pisos) {
  if (!PISOS[piso]) {
    console.error(`Piso desconocido: ${piso}. Opciones: ${Object.keys(PISOS).join(", ")}`);
    process.exit(1);
  }
  processPiso(piso);
}
