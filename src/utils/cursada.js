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

      const nombreAula = comision.aula?.nombre
      const aulaLabel = formatAulaLabel(nombreAula)
      const edificioNombre = comision.aula?.edificio?.nombre ?? ''
      const aula = aulaLabel
        ? `${aulaLabel}${edificioNombre ? ` · ${edificioNombre}` : ''}`
        : 'Sin aula asignada'

      clases.push({
        id: `${materia.id}-${comision.id}`,
        nombre: materia.nombre,
        codigo: comision.codigo,
        inicio: horario.inicio.slice(0, 5),
        fin: horario.fin.slice(0, 5),
        aula,
        aulaDetalle: comision.aula
          ? {
              id: comision.aula.nombre ?? comision.aula.id,
              nombre: aulaLabel,
              estado: 'mi-clase',
              info: {
                materia: materia.nombre,
                comision: comision.codigo,
                horario: `${horario.inicio.slice(0, 5)} - ${horario.fin.slice(0, 5)}`,
                horarioId: horario.id,
                comisionId: comision.id,
                aulaId: comision.aula.id,
                dia: horario.dia,
                inicio: horario.inicio,
                fin: horario.fin,
              },
              pisoSlug: comision.aula.piso,
            }
          : null,
        edificio: comision.aula?.edificio
          ? {
              id: comision.aula.edificio_id ?? comision.aula.edificio.id,
              nombre: comision.aula.edificio.nombre,
              slug: comision.aula.edificio.slug,
              planoId: comision.aula.edificio.plano_id,
            }
          : null,
        piso: comision.aula?.piso
          ? {
              slug: comision.aula.piso,
              nombre: getPisoLabel(comision.aula.piso),
            }
          : null,
      })
    })
  })
  return clases.sort((a, b) => a.inicio.localeCompare(b.inicio))
}
