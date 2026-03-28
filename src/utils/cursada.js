export function getClasesParaDia(materias, diaDB) {
  const clases = []
  materias.forEach((materia) => {
    materia.comisiones?.forEach((comision) => {
      const horario = comision.horarios?.find((h) => h.dia === diaDB)
      if (!horario) return

      const nombreAula = comision.aula?.nombre
      const aulaLabel = nombreAula
        ? /^\d+$/.test(nombreAula) ? `Aula ${nombreAula}` : nombreAula
        : null
      const edificioNombre = comision.aula?.edificio?.nombre ?? ''
      const aula = aulaLabel
        ? `${aulaLabel}${edificioNombre ? ` · ${edificioNombre}` : ''}`
        : 'Sin aula asignada'

      clases.push({
        id: `${materia.id}-${comision.id}`,
        nombre: materia.nombre,
        inicio: horario.inicio.slice(0, 5),
        fin: horario.fin.slice(0, 5),
        aula,
      })
    })
  })
  return clases.sort((a, b) => a.inicio.localeCompare(b.inicio))
}
