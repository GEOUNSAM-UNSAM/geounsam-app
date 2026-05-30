import { supabase } from '../lib/supabase';

export async function enviarReporteApp({
  userId,
  userName,
  tipo,
  descripcion,
}) {
  const descripcionNormalizada = descripcion?.trim();

  if (!userId) {
    throw new Error('Necesitás iniciar sesión para enviar un reporte.');
  }

  if (!tipo) {
    throw new Error('Seleccioná un tipo de reporte.');
  }

  if (!descripcionNormalizada) {
    throw new Error('Contanos brevemente qué pasó.');
  }

  const { error } = await supabase.from('reportes').insert({
    alumno_id: userId,
    alumno_nombre: userName ?? null,
    alumno_ref: userId.slice(-4),
    tipo,
    descripcion: descripcionNormalizada,
    origen: 'webapp',
    user_agent: window.navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });

  if (error) throw error;
}
