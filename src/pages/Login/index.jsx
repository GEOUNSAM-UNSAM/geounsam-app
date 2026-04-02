import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-geounsam.svg'
import samuLaptop from '../../assets/samu_laptop.png'
import AuthInput from '../../components/AuthInput/index.jsx'
import BotonGoogle from '../../components/BotonGoogle/index.jsx'
import { supabase } from '../../lib/supabase'
import { esEmailValido, validarLogin } from '../../utils/validacionesAuth.js'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
      form: '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = form.email.trim()
    const nextErrors = validarLogin({ ...form, email })

    if (nextErrors.email || nextErrors.password) {
      setErrors((prev) => ({ ...prev, ...nextErrors, form: '' }))
      return
    }

    setLoading(true)
    setErrors((prev) => ({ ...prev, form: '' }))

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: form.password,
    })

    if (signInError) {
      setErrors((prev) => ({
        ...prev,
        form: 'Email o contraseña incorrectos.',
      }))
      setLoading(false)
      return
    }

    navigate('/inicio', { replace: true })
  }

  const isEmailValid = esEmailValido(form.email)
  const isSubmitDisabled = loading || !form.email.trim() || !form.password || !isEmailValid

  return (
    <div className="flex flex-col min-h-screen bg-base px-8 pt-[60px] pb-8">
      <div className="flex flex-col items-center gap-6">
        <img src={logo} alt="GeoUNSAM" className="w-[60px] h-[60px]" />

        <img
          src={samuLaptop}
          alt="Samu usando una laptop"
          className="w-[151px] h-[200px] object-contain"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 pt-6">
        <div className="flex flex-col gap-5">
          <h1 className="font-saira font-semibold text-[22px] text-identity leading-8">
            Ingresá a tu cuenta
          </h1>

          <div className="flex flex-col gap-3">
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
              label="Contraseña"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              type="password"
              autoComplete="current-password"
              error={errors.password}
            />
          </div>
        </div>

        {errors.form && (
          <p className="font-saira text-sm text-error mt-3">{errors.form}</p>
        )}

        <div className="flex flex-col gap-6 mt-auto pt-10">
          <BotonGoogle
            texto="Iniciar sesión con Google"
            className="border border-neutral-extra-dark text-neutral-extra-dark h-11 py-0"
          />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-main" />
            <span className="font-saira font-semibold text-lg leading-8 text-neutral-dark">
              o
            </span>
            <div className="flex-1 h-px bg-neutral-main" />
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="bg-action text-neutral-extra-dark font-saira font-semibold text-lg text-center h-11 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <Link
            to="/registro"
            className="font-faustina font-medium text-base leading-6 text-action visited:text-action active:text-action text-center py-2"
          >
            ¿Aún no te registraste? Hacé click acá.
          </Link>
        </div>
      </form>
    </div>
  )
}
