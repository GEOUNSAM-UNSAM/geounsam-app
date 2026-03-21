import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import geounsam from '../../assets/geounsam.svg'
import arrowLeft from '../../assets/arrow_left.svg'
import AuthInput from '../../components/AuthInput/index.jsx'

const carreras = [
  'Ingeniería Ambiental',
  'Ingeniería Biomédica',
  'Ingeniería Electrónica',
  'Ingeniería en Energía',
  'Ingeniería Industrial',
  'Ingeniería en Sistemas Espaciales',
  'Ingeniería en Telecomunicaciones',
  'Ingeniería en Transporte',
  'Ingeniería en Desarrollo de Software',
  'Licenciatura en Biotecnología',
  'Licenciatura en Ciencia de Datos',
  'Licenciatura en Física Médica',
]

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    carrera: '',
    dni: '',
    nombre: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con backend
    navigate('/buscar')
  }

  return (
    <div className="flex flex-col min-h-screen bg-base px-8 pt-10 pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-16">
        <button onClick={() => navigate(-1)} className="shrink-0">
          <img src={arrowLeft} alt="Volver" className="w-7 h-7" />
        </button>
        <h1 className="font-saira font-semibold text-[22px] text-identity leading-8">
          Crear tu cuenta
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        {/* Carrera */}
        <div className="flex flex-col gap-2">
          <label className="font-saira text-sm text-neutral-dark">Carrera</label>
          <div className="relative">
            <select
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
              className="w-full h-10 bg-neutral-white border border-identity rounded-xl pl-5 pr-10 font-saira text-neutral-dark appearance-none"
            >
              <option value="" disabled>Ingrese su carrera</option>
              {carreras.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="#00205b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <AuthInput label="DNI" name="dni" value={form.dni} onChange={handleChange} placeholder="Ingrese su DNI" />
        <AuthInput label="Nombre y apellido" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ingrese su nombre y apellido" />
        <AuthInput label="Contraseña" name="password" value={form.password} onChange={handleChange} placeholder="Ingrese su contraseña" type="password" />

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-auto pt-6">
          <button
            type="submit"
            className="bg-action text-neutral-dark font-saira font-semibold text-lg text-center py-3 rounded-xl w-full"
          >
            Crear cuenta
          </button>
          <Link
            to="/onboarding"
            className="border border-action text-action font-faustina font-medium text-[16px] text-center py-2 rounded-xl w-full block"
          >
            Cancelar
          </Link>
        </div>

        {/* Logo */}
        <div className="flex justify-center pt-2">
          <img src={geounsam} alt="GeoUNSAM" className="w-28 h-6" />
        </div>
      </form>
    </div>
  )
}
