export function obtenerInicialesNombre(nombre) {
	const partes = nombre
		?.trim()
		.split(/\s+/)
		.filter(Boolean) ?? []

	if (partes.length === 0) return 'U'
	if (partes.length === 1) return partes[0][0].toUpperCase()

	return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase()
}
