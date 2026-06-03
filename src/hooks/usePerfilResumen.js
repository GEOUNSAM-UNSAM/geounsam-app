import { useEffect, useState } from 'react'
import { getAlumnoCarreras } from '../services/alumnos'

const INITIAL_STATE = {
	carrera: '',
}

export default function usePerfilResumen(userId, enabled = true) {
	const [resumen, setResumen] = useState(INITIAL_STATE)

	useEffect(() => {
		if (!userId || !enabled) return

		let mounted = true

		Promise.all([getAlumnoCarreras(userId)])
			.then(([carreras]) => {
				if (!mounted) return
				setResumen({carrera: carreras[0]?.carreras?.nombre ?? ''})
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
