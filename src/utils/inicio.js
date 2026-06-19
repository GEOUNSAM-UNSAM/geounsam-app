import {
    DIAS,
    DIAS_NOMBRES,
    getDiasSemanana,
    minutosDelDia,
} from "./tiempo";
import { getDetalleAulaPath } from "./edificios";
import { getPisoLabel } from "./pisos";

function getNombreSaludo(user) {
    const nombreCrudo =
        user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        user?.email?.split("@")[0] ??
        "estudiante";

    return nombreCrudo.trim().split(/\s+/)[0];
}

function formatAulaLabel(nombreAula) {
    if (!nombreAula) return null;
    return /^\d+$/.test(nombreAula) ? `Aula ${nombreAula}` : nombreAula;
}

function getAulaHorario(comision, horario) {
    return horario?.aula ?? comision.aula ?? null;
}

function normalizarUbicacion(comision, horario) {
    const aula = getAulaHorario(comision, horario);
    const nombreAula = aula?.nombre?.trim() ?? "";
    const edificio = aula?.edificio?.nombre?.trim() ?? "";
    const esVirtual = horario?.modalidad === "virtual";

    if (esVirtual) {
        return {
            ubicacion: "Clase virtual",
            esVirtual: true,
        };
    }

    if (!nombreAula) {
        return {
            ubicacion: "Sin aula asignada",
            esVirtual: false,
        };
    }

    const aulaLabel = formatAulaLabel(nombreAula);

    return {
        ubicacion: edificio ? `${aulaLabel} - ${edificio}` : aulaLabel,
        esVirtual: false,
    };
}

function crearClaseItem(materia, comision, horario, extras = {}) {
    const aula = getAulaHorario(comision, horario);
    const { ubicacion, esVirtual } = normalizarUbicacion(comision, horario);
    const aulaLabel = formatAulaLabel(aula?.nombre?.trim());
    const aulaDetalle = aula
        ? {
              id: aula.nombre ?? aula.id,
              nombre: aulaLabel,
              estado: "mi-clase",
              info: {
                  materia: materia.nombre,
                  comision: comision.codigo,
                  horario: `${horario.inicio.slice(0, 5)} - ${horario.fin.slice(0, 5)}`,
                  horarioId: horario.id,
                  comisionId: comision.id,
                  aulaId: aula.id,
                  dia: horario.dia,
                  inicio: horario.inicio,
                  fin: horario.fin,
                  modalidad: horario.modalidad ?? "presencial",
                  esVirtual,
              },
              pisoSlug: aula.piso,
          }
        : null;
    const edificio = aula?.edificio
        ? {
              id: aula.edificio_id ?? aula.edificio.id,
              nombre: aula.edificio.nombre,
              slug: aula.edificio.slug,
              planoId: aula.edificio.plano_id,
          }
        : null;
    const piso = aula?.piso
        ? {
              slug: aula.piso,
              nombre: getPisoLabel(aula.piso),
          }
        : null;
    const detalleAulaPath = aulaDetalle
        ? getDetalleAulaPath({ edificio, aula: aulaDetalle })
        : null;
    const detalleAulaState = aulaDetalle
        ? {
              aula: aulaDetalle,
              edificio,
              piso,
          }
        : null;

    return {
        id: `${materia.id}-${comision.id}-${horario.dia}-${horario.inicio}`,
        nombre: materia.nombre,
        inicio: horario.inicio.slice(0, 5),
        fin: horario.fin.slice(0, 5),
        ubicacion,
        detalleClasePath: `/cursada/clases/${horario.id}`,
        detalleClaseState: {
            clase: {
                id: `${materia.id}-${comision.id}-${horario.id}`,
                enCursada: true,
                nombre: materia.nombre,
                comision: comision.codigo,
                inicio: horario.inicio.slice(0, 5),
                fin: horario.fin.slice(0, 5),
                horarioId: horario.id,
                comisionId: comision.id,
                aulaId: aula?.id ?? null,
                modalidad: horario.modalidad ?? "presencial",
                esVirtual,
                aula: ubicacion,
                aulaDetalle,
                edificio,
                piso,
            },
        },
        detalleAulaPath,
        detalleAulaState,
        esVirtual,
        estado: esVirtual ? "virtual" : undefined,
        ...extras,
    };
}

function getClasesHoy(materias) {
    const hoy = getDiasSemanana().find((dia) => dia.esHoy);
    if (!hoy) return [];

    const clases = [];
    materias.forEach((materia) => {
        materia.comisiones?.forEach((comision) => {
            const horario = comision.horarios?.find(
                (item) => item.dia === hoy.diaDB,
            );
            if (!horario) return;

            clases.push(crearClaseItem(materia, comision, horario));
        });
    });

    return clases.sort((a, b) => a.inicio.localeCompare(b.inicio));
}

function getClasesProximas(materias, limite = 4) {
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const diaActualIdx = ahora.getDay();
    const diasOrdenados = Array.from(
        { length: 7 },
        (_, i) => DIAS[(diaActualIdx + i) % 7],
    );

    const clases = [];

    materias.forEach((materia) => {
        materia.comisiones?.forEach((comision) => {
            comision.horarios?.forEach((horario) => {
                const offsetDias = diasOrdenados.indexOf(horario.dia);
                if (offsetDias === -1) return;

                const inicioMin = minutosDelDia(horario.inicio);
                if (offsetDias === 0 && inicioMin <= minutosAhora) return;

                clases.push(
                    crearClaseItem(materia, comision, horario, {
                        prioridad: offsetDias * 1440 + inicioMin,
                        offsetDias,
                        dia: horario.dia,
                    }),
                );
            });
        });
    });

    return clases.sort((a, b) => a.prioridad - b.prioridad).slice(0, limite);
}

function getTituloProximaClase(clase) {
    if (!clase) return "Próxima clase";
    if (clase.offsetDias === 0) {
        const ahora = new Date();
        const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
        const minutosRestantes = minutosDelDia(clase.inicio) - minutosAhora;
        if (minutosRestantes < 60) {
            return `Próxima clase - ${minutosRestantes} min`;
        }
        return "Próxima clase - hoy";
    }
    if (clase.offsetDias === 1) return "Próxima clase - mañana";

    const diaIdx = DIAS.indexOf(clase.dia);
    const nombreDia = diaIdx > 0 ? DIAS_NOMBRES[diaIdx - 1] : "esta semana";
    return `Próxima clase - ${nombreDia}`;
}

export function buildInicioState({ user, materias }) {
    const clasesHoy = getClasesHoy(materias);
    const proximas = getClasesProximas(materias, 4);
    const proximaClaseBase = proximas[0] ?? null;
    const proximaClase = proximaClaseBase
        ? {
              ...proximaClaseBase,
              estado: undefined,
              tituloSeccion: getTituloProximaClase(proximaClaseBase),
          }
        : null;

    const programacion = clasesHoy.length > 0 ? clasesHoy : proximas.slice(1);

    return {
        usuario: {
            nombre: getNombreSaludo(user),
        },
        cambiosPendientes: {
            visible: false,
        },
        proximaClase,
        programacionTitulo:
            clasesHoy.length > 0 ? "Programación del día" : "Próximas clases",
        programacion,
        mostrarEstadoVacio: !proximaClase && programacion.length === 0,
    };
}
