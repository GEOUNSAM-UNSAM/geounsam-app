import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import geounsam from '../../assets/geounsam.svg'
import arrowLeft from '../../assets/arrow_left.svg'
import samuAsomandoseLlave from '../../assets/samu_asomandose_llave.png'
import AuthInput from '../../components/AuthInput/index.jsx'
import { supabase } from '../../lib/supabase'
import { esEmailValido, validarRegistro } from '../../utils/validacionesAuth.js'

function parseCarreraId(value) {
    if (!value) return null

    const carreraId = Number.parseInt(value, 10)
    return Number.isInteger(carreraId) && carreraId > 0 ? carreraId : null
}

export default function Registro() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [form, setForm] = useState({
        email: '',
        nombre: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        email: '',
        nombre: '',
        password: '',
        form: '',
    })
    const [successMessage, setSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({
            ...prev,
            [name]: '',
            form: '',
        }))
        setSuccessMessage('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const nextValues = {
            ...form,
            email: form.email.trim(),
            nombre: form.nombre.trim(),
        }
        const carreraId = parseCarreraId(searchParams.get('carrera_id'))
        const nextErrors = validarRegistro(nextValues)

        if (nextErrors.email || nextErrors.nombre || nextErrors.password) {
            setErrors((prev) => ({ ...prev, ...nextErrors, form: '' }))
            return
        }

        setLoading(true)
        setErrors((prev) => ({ ...prev, form: '' }))
        setSuccessMessage('')

        const userData = {
            full_name: nextValues.nombre,
        }

        if (carreraId !== null) {
            userData.carrera_id = carreraId
        }

        const { data, error } = await supabase.auth.signUp({
            email: nextValues.email,
            password: nextValues.password,
            options: {
                data: userData,
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        console.log('[Registro] signUp response', { data, error })

        if (error) {
            setErrors((prev) => ({
                ...prev,
                form: error.message || 'No se pudo crear la cuenta.',
            }))
            setLoading(false)
            return
        }

        if (data.session) {
            await supabase.auth.signOut()
        }

        setSuccessMessage(
            data.session
                ? 'Cuenta creada correctamente. Ya podés iniciar sesión.'
                : 'Cuenta creada. Revisá tu correo para confirmar la cuenta.'
        )
        setLoading(false)
    }

    const isSubmitDisabled =
        loading ||
        !form.email.trim() ||
        !esEmailValido(form.email) ||
        !form.nombre.trim() ||
        form.nombre.trim().length < 3 ||
        !form.password ||
        form.password.length < 6

    return (
        <div className="relative overflow-hidden flex flex-col min-h-screen bg-base px-8 pt-[36px] pb-8">
            <div className="flex justify-center">
                <img src={geounsam} alt="GeoUNSAM" className="w-[117px] h-4" />
            </div>

            <img
                src={samuAsomandoseLlave}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-4 w-[126px] h-[200px]"
            />

            <div className="flex items-center gap-2 mt-14">
                <button onClick={() => navigate(-1)} className="shrink-0">
                    <img src={arrowLeft} alt="Volver" className="w-[30px] h-[30px]" />
                </button>
                <h1 className="font-saira font-semibold text-[22px] text-identity leading-8">
                    Crear tu cuenta
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 pt-14">
                <div className="flex flex-col gap-6">
                    <AuthInput
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Ingrese su email"
                        type="email"
                        autoComplete="email"
                        error={errors.email}
                    />
                    <AuthInput
                        label="Nombre y apellido"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Ingrese su nombre y apellido"
                        autoComplete="name"
                        error={errors.nombre}
                    />
                    <AuthInput
                        label="Contraseña"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Ingrese su contraseña"
                        type="password"
                        autoComplete="new-password"
                        error={errors.password}
                    />
                </div>

                {errors.form && (
                    <p className="font-saira text-sm text-error mt-3">{errors.form}</p>
                )}
                {successMessage && (
                    <p className="font-saira text-sm text-data-green-800 mt-3">{successMessage}</p>
                )}

                <div className="flex flex-col gap-6 mt-auto pt-10">
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="bg-action text-neutral-extra-dark font-saira font-semibold text-lg text-center h-11 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                    <Link
                        to="/bienvenida"
                        className="border border-identity text-identity font-saira text-sm leading-6 text-center h-9 rounded-xl w-full flex items-center justify-center"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    )
}
