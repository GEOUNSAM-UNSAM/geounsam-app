import { supabase } from "../lib/supabase";

const OBJETIVO_CONFIRMACIONES = 10;

function getTiempoRelativo(value) {
    const date = new Date(value);
    const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));

    if (diffMinutes < 1) return "Ahora";
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;

    const diffDays = Math.round(diffHours / 24);
    return `Hace ${diffDays} d`;
}

export async function confirmarClase({ horarioId }) {
    if (!horarioId) {
        throw new Error("Falta el horario para confirmar");
    }

    const { data, error } = await supabase.rpc("confirmar_clase", {
        p_horario_id: horarioId,
    });

    if (error) throw error;

    return data?.[0] ?? null;
}

export async function getResumenConfirmacionesClase({ horarioId }) {
    if (!horarioId) {
        return {
            confirmaciones: 0,
            total: OBJETIVO_CONFIRMACIONES,
            yaConfirmo: false,
            actualizaciones: [],
        };
    }

    const { data, error } = await supabase.rpc("get_resumen_confirmaciones_clase", {
        p_horario_id: horarioId,
    });

    if (error) throw error;

    const resumen = data?.[0] ?? {};
    const actualizaciones = Array.isArray(resumen.actualizaciones)
        ? resumen.actualizaciones
        : [];

    return {
        confirmaciones: Number(resumen.total_confirmaciones ?? 0),
        total: OBJETIVO_CONFIRMACIONES,
        yaConfirmo: Boolean(resumen.ya_confirmo),
        actualizaciones: actualizaciones.map((item) => ({
            id: `confirmacion-${item.id}`,
            texto: `${item.nombre ?? "Una persona"} confirmó esta clase`,
            tiempo: getTiempoRelativo(item.created_at),
            color: "bg-status-green",
        })),
    };
}

export const confirmarAula = ({ horarioId }) => confirmarClase({ horarioId });
export const getResumenConfirmacionesAula = ({ horarioId }) =>
    getResumenConfirmacionesClase({ horarioId });
