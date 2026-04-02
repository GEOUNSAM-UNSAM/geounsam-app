import { Star } from 'lucide-react'
import { obtenerInicialesNombre } from '../../../utils/avatar.js'

export default function BannerPerfil({ nombre, avatarUrl, carrera, nivel }) {
  const iniciales = obtenerInicialesNombre(nombre)

  return (
    <div className="bg-identity flex flex-col gap-3 items-center px-4 pt-5 pb-5">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Perfil"
          className="w-20 h-20 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-neutral-main flex items-center justify-center">
          <span className="font-saira font-bold text-2xl text-neutral-extra-dark">
            {iniciales}
          </span>
        </div>
      )}

      <h1 className="font-saira font-bold text-[28px] text-base leading-tight">
        {nombre}
      </h1>

      {carrera && (
        <p className="font-saira text-sm text-base text-center">
          {carrera}
        </p>
      )}

      {nivel && (
        <div className="bg-action flex items-center gap-1 px-3 py-1.5 rounded-full">
          <Star size={16} className="text-neutral-extra-dark" />
          <span className="font-saira text-sm text-neutral-extra-dark">
            Nivel {nivel.niveles.findIndex(n => n.estado === 'actual') + 1} - {nivel.nombre}
          </span>
        </div>
      )}
    </div>
  )
}
