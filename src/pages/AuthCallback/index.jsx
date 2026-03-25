import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAlumnoCarreras } from '../../services/alumnos'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    getAlumnoCarreras(user.id).then((carreras) => {
      if (carreras.length > 0) {
        navigate('/inicio', { replace: true })
      } else {
        navigate('/seleccionar-carrera', { replace: true })
      }
    }).catch(() => {
      navigate('/seleccionar-carrera', { replace: true })
    })
  }, [user, loading, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-base">
      <p className="font-saira text-identity text-lg">Cargando...</p>
    </div>
  )
}
