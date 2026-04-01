import { Award, Flag, SquareCheckBig, Map } from 'lucide-react'

const iconos = {
  flag: Flag,
  'square-check': SquareCheckBig,
  map: Map,
}

export default function Insignias({ insignias }) {
  return (
    <div className="bg-neutral-white rounded-[30px] px-5 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Award size={24} className="text-neutral-extra-dark" />
        <span className="font-saira font-semibold text-lg text-neutral-extra-dark">Insignias</span>
      </div>
      <div className="flex items-stretch justify-between gap-2">
        {insignias.map((ins) => {
          const Icono = iconos[ins.icono]
          const desbloqueada = ins.desbloqueada

          return (
            <div
              key={ins.nombre}
              className={`${desbloqueada ? '' : 'bg-neutral-light'} rounded-[10px] flex flex-col items-center justify-center gap-1 px-2 py-3 w-[100px]`}
              style={desbloqueada && ins.color ? { backgroundColor: ins.color } : undefined}
            >
              {Icono && <Icono size={24} className={desbloqueada ? 'text-neutral-extra-dark' : 'text-neutral-main'} />}
              <span className={`font-saira text-base ${desbloqueada ? 'text-neutral-extra-dark' : 'text-neutral-main'}`}>{ins.nombre}</span>
              <span className={`font-saira font-medium text-xs text-center ${desbloqueada ? 'text-neutral-extra-dark' : 'text-neutral-main'}`}>{ins.descripcion}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
