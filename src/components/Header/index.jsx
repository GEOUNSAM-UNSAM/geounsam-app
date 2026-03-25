import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bolt, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logotipoWhite from '../../assets/logotipo_white.svg'

export default function Header() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const avatarUrl = user?.user_metadata?.avatar_url
  const esPerfil = pathname === '/perfil'
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="bg-identity px-5 h-16 flex items-center justify-between relative">
      {!esPerfil && avatarUrl ? (
        <img src={avatarUrl} alt="Perfil" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-8 h-8" />
      )}
      <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
      {esPerfil ? (
        <button onClick={() => setMenuAbierto(!menuAbierto)}>
          <Bolt size={24} className="text-neutral-main" />
        </button>
      ) : (
        <div className="w-8 h-8" />
      )}

      {/* Menú desplegable */}
      {menuAbierto && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuAbierto(false)} />
          <div className="absolute right-5 top-14 z-50 bg-neutral-white rounded-xl shadow-lg py-2 min-w-[180px]">
            <button
              onClick={() => {
                setMenuAbierto(false)
                navigate('/logout')
              }}
              className="flex items-center gap-3 w-full px-4 py-3 font-saira text-sm text-red-500"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </header>
  )
}
