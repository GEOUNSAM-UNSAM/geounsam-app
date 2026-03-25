import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAlumnoCarreras } from '../../services/alumnos'
import { getEstadisticas, getNivel, getInsignias } from '../../services/perfil'
import BannerPerfil from '../../components/Perfil/BannerPerfil/index.jsx'
import Metricas from '../../components/Perfil/Metricas/index.jsx'
import Avance from '../../components/Perfil/Avance/index.jsx'
import Insignias from '../../components/Perfil/Insignias/index.jsx'
import TopCampus from '../../components/Perfil/TopCampus/index.jsx'

export default function Perfil() {
  const { user } = useAuth()
  const [carrera, setCarrera] = useState('')
  const [estadisticas, setEstadisticas] = useState(null)
  const [nivel, setNivel] = useState(null)
  const [insignias, setInsignias] = useState([])

  const nombre = user?.user_metadata?.full_name || 'Usuario'
  const avatarUrl = user?.user_metadata?.avatar_url

  useEffect(() => {
    if (!user) return
    getAlumnoCarreras(user.id).then((data) => {
      if (data.length > 0) setCarrera(data[0].carreras.nombre)
    }).catch(console.error)

    getEstadisticas(user.id).then(setEstadisticas).catch(console.error)
    getNivel(user.id).then(setNivel).catch(console.error)
    getInsignias(user.id).then(setInsignias).catch(console.error)
  }, [user])

  return (
    <div className="flex flex-col pb-20">
      <BannerPerfil nombre={nombre} avatarUrl={avatarUrl} carrera={carrera} nivel={nivel} />
      {estadisticas && <Metricas estadisticas={estadisticas} />}
      <div className="flex flex-col gap-3 px-6 py-3">
        {nivel && <Avance nivel={nivel} />}
        {insignias.length > 0 && <Insignias insignias={insignias} />}
        <TopCampus />
      </div>
    </div>
  )
}
