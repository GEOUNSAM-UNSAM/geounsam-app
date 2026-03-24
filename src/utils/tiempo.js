export const DIAS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

export function minutosDelDia(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}
