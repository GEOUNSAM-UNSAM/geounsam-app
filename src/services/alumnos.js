import { supabase } from '../lib/supabase'

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
