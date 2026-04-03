import { useEffect, useState } from 'react'
import { getAlumnoCarreras } from '../services/alumnos'
import { getEstadisticas, getNivel } from '../services/perfil'

const INITIAL_STATE = {
	carrera: '',
	estadisticas: null,
	nivel: null,
}

export default function usePerfilResumen(userId, enabled = true) {
	const [resumen, setResumen] = useState(INITIAL_STATE)

	useEffect(() => {
		if (!userId || !enabled) return

		let mounted = true

		Promise.all([
			getAlumnoCarreras(userId),
			getEstadisticas(userId),
			getNivel(userId),
		])
			.then(([carreras, estadisticas, nivel]) => {
				if (!mounted) return

				setResumen({
					carrera: carreras[0]?.carreras?.nombre ?? '',
					estadisticas: estadisticas ?? null,
					nivel: nivel ?? null,
				})
			})
			.catch((error) => {
				console.error(error)
				if (!mounted) return
				setResumen(INITIAL_STATE)
			})

		return () => {
			mounted = false
		}
	}, [enabled, userId])

	return resumen
}
