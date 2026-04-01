import { supabase } from '../lib/supabase'

export async function getOnboardingVisto(userId) {
  const { data, error } = await supabase
    .from('alumnos')
    .select('onboarding_seen')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data?.onboarding_seen ?? false
}

export async function marcarOnboardingVisto(userId) {
  const { error } = await supabase
    .from('alumnos')
    .update({ onboarding_seen: true })
    .eq('id', userId)
  if (error) throw error
}

export async function getCarreras() {
  const { data, error } = await supabase
    .from('carreras')
    .select('id, nombre')
    .order('nombre')

  if (error) throw error
  return data
}

export async function getAlumnoCarreras(userId) {
  const { data, error } = await supabase
    .from('alumno_carreras')
    .select('carrera_id, carreras(id, nombre)')
    .eq('alumno_id', userId)

  if (error) throw error
  return data
}

export async function setAlumnoCarrera(userId, carreraId) {
  const { error } = await supabase
    .from('alumno_carreras')
    .insert({ alumno_id: userId, carrera_id: carreraId })

  if (error) throw error
}

export async function getMateriasCarreraConHorarios(userId) {
  const { data: carreraData, error: carreraError } = await supabase
    .from('alumno_carreras')
    .select('carrera_id')
    .eq('alumno_id', userId)
    .single()

  if (carreraError || !carreraData) return []

  const { data, error } = await supabase
    .from('carrera_materias')
    .select(`
      materia:materias!inner(
        id, nombre,
        comisiones(
          id, codigo,
          aula:aulas(id, nombre, edificio:edificios(nombre)),
          horarios(dia, inicio, fin)
        )
      )
    `)
    .eq('carrera_id', carreraData.carrera_id)

  if (error) throw error
  return data.map((d) => d.materia)
}
