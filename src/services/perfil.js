// Capa de servicio para datos de perfil/gamificación.
// Hoy devuelve datos estáticos. Cuando el backend esté listo,
// se cambia a queries de Supabase sin tocar los componentes.

export async function getEstadisticas(userId) {
  return {
    puntos: 300,
    reportes: 12,
    confirmaciones: 5,
    racha: 5,
  }
}

export async function getNivel(userId) {
  return {
    nombre: 'Verificador',
    xpActual: 340,
    xpTotal: 500,
    porcentaje: 30,
    xpRestante: 160,
    siguienteNivel: 'Guía del Campus',
    niveles: [
      { nombre: 'Explorador', estado: 'completado' },
      { nombre: 'Verificador', estado: 'actual' },
      { nombre: 'Guía', estado: 'bloqueado' },
    ],
  }
}

export async function getInsignias(userId) {
  return [
    { nombre: 'Pionero', descripcion: 'Hacé tu primer reporte', color: '#b2e0ff', icono: 'flag', desbloqueada: true },
    { nombre: 'Verificador', descripcion: 'Verifica 10 cambios', color: '#7fd9ae', icono: 'square-check', desbloqueada: true },
    { nombre: 'Guía', descripcion: '500 XP', color: null, icono: 'map', desbloqueada: false },
  ]
}

export async function getTopCampus() {
  return [
    { posicion: 1, nombre: 'María López', puntos: 520 },
    { posicion: 2, nombre: 'Juan Pérez', puntos: 480 },
    { posicion: 3, nombre: 'Lucía García', puntos: 350 },
  ]
}
