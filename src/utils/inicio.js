import {
    DIAS,
    DIAS_NOMBRES,
    getDiasSemanana,
    minutosDelDia,
} from "./tiempo";

function getNombreSaludo(user) {
    const nombreCrudo =
        user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        user?.email?.split("@")[0] ??
        "estudiante";

    return nombreCrudo.trim().split(/\s+/)[0];
}

function normalizarUbicacion(comision) {
    const nombreAula = comision.aula?.nombre?.trim() ?? "";
    const edificio = comision.aula?.edificio?.nombre?.trim() ?? "";
    const esVirtual = /virtual/i.test(nombreAula) || /virtual/i.test(edificio);

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

    const aulaLabel = /^\d+$/.test(nombreAula)
        ? `Aula ${nombreAula}`
        : nombreAula;

    return {
        ubicacion: edificio ? `${aulaLabel} - ${edificio}` : aulaLabel,
        esVirtual: false,
    };
}

function crearClaseItem(materia, comision, horario, extras = {}) {
    const { ubicacion, esVirtual } = normalizarUbicacion(comision);

    return {
        id: `${materia.id}-${comision.id}-${horario.dia}-${horario.inicio}`,
        nombre: materia.nombre,
        inicio: horario.inicio.slice(0, 5),
        fin: horario.fin.slice(0, 5),
        ubicacion,
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
    if (clase.offsetDias === 0 && clase.prioridad < 60) {
        return `Próxima clase - ${clase.prioridad} min`;
    }
    if (clase.offsetDias === 0) return "Próxima clase - hoy";
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
