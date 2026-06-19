import { getPisoLabel } from './pisos'

function formatAulaLabel(nombreAula) {
  if (!nombreAula) return null
  return /^\d+$/.test(nombreAula) ? `Aula ${nombreAula}` : nombreAula
}

export function getClasesParaDia(materias, diaDB) {
  const clases = []
  materias.forEach((materia) => {
    materia.comisiones?.forEach((comision) => {
      const horario = comision.horarios?.find((h) => h.dia === diaDB)
      if (!horario) return

      const aulaBase = horario.aula ?? comision.aula ?? null
      const nombreAula = aulaBase?.nombre
      const aulaLabel = formatAulaLabel(nombreAula)
      const edificioNombre = aulaBase?.edificio?.nombre ?? ''
      const esVirtual = horario.modalidad === 'virtual'
      const aula = esVirtual
        ? 'Clase virtual'
        : aulaLabel
        ? `${aulaLabel}${edificioNombre ? ` · ${edificioNombre}` : ''}`
        : 'Sin aula asignada'

      const aulaDetalle = aulaBase
        ? {
            id: aulaBase.nombre ?? aulaBase.id,
            nombre: aulaLabel,
            estado: 'mi-clase',
            info: {
              materia: materia.nombre,
              comision: comision.codigo,
              horario: `${horario.inicio.slice(0, 5)} - ${horario.fin.slice(0, 5)}`,
              horarioId: horario.id,
              comisionId: comision.id,
              aulaId: aulaBase.id,
              dia: horario.dia,
              inicio: horario.inicio,
              fin: horario.fin,
              modalidad: horario.modalidad ?? 'presencial',
              esVirtual,
            },
            pisoSlug: aulaBase.piso,
          }
        : null
      const edificio = aulaBase?.edificio
        ? {
            id: aulaBase.edificio_id ?? aulaBase.edificio.id,
            nombre: aulaBase.edificio.nombre,
            slug: aulaBase.edificio.slug,
            planoId: aulaBase.edificio.plano_id,
          }
        : null
      const piso = aulaBase?.piso
        ? {
            slug: aulaBase.piso,
            nombre: getPisoLabel(aulaBase.piso),
          }
        : null

      clases.push({
        id: `${materia.id}-${comision.id}`,
        nombre: materia.nombre,
        codigo: comision.codigo,
        inicio: horario.inicio.slice(0, 5),
        fin: horario.fin.slice(0, 5),
        aula,
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
            aulaId: aulaBase?.id ?? null,
            modalidad: horario.modalidad ?? 'presencial',
            esVirtual,
            aula,
            aulaDetalle,
            edificio,
            piso,
          },
        },
        aulaDetalle,
        edificio,
        piso,
        esVirtual,
        estado: esVirtual ? 'virtual' : undefined,
      })
    })
  })
  return clases.sort((a, b) => a.inicio.localeCompare(b.inicio))
}
