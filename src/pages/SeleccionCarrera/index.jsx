import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAccess } from '../../context/AccessContext.jsx'
import { getCarreras, setAlumnoCarrera } from '../../services/alumnos'
import logo from '../../assets/logo-geounsam.svg'
import samuSaludando from '../../assets/samu_saludando.png'

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

  const primerNombre = user?.user_metadata?.full_name?.trim()?.split(/\s+/)?.[0] ?? 'estudiante'

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
    <div className="flex flex-col min-h-screen bg-base px-8 pt-[60px] pb-8">
      <div className="flex flex-col items-center gap-6">
        <img src={logo} alt="GeoUNSAM" className="w-[60px] h-[60px]" />

        <img
          src={samuSaludando}
          alt="Samu saludando"
          className="w-[245px] h-[300px] object-contain max-w-full"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 pt-6">
        <div className="flex flex-col gap-6">
          <h1 className="font-saira font-semibold text-[22px] text-identity leading-8 text-center">
            ¡Hola, {primerNombre}!
          </h1>

          <p className="font-saira text-sm leading-6 text-neutral-extra-dark text-center">
            Sólo nos falta un dato para personalizar tu experiencia
          </p>

          <div className="flex flex-col gap-2">
            <label className="font-saira text-sm leading-6 text-neutral-extra-dark">
              ¿Qué carrera estudias?
            </label>

            <div className="relative">
              <select
                value={carreraId}
                onChange={(e) => setCarreraId(e.target.value)}
                className={`w-full h-10 bg-neutral-white border border-identity rounded-xl pl-5 pr-10 font-saira text-base leading-6 appearance-none ${carreraId ? 'text-neutral-extra-dark' : 'text-neutral-main'}`}
              >
                <option value="" disabled>
                  Ingrese su carrera
                </option>
                {carreras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                color="#A7A9AC"
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="font-saira text-sm text-error mt-3">{error}</p>
        )}

        <div className="flex flex-col gap-6 mt-auto pt-10">
          <button
            type="submit"
            disabled={!carreraId || guardando}
            className="bg-action text-neutral-extra-dark font-saira font-semibold text-lg text-center h-11 rounded-xl w-full disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Continuar'}
          </button>

          <Link
            to="/logout"
            className="font-faustina font-medium text-base leading-6 text-action visited:text-action active:text-action text-center py-2"
          >
            Cambiar de cuenta
          </Link>
        </div>
      </form>
    </div>
  )
}
