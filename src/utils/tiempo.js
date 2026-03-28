export const DIAS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

export const DIAS_LABELS  = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
export const DIAS_NOMBRES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function minutosDelDia(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// Devuelve los 6 días (Lun-Sáb) de la semana actual con metadata útil para calendarios.
export function getDiasSemanana() {
  const hoy = new Date();
  const dow = hoy.getDay();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - (dow === 0 ? 6 : dow - 1));

  return DIAS_LABELS.map((label, i) => {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    return {
      label,
      diaDB: DIAS[i + 1], // DIAS[1]=Lun … DIAS[6]=Sab
      nombre: DIAS_NOMBRES[i],
      num: fecha.getDate(),
      esHoy: fecha.toDateString() === hoy.toDateString(),
    };
  });
}
