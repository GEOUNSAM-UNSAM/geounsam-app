import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-geounsam.svg'
import AuthInput from '../../components/AuthInput/index.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    dni: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/buscar')
  }

  return (
    <div className="flex flex-col min-h-screen bg-base px-8 pt-20 pb-8">
      {/* Logo */}
      <div className="flex justify-center mb-16">
        <img src={logo} alt="GeoUNSAM" className="w-24 h-24" />
      </div>

      {/* Header */}
      <h1 className="font-saira font-semibold text-[22px] text-identity leading-8 mb-10">
        Ingresa a tu cuenta
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        <AuthInput label="DNI" name="dni" value={form.dni} onChange={handleChange} placeholder="Ingrese su DNI" />
        <AuthInput label="Contraseña" name="password" value={form.password} onChange={handleChange} placeholder="Ingrese su contraseña" type="password" />

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-auto pt-6">
          <button
            type="submit"
            className="bg-action text-neutral-dark font-saira font-semibold text-lg text-center py-3 rounded-xl w-full"
          >
            Iniciar sesión
          </button>
          <Link
            to="/registro"
            className="font-faustina font-medium text-[16px] text-action text-center py-2"
          >
            ¿Aún no te registraste? Hacé click acá.
          </Link>
        </div>
      </form>
    </div>
  )
}
