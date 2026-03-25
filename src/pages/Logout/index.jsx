import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Logout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    logout().then(() => navigate('/onboarding', { replace: true }))
  }, [logout, navigate])

  return null
}
