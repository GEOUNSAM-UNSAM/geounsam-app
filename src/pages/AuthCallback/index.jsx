import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAccess } from '../../context/AccessContext.jsx'
import { marcarOnboardingVisto } from '../../services/alumnos'
import PantallaCarga from '../../components/PantallaCarga/index.jsx'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { refresh } = useAccess()
  const redireccionIniciada = useRef(false)

  useEffect(() => {
    if (redireccionIniciada.current) return
    if (loading) return
    if (!user) {
      redireccionIniciada.current = true
      navigate('/login', { replace: true })
      return
    }

    redireccionIniciada.current = true

    async function redirigir() {
      try {
        if (localStorage.getItem('onboarding_completado') === '1') {
          await marcarOnboardingVisto(user.id)
          localStorage.removeItem('onboarding_completado')
        }

        await refresh()
        navigate('/', { replace: true })
      } catch {
        navigate('/sin-conexion', { replace: true })
      }
    }

    redirigir()
  }, [user, loading, navigate, refresh])

  return (
    <PantallaCarga mensaje="Ingresando a tu cuenta..." />
  )
}
