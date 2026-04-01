import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAccess } from '../../context/AccessContext.jsx'
import { getCarreras, setAlumnoCarrera } from '../../services/alumnos'
import logo from '../../assets/logo-geounsam.svg'

export default function SeleccionCarrera() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refresh } = useAccess()
  const [carreras, setCarreras] = useState([])
  const [carreraId, setCarreraId] = useState('')
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    getCarreras()
      .then(setCarreras)
      .catch((err) => setError(err.message))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!carreraId) return

    setGuardando(true)
    try {
      await setAlumnoCarrera(user.id, Number(carreraId))
      await refresh()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-base px-8 pt-20 pb-8">
      {/* Logo */}
      <div className="flex justify-center mb-16">
        <img src={logo} alt="GeoUNSAM" className="w-24 h-24" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-10 flex-1">
        <h1 className="font-saira font-semibold text-[22px] text-identity leading-8 text-center">
          ¡Bienvenido, {user?.user_metadata?.full_name?.split(' ')[0]}!
        </h1>

        <p className="font-saira text-sm text-neutral-extra-dark text-center">
          Sólo nos falta un dato para personalizar tu experiencia
        </p>

        <div className="flex flex-col gap-2">
          <label className="font-saira text-sm text-neutral-extra-dark">¿Qué carrera estudiás?</label>
          <div className="relative">
            <select
              value={carreraId}
              onChange={(e) => setCarreraId(e.target.value)}
              className={`w-full h-10 bg-neutral-white border border-identity rounded-xl pl-5 pr-10 font-saira appearance-none ${carreraId ? 'text-neutral-extra-dark' : 'text-neutral-main'}`}
            >
              <option value="" disabled>Seleccioná tu carrera</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <ChevronDown size={16} color="#00205b" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {error && (
          <p className="font-saira text-sm text-red-500">{error}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-auto pt-6">
          <button
            type="submit"
            disabled={!carreraId || guardando}
            className="bg-action text-neutral-extra-dark font-saira font-semibold text-lg text-center py-3 rounded-xl w-full disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </form>
    </div>
  )
}
