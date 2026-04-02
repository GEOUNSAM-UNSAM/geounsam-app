export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function esEmailValido(email) {
	return EMAIL_REGEX.test(email.trim())
}

export function validarLogin(values) {
	const errors = {
		email: '',
		password: '',
	}

	const email = values.email.trim()

	if (!email) {
		errors.email = 'Ingresá tu email.'
	} else if (!esEmailValido(email)) {
		errors.email = 'Ingresá un email válido.'
	}

	if (!values.password) {
		errors.password = 'Ingresá tu contraseña.'
	}

	return errors
}

export function validarRegistro(values) {
	const errors = {
		carrera: '',
		email: '',
		nombre: '',
		password: '',
	}

	const email = values.email.trim()
	const nombre = values.nombre.trim()

	if (!values.carrera) {
		errors.carrera = 'Seleccioná tu carrera.'
	}

	if (!email) {
		errors.email = 'Ingresá tu email.'
	} else if (!esEmailValido(email)) {
		errors.email = 'Ingresá un email válido.'
	}

	if (!nombre) {
		errors.nombre = 'Ingresá tu nombre y apellido.'
	} else if (nombre.length < 3) {
		errors.nombre = 'Ingresá un nombre válido.'
	}

	if (!values.password) {
		errors.password = 'Ingresá tu contraseña.'
	} else if (values.password.length < 6) {
		errors.password = 'La contraseña debe tener al menos 6 caracteres.'
	}

	return errors
}
