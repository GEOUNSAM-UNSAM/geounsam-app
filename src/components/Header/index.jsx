import { useAuth } from '../../context/AuthContext'
import logotipoWhite from '../../assets/logotipo_white.svg'

export default function Header() {
  const { user } = useAuth()
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <header className="bg-identity px-5 h-16 flex items-center justify-between">
      {avatarUrl ? (
        <img src={avatarUrl} alt="Perfil" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-8 h-8" />
      )}
      <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
      <div className="w-8 h-8" />
    </header>
  )
}
