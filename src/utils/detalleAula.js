import { DIAS, minutosDelDia } from "./tiempo";
import { getPisoLabel } from "./pisos";

const ESTADOS_AULA_DETALLE = {
    "mi-clase": "Mi clase",
    libre: "Disponible",
    ocupada: "Pendiente",
    espacios: "Pendiente",
};

function formatAulaLabel(value) {
    if (!value) return null;

    const normalized = String(value).trim();
    const aulaMatch = normalized.match(/^A(?:ula)?\s*(\d+)$/i);

    if (/^\d+$/.test(normalized)) return `Aula ${normalized}`;
    if (aulaMatch) return `Aula ${aulaMatch[1]}`;

    return normalized;
}

function normalizeAulaRef(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/^a(?:ula)?\s*/i, "")
        .replace(/\s+/g, "")
        .toLowerCase()
        .trim();
}

function formatPiso(piso) {
    const slug = piso?.slug;

    return piso?.nombre ?? getPisoLabel(slug);
}

function getClaseFromAula(aula) {
    if (!aula?.info?.materia) return null;

    const [inicio = "", fin = ""] = aula.info.horario?.split(" - ") ?? [];

    return {
        nombre: aula.info.materia,
        inicio,
        fin,
        comision: aula.info.comision,
    };
}

function normalizarHora(hora) {
    return hora ? String(hora).slice(0, 5) : "";
}

function getConfirmacionFromAula(aula, enCursada) {
    const info = aula?.info;
    const horarioId = info?.horarioId ?? null;
    const aulaId = info?.aulaId ?? null;
    const comisionId = info?.comisionId ?? null;

    if (!enCursada) {
        return {
            horarioId,
            aulaId,
            comisionId,
            puedeConfirmar: false,
        };
    }

    if (!horarioId || !aulaId) {
        return {
            horarioId,
            aulaId,
            comisionId,
            puedeConfirmar: false,
        };
    }

    const ahora = new Date();
    const diaHoy = DIAS[ahora.getDay()];

    if (info?.dia && info.dia !== diaHoy) {
        return {
            horarioId,
            aulaId,
            comisionId,
            puedeConfirmar: false,
        };
    }

    const inicio = normalizarHora(info?.inicio);
    const fin = normalizarHora(info?.fin);

    if (!inicio || !fin) {
        return {
            horarioId,
            aulaId,
            comisionId,
            puedeConfirmar: false,
        };
    }

    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const minutosInicio = minutosDelDia(inicio);
    const minutosFin = minutosDelDia(fin);

    if (minutosAhora < minutosInicio - 60) {
        return {
            horarioId,
            aulaId,
            comisionId,
            puedeConfirmar: false,
        };
    }

    if (minutosAhora > minutosFin) {
        return {
            horarioId,
            aulaId,
            comisionId,
            puedeConfirmar: false,
        };
    }

    return {
        horarioId,
        aulaId,
        comisionId,
        puedeConfirmar: true,
    };
}

export function buildDetalleAula({ state, aulaId }) {
    const aula = state?.aula;
    const clase = getClaseFromAula(aula);
    const estadoAula = aula?.estado;
    const enCursada = estadoAula === "mi-clase";

    return {
        aula: formatAulaLabel(aula?.nombre ?? aulaId),
        edificio: state?.edificio?.nombre ?? null,
        piso: formatPiso(state?.piso),
        estado: ESTADOS_AULA_DETALLE[estadoAula] ?? null,
        clase,
        validacion: null,
        actualizaciones: [],
        enCursada,
        tieneClase: Boolean(clase),
        confirmacion: getConfirmacionFromAula(aula, enCursada),
    };
}

export function buildDetalleAulaStateFromEstados({ aulaId, estados }) {
    const aulaRef = normalizeAulaRef(aulaId);
    if (!aulaRef) return null;

    for (const [pisoSlug, aulas] of Object.entries(estados ?? {})) {
        for (const [nombreAula, info] of Object.entries(aulas ?? {})) {
            if (normalizeAulaRef(nombreAula) !== aulaRef) continue;

            return {
                aula: {
                    id: nombreAula,
                    nombre: formatAulaLabel(nombreAula),
                    estado: info.estado,
                    info,
                    pisoSlug,
                },
                edificio: null,
                piso: {
                    slug: pisoSlug,
                    nombre: getPisoLabel(pisoSlug),
                },
            };
        }
    }

    return null;
}
