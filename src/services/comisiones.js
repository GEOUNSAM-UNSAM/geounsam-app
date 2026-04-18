import { supabase } from "../lib/supabase";

export async function getAlumnoComisionIds(userId) {
	const { data, error } = await supabase
		.from("alumno_comisiones")
		.select("comision_id")
		.eq("alumno_id", userId);

	if (error) throw error;
	return (data ?? []).map((item) => item.comision_id);
}

export async function guardarAlumnoComision(userId, comisionId) {
	const { error } = await supabase
		.from("alumno_comisiones")
		.upsert(
			{
				alumno_id: userId,
				comision_id: comisionId,
			},
			{
				onConflict: "alumno_id,comision_id",
				ignoreDuplicates: true,
			},
		);

	if (error) throw error;
}

export async function quitarAlumnoComision(userId, comisionId) {
	const { error } = await supabase
		.from("alumno_comisiones")
		.delete()
		.eq("alumno_id", userId)
		.eq("comision_id", comisionId);

	if (error) throw error;
}

export async function getAlumnoComisiones(userId) {
	const { data, error } = await supabase
		.from("alumno_comisiones")
		.select(`
      comision:comisiones!inner(
        id,
        codigo,
        materia:materias!inner(
          id,
          nombre
        ),
        aula:aulas(
          id,
          nombre,
          piso,
          edificio_id,
          edificio:edificios(id, nombre)
        ),
        horarios(
          id,
          dia,
          inicio,
          fin
        )
      )
    `)
		.eq("alumno_id", userId);

	if (error) throw error;
	return (data ?? [])
		.map((item) => item.comision)
		.filter(Boolean);
}

export async function getMateriasPinneadasConHorarios(userId) {
	const comisiones = await getAlumnoComisiones(userId);
	const materiasMap = new Map();

	comisiones.forEach((comision) => {
		const materia = comision.materia;
		if (!materia) return;

		if (!materiasMap.has(materia.id)) {
			materiasMap.set(materia.id, {
				id: materia.id,
				nombre: materia.nombre,
				comisiones: [],
			});
		}

		materiasMap.get(materia.id).comisiones.push({
			id: comision.id,
			codigo: comision.codigo,
			aula: comision.aula,
			horarios: comision.horarios ?? [],
		});
	});

	return Array.from(materiasMap.values());
}
