import { Star } from 'lucide-react'

export default function BannerPerfil({ nombre, avatarUrl, carrera, nivel }) {
  return (
    <div className="bg-identity flex flex-col gap-3 items-center pb-5 px-4 -mt-0.5">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Perfil"
          className="w-20 h-20 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-neutral-main" />
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
          <Star size={16} className="text-neutral-dark" />
          <span className="font-saira text-sm text-neutral-dark">
            Nivel {nivel.niveles.findIndex(n => n.estado === 'actual') + 1} - {nivel.nombre}
          </span>
        </div>
      )}
    </div>
  )
}
