import { Trophy, Check, Ellipsis, Lock } from 'lucide-react'

const iconoEstado = {
  completado: <Check size={16} className="text-white" />,
  actual: <Ellipsis size={16} className="text-neutral-extra-dark" />,
  bloqueado: <Lock size={14} className="text-white" />,
}

const estiloCirculo = {
  completado: 'bg-[#7fd9ae]',
  actual: 'bg-action border border-neutral-dark',
  bloqueado: 'bg-neutral-main',
}

const estiloTexto = {
  completado: 'text-[#7fd9ae]',
  actual: 'text-action',
  bloqueado: 'text-neutral-main',
}

export default function Avance({ nivel }) {
  const porcentajeBarra = Math.round((nivel.xpActual / nivel.xpTotal) * 100)

  return (
    <div className="bg-neutral-white rounded-[30px] px-6 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={24} className="text-neutral-extra-dark" />
          <span className="font-saira font-semibold text-lg text-neutral-extra-dark">{nivel.nombre}</span>
        </div>
        <span className="font-saira font-medium text-xs text-neutral-main">{nivel.xpActual} / {nivel.xpTotal} XP</span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="w-full h-1 bg-neutral-light rounded-full">
          <div className="h-1 bg-[#7fd9ae] rounded-full" style={{ width: `${porcentajeBarra}%` }} />
        </div>
        <div className="flex justify-between">
          <span className="font-saira font-medium text-xs text-neutral-main">{nivel.xpRestante} XP para {nivel.siguienteNivel}</span>
          <span className="font-saira font-medium text-xs text-action">{nivel.porcentaje}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {nivel.niveles.map((n, i) => (
          <div key={n.nombre} className="contents">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${estiloCirculo[n.estado]}`}>
                {iconoEstado[n.estado]}
              </div>
              <span className={`font-saira text-sm ${estiloTexto[n.estado]}`}>{n.nombre}</span>
            </div>
            {i < nivel.niveles.length - 1 && <div className="w-5 h-px bg-neutral-main" />}
          </div>
        ))}
      </div>
    </div>
  )
}
